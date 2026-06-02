from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib, secrets

SECRET_KEY = "railshield-super-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

security = HTTPBearer()
router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hashlib.sha256(password.encode()).hexdigest() == hashed

USERS_DB = {
    "admin@railshield.in": {
        "name": "Arjun Sharma",
        "role": "SOC Admin",
        "password_hash": hash_password("railshield123"),
        "avatar": "AS",
        "zone": "All Zones",
    },
    "analyst@railshield.in": {
        "name": "Priya Nair",
        "role": "Security Analyst",
        "password_hash": hash_password("analyst123"),
        "avatar": "PN",
        "zone": "Zone-1-NR",
    },
    "ops@railshield.in": {
        "name": "Ravi Kumar",
        "role": "Network Ops",
        "password_hash": hash_password("ops12345"),
        "avatar": "RK",
        "zone": "Zone-4-ER",
    },
}

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = USERS_DB.get(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token({"sub": req.email, "role": user["role"], "name": user["name"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": req.email,
            "name": user["name"],
            "role": user["role"],
            "avatar": user["avatar"],
            "zone": user["zone"],
        }
    }

@router.get("/me")
def get_me(payload: dict = Depends(verify_token)):
    email = payload.get("sub")
    user = USERS_DB.get(email, {})
    return {
        "email": email,
        "name": payload.get("name"),
        "role": payload.get("role"),
        "avatar": user.get("avatar", "??"),
        "zone": user.get("zone", "N/A"),
    }

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
