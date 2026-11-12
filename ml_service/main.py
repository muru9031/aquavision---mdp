# ml_service/main.py
# ============================================================
# AquaVision AI — Python ML Microservice (FastAPI)
# Wraps: LSTM-XGBoost forecasting + SHAP explainability
# Start with: uvicorn main:app --host 0.0.0.0 --port 8000
# ============================================================
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
from typing import List, Dict, Optional
import httpx  # to push results back to Spring Boot MySQL via REST

app = FastAPI(title="AquaVision ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SPRING_BASE_URL = "http://localhost:8080/api/v1"

# ── Pydantic Schemas ──────────────────────────────────────────────────
class InputFeatures(BaseModel):
    well_id: int
    rainfall: List[float]        # sequence of past N readings
    temperature: List[float]
    water_level: List[float]
    extraction_rate: List[float]

class PredictionResult(BaseModel):
    well_id: int
    forecast_date: str           # ISO date e.g. "2026-07-01"
    predicted_level: float
    shap_values: Dict[str, float]

# ── Lazy-load models (replace with real joblib/torch load) ────────────
def get_lstm_model():
    """Load your trained Keras/PyTorch LSTM model here."""
    # import torch; return torch.load("models/lstm.pt")
    return None   # placeholder

def get_xgb_model():
    """Load your trained XGBoost model here."""
    # import xgboost as xgb; return xgb.Booster(model_file="models/xgb.json")
    return None   # placeholder

def get_shap_explainer(model):
    """Create a SHAP explainer around the XGBoost model."""
    # import shap; return shap.TreeExplainer(model)
    return None   # placeholder

# ── Forecast Endpoint ─────────────────────────────────────────────────
@app.post("/predict", response_model=List[PredictionResult])
async def predict(features: InputFeatures):
    """
    Accepts recent sensor readings and returns a 6-month forecast
    with SHAP values per prediction.
    
    Flow:
      1. Normalise input features
      2. Run LSTM → get latent context vector
      3. Run XGBoost on [LSTM output + raw features] → predicted_level
      4. Run SHAP TreeExplainer → feature attributions
      5. Return structured JSON (Spring Boot stores it in DB)
    """
    try:
        # -----------------------------------------------------------
        # STUB — replace with real model inference
        # -----------------------------------------------------------
        feature_names = ["rainfall", "extraction", "temperature", "soil_permeability"]
        horizons = 6
        results = []

        for i in range(horizons):
            # Fake predictions (replace with model output)
            predicted = round(18.5 + (i + 1) * 0.3 + np.random.normal(0, 0.1), 2)

            # Fake SHAP values (replace with shap_explainer.shap_values())
            shap_vals = {
                "rainfall":          round(-0.80 + i * 0.01, 3),
                "extraction":        round( 0.65 + i * 0.01, 3),
                "temperature":       round( 0.30 + i * 0.005, 3),
                "soil_permeability": round( 0.40 - i * 0.005, 3),
            }

            from datetime import date, timedelta
            from dateutil.relativedelta import relativedelta
            forecast_date = (date.today().replace(day=1) +
                             relativedelta(months=i + 1)).isoformat()

            results.append(PredictionResult(
                well_id=features.well_id,
                forecast_date=forecast_date,
                predicted_level=predicted,
                shap_values=shap_vals,
            ))

        # Optionally push results back to Spring Boot so they get stored in MySQL
        # async with httpx.AsyncClient() as client:
        #     await client.post(f"{SPRING_BASE_URL}/predictions/ingest",
        #                       json=[r.dict() for r in results])

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Health Check ──────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "AquaVision ML"}


# ── SHAP Values Endpoint (standalone — given saved predictions) ───────
@app.get("/shap/{well_id}")
def get_shap_summary(well_id: int):
    """
    Returns feature importance summary for the given well.
    In production, load the latest SHAP values from DB or compute live.
    """
    # Dummy response — replace with DB read + shap computation
    return [
        {"feature": "Lack of Rainfall",    "importance": 80},
        {"feature": "High Ind. Extraction", "importance": 65},
        {"feature": "Soil Permeability",   "importance": 40},
        {"feature": "Temperature Rise",    "importance": 30},
    ]

