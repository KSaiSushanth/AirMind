from fastapi import APIRouter, Depends, status
from app.schemas.simulation import SimulationCreate, SimulationOut
from app.services.simulation import SimulationService
from app.middleware.auth import get_current_user
from typing import List

router = APIRouter(prefix="/simulation", tags=["Digital Twin Simulation"])

@router.post("", response_model=SimulationOut, status_code=status.HTTP_201_CREATED)
async def create_simulation(data: SimulationCreate, current_user: dict = Depends(get_current_user)):
    """Runs a policy simulation (curtailment inputs) and saves the results to the user's history."""
    return await SimulationService.create_and_save(current_user["id"], data)

@router.get("/history", response_model=List[SimulationOut])
async def get_history(current_user: dict = Depends(get_current_user)):
    """Retrieves all past simulation runs completed by the active authenticated user."""
    return await SimulationService.get_user_history(current_user["id"])
