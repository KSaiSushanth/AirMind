import numpy as np

class AeroBudgetEngine:
    @staticmethod
    def calculate_budget(city_name: str, pblh: float, wind_speed: float, current_aqi: int) -> dict:
        # Standard constants for urban air-shed budget math
        area_sq_km = 600.0  # Assumed metropolitan core area
        target_aqi = 100.0  # Clean Air Standard target
        
        # Volume of the atmospheric mixing chamber (in million cubic meters)
        air_volume = area_sq_km * pblh / 1000.0
        
        # Dispersion modifier: higher wind speeds clear pollutants faster
        dispersion_modifier = wind_speed / 10.0
        
        # Total carrying capacity (safe emission ceiling in kilograms/day)
        # Ca = Volume * (Target - Current) * dispersion
        # If Current > Target, carrying capacity becomes limited (compressed budget)
        delta_aqi = max(5.0, target_aqi + 150.0 - current_aqi)
        carrying_capacity_kg = air_volume * delta_aqi * dispersion_modifier * 0.1
        
        # Convert to tons
        capacity_tons = round(carrying_capacity_kg / 1000.0, 1)
        capacity_tons = max(50.0, capacity_tons)  # floor limit
        
        # Used budget is proportional to current AQI
        used_tons = round(capacity_tons * (current_aqi / (current_aqi + 100.0)), 1)
        
        available_percent = round(((capacity_tons - used_tons) / capacity_tons) * 100, 1)
        available_percent = max(0.0, available_percent)
        
        # Risk evaluation rules
        if current_aqi > 300:
            risk_level = "Critical Stagnation"
        elif current_aqi > 200 or available_percent < 20.0:
            risk_level = "High Warning"
        else:
            risk_level = "Safe / Stable"

        return {
            "capacityTons": capacity_tons,
            "usedTons": used_tons,
            "availablePercent": available_percent,
            "riskLevel": risk_level
        }
