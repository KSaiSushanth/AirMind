from pydantic import BaseModel, Field
from typing import Optional

class AlertCreate(BaseModel):
    city: str
    title: str
    desc: str
    severity: str = Field("warning", pattern="^(critical|warning|info)$")

class AlertOut(BaseModel):
    id: str
    city: str
    title: str
    desc: str
    severity: str
    timestamp: str
    status: str

class AlertUpdate(BaseModel):
    status: str = Field(..., pattern="^(active|resolved)$")
