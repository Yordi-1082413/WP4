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

@router.get("/userinfo")
async def exampleadmin(session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    user_id = get_user_id_from_session(session_id)

    cursor.execute(
        "SELECT GebruikersNaam, Email, avatarUrl ,UserType FROM Gebruikers WHERE GebruikerID = ?", (user_id,))
    rows = cursor.fetchall()

    columns = [column[0] for column in cursor.description]
    userinfo = rows_to_dict(rows, columns)

    return {"userinfo": userinfo}

@router.get("/getmodules")
async def getmodules(session_id: str = Cookie(None)):
    if session_id is None:
        return 'piepo'
    user_id = get_user_id_from_session(session_id)
    cursor.execute("SELECT Modules.ModuleId, Modules.Naam, Modules.Beschrijving, SubmittedAssignments.Status, SubmittedAssignments.fileURL, SubmittedAssignments.UserID FROM ModuleInstantieVak INNER JOIN Modules ON ModuleInstantieVak.ModuleId = Modules.ModuleId LEFT JOIN SubmittedAssignments ON ModuleInstantieVak.ModuleId = SubmittedAssignments.ModuleID AND SubmittedAssignments.UserID = ? WHERE ModuleInstantieVak.VakId = ?", (user_id , 3,) )
    modules = cursor.fetchall()
    return modules


@router.post("/upload-avatar/")
async def upload_image(session_id: str = Cookie(None), file: UploadFile = File(...)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")
    user_id = get_user_id_from_session(session_id)

    # Fetch the current avatar URL from the database
    cursor.execute("SELECT avatarUrl FROM Gebruikers WHERE GebruikerID = ?", (user_id,))
    avatarUrl = cursor.fetchone()
    if avatarUrl and avatarUrl[0]:
        old_file_location = f"./useruploads/profilepictures/{avatarUrl[0]}"
        # Check if the file exists and delete it
        if os.path.exists(old_file_location):
            os.remove(old_file_location)

    # Validate file extension
    valid_extensions = ["webp", "png", "jpg"]
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in valid_extensions:
        raise HTTPException(status_code=415, detail="Unsupported file type")

    # Generate a random filename using secrets.token_hex
    random_filename = secrets.token_hex(8) + '.' + file_extension
    file_location = f"./useruploads/profilepictures/{random_filename}"

    # Save the new image
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())

    # Update the database with the new avatar URL
    cursor.execute("UPDATE Gebruikers SET avatarUrl = ? WHERE GebruikerID = ?", (random_filename, user_id))
    conn.commit()

    return {"filename": random_filename}

@router.get("/images/{image_name}")
async def get_image(image_name: str):
    return FileResponse(f"./useruploads/profilepictures/{image_name}")


@router.put("/update-username")
async def update_username(session_id: str = Cookie(None), new_username: str = Body(...)):
    if session_id is None:
        raise NotLoggedInException()
    user_id = get_user_id_from_session(session_id)

    cursor.execute("UPDATE Gebruikers SET GebruikersNaam = ? WHERE GebruikerID = ?", (new_username, user_id))
    conn.commit()

    return {"message": "Username updated successfully"}

@router.put("/update-password")
async def update_password(session_id: str = Cookie(None), current_password: str = Body(...), new_password: str = Body(...)):
    if session_id is None:
        raise NotLoggedInException()
    user_id = get_user_id_from_session(session_id)

    # Fetch the current hashed password from the database
    cursor.execute("SELECT WachtwoordHash FROM Gebruikers WHERE GebruikerID = ?", (user_id,))
    current_hashed_password = cursor.fetchone()[0]

    if not check_password(current_password, current_hashed_password):
        raise HTTPException(status_code=401, detail="Invalid current password")

    new_hashed_password = hash_password(new_password)

    # Update the password in the database
    cursor.execute("UPDATE Gebruikers SET WachtwoordHash = ? WHERE GebruikerID = ?", (new_hashed_password, user_id))
    conn.commit()

    return {"message": "Password updated successfully"}

@router.post("/update-push-token")
async def update_push_token(token_data: TokenUpdate, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()

    user_id = get_user_id_from_session(session_id)
    if user_id is None:
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute("UPDATE Gebruikers SET ExpoPushToken = ? WHERE GebruikerID = ?", (token_data.expoPushToken, user_id))
    conn.commit()

    return {"message": "Expo push token updated successfully"}