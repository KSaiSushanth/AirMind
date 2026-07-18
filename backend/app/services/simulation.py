from app.config.database import get_collection
from app.schemas.simulation import SimulationCreate
from app.ai.predictor import ForecastingPredictor
from datetime import datetime
from bson import ObjectId

class SimulationService:
    @staticmethod
    def calculate_results(data: SimulationCreate) -> dict:
        # Run Baseline model inference
        # Standard input settings: Hour 12, Wed, Temp 35, Humid 40, Wind 8, PBLH 400, Traffic 60
        baseline = ForecastingPredictor.predict(
            hour=12, day_of_week=2, temp=35.0, humidity=40.0, wind_speed=8.0, pblh=400.0, traffic_index=60.0
        )
        
        # Calculate simulated inputs based on policy sliders:
        # - divert traffic: reduces traffic index
        # - pause construction: simulates dust mitigation (lowers PM10 directly)
        # - restrict industry: increases dispersion potential / lowers baseline industrial load
        # - road closure: clears wind canyons (increases simulated PBLH locally by clearing vertical bottlenecks)
        sim_traffic = 60.0 * (1.0 - data.reduceTraffic / 100.0)
        sim_pblh = 400.0 + (data.roadClosure * 1.5)
        
        simulated = ForecastingPredictor.predict(
            hour=12, day_of_week=2, temp=35.0, humidity=40.0, wind_speed=8.0, pblh=sim_pblh, traffic_index=sim_traffic
        )
        
        # Calculate AQI reduction delta
        aqi_delta = max(0, baseline["aqi"] - simulated["aqi"])
        
        # Adjust calculations for construction and industry which modify PM10 and SO2 directly
        pm10_savings = max(0, baseline["pm10"] - simulated["pm10"]) + (data.pauseConstruction * 0.8)
        so2_savings = max(0, baseline["so2"] - simulated["so2"]) + (data.reduceIndustry * 0.2)
        
        # Total combined impact
        total_aqi_red = round(aqi_delta + pm10_savings * 0.15 + so2_savings * 0.3)
        total_cost_val = round((data.reduceTraffic * 2.5) + (data.pauseConstruction * 4.2) + (data.reduceIndustry * 8.5) + (data.roadClosure * 1.8))
        total_health_red = round(total_aqi_red * 0.25)

        return {
            "aqiReduction": f"-{total_aqi_red} AQI",
            "cost": f"${total_cost_val}k / Day",
            "healthImpact": f"-{total_health_red}% ER Admissions"
        }

    @classmethod
    async def create_and_save(cls, user_id: str, data: SimulationCreate) -> dict:
        sim_col = get_collection("simulations")
        
        # Run ML-based calculation
        calc = cls.calculate_results(data)
        
        sim_doc = {
            "userId": user_id,
            "roadClosure": data.roadClosure,
            "reduceTraffic": data.reduceTraffic,
            "pauseConstruction": data.pauseConstruction,
            "reduceIndustry": data.reduceIndustry,
            "aqiReduction": calc["aqiReduction"],
            "cost": calc["cost"],
            "healthImpact": calc["healthImpact"],
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        result = await sim_col.insert_one(sim_doc)
        sim_doc["id"] = str(result.inserted_id)
        sim_doc.pop("_id", None)
        return sim_doc

    @staticmethod
    async def get_user_history(user_id: str) -> list:
        sim_col = get_collection("simulations")
        cursor = sim_col.find({"userId": user_id}).sort("timestamp", -1)
        history = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            doc.pop("_id", None)
            history.append(doc)
        return history
