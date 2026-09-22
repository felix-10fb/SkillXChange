from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Skill, User
from ..schemas.schemas import SkillOut, SkillCreate
from .deps import get_current_admin

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return skills

@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Skill.category).distinct().all()
    return [c[0] for c in categories]

@router.post("", response_model=SkillOut)
def create_skill(skill_in: SkillCreate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    existing = db.query(Skill).filter(Skill.name == skill_in.name).first()
    if existing:
        return existing
    skill = Skill(name=skill_in.name, category=skill_in.category)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
