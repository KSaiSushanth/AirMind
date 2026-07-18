import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from app.ai.datasets.generate_data import generate_synthetic_dataset

def train_forecasting_model():
    dataset_path = "backend/app/ai/datasets/historical_aqi_weather.csv"
    model_dir = "backend/app/ai/saved_models"
    os.makedirs(model_dir, exist_ok=True)
    
    # Auto-generate dataset if not present
    if not os.path.exists(dataset_path):
        print("Dataset not found. Generating synthetic dataset...")
        generate_synthetic_dataset(dataset_path, num_records=2000)
        
    df = pd.read_csv(dataset_path)
    
    # Define features (X) and targets (y)
    feature_cols = ["hour", "day_of_week", "temperature", "humidity", "wind_speed", "pblh", "traffic_index"]
    target_cols = ["aqi", "pm25", "pm10", "no2", "so2", "co", "o3"]
    
    X = df[feature_cols]
    y = df[target_cols]
    
    # Split datasets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Fit scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train multi-output XGBoost Regressor
    print("Training Multi-Output XGBoost Regressor...")
    model = XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    predictions = model.predict(X_test_scaled)
    
    print("\n" + "="*50)
    print("MODEL EVALUATION METRICS")
    print("="*50)
    
    for i, col in enumerate(target_cols):
        col_pred = predictions[:, i]
        col_true = y_test[col].values
        
        mae = mean_absolute_error(col_true, col_pred)
        rmse = np.sqrt(mean_squared_error(col_true, col_pred))
        r2 = r2_score(col_true, col_pred)
        
        print(f"Metrics for: {col.upper()}")
        print(f"  - Mean Absolute Error (MAE): {mae:.3f}")
        print(f"  - Root Mean Squared Error (RMSE): {rmse:.3f}")
        print(f"  - R² Score (Coefficient of Det.): {r2:.3f}")
        print("-" * 30)
        
    # Save Model Binaries
    model_path = os.path.join(model_dir, "aqi_forecast.joblib")
    scaler_path = os.path.join(model_dir, "metrics_scaler.joblib")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"\nTrained models successfully saved at: {model_dir}")

if __name__ == "__main__":
    train_forecasting_model()
