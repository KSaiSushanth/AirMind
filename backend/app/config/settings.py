from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "airmind"
    
    JWT_SECRET: str = "super_secret_airmind_development_key_change_in_production"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
