from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

from model.client_model import User
from sqlalchemy.orm import Session
from dependencies import get_db


# Secret key for JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

# OAuth2 scheme for retrieving tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return plain_password == hashed_password

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        user = None
        if sub.isdigit():  # new tokens with user_id
            user_id = int(sub)
            user = db.query(User).filter(User.user_id == user_id).first()
        else:  # legacy tokens with email
            email = sub
            user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def get_user_id(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        user_id = None
        if sub.isdigit(): 
            user_id = int(sub)
            return user_id
        
        elif user_id is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")