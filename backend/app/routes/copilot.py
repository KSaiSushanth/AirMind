from fastapi import APIRouter
from pydantic import BaseModel
from app.services.copilot import CopilotService

router = APIRouter(prefix="/copilot", tags=["AI Copilot Dialogue"])

class QueryInput(BaseModel):
    query: str

class QueryResponse(BaseModel):
    response: str

@router.post("/query", response_model=QueryResponse)
async def ask_copilot(data: QueryInput):
    """Processes user queries about city conditions or simulations using Causal AI and Gemini."""
    reply = await CopilotService.get_response(data.query)
    return {"response": reply}
