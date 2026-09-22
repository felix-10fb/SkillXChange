from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# User & Auth Schemas
class UserRegister(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class AdminLogin(BaseModel):
    admin_key: str
    email_or_username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    role: str

class SkillBase(BaseModel):
    name: str
    category: str

class SkillCreate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: str

    class Config:
        from_attributes = True

class UserSkillDetail(BaseModel):
    skill_id: str
    name: str
    category: str
    type: str # TEACH or LEARN
    experience_level: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    experience_level: Optional[str] = None
    availability: Optional[str] = None
    teach_skill_ids: Optional[List[str]] = None
    learn_skill_ids: Optional[List[str]] = None

class ProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    username: str
    email: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    experience_level: str
    availability: str
    rating: float
    reviews_count: int
    exchanges_completed: int
    role: str
    skillcoins: int = 500
    streak_count: int = 1
    is_featured: bool = False
    badge_title: Optional[str] = None
    teach_skills: List[SkillOut] = []
    learn_skills: List[SkillOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Skillcoin Transaction Schemas
class TransactionOut(BaseModel):
    id: str
    amount: int
    type: str
    description: str
    created_at: datetime

class RewardRedeem(BaseModel):
    item_id: str
    cost: int
    title: str

# Reciprocal Match Response Schema
class MatchOut(BaseModel):
    user_id: str
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    compatibility_score: float
    reason: str
    teach_skills: List[SkillOut] = []
    learn_skills: List[SkillOut] = []
    experience_level: str
    availability: str
    is_featured: bool = False
    badge_title: Optional[str] = None

# Exchange Request Schemas
class ExchangeRequestCreate(BaseModel):
    receiver_id: str
    teach_skill_id: str
    learn_skill_id: str
    message: str

class ExchangeRequestOut(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    sender_username: str
    sender_avatar: Optional[str] = None
    receiver_id: str
    receiver_name: str
    receiver_username: str
    receiver_avatar: Optional[str] = None
    teach_skill: SkillOut
    learn_skill: SkillOut
    message: str
    status: str
    created_at: datetime

class ExchangeRequestAction(BaseModel):
    status: str # ACCEPTED or DECLINED

# Messaging Schemas
class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender_username: str
    content: str
    read_at: Optional[datetime] = None
    created_at: datetime

class ConversationOut(BaseModel):
    id: str
    other_user_id: str
    other_user_name: str
    other_user_username: str
    other_user_avatar: Optional[str] = None
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0

# Review Schemas
class ReviewCreate(BaseModel):
    exchange_id: str
    reviewed_user_id: str
    rating: int = Field(..., ge=1, le=5)
    review: str

class ReviewOut(BaseModel):
    id: str
    reviewer_name: str
    reviewer_avatar: Optional[str] = None
    rating: int
    review: str
    created_at: datetime

# Admin Stats Schema
class AdminStatsOut(BaseModel):
    total_users: int
    active_users: int
    total_skills: int
    active_exchanges: int
    completed_exchanges: int
    pending_requests: int
