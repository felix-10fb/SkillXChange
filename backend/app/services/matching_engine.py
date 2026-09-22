from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..models.models import User, Profile, UserSkill, Skill

def calculate_reciprocal_matches(user_id: str, db: Session) -> List[Dict[str, Any]]:
    # Get current user's skills
    current_user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    if not current_user_skills:
        return []

    current_teaches = {us.skill_id: us.skill for us in current_user_skills if us.type == "TEACH"}
    current_wants = {us.skill_id: us.skill for us in current_user_skills if us.type == "LEARN"}

    current_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    current_exp = current_profile.experience_level if current_profile else "Intermediate"
    current_avail = current_profile.availability if current_profile else "Flexible"

    # Get all other active users
    other_users = db.query(User).filter(User.id != user_id, User.is_active == True).all()

    matches = []

    for candidate in other_users:
        cand_profile = db.query(Profile).filter(Profile.user_id == candidate.id).first()
        if not cand_profile:
            continue

        cand_skills = db.query(UserSkill).filter(UserSkill.user_id == candidate.id).all()
        cand_teaches = {us.skill_id: us.skill for us in cand_skills if us.type == "TEACH"}
        cand_wants = {us.skill_id: us.skill for us in cand_skills if us.type == "LEARN"}

        # Reciprocity calculation
        # 1. Candidate teaches what Current wants
        cand_teaches_current_wants = set(cand_teaches.keys()).intersection(set(current_wants.keys()))
        # 2. Current teaches what Candidate wants
        current_teaches_cand_wants = set(current_teaches.keys()).intersection(set(cand_wants.keys()))

        score = 40.0 # Base score for registered user
        reasons = []

        double_match = len(cand_teaches_current_wants) > 0 and len(current_teaches_cand_wants) > 0
        single_match_1 = len(cand_teaches_current_wants) > 0
        single_match_2 = len(current_teaches_cand_wants) > 0

        if double_match:
            score += 45.0
            teach_names = ", ".join([cand_teaches[sid].name for sid in cand_teaches_current_wants])
            learn_names = ", ".join([current_teaches[sid].name for sid in current_teaches_cand_wants])
            reasons.append(f"Perfect Reciprocal Match: {candidate.username} teaches {teach_names} & wants {learn_names}!")
        elif single_match_1:
            score += 25.0
            teach_names = ", ".join([cand_teaches[sid].name for sid in cand_teaches_current_wants])
            reasons.append(f"Skill Match: {candidate.username} teaches {teach_names} which you want to learn.")
        elif single_match_2:
            score += 20.0
            learn_names = ", ".join([current_teaches[sid].name for sid in current_teaches_cand_wants])
            reasons.append(f"Skill Match: {candidate.username} wants to learn {learn_names} which you teach.")
        else:
            # Check category alignment
            cand_teach_cats = {s.category for s in cand_teaches.values()}
            curr_want_cats = {s.category for s in current_wants.values()}
            if cand_teach_cats.intersection(curr_want_cats):
                score += 15.0
                reasons.append(f"Category Interest Alignment in {', '.join(cand_teach_cats.intersection(curr_want_cats))}.")

        # Experience level score boost
        if cand_profile.experience_level == current_exp:
            score += 7.0
            reasons.append(f"Matching experience level ({current_exp}).")

        # Availability score boost
        if cand_profile.availability == current_avail or cand_profile.availability == "Flexible" or current_avail == "Flexible":
            score += 7.0
            reasons.append(f"Compatible schedule ({cand_profile.availability}).")

        score = min(98.0, round(score, 1))

        # Only include if score >= 50
        if score >= 50.0 or double_match:
            matches.append({
                "user_id": candidate.id,
                "username": candidate.username,
                "full_name": cand_profile.full_name,
                "avatar_url": cand_profile.avatar_url,
                "bio": cand_profile.bio,
                "compatibility_score": score,
                "reason": " • ".join(reasons) if reasons else "Compatible profile & interest match.",
                "teach_skills": [{"id": s.id, "name": s.name, "category": s.category} for s in cand_teaches.values()],
                "learn_skills": [{"id": s.id, "name": s.name, "category": s.category} for s in cand_wants.values()],
                "experience_level": cand_profile.experience_level,
                "availability": cand_profile.availability
            })

    # Sort matches by compatibility score descending
    matches.sort(key=lambda x: x["compatibility_score"], reverse=True)
    return matches
