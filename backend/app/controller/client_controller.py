from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.schemas import LoginRequest, RegisterRequest
from model.client_model import User
from service.auth import verify_password, get_password_hash, create_access_token
from dependencies import get_db

router = APIRouter()



@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # validate user if exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = get_password_hash(request.password)

    new_user = User(email=request.email, hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # query the user by email
    user = db.query(User).filter(User.email == request.email).first()

    # Validatte user and password
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Create a jwt token
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

