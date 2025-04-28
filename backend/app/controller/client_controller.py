from fastapi import APIRouter, Depends, Form, HTTPException, BackgroundTasks  , Query

from sqlalchemy.orm import Session
from sqlalchemy import JSON, Column, func

from schemas.user_schemas import LoginRequest, RegisterRequest, PasswordResetRequest, UserListResponse, UserProfileResponse, UserProfileUpdateRequest
from model.client_model import User
from service.auth import get_current_user, verify_password, get_password_hash, create_access_token, ALGORITHM, SECRET_KEY
from dependencies import get_db
from jose import jwt, JWTError

router = APIRouter()


@router.post("/register")
def register(
    request: RegisterRequest, 
    db: Session = Depends(get_db)
    ):
    # validate if username or email already exists
    if request.email:
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    if request.username:
        existing_user = db.query(User).filter(User.username == request.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(request.password)

    # user creation
    new_user = User(
        name=request.name,
        surname=request.surname,
        username=request.username,
        email=request.email,
        phone_number=request.phone_number,
        password=hashed_password,
        role=request.role or "user",  # Default role is user
        preference=request.preferences.dict() if request.preferences else None,
        bio=request.bio,
        pets=request.pets.dict() if request.pets else None,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # query the user by email
    user = db.query(User).filter(User.email == request.email).first()

    # Validatte user and password
    if not user or not verify_password(request.password, user.password):
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

@router.post("/change-password")
def change_password(
    current_password: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.password = get_password_hash(new_password)
    db.commit()

    return {"message": "Password changed successfully"}

@router.get("/users/{user_id}", response_model=UserProfileResponse)
def get_user_profile(
    user_id: int, 
    db: Session = Depends(get_db)):

    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    

    return {
        "user_id": user.user_id,
        "name": user.name,
        "surname": user.surname,
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "bio": user.bio,
        "preferences": user.preference,
        "pets": user.pets,
        "created_at": user.created_at.isoformat(),
    }

@router.put("/users/{user_id}", response_model=UserProfileResponse)
def update_user_profile(
    user_id: int, 
    profile_update: UserProfileUpdateRequest, 
    db: Session = Depends(get_db)
    ):
    # Fetch user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the fields if its provided
    if profile_update.name is not None:
        user.name = profile_update.name
    if profile_update.surname is not None:
        user.surname = profile_update.surname
    if profile_update.phone_number is not None:
        user.phone_number = profile_update.phone_number
    if profile_update.bio is not None:
        user.bio = profile_update.bio
    if profile_update.pets is not None:
        user.pets = profile_update.pets.dict()
    if profile_update.preferences is not None:
        user.preference = profile_update.preferences.dict()  
    
    db.commit()
    db.refresh(user)
    
    return {
        "user_id": user.user_id,
        "name": user.name,
        "surname": user.surname,
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "bio": user.bio,
        "preferences": user.preference,
        "pets": user.pets,
        "created_at": user.created_at.isoformat(),
    }

@router.get("/users", response_model=UserListResponse)
def list_all_users(
    skip: int = Query(0, ge=0), 
    limit: int = Query(10, le=100), 
    db: Session = Depends(get_db)
):
    # Fetch total count and results
    total_users = db.query(func.count(User.user_id)).scalar()
    users = db.query(User).offset(skip).limit(limit).all()
    
    return {
        "total": total_users,
        "users": [
            {
                "user_id": user.user_id,
                "name": user.name,
                "surname": user.surname,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
            for user in users
        ],
    }

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admins or the user themselves can delete a user
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    # Fetch the user
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the user
    db.delete(user)
    db.commit()
    
    return {"message": f"User with ID {user_id} has been deleted"}