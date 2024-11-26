from fastapi import APIRouter, HTTPException, Depends, Cookie
import sqlite3
import os
from .authentication import check_user_type
router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, '..', 'database')
DB_FILE = os.path.join(DB_DIR, 'database.db')


def get_current_user_type(session_id: str = Cookie(None)) -> int:
    return check_user_type(session_id, required_user_type=2)

@router.get("/admin-dashboard")
async def admin_dashboard(user_type: int = Depends(get_current_user_type)):
    return {"message": "Welcome to the admin dashboard"}


# usertype 0 = student, usertype 1 = docent
def get_admin_data(user_type: int) -> int:
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Gebruikers WHERE UserType = ?", (user_type,))
        count = cursor.fetchone()[0]
        conn.close()
        return count
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin-count")
async def get_admin_count():
    admin_count = get_admin_data(1) 
    return {"admin_count": admin_count}

@router.get("/student-count")
async def get_student_count():
    student_count = get_admin_data(0)  
    return {"student_count": student_count}

#game functies
def get_game_data():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Games")
        count = cursor.fetchone()[0]
        conn.close()
        return count
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/game-count")
async def get_game_count():
    game_count = get_game_data()  
    return {"game_count": game_count}


#domain functies
def get_domain_count():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM domain")
        count = cursor.fetchone()[0]
        conn.close()
        return count
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/domain-count")
async def get_domain_count_route():
    domain_count = get_domain_count()
    return {"domain_count": domain_count}


#recente gebeurtenissen functies
# recente registraties

def get_recent_registrations(limit: int = 5):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT GebruikersNaam, RegistratieDatum FROM Gebruikers ORDER BY RegistratieDatum DESC LIMIT ?", (limit,))
        recent_registrations = cursor.fetchall()
        conn.close()
        return [{"username": row[0], "registration_date": row[1]} for row in recent_registrations]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/recent-registrations")
async def get_recent_registrations_route():
    recent_registrations = get_recent_registrations()
    return { "recent_registrations": recent_registrations}