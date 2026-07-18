from fastapi import APIRouter, Depends, status, Header
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.services.auth import AuthService
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister):
    """Registers a new user (Admin, Citizen, Hospital, or Traffic role)."""
    return await AuthService.register(data)

@router.post("/login", response_model=Token)
async def login(data: UserLogin):
    """Authenticates credentials and returns access and refresh tokens."""
    return await AuthService.login(data)

@router.post("/refresh", response_model=Token)
async def refresh(refresh_token: str = Header(..., alias="Authorization-Refresh")):
    """Refreshes an expired access token using a valid refresh token."""
    # Strip bearer prefix if passed
    if refresh_token.lower().startswith("bearer "):
        refresh_token = refresh_token[7:]
    return await AuthService.refresh(refresh_token)

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Returns the current authenticated user's profile details."""
    return current_user
