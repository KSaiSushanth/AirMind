from fastapi import APIRouter, HTTPException, status, Query
from app.config.database import get_collection
from app.schemas.city import CityOut
from app.ai.predictor import ForecastingPredictor
from app.ai.services.health_advisor import CitizenHealthAdvisor
from typing import List, Dict, Any

router = APIRouter(prefix="/cities", tags=["Cities & Stations"])

@router.get("", response_model=List[str])
async def list_cities():
    """Lists the names of all air-shed cities available in the system."""
    cities_col = get_collection("cities")
    cursor = cities_col.find({}, {"name": 1})
    cities = []
    async for doc in cursor:
        cities.append(doc["name"])
    return cities

@router.get("/{city_name}", response_model=CityOut)
async def get_city(city_name: str):
    """Retrieves full environmental data, including sensors and weather, for a given city."""
    cities_col = get_collection("cities")
    city = await cities_col.find_one({"name": city_name.lower()})
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City '{city_name}' not found in the spatial registry."
        )
    
    # Map MongoDB internal object ID
    city["id"] = str(city["_id"])
    city.pop("_id", None)
    return city

@router.get("/{city_name}/forecast")
async def get_dynamic_forecast(city_name: str):
    """Generates dynamic multi-step predictions (6h, 12h, 24h, 48h, 72h) for AQI and trace gases."""
    cities_col = get_collection("cities")
    city_data = await cities_col.find_one({"name": city_name.lower()})
    if not city_data:
        raise HTTPException(status_code=404, detail="City not found.")

    wind_raw = city_data["weather"]["windSpeed"]
    wind_val = 5.0
    try:
        wind_val = float(wind_raw.split()[0])
    except Exception:
        pass
    
    # Multi-step projections using XGBoost/Fallback regressor
    forecasts = []
    steps = [
        {"label": "6 Hours", "hour_offset": 6, "pblh_mod": 0.9},
        {"label": "12 Hours", "hour_offset": 12, "pblh_mod": 0.8},
        {"label": "24 Hours", "hour_offset": 24, "pblh_mod": 0.75},
        {"label": "48 Hours", "hour_offset": 48, "pblh_mod": 0.95},
        {"label": "72 Hours", "hour_offset": 72, "pblh_mod": 1.1}
    ]
    
    for step in steps:
        pred = ForecastingPredictor.predict(
            hour=(12 + step["hour_offset"]) % 24,
            day_of_week=3,
            temp=32.0,
            humidity=45.0,
            wind_speed=wind_val,
            pblh=450.0 * step["pblh_mod"],
            traffic_index=55.0
        )
        forecasts.append({
            "horizon": step["label"],
            "metrics": pred
        })
        
    return {
        "cityName": city_name,
        "currentAqi": city_data["overallAqi"],
        "forecast": forecasts
    }

@router.get("/{city_name}/health-advisory")
async def get_health_advisory(
    city_name: str,
    age: int = Query(25, ge=0),
    health_profile: str = Query("normal")
):
    """Calculates personalized healthcare risk advisories and mask guidelines for citizens."""
    cities_col = get_collection("cities")
    city_data = await cities_col.find_one({"name": city_name.lower()})
    if not city_data:
        raise HTTPException(status_code=404, detail="City not found.")
        
    current_aqi = int(city_data["overallAqi"])
    
    # Generate advisory details
    advisory = CitizenHealthAdvisor.generate_advisory(current_aqi, age, health_profile)
    return {
        "cityName": city_name,
        "aqi": current_aqi,
        "advisory": advisory
    }
