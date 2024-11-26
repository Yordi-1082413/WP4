from fastapi import FastAPI, status, HTTPException, Response, APIRouter, Query, Cookie, Request
import secrets
import sqlite3
from pydantic import BaseModel
from datetime import datetime, timedelta
import bcrypt
from .error_handlers import NotLoggedInException
from .authentication import get_user_id_from_session, rows_to_dict

router = APIRouter()
conn = sqlite3.connect('./database/database.db')
cursor = conn.cursor()


class DomainRequest(BaseModel):
    DomainId: int

@router.get("/getsubjects")
async def getsubjects(session_id: str = Cookie(None),DomainId: str = Query(...)): #DomainId ophalen en gebruiken in deze functie
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    cursor.execute("SELECT distinct Vak.VakID, Naam, Beschrijving FROM DomainVak INNER JOIN Vak ON DomainVak.VakID = Vak.VakID WHERE Vak.DomainID = ?", (DomainId,))
    subjects = cursor.fetchall()
    return subjects

@router.get("/getinstanties")
async def getinstanties(session_id: str = Cookie(None)):
    cursor.execute("SELECT * FROM Instanties")
    instanties = cursor.fetchall()
    return instanties
#@router.get("/userinfo")
#async def exampleadmin(session_id: str = Cookie(None)):
   # if session_id is None:
       # raise NotLoggedInException()
    #user_id = get_user_id_from_session(session_id)

   # return user_id
