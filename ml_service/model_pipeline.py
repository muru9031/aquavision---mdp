# ml_service/model_pipeline.py
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
import xgboost as xgb
import shap

def generate_synthetic_well_data(days: int = 365) -> pd.DataFrame:
    """Generates synthetic hydrological time-series."""
    np.random.seed(42)
    dates = pd.date_range(end=pd.Timestamp.today(), periods=days)
    
    rainfall = np.random.exponential(scale=3.0, size=days) * (np.random.rand(days) > 0.7)
    temp = 22 + 10 * np.sin(np.linspace(0, 4 * np.pi, days)) + np.random.normal(0, 1.5, days)
    extraction = 400 + 150 * (temp / 30) + np.random.normal(0, 20, days)
    soil_moist = np.clip(20 + 2.5 * rainfall - 0.3 * temp + np.random.normal(0, 2, days), 5, 80)
    
    depth = 15.0
    water_levels = []
    for r, ext, t in zip(rainfall, extraction, temp):
        recharge = r * 0.08
        depletion = (ext / 1500) * 0.05 + (t / 40) * 0.02
        depth = depth - recharge + depletion + np.random.normal(0, 0.02)
        water_levels.append(depth)
        
    return pd.DataFrame({
        "recorded_date": dates,
        "rainfall": rainfall,
        "temperature": temp,
        "soil_moisture": soil_moist,
        "extraction_rate": extraction,
        "water_level": water_levels
    })

def train_and_explain(df: pd.DataFrame):
    """
    Trains XGBoost on groundwater features and computes SHAP explainability.
    """
    feature_cols = ["rainfall", "temperature", "soil_moisture", "extraction_rate"]
    X = df[feature_cols]
    y = df["water_level"]

    split = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y.iloc[:split], y.iloc[split:]

    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.05,
        random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"XGBoost Model - RMSE: {rmse:.4f}, R2: {r2:.4f}")

    # SHAP Explainer
    explainer = shap.TreeExplainer(model)
    shap_vals = explainer.shap_values(X_test)
    mean_shap = np.abs(shap_vals).mean(axis=0)
    total_shap = np.sum(mean_shap) + 1e-6

    shap_dict = {
        col: round(float((val / total_shap) * 100), 2)
        for col, val in zip(feature_cols, mean_shap)
    }

    return model, shap_dict

if __name__ == "__main__":
    df = generate_synthetic_well_data()
    _, shap_res = train_and_explain(df)
    print("SHAP Feature Importance (%):", shap_res)

