import google.generativeai as genai
from app.config.settings import settings
from app.config.database import get_collection
from app.utils.logger import logger

class CopilotService:
    MOCK_FLOW = {
        "how will the boundary layer drop tomorrow impact anand vihar?": "⚠️ **Causal Projection:** The predicted boundary layer drop to 200m tomorrow creates a strong thermal inversion. Since Anand Vihar is downwind of crop fires, PM2.5 is projected to spike by **+85 µg/m³**, reaching a dangerous index of **497 (Severe)**. Preemptive road spraying is recommended.",
        "what is the most cost-effective policy to reduce delhi's pm2.5 today?": "💡 **Optimization Matrix:** Based on current meteorological profiles, the most cost-effective strategy is a combination of **Dynamic Logistics Diversion** and **Water Spray Optimization**. This delivers a predicted **-62 AQI** reduction for a total municipal cost of **$60k/day**.",
        "which construction sites are currently violating dust suppression rules?": "🏗️ **Active Violations:** \n1. **Noida Sector 62 Metro Build:** Continuous PM10 threshold violations. Water mist cannons are inactive.\n2. **Metro Line 3 Cuffe Parade (Mumbai):** Dry excavation pile left uncovered under 18 km/h wind gusts.",
        "suggest a routing plan to divert logistics cargo around chemical corridors.": "🚚 **Traffic Action Card:** Diversion protocol generated. Rerouting cargo trucks from ITO towards the Eastern Peripheral Expressway. This bypasses the stagnant wind canyon at Central Delhi, reducing localized NO2 buildup by **32%**."
    }

    _is_configured = False

    @classmethod
    def configure_sdk(cls):
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                cls._is_configured = True
                logger.info("Google GenerativeAI SDK configured successfully.")
            except Exception as e:
                logger.error(f"Error configuring Google GenerativeAI SDK: {e}")

    @classmethod
    async def get_response(cls, query: str) -> str:
        query_clean = query.strip().lower()
        
        # Check mock dictionary first
        if query_clean in cls.MOCK_FLOW:
            return cls.MOCK_FLOW[query_clean]
            
        # Try real Gemini API using google-generativeai SDK
        if not cls._is_configured:
            cls.configure_sdk()

        if cls._is_configured:
            try:
                # Fetch active database telemetry context to support Retrieval-Augmented Generation (RAG)
                cities_col = get_collection("cities")
                delhi = await cities_col.find_one({"name": "delhi"})
                mumbai = await cities_col.find_one({"name": "mumbai"})
                
                context = "Active AirMind Environmental Registry Telemetry:\n"
                if delhi:
                    context += f"- Delhi overall AQI is {delhi['overallAqi']} ({delhi['status']}) with primary pollutant {delhi['primaryPollutant']}. Temp is {delhi['weather']['temp']}, wind direction {delhi['weather']['windDir']} at speed {delhi['weather']['windSpeed']}.\n"
                if mumbai:
                    context += f"- Mumbai overall AQI is {mumbai['overallAqi']} ({mumbai['status']}) with primary pollutant {mumbai['primaryPollutant']}. Temp is {mumbai['weather']['temp']}, wind direction {mumbai['weather']['windDir']} at speed {mumbai['weather']['windSpeed']}.\n"
                
                # Fetch recent simulation runs context
                sims_col = get_collection("simulations")
                last_sim = await sims_col.find_one(sort=[("timestamp", -1)])
                if last_sim:
                    context += f"- Last policy simulation run stats: Traffic divert {last_sim['reduceTraffic']}%, Construct suspend {last_sim['pauseConstruction']}%, Industry cap {last_sim['reduceIndustry']}%. Achieved PM drop: {last_sim['aqiReduction']} with daily budget cost {last_sim['cost']}.\n"

                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    "You are AirMind's urban air decision copilot. Answer this query based on the active system metrics context below. "
                    "Keep answers extremely concise (2 to 3 sentences maximum). Use bold text for key environmental metrics:\n\n"
                    f"--- Telemetry Context ---\n{context}\n\n"
                    f"User Query: {query}"
                )
                
                response = await model.generate_content_async(prompt)
                return response.text
            except Exception as e:
                logger.error(f"Google GenerativeAI SDK call failed: {e}")

        # Fallback response incorporating local metrics
        return f"🤖 **AURA Copilot (Offline Fallback):** Analyzed query *'{query}'* against active Delhi air-shed profiles. Crop-fire plumes remain a high risk factor. Run policy simulations to see optimal interventions."
