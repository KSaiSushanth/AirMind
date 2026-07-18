import os
import joblib
import numpy as np
from app.utils.logger import logger

class ForecastingPredictor:
    _model = None
    _scaler = None

    @classmethod
    def load_models(cls):
        # Paths relative to the backend root directory
        model_path = os.path.join(os.path.dirname(__file__), "saved_models", "aqi_forecast.joblib")
        scaler_path = os.path.join(os.path.dirname(__file__), "saved_models", "metrics_scaler.joblib")
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            try:
                cls._model = joblib.load(model_path)
                cls._scaler = joblib.load(scaler_path)
                logger.info("Forecasting models loaded into memory successfully.")
            except Exception as e:
                logger.error(f"Error loading forecasting model binaries: {e}")
        else:
            logger.warning("Model binaries not found. Inferences will fallback to mathematical models.")

    @classmethod
    def predict(cls, hour: int, day_of_week: int, temp: float, humidity: float, wind_speed: float, pblh: float, traffic_index: float) -> dict:
        if cls._model is not None and cls._scaler is not None:
            try:
                features = np.array([[hour, day_of_week, temp, humidity, wind_speed, pblh, traffic_index]])
                scaled_features = cls._scaler.transform(features)
                pred = cls._model.predict(scaled_features)[0]
                
                return {
                    "aqi": int(np.clip(pred[0], 10, 500)),
                    "pm25": float(np.round(np.clip(pred[1], 5, 500), 1)),
                    "pm10": float(np.round(np.clip(pred[2], 10, 600), 1)),
                    "no2": float(np.round(np.clip(pred[3], 2, 120), 1)),
                    "so2": float(np.round(np.clip(pred[4], 1, 50), 1)),
                    "co": float(np.round(np.clip(pred[5], 0.1, 4.5), 2)),
                    "o3": float(np.round(np.clip(pred[6], 5, 150), 1))
                }
            except Exception as e:
                logger.error(f"Error running model inference: {e}")
        
        # Physical mathematical fallback (identical formulas to synthetic dataset generator)
        pm25 = (180 - pblh / 10) + (traffic_index * 1.5) + (35 / wind_speed)
        pm25 = np.clip(pm25, 5, 500)
        pm10 = pm25 * 1.3 + (100 - humidity) * 0.8
        pm10 = np.clip(pm10, 10, 600)
        no2 = (traffic_index * 0.9) + (30 / wind_speed)
        no2 = np.clip(no2, 2, 120)
        so2 = 12 + (150 / pblh)
        so2 = np.clip(so2, 1, 50)
        co = 0.4 + (traffic_index * 0.015) + (100 / pblh)
        co = np.clip(co, 0.1, 4.5)
        o3 = 15 + (temp * 1.2) - (no2 * 0.1)
        o3 = np.clip(o3, 5, 150)
        aqi = pm25 * 0.9 + pm10 * 0.1
        
        return {
            "aqi": int(np.clip(aqi, 10, 500)),
            "pm25": float(np.round(pm25, 1)),
            "pm10": float(np.round(pm10, 1)),
            "no2": float(np.round(no2, 1)),
            "so2": float(np.round(so2, 1)),
            "co": float(np.round(co, 2)),
            "o3": float(np.round(o3, 1))
        }

# Initial trigger to load models
ForecastingPredictor.load_models()
