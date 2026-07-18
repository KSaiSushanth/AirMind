from pydantic import BaseModel
from typing import List, Tuple

class SensorSchema(BaseModel):
    id: str
    name: str
    coords: Tuple[float, float]
    aqi: int
    status: str
    pm25: float
    pm10: float
    no2: float
    so2: float
    co: float
    o3: float

class SourceSchema(BaseModel):
    id: str
    name: str
    coords: Tuple[float, float]
    type: str
    emissionRate: str
    status: str
    desc: str
    impact: float

class WeatherSchema(BaseModel):
    temp: str
    humidity: str
    windSpeed: str
    windDir: str
    barometer: str

class ForecastItem(BaseModel):
    time: str
    aqi: int
    temp: float
    wind: float
    confidence: float

class CityOut(BaseModel):
    name: str
    center: Tuple[float, float]
    overallAqi: int
    status: str
    primaryPollutant: str
    weather: WeatherSchema
    stations: List[SensorSchema]
    sources: List[SourceSchema]
    historicalAqi: List[int]
    forecastAqi: List[ForecastItem]
