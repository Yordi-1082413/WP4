from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Union
import sqlite3

router = APIRouter()

def get_teacher_data() -> List[Dict[str, Union[int, str]]]:
    conn = sqlite3.connect('./database/database.db' , check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT GebruikerID, GebruikersNaam, Email, avatarUrl, UserType FROM Gebruikers WHERE UserType IN (1,2)")
        rows = cursor.fetchall()
        print("Aantal docenten gevonden:", len(rows))
        if not rows:
            raise HTTPException(status_code=404, detail="Geen docenten of admins gevonden")
        columns = [column[0] for column in cursor.description]
        teachers = [{columns[i]: row[i] for i in range(len(columns))} for row in rows]
        return teachers
    finally:
        conn.close()

def get_teacher_by_id(teacher_id: int) -> Dict[str, Union[int, str]]:
    conn = sqlite3.connect('./database/database.db' , check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT GebruikerID, GebruikersNaam, Email, avatarUrl, UserType FROM Gebruikers WHERE GebruikerID = ? AND UserType IN (1,2)", (teacher_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Docent niet gevonden")
        columns = [column[0] for column in cursor.description]
        teacher = {columns[i]: row[i] for i in range(len(columns))}
        return teacher
    finally:
        conn.close()

def update_teacher_data(teacher_id: int, gebruikersnaam: str, email: str, usertype: int, avatar_url: str = None):
    conn = sqlite3.connect('./database/database.db' , check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Gebruikers
            SET GebruikersNaam = ?, Email = ?, UserType = ?, avatarUrl = ?
            WHERE GebruikerID = ? AND UserType = 1
        """, (gebruikersnaam, email, usertype, avatar_url, teacher_id))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Docent niet gevonden of niks bewerkt.")
    finally:
        conn.close()

@router.get("/")
async def get_teacher_info():
    teachers = get_teacher_data()
    return teachers

@router.get("/{teacher_id}")
async def get_teacher_info_by_id(teacher_id: int):
    teacher = get_teacher_by_id(teacher_id)
    return teacher

@router.put("/{teacher_id}")
async def update_teacher_info(teacher_id: int, 
                              gebruikersnaam: str = Body(...), 
                              email: str = Body(...), 
                              usertype: int = Body(...), 
                              avatar_url: str = Body(None)):
    update_teacher_data(teacher_id, gebruikersnaam, email, usertype, avatar_url)
    return {"detail": "Docent succesvol bewerkt en opgeslagen! "}
