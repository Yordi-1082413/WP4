from fastapi import APIRouter, Cookie, HTTPException, Body, Depends
from pydantic import BaseModel
from typing import Dict, Any
import sqlite3
from exponent_server_sdk import PushClient, PushMessage as ExpoPushMessage
from .authentication import check_user_type
from .error_handlers import NotLoggedInException


class PushMessage(BaseModel):
    body: str
    data: Dict[str, Any]

router = APIRouter()

conn = sqlite3.connect('./database/database.db', check_same_thread=False)
cursor = conn.cursor()

@router.post("/send-notification/{user_id}")
async def send_notification(user_id: int, push_message: PushMessage, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)
    
    cursor.execute("SELECT ExpoPushToken FROM Gebruikers WHERE GebruikerID = ?", (user_id,))
    user_token = cursor.fetchone()

    if not user_token or not user_token[0]:
        raise HTTPException(status_code=404, detail="No valid Expo push token found for user")

    # Create an ExpoPushMessage object to send via the Expo SDK
    expo_push_message = ExpoPushMessage(to=user_token[0], body=push_message.body, data=push_message.data)

    try:
        response = PushClient().publish(expo_push_message)
        return {"message": "Notification sent successfully", "details": response}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
