from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User
from ..schemas.schemas import MatchOut
from ..services.matching_engine import calculate_reciprocal_matches
from .deps import get_current_user

router = APIRouter(prefix="/matches", tags=["Matching Algorithm"])

@router.get("", response_model=List[MatchOut])
def get_matches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    matches = calculate_reciprocal_matches(current_user.id, db)
    return matches
