from fastapi import FastAPI, File, Form, UploadFile, status, HTTPException, Response, APIRouter, Query, Cookie
import secrets
import sqlite3
from pydantic import BaseModel
from datetime import datetime, timedelta
import bcrypt
import os
import shutil

from .models import SubmitDeleteRequest  
from .authentication import get_user_id_from_session, rows_to_dict

router = APIRouter()
conn = sqlite3.connect('./database/database.db')
cursor = conn.cursor()


@router.post("/submit/")
async def submit(session_id: str = Cookie(None), file: UploadFile = File(...), subjectid: int = Form(...)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    user_id = get_user_id_from_session(session_id)
    cursor.execute("SELECT * FROM SubmittedAssignments WHERE UserID = ? AND ModuleID = ?", (user_id, subjectid))
    assignment = cursor.fetchone()
    if assignment:
         cursor.execute("DELETE FROM SubmittedAssignments WHERE UserID = ? AND ModuleID = ?", (user_id, subjectid))
    cursor.execute("INSERT INTO SubmittedAssignments (ModuleID, UserID, Status, fileURL) VALUES (?, ?, ?, ?)", (subjectid, user_id, "Ingeleverd", file.filename))
    conn.commit()
    return "Added succesfull"

@router.post("/deletesubmit/")
async def deletesubmit(session_id: str = Cookie(None), subjectid: int = Form(...)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    user_id = get_user_id_from_session(session_id)
    cursor.execute("SELECT * FROM SubmittedAssignments WHERE UserID = ? AND ModuleID = ?", (user_id, subjectid))
    assignment = cursor.fetchone()
    if assignment:
         cursor.execute("DELETE FROM SubmittedAssignments WHERE UserID = ? AND ModuleID = ?", (user_id, subjectid))
   # cursor.execute("DELETE SubmittedAssignments WHERE userID = ? AND ModuleID = ?", (user_id, student_id))
    conn.commit() 
    #conn.commit()
    return "deleted succesfull"




# Roan's attempt at a submit (works in /docs)
@router.post("/submitassignment/submit/")
async def submit_assignment(subjectid: str, session_id: str = Cookie(None), file: UploadFile = File(...)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    
    # Validate file extension
    valid_extensions = ["docx", "pdf"]
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in valid_extensions:
        raise HTTPException(status_code=415, detail="Unsupported file type")

    # Ensure unique filename by appending a counter if the file already exists
    file_location = f"./useruploads/userupload/{file.filename}"
    counter = 1
    while os.path.exists(file_location):
        file_location = f"./useruploads/userupload/{file.filename.split('.')[0]}_{counter}.{file_extension}"
        counter += 1

    # Save the new file
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return {"filename": file.filename}