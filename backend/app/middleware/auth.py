from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_token
from app.config.database import get_collection
from bson import ObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token credentials."
        )
    
    user_id = payload.get("sub")
    users_col = get_collection("users")
    
    try:
        user = await users_col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = None
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this token not found."
        )
        
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }

def require_roles(allowed_roles: list):
    async def role_dependency(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: Insufficient security clearances."
            )
        return current_user
    return role_dependency
