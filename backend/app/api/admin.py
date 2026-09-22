from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, Skill, ExchangeRequest, Exchange, Review
from ..schemas.schemas import AdminStatsOut
from .deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Console"])

@router.get("/stats", response_model=AdminStatsOut)
def get_admin_stats(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    tot_users = db.query(User).count()
    act_users = db.query(User).filter(User.is_active == True).count()
    tot_skills = db.query(Skill).count()
    act_exchanges = db.query(Exchange).filter(Exchange.status == "ACTIVE").count()
    comp_exchanges = db.query(Exchange).filter(Exchange.status == "COMPLETED").count()
    pend_reqs = db.query(ExchangeRequest).filter(ExchangeRequest.status == "PENDING").count()

    return AdminStatsOut(
        total_users=tot_users,
        active_users=act_users,
        total_skills=tot_skills,
        active_exchanges=act_exchanges,
        completed_exchanges=comp_exchanges,
        pending_requests=pend_reqs
    )

@router.get("/users")
def get_all_users(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    out = []
    for u in users:
        p = db.query(Profile).filter(Profile.user_id == u.id).first()
        out.append({
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "full_name": p.full_name if p else u.username,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at
        })
    return out

@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(user_id: str, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot disable your own admin account")

    user.is_active = not user.is_active
    db.commit()
    return {"status": "success", "user_id": user.id, "is_active": user.is_active}

@router.delete("/reviews/{review_id}")
def delete_review(review_id: str, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    rev = db.query(Review).filter(Review.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(rev)
    db.commit()
    return {"status": "success", "message": "Review removed by administrator"}
