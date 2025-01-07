from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks  
from sqlalchemy.orm import Session
from schemas.schemas import LoginRequest, RegisterRequest, PasswordResetRequest
from model.client_model import User
from service.auth import verify_password, get_password_hash, create_access_token, ALGORITHM, SECRET_KEY
from dependencies import get_db
from jose import jwt, JWTError

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



@router.post("/password-reset")
def password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    # step 1 - token generation (requesting reset)
    if request.email:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Generate reset token
        reset_token = create_access_token({"sub": user.email})
        
        # Simulate sending the token via email
        print(f"Password reset token for {request.email}: {reset_token}")

        return {"message": "Password reset link has been sent to your email"}

    # step 2 -  password reset (updatting password)
    if request.token and request.new_password:
        try:
            payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=400, detail="Invalid token")
        except JWTError:
            raise HTTPException(status_code=400, detail="Invalid token")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Hash and update the password
        hashed_password = get_password_hash(request.new_password)
        user.hashed_password = hashed_password
        db.commit()

        return {"message": "Password has been reset successfully"}

    # Fallback for invalid requests
    raise HTTPException(status_code=400, detail="Invalid request. Provide email or token with new password.")
