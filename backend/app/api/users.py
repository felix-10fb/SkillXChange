from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, UserSkill, Skill
from ..schemas.schemas import ProfileOut, ProfileUpdate, SkillOut
from .deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

def build_profile_out(user: User, profile: Profile, db: Session) -> ProfileOut:
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all()
    teach_skills = [
        SkillOut(id=us.skill.id, name=us.skill.name, category=us.skill.category)
        for us in user_skills if us.type == "TEACH" and us.skill
    ]
    learn_skills = [
        SkillOut(id=us.skill.id, name=us.skill.name, category=us.skill.category)
        for us in user_skills if us.type == "LEARN" and us.skill
    ]

    return ProfileOut(
        id=profile.id,
        user_id=user.id,
        full_name=profile.full_name,
        username=user.username,
        email=user.email,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        experience_level=profile.experience_level,
        availability=profile.availability,
        rating=profile.rating,
        reviews_count=profile.reviews_count,
        exchanges_completed=profile.exchanges_completed,
        role=user.role,
        skillcoins=profile.skillcoins,
        streak_count=profile.streak_count,
        is_featured=profile.is_featured,
        badge_title=profile.badge_title,
        teach_skills=teach_skills,
        learn_skills=learn_skills,
        created_at=user.created_at
    )

@router.get("/me", response_model=ProfileOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return build_profile_out(current_user, profile, db)

@router.put("/me", response_model=ProfileOut)
def update_me(update_in: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if update_in.full_name is not None:
        profile.full_name = update_in.full_name
    if update_in.bio is not None:
        profile.bio = update_in.bio
    if update_in.avatar_url is not None:
        profile.avatar_url = update_in.avatar_url
    if update_in.experience_level is not None:
        profile.experience_level = update_in.experience_level
    if update_in.availability is not None:
        profile.availability = update_in.availability

    # Update Teach skills
    if update_in.teach_skill_ids is not None:
        db.query(UserSkill).filter(UserSkill.user_id == current_user.id, UserSkill.type == "TEACH").delete()
        for sid in update_in.teach_skill_ids:
            us = UserSkill(user_id=current_user.id, skill_id=sid, type="TEACH", experience_level=profile.experience_level)
            db.add(us)

    # Update Learn skills
    if update_in.learn_skill_ids is not None:
        db.query(UserSkill).filter(UserSkill.user_id == current_user.id, UserSkill.type == "LEARN").delete()
        for sid in update_in.learn_skill_ids:
            us = UserSkill(user_id=current_user.id, skill_id=sid, type="LEARN", experience_level=profile.experience_level)
            db.add(us)

    db.commit()
    db.refresh(profile)
    return build_profile_out(current_user, profile, db)

@router.get("/explore", response_model=List[ProfileOut])
def explore_users(
    query: Optional[str] = None,
    category: Optional[str] = None,
    experience: Optional[str] = None,
    availability: Optional[str] = None,
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.is_active == True).all()
    results = []
    for u in users:
        p = db.query(Profile).filter(Profile.user_id == u.id).first()
        if not p:
            continue

        p_out = build_profile_out(u, p, db)

        # Filters
        if query:
            q = query.lower()
            matches_q = (
                q in u.username.lower() or
                q in p.full_name.lower() or
                (p.bio and q in p.bio.lower()) or
                any(q in s.name.lower() for s in p_out.teach_skills) or
                any(q in s.name.lower() for s in p_out.learn_skills)
            )
            if not matches_q:
                continue

        if category:
            matches_cat = any(s.category == category for s in p_out.teach_skills + p_out.learn_skills)
            if not matches_cat:
                continue

        if experience and p.experience_level != experience:
            continue

        if availability and p.availability != availability and p.availability != "Flexible":
            continue

        results.append(p_out)

    return results

@router.get("/{username}", response_model=ProfileOut)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return build_profile_out(user, profile, db)
