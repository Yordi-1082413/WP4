from fastapi import FastAPI, status, HTTPException, Response, APIRouter, Query, Cookie
import secrets
import sqlite3
from datetime import datetime, timedelta
import bcrypt
from fastapi.responses import RedirectResponse

#models import
from .error_handlers import NotLoggedInException
from .models import SignupData, UserLogin


router = APIRouter()
conn = sqlite3.connect('./database/database.db' , check_same_thread=False)
cursor = conn.cursor()

# Cookie configuration settings
cookie_config = {
    "samesite": 'none',  # Options: 'strict', 'lax', 'none'
    "secure": False,     # Set to True if using HTTPS
    "httponly": True     # Prevent client-side access to cookie
}   



@router.get('/')
def read_sub():
    return {'message': 'Hello World from auth API'}

# Functions

def rows_to_dict(rows, columns):
    return [dict(zip(columns, row)) for row in rows]


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')


def check_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def check_user_type(session_id: str, required_user_type: int) -> bool:
    # Get the user ID from the session
    user_id = get_user_id_from_session(session_id)
    if user_id is None:
        raise NotLoggedInException()

    # Query the Gebruikers table to get the user type
    cursor.execute(
        "SELECT UserType FROM Gebruikers WHERE GebruikerID = ?", (user_id,))
    user_type = cursor.fetchone()

    # Check if the user type matches the required user type
    if user_type and user_type[0] == required_user_type:
        return True
    else:
        raise HTTPException(
            status_code=403, detail="User does not have the required user permissions")


def get_user_id_from_session(session_id: str) -> int:
    # Calculate the date 2 days ago from the current date
    two_days_ago = datetime.now() - timedelta(days=2)

    # Query to select the session based on the session_id and CreationDate
    cursor.execute("SELECT GebruikerID FROM Sessions WHERE SessionID = ? AND CreationDate >= ?",
                   (session_id, two_days_ago.strftime('%Y-%m-%d %H:%M:%S')))
    session = cursor.fetchone()

    # If a session is found, return the user's ID; otherwise, return exception not logged in
    if session:
        return session[0]
    else:
        raise NotLoggedInException()

# Routes

@router.post("/login")
async def login(user_login: UserLogin, response: Response):

    cursor.execute(
        "SELECT GebruikerID, WachtwoordHash FROM gebruikers WHERE email = ?", (user_login.email,))
    user = cursor.fetchone()

    if user is None or not check_password(user_login.password, user[1]):
        raise HTTPException(
            status_code=401, detail="Invalid email or password")
    else:
        session_id = secrets.token_hex(16)

        # Set the session_id cookie
        cursor.execute(
            "INSERT INTO Sessions (SessionID, GebruikerID, CreationDate) VALUES (?, ?, CURRENT_TIMESTAMP)", (session_id, user[0]))
        conn.commit()
        response.set_cookie(
            key="session_id",
            value=session_id,
            samesite=cookie_config['samesite'],
            secure=cookie_config['secure'],
            httponly=cookie_config['httponly']
        )

        if user[2] == 2:
            return RedirectResponse(url="/beheerder")

        return {"message": "Logged in successfully", "success": True}


@router.post("/signup")
async def signup(signup_data: SignupData, response: Response):
    hashed_password = hash_password(signup_data.password)

    # Check if the email already exists
    cursor.execute("SELECT Email FROM Gebruikers WHERE Email = ?",
                   (signup_data.email,))
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    # Insert the new user into the Gebruikers table
    cursor.execute("INSERT INTO Gebruikers (GebruikersNaam, Email, WachtwoordHash, RegistratieDatum) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
                   (signup_data.name, signup_data.email, hashed_password))
    conn.commit()

    # Get the ID of the newly inserted user
    cursor.execute("SELECT last_insert_rowid()")
    user_id = cursor.fetchone()[0]

    # Generate a session ID
    session_id = secrets.token_hex(16)

    # Insert the session into the Sessions table
    cursor.execute(
        "INSERT INTO Sessions (SessionID, GebruikerID, CreationDate) VALUES (?, ?, CURRENT_TIMESTAMP)", (session_id, user_id))
    conn.commit()

    # Set the session_id cookie
    response.set_cookie(
            key="session_id",
            value=session_id,
            samesite=cookie_config['samesite'],
            secure=cookie_config['secure'],
            httponly=cookie_config['httponly']
    )


    # Return a simple "OK" response
    return Response(content="OK", media_type="text/plain")

@router.post("/logout")
async def logout(response: Response, session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()

    # Delete the session from the Sessions table
    cursor.execute("DELETE FROM Sessions WHERE SessionID = ?", (session_id,))
    conn.commit()

    # Clear the session_id cookie
    response.delete_cookie(key="session_id")

    return {"message": "Logged out successfully"}

# Example of checking for user permissions
@router.get("/exampleadmin")
async def exampleadmin(session_id: str = Cookie(None)):
    if session_id is None:
        raise HTTPException(status_code=401, detail="User is not logged in")

    # Checks if the user has an usertype of 1
    check_user_type(session_id, 1)
    return {"message": "Welcome to the admin dashboard"}

@router.get("/check-session")
async def check_session(session_id: str = Cookie(None)):
    user_id = get_user_id_from_session(session_id)
    if user_id:
        return {"redirect": "/profile", "message": "Session is valid."}
    else:
        return {"Please log in"} 
