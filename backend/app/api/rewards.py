from datetime import datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, SkillcoinTransaction, Notification
from ..schemas.schemas import TransactionOut, RewardRedeem
from .deps import get_current_user

router = APIRouter(prefix="/wallet", tags=["Skillcoin & Streaks Economy"])

@router.post("/checkin")
def daily_checkin(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    now = datetime.now(timezone.utc)
    # Check if user already checked in today (within 20 hours for user friendliness)
    if profile.last_checkin_at:
        time_diff = now - profile.last_checkin_at
        if time_diff < timedelta(hours=20):
            raise HTTPException(status_code=400, detail="Daily check-in reward already claimed for today! Come back tomorrow.")

    # Increment streak and award 25 Skillcoins
    profile.streak_count += 1
    profile.skillcoins += 25
    profile.last_checkin_at = now

    # Record transaction
    tx = SkillcoinTransaction(
        user_id=current_user.id,
        amount=25,
        type="DAILY_CHECKIN",
        description=f"Claimed Daily Login Streak Bonus (🔥 Day {profile.streak_count} Streak)"
    )
    db.add(tx)

    # Add notification
    notif = Notification(
        user_id=current_user.id,
        type="SKILLCOIN",
        message=f"🎉 Claimed +25 Skillcoins! Daily Streak is now 🔥 {profile.streak_count} days!"
    )
    db.add(notif)

    db.commit()
    db.refresh(profile)

    return {
        "message": "Daily check-in bonus claimed!",
        "skillcoins": profile.skillcoins,
        "streak_count": profile.streak_count,
        "claimed_amount": 25
    }

@router.get("/transactions", response_model=List[TransactionOut])
def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txs = db.query(SkillcoinTransaction).filter(
        SkillcoinTransaction.user_id == current_user.id
    ).order_by(SkillcoinTransaction.created_at.desc()).limit(30).all()

    return [
        TransactionOut(
            id=tx.id,
            amount=tx.amount,
            type=tx.type,
            description=tx.description,
            created_at=tx.created_at
        )
        for tx in txs
    ]

@router.post("/redeem")
def redeem_reward(
    item: RewardRedeem,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile.skillcoins < item.cost:
        raise HTTPException(status_code=400, detail=f"Insufficient Skillcoins! You have 🪙 {profile.skillcoins} SKC, but {item.title} requires 🪙 {item.cost} SKC.")

    # Deduct Skillcoins
    profile.skillcoins -= item.cost

    # Apply reward perks based on item_id
    if item.item_id == "boost":
        profile.is_featured = True
    elif item.item_id == "tutor_badge":
        profile.badge_title = "⭐ Verified Master Tutor"
    elif item.item_id == "expert_badge":
        profile.badge_title = "🚀 Premier Exchanger"

    # Record spend transaction
    tx = SkillcoinTransaction(
        user_id=current_user.id,
        amount=-item.cost,
        type="REDEEM_REWARD",
        description=f"Redeemed Marketplace Reward: {item.title}"
    )
    db.add(tx)

    # Add notification
    notif = Notification(
        user_id=current_user.id,
        type="SKILLCOIN",
        message=f"🎉 Successfully unlocked {item.title}! 🪙 {item.cost} Skillcoins spent."
    )
    db.add(notif)

    db.commit()
    db.refresh(profile)

    return {
        "message": f"Successfully redeemed {item.title}!",
        "new_balance": profile.skillcoins,
        "is_featured": profile.is_featured,
        "badge_title": profile.badge_title
    }
