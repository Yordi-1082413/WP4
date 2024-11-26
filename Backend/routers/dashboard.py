from fastapi import FastAPI, status, HTTPException, Response, APIRouter, Query, Cookie
import secrets
import sqlite3
from pydantic import BaseModel
from datetime import datetime, timedelta
import bcrypt

router = APIRouter()
conn = sqlite3.connect('./database/database.db')
cursor = conn.cursor()

@router.get("/getdashboard")
async def getdashboard():
    cursor.execute("SELECT * from Domain")
    domain = cursor.fetchall()
    return domain


