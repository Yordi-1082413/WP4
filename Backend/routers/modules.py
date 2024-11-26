from fastapi import APIRouter, Depends, Cookie, HTTPException, Query, UploadFile, File, Body
from fastapi.responses import JSONResponse, FileResponse
from .authentication import get_user_id_from_session, rows_to_dict, hash_password, check_password
import sqlite3
import os
import secrets
from .models import TokenUpdate
from .error_handlers import NotLoggedInException

router = APIRouter()

conn = sqlite3.connect('./database/database.db')
cursor = conn.cursor()

@router.get("/getmodules")
async def getmodules(session_id: str = Cookie(None), VakId: str = Query(...)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    user_id = get_user_id_from_session(session_id)
    cursor.execute("SELECT Modules.ModuleId, Modules.Naam, Modules.Beschrijving, SubmittedAssignments.Status, SubmittedAssignments.fileURL, SubmittedAssignments.UserID FROM ModuleInstantieVak INNER JOIN Modules ON ModuleInstantieVak.ModuleId = Modules.ModuleId LEFT JOIN SubmittedAssignments ON ModuleInstantieVak.ModuleId = SubmittedAssignments.ModuleID AND SubmittedAssignments.UserID = ? WHERE ModuleInstantieVak.VakId = ?", (user_id, VakId,) )
    modules = cursor.fetchall()
    return modules


@router.get("/getmodule")
async def getmodules(session_id: str = Cookie(None), SubjectId: str = Query(...)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    user_id = get_user_id_from_session(session_id)
    cursor.execute("SELECT Modules.ModuleId, Modules.Naam, Modules.Beschrijving, SubmittedAssignments.Status, SubmittedAssignments.fileURL, SubmittedAssignments.UserID FROM ModuleInstantieVak INNER JOIN Modules ON ModuleInstantieVak.ModuleId = Modules.ModuleId LEFT JOIN SubmittedAssignments ON ModuleInstantieVak.ModuleId = SubmittedAssignments.ModuleID WHERE SubmittedAssignments.UserID = ? AND ModuleInstantieVak.ModuleId = ?", (user_id, SubjectId,) )
    module = cursor.fetchall()
    return module


