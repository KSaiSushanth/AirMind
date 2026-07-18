from pydantic import BaseModel, Field

class SimulationCreate(BaseModel):
    roadClosure: int = Field(..., ge=0, le=100)
    reduceTraffic: int = Field(..., ge=0, le=100)
    pauseConstruction: int = Field(..., ge=0, le=100)
    reduceIndustry: int = Field(..., ge=0, le=100)

class SimulationOut(BaseModel):
    id: str
    userId: str
    roadClosure: int
    reduceTraffic: int
    pauseConstruction: int
    reduceIndustry: int
    aqiReduction: str
    cost: str
    healthImpact: str
    timestamp: str
