from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.config import settings
from ..core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from ..models.models import User, Profile
from ..schemas.schemas import UserRegister, UserLogin, AdminLogin, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check existing user
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=user_in.email,
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create empty profile
    profile = Profile(
        user_id=user.id,
        full_name=user_in.full_name,
        bio=f"Hello! I am {user_in.full_name}, excited to learn and share skills on Skill X Change!"
    )
    db.add(profile)
    db.commit()

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "role": user.role
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == credentials.email_or_username) | (User.username == credentials.email_or_username)
    ).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email/username or password")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account disabled by administrator")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "role": user.role
    }

@router.post("/admin-login", response_model=Token)
def admin_login(credentials: AdminLogin, db: Session = Depends(get_db)):
    """Authenticate with the admin key. If the admin key is valid,
    logs the user in and creates or promotes them to admin role."""

    # 1. Validate admin key
    if credentials.admin_key != settings.ADMIN_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid administrator key"
        )

    # 2. Find or create user
    user = db.query(User).filter(
        (User.email == credentials.email_or_username) | (User.username == credentials.email_or_username)
    ).first()

    if not user:
        # If user does not exist yet, auto-create the admin user!
        username = credentials.email_or_username.split("@")[0] if "@" in credentials.email_or_username else credentials.email_or_username
        email = credentials.email_or_username if "@" in credentials.email_or_username else f"{credentials.email_or_username}@skillxchange.com"

        # Ensure unique username & email if collisions occur
        if db.query(User).filter(User.username == username).first():
            username = f"{username}_{int(datetime.now().timestamp())}"
        if db.query(User).filter(User.email == email).first():
            email = f"admin_{int(datetime.now().timestamp())}@skillxchange.com"

        user = User(
            email=email,
            username=username,
            password_hash=get_password_hash(credentials.password),
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = Profile(
            user_id=user.id,
            full_name=f"{username.capitalize()} (Admin)",
            bio="Administrator for Skill X Change platform."
        )
        db.add(profile)
        db.commit()
    else:
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email/username or password"
            )

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Account disabled")

        # Promote to admin if not already
        if user.role != "admin":
            user.role = "admin"
            db.commit()
            db.refresh(user)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "role": user.role
    }

