import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_dataset(output_path: str, num_records: int = 1000):
    np.random.seed(42)
    
    # Generate timestamp series
    start_date = datetime.now() - timedelta(days=num_records // 24)
    timestamps = [start_date + timedelta(hours=i) for i in range(num_records)]
    
    # Base meteorological variables (sine-wave daily cycles)
    hours = np.array([t.hour for t in timestamps])
    days_of_week = np.array([t.weekday() for t in timestamps])
    
    # Temperature: Peak at 3 PM (hour 15), minimum at 5 AM (hour 5)
    temp_base = 25 + 10 * np.sin(2 * np.pi * (hours - 9) / 24)
    temperature = temp_base + np.random.normal(0, 1.5, num_records)
    
    # Relative humidity: Inversely correlated with temperature
    humidity = 60 - 25 * np.sin(2 * np.pi * (hours - 9) / 24) + np.random.normal(0, 3, num_records)
    humidity = np.clip(humidity, 10, 100)
    
    # Planetary Boundary Layer Height (PBLH): Rises with heat during day (up to 1500m), collapses at night (down to 150m)
    pblh = 400 + 600 * np.sin(2 * np.pi * (hours - 8) / 24) + np.random.normal(0, 50, num_records)
    pblh = np.clip(pblh, 150, 1800)
    
    # Wind Speed: Slightly higher during afternoons
    wind_speed = 8 + 4 * np.sin(2 * np.pi * (hours - 11) / 24) + np.random.normal(0, 2, num_records)
    wind_speed = np.clip(wind_speed, 1, 35)
    
    # Traffic Congestion Index (0 to 100): Peaks at 9 AM and 6 PM
    traffic_index = 15 + 45 * (np.exp(-((hours - 9)/2)**2) + np.exp(-((hours - 18)/2)**2)) + np.random.normal(0, 4, num_records)
    traffic_index = np.clip(traffic_index, 5, 100)
    
    # Pollutant Calculations incorporating Causal Physics:
    # 1. PM2.5: Trapped by low PBLH, increased by traffic emissions and lack of wind
    pm25 = (180 - pblh / 10) + (traffic_index * 1.5) + (35 / wind_speed) + np.random.normal(0, 15, num_records)
    pm25 = np.clip(pm25, 5, 500)
    
    # 2. PM10: Dominated by construction dust and traffic re-suspension, worse with low humidity
    pm10 = pm25 * 1.3 + (100 - humidity) * 0.8 + np.random.normal(0, 20, num_records)
    pm10 = np.clip(pm10, 10, 600)
    
    # 3. NO2: Directly tied to vehicle traffic exhaust
    no2 = (traffic_index * 0.9) + (30 / wind_speed) + np.random.normal(0, 5, num_records)
    no2 = np.clip(no2, 2, 120)
    
    # 4. SO2: Industrial stack baseline, trapped by inversions
    so2 = 12 + (150 / pblh) + np.random.normal(0, 2, num_records)
    so2 = np.clip(so2, 1, 50)
    
    # 5. CO: Incomplete combustion from traffic, trapped at night
    co = 0.4 + (traffic_index * 0.015) + (100 / pblh) + np.random.normal(0, 0.1, num_records)
    co = np.clip(co, 0.1, 4.5)
    
    # 6. O3 (Ozone): Photochemical, requires high temperature and sunlight (peaks mid-afternoon)
    o3 = 15 + (temperature * 1.2) - (no2 * 0.1) + np.random.normal(0, 5, num_records)
    o3 = np.clip(o3, 5, 150)
    
    # Calculate Indian Standard AQI
    # Simple linear map for mock/model simulation consistency
    aqi = pm25 * 0.9 + pm10 * 0.1
    aqi = np.clip(aqi, 10, 500).astype(int)
    
    # Assemble DataFrame
    df = pd.DataFrame({
        "timestamp": timestamps,
        "hour": hours,
        "day_of_week": days_of_week,
        "temperature": np.round(temperature, 1),
        "humidity": np.round(humidity, 1),
        "wind_speed": np.round(wind_speed, 1),
        "pblh": np.round(pblh, 1),
        "traffic_index": np.round(traffic_index, 1),
        "pm25": np.round(pm25, 1),
        "pm10": np.round(pm10, 1),
        "no2": np.round(no2, 1),
        "so2": np.round(so2, 1),
        "co": np.round(co, 2),
        "o3": np.round(o3, 1),
        "aqi": aqi
    })
    
    # Ensure directory path exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated synthetic dataset with {len(df)} records at: {output_path}")

if __name__ == "__main__":
    generate_synthetic_dataset("backend/app/ai/datasets/historical_aqi_weather.csv")
