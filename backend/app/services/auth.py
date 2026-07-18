from fastapi import HTTPException, status
from app.config.database import get_collection
from app.schemas.auth import UserRegister, UserLogin, Token, UserOut
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from bson import ObjectId

class AuthService:
    @staticmethod
    async def register(data: UserRegister) -> dict:
        users_col = get_collection("users")
        
        # Check duplicate email
        existing_user = await users_col.find_one({"email": data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered in the system."
            )
        
        # Create user
        user_doc = {
            "email": data.email,
            "password_hash": hash_password(data.password),
            "role": data.role
        }
        result = await users_col.insert_one(user_doc)
        
        return {
            "id": str(result.inserted_id),
            "email": data.email,
            "role": data.role
        }

    @staticmethod
    async def login(data: UserLogin) -> dict:
        users_col = get_collection("users")
        
        # Find user
        user = await users_col.find_one({"email": data.email})
        if not user or not verify_password(data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password credentials."
            )
        
        # Generate tokens
        token_data = {"sub": str(user["_id"]), "role": user["role"]}
        access = create_access_token(token_data)
        refresh = create_refresh_token(token_data)
        
        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer"
        }

    @staticmethod
    async def refresh(refresh_token: str) -> dict:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token."
            )
        
        user_id = payload.get("sub")
        role = payload.get("role")
        
        users_col = get_collection("users")
        user = await users_col.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account associated with this token not found."
            )
        
        # Generate fresh tokens
        token_data = {"sub": user_id, "role": role}
        access = create_access_token(token_data)
        refresh = create_refresh_token(token_data)
        
        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer"
        }
