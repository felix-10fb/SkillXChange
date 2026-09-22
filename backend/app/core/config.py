import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SKILL X CHANGE"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Secret Key for JWT
    SECRET_KEY: str = os.getenv("JWT_SECRET", "skillxchange_super_secret_jwt_key_2026_prod_secure")
    REFRESH_SECRET_KEY: str = os.getenv("JWT_REFRESH_SECRET", "skillxchange_super_secret_refresh_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for ease of demo
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # Database URL defaults to local SQLite for instant setup, can be overridden by PostgreSQL env var
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'skillxchange.db')).replace('\\\\', '/')}"
    )
    
    # Admin Key for administrator login
    ADMIN_KEY: str = os.getenv("ADMIN_KEY", "SXC-ADMIN-2026-MASTER")

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
