from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.client: AsyncIOMotorClient = None
        self.db = None

    def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URI)
            self.db = self.client[settings.MONGO_DB]
            logger.info("Connected to MongoDB database successfully.")
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            raise e

    def close(self):
        if self.client:
            self.client.close()
            logger.info("Closed MongoDB database connection.")

db = DatabaseManager()

def get_collection(name: str):
    if db.db is None:
        # Fallback for scripts running out of standard lifespan context
        db.connect()
    return db.db[name]
