import sys
import os

# Add root & backend directory to PYTHONPATH
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(root_dir, "backend")
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.models import (
    User, Profile, Skill, UserSkill, ExchangeRequest, Exchange,
    Conversation, ConversationMember, Message, Review, Notification, SkillcoinTransaction
)

def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("[SEED] Clearing old seed data...")
    db.query(SkillcoinTransaction).delete()
    db.query(Notification).delete()
    db.query(Review).delete()
    db.query(Exchange).delete()
    db.query(Message).delete()
    db.query(ConversationMember).delete()
    db.query(Conversation).delete()
    db.query(ExchangeRequest).delete()
    db.query(UserSkill).delete()
    db.query(Skill).delete()
    db.query(Profile).delete()
    db.query(User).delete()
    db.commit()

    print("[SEED] Creating 18 Skill Categories & Skills...")
    skills_data = [
        ("Python", "Programming"),
        ("FastAPI", "Web Development"),
        ("Machine Learning", "Artificial Intelligence"),
        ("React & Next.js", "Web Development"),
        ("UI/UX Design", "UI/UX Design"),
        ("Figma Mastery", "UI/UX Design"),
        ("Graphic Design", "Graphic Design"),
        ("Cybersecurity & Linux", "Cybersecurity"),
        ("Video Editing", "Video Editing"),
        ("Digital Marketing", "Digital Marketing"),
        ("SEO Optimization", "Digital Marketing"),
        ("Public Speaking", "Public Speaking"),
        ("Mobile App Development", "App Development"),
        ("Data Science & Pandas", "Data Science"),
        ("Financial Modeling", "Finance"),
        ("Spanish Language", "Languages"),
        ("Calculus & Linear Algebra", "Academics"),
        ("Startup Fundraising", "Entrepreneurship")
    ]

    skill_objs = {}
    for name, cat in skills_data:
        s = Skill(name=name, category=cat)
        db.add(s)
        skill_objs[name] = s
    db.commit()

    print("[SEED] Creating Master Administrator Account & Initial Community Accounts...")
    users_data = [
        {
            "full_name": "System Administrator",
            "username": "admin",
            "email": "admin@skillxchange.com",
            "password": "ADMIN_KEY_2026",
            "role": "admin",
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
            "bio": "Master System Administrator for Skill X Change platform.",
            "exp": "Expert",
            "avail": "Flexible",
            "skillcoins": 1000,
            "streak": 1,
            "badge": "🛡️ Platform Master Admin",
            "teach": ["Python", "Cybersecurity & Linux"],
            "learn": ["Startup Fundraising"]
        },
        {
            "full_name": "Alex Johnson",
            "username": "alex",
            "email": "alex@skillxchange.com",
            "password": "password123",
            "role": "user",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            "bio": "Full-stack Python enthusiast & CS major. Looking to sharpen my UI/UX design skills in exchange for Python/FastAPI tutoring!",
            "exp": "Advanced",
            "avail": "Flexible",
            "skillcoins": 650,
            "streak": 5,
            "badge": "🚀 Premier Exchanger",
            "teach": ["Python", "FastAPI", "Machine Learning"],
            "learn": ["UI/UX Design", "Figma Mastery"]
        },
        {
            "full_name": "Sarah Miller",
            "username": "sarah",
            "email": "sarah@skillxchange.com",
            "password": "password123",
            "role": "user",
            "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
            "bio": "Product designer at a tech startup. Excited to teach Figma & UI design while learning Python and ML to build AI products!",
            "exp": "Expert",
            "avail": "Weekends",
            "skillcoins": 800,
            "streak": 7,
            "badge": "⭐ Master Tutor",
            "teach": ["UI/UX Design", "Figma Mastery", "Graphic Design"],
            "learn": ["Python", "Machine Learning"]
        }
    ]

    user_objs = {}
    for udata in users_data:
        u = User(
            email=udata["email"],
            username=udata["username"],
            password_hash=get_password_hash(udata["password"]),
            role=udata["role"]
        )
        db.add(u)
        db.flush()

        p = Profile(
            user_id=u.id,
            full_name=udata["full_name"],
            bio=udata["bio"],
            avatar_url=udata["avatar_url"],
            experience_level=udata["exp"],
            availability=udata["avail"],
            rating=5.0 if udata["username"] == "admin" else 4.9,
            reviews_count=10,
            exchanges_completed=3,
            skillcoins=udata["skillcoins"],
            streak_count=udata["streak"],
            badge_title=udata["badge"]
        )
        db.add(p)

        tx = SkillcoinTransaction(
            user_id=u.id,
            amount=udata["skillcoins"],
            type="INITIAL_WELCOME",
            description="Welcome bonus +500 Skillcoins for joining Skill X Change!"
        )
        db.add(tx)

        for sname in udata["teach"]:
            if sname in skill_objs:
                us = UserSkill(user_id=u.id, skill_id=skill_objs[sname].id, type="TEACH", experience_level=udata["exp"])
                db.add(us)

        for sname in udata["learn"]:
            if sname in skill_objs:
                us = UserSkill(user_id=u.id, skill_id=skill_objs[sname].id, type="LEARN", experience_level=udata["exp"])
                db.add(us)

        user_objs[udata["username"]] = u

    db.commit()
    print("[SEED] Administrator Key & Seed data populated successfully!")

if __name__ == "__main__":
    seed()
