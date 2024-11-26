from fastapi import FastAPI, BackgroundTasks, requests, APIRouter, Depends, Cookie, HTTPException, Request
from typing import List, Optional
import re
import os
from dotenv import load_dotenv
from .authentication import check_user_type, get_user_id_from_session, rows_to_dict
from .error_handlers import NotLoggedInException
import sqlite3
import requests
from .models import StudentUpdate, Inlevering

load_dotenv()

EMAIL_REGEX = re.compile(r'^[^@]+@hr\.nl$')
MAILGUN_API_KEY = os.getenv('MAILGUN_API_KEY')
MAILGUN_DOMAIN = os.getenv('MAILGUN_DOMAIN')


router = APIRouter()

conn = sqlite3.connect('./database/database.db', check_same_thread=False)
cursor = conn.cursor()


@router.get('/docent')
def beheerder_page():
    return {'message': 'Hello World from Docent API'}


@router.get("/getstudents")
async def getstudents(session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)

    # Selects everyone where usertype is NULL
    cursor.execute(
        "SELECT GebruikerID, GebruikersNaam, Email, studentClass FROM Gebruikers WHERE UserType IS NULL")
    rows = cursor.fetchall()

    # Process the results to remove everything after the @ in emails
    # This is done because we dont have studentNR's but we only allow @hr emails who are always equal to studentNR
    processed_rows = []
    for row in rows:
        id, name, email, studentClass = row
        studentNumber = email.split('@')[0]  # Remove everything after the @
        processed_rows.append((id, name, studentNumber, studentClass))

    columns = ["id", "name", "studentNumber", "studentClass"]
    userinfo = rows_to_dict(processed_rows, columns)

    return {"studentinfo": userinfo}


@router.put('/updatestudent')
async def updatestudent(student: StudentUpdate, request: Request, session_id: Optional[str] = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)

    cursor.execute("UPDATE Gebruikers SET GebruikersNaam = ?, studentClass = ? WHERE GebruikerID = ?",
                   (student.name, student.studentClass, student.id))
    conn.commit()

    return {"message": "Student updated successfully"}


@router.delete('/deletestudent/{student_id}')
async def deletestudent(student_id: int, request: Request, session_id: Optional[str] = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)

    cursor.execute(
        "DELETE FROM Gebruikers WHERE GebruikerID = ?", (student_id,))
    conn.commit()

    return {"message": "Student deleted successfully"}


@router.get("/getallsubjects")
async def getallsubjects(session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)
    teacher_id = get_user_id_from_session(session_id)

    cursor.execute(
        "SELECT DISTINCT Vak.VakID, Naam, Beschrijving FROM DomainVak INNER JOIN Vak ON DomainVak.VakID = Vak.VakID AND Vak.TeacherID = ?", (teacher_id,))
    subjects = cursor.fetchall()
    return subjects


@router.get("/getinleveringen/{vakid}", response_model=List[Inlevering])
def get_inleveringen(vakid: int, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)
    teacher_id = get_user_id_from_session(session_id)
    try:
        query = """
        SELECT 
            GI.GameID,
            GI.GebruikersID,
            GI.OpdrachtInlevering,
            G.Naam AS GameNaam,
            V.Naam AS VakNaam,
            U.Email AS StudentEmail,
            U.GebruikersNaam AS UserName
        FROM 
            GamesInleveringen GI
        JOIN 
            Games G ON GI.GameID = G.GameID
        JOIN 
            Vak V ON G.VakID = V.VakID
        JOIN 
            Gebruikers U ON GI.GebruikersID = U.GebruikerID
        WHERE 
            V.VakID = ? AND V.TeacherID = ? AND GI.Status IS NULL
        """
        cursor.execute(query, (vakid, teacher_id))
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(
                status_code=404, detail="Geen nieuweinleveringen gevonden voor dit vak")

        inleveringen = [Inlevering(GameID=row[0], GebruikersID=row[1],
                                   OpdrachtInlevering=row[2], GameNaam=row[3], VakNaam=row[4], StudentEmail=row[5], UserName=row[6]) for row in rows]
        return inleveringen

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database fout: {e}")
    
# Email stuff
def send_simple_message(subject: str, email_to: str, body: str):
    return requests.post(
        f"https://api.eu.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={"from": f"Glitch Game <WP4@{MAILGUN_DOMAIN}>",
              "to": [email_to],
              "subject": subject,
              "html": body})


def read_html_file(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()


@router.post("/invite")
async def invite_students(request: Request, background_tasks: BackgroundTasks, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)

    data = await request.json()
    emails = data.get("email", "")
    email_list = [email.strip() for email in emails.split(",")]

    invalid_emails = [
        email for email in email_list if not EMAIL_REGEX.match(email)]
    if invalid_emails:
        raise HTTPException(
            status_code=400, detail=f"Invalid email addresses: {', '.join(invalid_emails)}")

    html_file_path = os.path.join(
        os.path.dirname(__file__), 'uitnodiging.html')
    html_body = read_html_file(html_file_path)

    for email in email_list:
        subject = "Uitnodiging Glitch!"
        background_tasks.add_task(
            send_simple_message, subject, email, html_body)

    return {"message": "Invitations sent successfully"}


@router.post("/approve/{game_id}/{gebruikersID}")
async def approve_submission(game_id: int, gebruikersID: int, request: Request, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)

    try:
        cursor.execute("UPDATE GamesInleveringen SET Status = 'Approved' WHERE GameID = ? AND GebruikersID = ?", (game_id, gebruikersID))
        conn.commit()
        return {"message": "Submission approved successfully"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.post("/reject/{game_id}/{gebruikersID}")
async def reject_submission(game_id: int, gebruikersID: int, request: Request, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)

    try:
        cursor.execute("UPDATE GamesInleveringen SET Status = 'Rejected' WHERE GameID = ? AND GebruikersID = ?", (game_id, gebruikersID))
        conn.commit()
        return {"message": "Submission rejected successfully"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")