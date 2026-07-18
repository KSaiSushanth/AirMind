from fastapi import APIRouter, Query, HTTPException, status
from app.config.database import get_collection
from app.ai.services.budget_engine import AeroBudgetEngine
from app.ai.services.source_attr import SourceAttributionEngine
from app.ai.predictor import ForecastingPredictor
from typing import Dict, Any

router = APIRouter(prefix="/dashboard", tags=["Dashboard Aggregations"])

@router.get("/summary")
async def get_dashboard_summary(city: str = Query("delhi")):
    """Aggregates real-time metrics, capacity budgets, alerts, and activity logs using the AI Engine."""
    cities_col = get_collection("cities")
    alerts_col = get_collection("alerts")
    
    city_data = await cities_col.find_one({"name": city.lower()})
    if not city_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City '{city}' not found in registry."
        )

    # Clean coordinates from string format if needed
    pblh_val = float(city_data.get("pblh", 450.0)) if "pblh" in city_data else 450.0
    
    # Strip wind speed units (e.g. "4.8 km/h" -> 4.8)
    wind_raw = city_data["weather"]["windSpeed"]
    wind_val = 5.0
    try:
        wind_val = float(wind_raw.split()[0])
    except Exception:
        pass
        
    current_aqi = int(city_data["overallAqi"])

    # 1. Run AeroBudget Engine calculations
    budget = AeroBudgetEngine.calculate_budget(city, pblh_val, wind_val, current_aqi)

    # 2. Run Causal Source Attribution Engine
    # Noida Sector 62 is violating under Delhi, Metro 3 Cuffe Parade is violating under Mumbai
    violating_permits = 1 if city.lower() in ["delhi", "mumbai"] else 0
    traffic_index = 65.0 if city.lower() == "delhi" else 45.0
    
    sources_attribution = SourceAttributionEngine.attribute_pollution(
        city, wind_val, traffic_index, violating_permits
    )

    # 3. Fetch active alerts
    alerts_cursor = alerts_col.find({"city": city.lower(), "status": "active"})
    alerts = []
    async for a in alerts_cursor:
        a["id"] = str(a["_id"])
        a.pop("_id", None)
        alerts.append(a)

    # 4. Generate dynamic logs based on ML predictions
    pred_6h = ForecastingPredictor.predict(
        hour=18, day_of_week=2, temp=34.0, humidity=35.0, wind_speed=wind_val, pblh=pblh_val * 0.8, traffic_index=80.0
    )
    
    logs = [
        f"[Forecasting Agent] Dynamic boundary layer drop to {round(pblh_val * 0.8)}m predicted. AQI will trend to {pred_6h['aqi']}.",
        f"[Attribution Agent] Causal breakdown: Traffic {sources_attribution.get('Traffic')}% | Industry {sources_attribution.get('Industry')}% | Construction {sources_attribution.get('Construction')}%.",
        f"[Enforcement Agent] Smart warning recommended: Trigger wet dust spray to save estimated {round(pm10_savings := pred_6h['pm10'] * 0.15)} tons/day."
    ]

    return {
        "cityName": city_data["name"],
        "overallAqi": current_aqi,
        "status": city_data["status"],
        "primaryPollutant": city_data["primaryPollutant"],
        "weather": city_data["weather"],
        "budget": budget,
        "sources": sources_attribution,
        "alerts": alerts,
        "recentLogs": logs
    }
