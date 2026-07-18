import asyncio
from app.config.database import db, get_collection
from app.utils.security import hash_password
from app.utils.logger import setup_logger, logger

MOCK_USERS = [
    {"email": "admin@airmind.gov.in", "password": "admin123", "role": "admin"},
    {"email": "citizen@gmail.com", "password": "citizen123", "role": "citizen"},
    {"email": "hospital@airmind.gov.in", "password": "hospital123", "role": "hospital"},
    {"email": "traffic@airmind.gov.in", "password": "traffic123", "role": "traffic"}
]

MOCK_CITIES = [
  {
    "name": "delhi",
    "center": [28.6139, 77.2090],
    "overallAqi": 342,
    "status": "Very Poor",
    "primaryPollutant": "PM2.5",
    "weather": {
      "temp": "38°C",
      "humidity": "24%",
      "windSpeed": "4.8 km/h",
      "windDir": "WNW",
      "barometer": "1004 hPa"
    },
    "stations": [
      { "id": "dl_anand_vihar", "name": "Anand Vihar CAAQMS", "coords": [28.6476, 77.3158], "aqi": 412, "status": "Severe", "pm25": 412, "pm10": 480, "no2": 89, "so2": 24, "co": 1.8, "o3": 45 },
      { "id": "dl_shadipur", "name": "Shadipur CAAQMS", "coords": [28.6515, 77.1581], "aqi": 320, "status": "Very Poor", "pm25": 320, "pm10": 380, "no2": 65, "so2": 18, "co": 1.2, "o3": 50 },
      { "id": "dl_rk_puram", "name": "R.K. Puram CAAQMS", "coords": [28.5653, 77.1866], "aqi": 295, "status": "Poor", "pm25": 295, "pm10": 310, "no2": 52, "so2": 12, "co": 0.9, "o3": 62 }
    ],
    "sources": [
      { "id": "src_dl_badarpur", "name": "Badarpur Eco-Park", "coords": [28.5065, 77.3075], "type": "industrial", "emissionRate": "High", "status": "Active", "desc": "High dust suspension from historical fly ash dump.", "impact": 18 },
      { "id": "src_dl_const_noida", "name": "Noida Sector 62 Metro Build", "coords": [28.6275, 77.3725], "type": "construction", "emissionRate": "Violating", "status": "Warning", "desc": "Uncovered earth excavation.", "impact": 25 },
      { "id": "src_dl_traffic_ito", "name": "ITO Intersection Peak", "coords": [28.6284, 77.2400], "type": "traffic", "emissionRate": "Very High", "status": "Critical", "desc": "Heavy vehicle idling.", "impact": 35 }
    ],
    "historicalAqi": [280, 295, 310, 315, 322, 330, 345, 350, 342, 335, 320, 310, 318, 342],
    "forecastAqi": [
      { "time": "08:00 AM", "aqi": 320, "temp": 31.0, "wind": 6.0, "confidence": 95.0 },
      { "time": "12:00 PM", "aqi": 310, "temp": 39.0, "wind": 8.0, "confidence": 92.0 },
      { "time": "04:00 PM", "aqi": 325, "temp": 41.0, "wind": 7.0, "confidence": 89.0 },
      { "time": "08:00 PM", "aqi": 350, "temp": 36.0, "wind": 4.0, "confidence": 94.0 }
    ]
  },
  {
    "name": "mumbai",
    "center": [19.0760, 72.8777],
    "overallAqi": 124,
    "status": "Moderate",
    "primaryPollutant": "PM10",
    "weather": {
      "temp": "31°C",
      "humidity": "78%",
      "windSpeed": "14.2 km/h",
      "windDir": "WSW",
      "barometer": "1009 hPa"
    },
    "stations": [
      { "id": "mb_bandra", "name": "Bandra CAAQMS", "coords": [19.0544, 72.8402], "aqi": 142, "status": "Moderate", "pm25": 65, "pm10": 142, "no2": 34, "so2": 12, "co": 0.6, "o3": 30 },
      { "id": "mb_kurla", "name": "Kurla CAAQMS", "coords": [19.0600, 72.8900], "aqi": 165, "status": "Poor", "pm25": 84, "pm10": 165, "no2": 45, "so2": 15, "co": 0.8, "o3": 25 }
    ],
    "sources": [
      { "id": "src_mb_refinery", "name": "Chembur Refinery", "coords": [19.0020, 72.9080], "type": "industrial", "emissionRate": "Moderate (SOx)", "status": "Active", "desc": "Petroleum distillation emissions.", "impact": 30 },
      { "id": "src_mb_const_metro3", "name": "Metro Line 3 Cuffe Parade", "coords": [18.9150, 72.8120], "type": "construction", "emissionRate": "Violating", "status": "Warning", "desc": "Muck loading dust dispersion.", "impact": 28 }
    ],
    "historicalAqi": [95, 102, 110, 115, 120, 125, 124, 118, 110, 98, 92, 105, 118, 124],
    "forecastAqi": [
      { "time": "08:00 AM", "aqi": 110, "temp": 28.0, "wind": 15.0, "confidence": 91.0 },
      { "time": "12:00 PM", "aqi": 105, "temp": 31.0, "wind": 18.0, "confidence": 88.0 }
    ]
  }
]

MOCK_ALERTS = [
  { "city": "delhi", "title": "Thermal Inversion Alert", "desc": "Atmospheric boundary layer height projected to drop to 200m. High stagnation expected.", "severity": "critical", "timestamp": "10:30 AM", "status": "active" },
  { "city": "delhi", "title": "PM10 Construction Violations", "desc": "Excavation dust counts exceeding 550µg/m³ registered at Noida Sector 62.", "severity": "warning", "timestamp": "11:15 AM", "status": "active" },
  { "city": "mumbai", "title": "Bandra Refinery Plume", "desc": "SO2 indicators increase. Stack emission trace matches Chembur refinery upwind.", "severity": "warning", "timestamp": "09:45 AM", "status": "active" }
]

async def seed_database():
    setup_logger()
    logger.info("Initializing database seed run...")
    db.connect()
    
    # 1. Seed Users
    users_col = get_collection("users")
    await users_col.delete_many({})
    for u in MOCK_USERS:
        doc = {
            "email": u["email"],
            "password_hash": hash_password(u["password"]),
            "role": u["role"]
        }
        await users_col.insert_one(doc)
    logger.info(f"Seeded {len(MOCK_USERS)} system login profiles.")

    # 2. Seed Cities
    cities_col = get_collection("cities")
    await cities_col.delete_many({})
    await cities_col.insert_many(MOCK_CITIES)
    logger.info(f"Seeded {len(MOCK_CITIES)} city environmental data blocks.")

    # 3. Seed Alerts
    alerts_col = get_collection("alerts")
    await alerts_col.delete_many({})
    await alerts_col.insert_many(MOCK_ALERTS)
    logger.info(f"Seeded {len(MOCK_ALERTS)} emergency warning structures.")

    db.close()
    logger.info("Database seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed_database())
