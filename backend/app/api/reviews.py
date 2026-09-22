from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, Review, Exchange, Notification
from ..schemas.schemas import ReviewCreate, ReviewOut
from .deps import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("", response_model=ReviewOut)
def create_review(
    rev_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exchange = db.query(Exchange).filter(Exchange.id == rev_in.exchange_id).first()
    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange not found")

    # Prevent duplicate reviews for same exchange by same reviewer
    existing = db.query(Review).filter(
        Review.exchange_id == rev_in.exchange_id,
        Review.reviewer_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted a review for this exchange")

    rev = Review(
        exchange_id=rev_in.exchange_id,
        reviewer_id=current_user.id,
        reviewed_user_id=rev_in.reviewed_user_id,
        rating=rev_in.rating,
        review=rev_in.review
    )
    db.add(rev)

    # Recalculate average rating for reviewed user profile
    reviewed_profile = db.query(Profile).filter(Profile.user_id == rev_in.reviewed_user_id).first()
    if reviewed_profile:
        all_reviews = db.query(Review).filter(Review.reviewed_user_id == rev_in.reviewed_user_id).all()
        ratings = [r.rating for r in all_reviews] + [rev_in.rating]
        reviewed_profile.reviews_count = len(ratings)
        reviewed_profile.rating = round(sum(ratings) / len(ratings), 1)

    # Add notification for reviewed user
    notif = Notification(
        user_id=rev_in.reviewed_user_id,
        type="REVIEW",
        message=f"{current_user.username} left you a {rev_in.rating}-star review!"
    )
    db.add(notif)

    db.commit()
    db.refresh(rev)

    curr_prof = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    return ReviewOut(
        id=rev.id,
        reviewer_name=curr_prof.full_name if curr_prof else current_user.username,
        reviewer_avatar=curr_prof.avatar_url if curr_prof else None,
        rating=rev.rating,
        review=rev.review,
        created_at=rev.created_at
    )

@router.get("/user/{user_id}", response_model=List[ReviewOut])
def get_user_reviews(user_id: str, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.reviewed_user_id == user_id).order_by(Review.created_at.desc()).all()
    results = []
    for r in reviews:
        rev_prof = db.query(Profile).filter(Profile.user_id == r.reviewer_id).first()
        rev_user = db.query(User).filter(User.id == r.reviewer_id).first()
        results.append(ReviewOut(
            id=r.id,
            reviewer_name=rev_prof.full_name if rev_prof else (rev_user.username if rev_user else "User"),
            reviewer_avatar=rev_prof.avatar_url if rev_prof else None,
            rating=r.rating,
            review=r.review,
            created_at=r.created_at
        ))
    return results
