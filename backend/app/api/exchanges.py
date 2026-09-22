from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, Skill, ExchangeRequest, Exchange, Notification, SkillcoinTransaction
from ..schemas.schemas import SkillOut
from .deps import get_current_user

router = APIRouter(prefix="/exchanges", tags=["Exchanges"])

@router.get("")
def get_user_exchanges(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    requests = db.query(ExchangeRequest).filter(
        (ExchangeRequest.sender_id == current_user.id) | (ExchangeRequest.receiver_id == current_user.id),
        ExchangeRequest.status.in_(["ACCEPTED", "COMPLETED"])
    ).all()

    results = []
    for r in requests:
        exchange = db.query(Exchange).filter(Exchange.request_id == r.id).first()
        if not exchange:
            continue

        partner_id = r.receiver_id if r.sender_id == current_user.id else r.sender_id
        partner = db.query(User).filter(User.id == partner_id).first()
        partner_prof = db.query(Profile).filter(Profile.user_id == partner_id).first()

        my_teach = db.query(Skill).filter(Skill.id == r.teach_skill_id if r.sender_id == current_user.id else r.learn_skill_id).first()
        my_learn = db.query(Skill).filter(Skill.id == r.learn_skill_id if r.sender_id == current_user.id else r.teach_skill_id).first()

        results.append({
            "id": exchange.id,
            "request_id": r.id,
            "status": exchange.status,
            "partner_id": partner_id,
            "partner_name": partner_prof.full_name if partner_prof else partner.username,
            "partner_username": partner.username,
            "partner_avatar": partner_prof.avatar_url if partner_prof else None,
            "skill_teaching": SkillOut(id=my_teach.id, name=my_teach.name, category=my_teach.category) if my_teach else None,
            "skill_learning": SkillOut(id=my_learn.id, name=my_learn.name, category=my_learn.category) if my_learn else None,
            "started_at": exchange.started_at,
            "completed_at": exchange.completed_at
        })

    return results

@router.post("/{exchange_id}/complete")
def complete_exchange(
    exchange_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exchange = db.query(Exchange).filter(Exchange.id == exchange_id).first()
    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange record not found")

    req = db.query(ExchangeRequest).filter(ExchangeRequest.id == exchange.request_id).first()
    if not req or (req.sender_id != current_user.id and req.receiver_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to complete this exchange")

    if exchange.status == "COMPLETED":
        return {"message": "Exchange already completed", "exchange_id": exchange_id}

    exchange.status = "COMPLETED"
    exchange.completed_at = datetime.now(timezone.utc)
    req.status = "COMPLETED"

    # Update profile completed counts & award +100 Skillcoins to both partners
    prof1 = db.query(Profile).filter(Profile.user_id == req.sender_id).first()
    prof2 = db.query(Profile).filter(Profile.user_id == req.receiver_id).first()

    if prof1:
        prof1.exchanges_completed += 1
        prof1.skillcoins += 100
        tx1 = SkillcoinTransaction(
            user_id=req.sender_id,
            amount=100,
            type="EXCHANGE_REWARD",
            description="Earned +100 Skillcoins for completing a Skill Exchange!"
        )
        db.add(tx1)

    if prof2:
        prof2.exchanges_completed += 1
        prof2.skillcoins += 100
        tx2 = SkillcoinTransaction(
            user_id=req.receiver_id,
            amount=100,
            type="EXCHANGE_REWARD",
            description="Earned +100 Skillcoins for completing a Skill Exchange!"
        )
        db.add(tx2)

    # Send notifications
    other_id = req.receiver_id if req.sender_id == current_user.id else req.sender_id
    notif = Notification(
        user_id=other_id,
        type="COMPLETED",
        message=f"🎉 {current_user.username} marked your Skill Exchange as COMPLETED! You earned +100 Skillcoins 🪙!"
    )
    db.add(notif)

    db.commit()
    return {"message": "Exchange marked as completed! +100 Skillcoins awarded!", "exchange_id": exchange_id}
