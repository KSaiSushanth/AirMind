from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import db, get_collection
from app.config.settings import settings
from app.utils.logger import setup_logger, logger
from app.middleware.errors import ErrorHandlingMiddleware
from app.middleware.logging import RequestLoggingMiddleware
from app.routes import auth, cities, dashboard, simulation, alerts, analytics, copilot
from contextlib import asynccontextmanager

async def auto_seed():
    """Seeds the database automatically on startup if no users exist."""
    users_col = get_collection("users")
    count = await users_col.count_documents({})
    if count == 0:
        logger.info("MongoDB is empty. Auto-seeding mock database collections...")
        from app.seed import MOCK_USERS, MOCK_CITIES, MOCK_ALERTS
        from app.utils.security import hash_password
        
        # Seed users
        for u in MOCK_USERS:
            await users_col.insert_one({
                "email": u["email"],
                "password_hash": hash_password(u["password"]),
                "role": u["role"]
            })
            
        # Seed cities & alerts
        await get_collection("cities").insert_many(MOCK_CITIES)
        await get_collection("alerts").insert_many(MOCK_ALERTS)
        logger.info("Automated database seeding completed successfully.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Lifespan
    setup_logger()
    logger.info("Starting up AirMind application lifecycle...")
    db.connect()
    
    # Trigger auto seed checks
    await auto_seed()
    
    # Load ML Model binaries into memory
    from app.ai.predictor import ForecastingPredictor
    ForecastingPredictor.load_models()
    
    yield
    # Shutdown Lifespan
    db.close()
    logger.info("Shutting down AirMind application lifecycle...")

app = FastAPI(
    title="AirMind Decision Intelligence API",
    description="Proactive smart city environmental intervention and atmospheric budgeting API.",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware Registrations (Error tracking & traffic loggers)
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Configure CORS for local frontend integration (React development server at port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon ease of integration across dynamic hosts
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Mounting under /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(cities.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "Online",
        "service": "AirMind Systems Control Core",
        "documentation": "/docs"
    }
