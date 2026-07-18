from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field("citizen", pattern="^(admin|citizen|hospital|traffic)$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: int

class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: str

    class Config:
        populate_by_name = True
