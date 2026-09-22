from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, Skill, ExchangeRequest, Exchange, Conversation, ConversationMember, Notification
from ..schemas.schemas import ExchangeRequestCreate, ExchangeRequestOut, ExchangeRequestAction, SkillOut
from .deps import get_current_user

router = APIRouter(prefix="/exchange-requests", tags=["Exchange Requests"])

def build_request_out(req: ExchangeRequest, db: Session) -> ExchangeRequestOut:
    sender = db.query(User).filter(User.id == req.sender_id).first()
    sender_prof = db.query(Profile).filter(Profile.user_id == req.sender_id).first()
    receiver = db.query(User).filter(User.id == req.receiver_id).first()
    receiver_prof = db.query(Profile).filter(Profile.user_id == req.receiver_id).first()

    teach_skill = db.query(Skill).filter(Skill.id == req.teach_skill_id).first()
    learn_skill = db.query(Skill).filter(Skill.id == req.learn_skill_id).first()

    return ExchangeRequestOut(
        id=req.id,
        sender_id=req.sender_id,
        sender_name=sender_prof.full_name if sender_prof else sender.username,
        sender_username=sender.username,
        sender_avatar=sender_prof.avatar_url if sender_prof else None,
        receiver_id=req.receiver_id,
        receiver_name=receiver_prof.full_name if receiver_prof else receiver.username,
        receiver_username=receiver.username,
        receiver_avatar=receiver_prof.avatar_url if receiver_prof else None,
        teach_skill=SkillOut(id=teach_skill.id, name=teach_skill.name, category=teach_skill.category),
        learn_skill=SkillOut(id=learn_skill.id, name=learn_skill.name, category=learn_skill.category),
        message=req.message or "",
        status=req.status,
        created_at=req.created_at
    )

@router.post("", response_model=ExchangeRequestOut)
def create_exchange_request(
    req_in: ExchangeRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req_in.receiver_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot send exchange request to yourself")

    receiver = db.query(User).filter(User.id == req_in.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=4404, detail="Receiver user not found")

    # Create request
    req = ExchangeRequest(
        sender_id=current_user.id,
        receiver_id=req_in.receiver_id,
        teach_skill_id=req_in.teach_skill_id,
        learn_skill_id=req_in.learn_skill_id,
        message=req_in.message,
        status="PENDING"
    )
    db.add(req)

    # Add notification for receiver
    notif = Notification(
        user_id=req_in.receiver_id,
        type="REQUEST",
        message=f"{current_user.username} sent you a Skill Exchange request!"
    )
    db.add(notif)

    db.commit()
    db.refresh(req)
    return build_request_out(req, db)

@router.get("", response_model=List[ExchangeRequestOut])
def get_exchange_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(ExchangeRequest).filter(
        (ExchangeRequest.sender_id == current_user.id) | (ExchangeRequest.receiver_id == current_user.id)
    ).order_by(ExchangeRequest.created_at.desc()).all()

    return [build_request_out(r, db) for r in requests]

@router.put("/{request_id}", response_model=ExchangeRequestOut)
def respond_exchange_request(
    request_id: str,
    action: ExchangeRequestAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(ExchangeRequest).filter(ExchangeRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Exchange request not found")

    if req.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only receiver can accept or decline requests")

    req.status = action.status.upper()

    if req.status == "ACCEPTED":
        # Create Exchange record
        exchange = Exchange(request_id=req.id, status="ACTIVE")
        db.add(exchange)

        # Create Conversation between users if not existing
        # Find existing conv
        conv_ids_1 = [cm.conversation_id for cm in db.query(ConversationMember).filter(ConversationMember.user_id == req.sender_id).all()]
        conv_ids_2 = [cm.conversation_id for cm in db.query(ConversationMember).filter(ConversationMember.user_id == req.receiver_id).all()]
        common = set(conv_ids_1).intersection(set(conv_ids_2))

        if not common:
            conv = Conversation()
            db.add(conv)
            db.flush()
            cm1 = ConversationMember(conversation_id=conv.id, user_id=req.sender_id)
            cm2 = ConversationMember(conversation_id=conv.id, user_id=req.receiver_id)
            db.add(cm1)
            db.add(cm2)

        # Send notification to sender
        notif = Notification(
            user_id=req.sender_id,
            type="ACCEPTED",
            message=f"{current_user.username} accepted your Skill Exchange request! You can now start messaging."
        )
        db.add(notif)
    elif req.status == "DECLINED":
        notif = Notification(
            user_id=req.sender_id,
            type="DECLINED",
            message=f"{current_user.username} declined your exchange request."
        )
        db.add(notif)

    db.commit()
    db.refresh(req)
    return build_request_out(req, db)
