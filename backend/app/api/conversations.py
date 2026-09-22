from typing import List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import User, Profile, Conversation, ConversationMember, Message, Notification
from ..schemas.schemas import ConversationOut, MessageOut, MessageCreate
from ..websocket.manager import manager
from .deps import get_current_user

router = APIRouter(prefix="/conversations", tags=["Messaging"])

@router.get("", response_model=List[ConversationOut])
def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member_records = db.query(ConversationMember).filter(ConversationMember.user_id == current_user.id).all()
    results = []

    for mr in member_records:
        conv_id = mr.conversation_id
        # Get other member
        other_member = db.query(ConversationMember).filter(
            ConversationMember.conversation_id == conv_id,
            ConversationMember.user_id != current_user.id
        ).first()

        if not other_member:
            continue

        other_user = db.query(User).filter(User.id == other_member.user_id).first()
        other_profile = db.query(Profile).filter(Profile.user_id == other_member.user_id).first()

        last_msg = db.query(Message).filter(Message.conversation_id == conv_id).order_by(Message.created_at.desc()).first()
        unread_cnt = db.query(Message).filter(
            Message.conversation_id == conv_id,
            Message.sender_id != current_user.id,
            Message.read_at == None
        ).count()

        results.append(ConversationOut(
            id=conv_id,
            other_user_id=other_user.id,
            other_user_name=other_profile.full_name if other_profile else other_user.username,
            other_user_username=other_user.username,
            other_user_avatar=other_profile.avatar_url if other_profile else None,
            last_message=last_msg.content if last_msg else "No messages yet",
            last_message_at=last_msg.created_at if last_msg else None,
            unread_count=unread_cnt
        ))

    return results

@router.get("/{conversation_id}/messages", response_model=List[MessageOut])
def get_messages(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = db.query(ConversationMember).filter(
        ConversationMember.conversation_id == conversation_id,
        ConversationMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()
    
    out = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        out.append(MessageOut(
            id=m.id,
            conversation_id=m.conversation_id,
            sender_id=m.sender_id,
            sender_username=sender.username if sender else "Unknown",
            content=m.content,
            read_at=m.read_at,
            created_at=m.created_at
        ))
    return out

@router.post("/{conversation_id}/messages", response_model=MessageOut)
async def send_message(
    conversation_id: str,
    msg_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = db.query(ConversationMember).filter(
        ConversationMember.conversation_id == conversation_id,
        ConversationMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=msg_in.content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Broadcast via WebSocket manager
    msg_data = {
        "id": msg.id,
        "conversation_id": conversation_id,
        "sender_id": current_user.id,
        "sender_username": current_user.username,
        "content": msg.content,
        "created_at": msg.created_at.isoformat()
    }
    await manager.broadcast_to_conversation(conversation_id, msg_data)

    return MessageOut(
        id=msg.id,
        conversation_id=msg.conversation_id,
        sender_id=msg.sender_id,
        sender_username=current_user.username,
        content=msg.content,
        read_at=msg.read_at,
        created_at=msg.created_at
    )
