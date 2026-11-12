# ml_service/db_service.py
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
import json
import pandas as pd
from typing import Dict, Any, List

connection_url = URL.create(
    drivername="mysql+pymysql",
    username="root",
    password="Muruga@2006",
    host="localhost",
    port=3306,
    database="aquavision_db"
)
engine = create_engine(connection_url, pool_recycle=3600)

def fetch_all_wells() -> pd.DataFrame:
    with engine.connect() as conn:
        return pd.read_sql(text("SELECT id, name, latitude, longitude, current_level FROM wells"), conn)

def insert_groundwater_record(well_id: int, record: Dict[str, Any], water_level: float, extraction_rate: float):
    query = text("""
        INSERT INTO groundwater_data (well_id, recorded_date, rainfall, temperature, soil_moisture, water_level, extraction_rate)
        VALUES (:well_id, :recorded_date, :rainfall, :temperature, :soil_moisture, :water_level, :extraction_rate)
        ON DUPLICATE KEY UPDATE
            rainfall = VALUES(rainfall),
            temperature = VALUES(temperature),
            soil_moisture = VALUES(soil_moisture),
            water_level = VALUES(water_level),
            extraction_rate = VALUES(extraction_rate)
    """)
    with engine.begin() as conn:
        conn.execute(query, {
            "well_id": well_id,
            "recorded_date": record["recorded_date"],
            "rainfall": record["rainfall"],
            "temperature": record["temperature"],
            "soil_moisture": record.get("soil_moisture", 0.0),
            "water_level": water_level,
            "extraction_rate": extraction_rate
        })

def insert_predictions_and_shap(well_id: int, predictions: List[Dict[str, Any]], shap_dict: Dict[str, float]):
    query = text("""
        INSERT INTO predictions (well_id, forecast_date, predicted_level, model_version, shap_values_json)
        VALUES (:well_id, :forecast_date, :predicted_level, :model_version, :shap_values_json)
        ON DUPLICATE KEY UPDATE
            predicted_level = VALUES(predicted_level),
            shap_values_json = VALUES(shap_values_json),
            generated_at = CURRENT_TIMESTAMP
    """)
    shap_json_str = json.dumps(shap_dict)
    with engine.begin() as conn:
        for pred in predictions:
            conn.execute(query, {
                "well_id": well_id,
                "forecast_date": pred["forecast_date"],
                "predicted_level": pred["predicted_level"],
                "model_version": "Hybrid-LSTM-XGBoost-v1",
                "shap_values_json": shap_json_str
            })

