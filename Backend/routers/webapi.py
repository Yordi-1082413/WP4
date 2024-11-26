from fastapi import APIRouter, Depends, Cookie, HTTPException
from .authentication import check_user_type
from .error_handlers import NotLoggedInException
router = APIRouter()

@router.get('/web')
def read_sub():
    return {'message': 'Hello World from web API'}

@router.get("/exampleadmin")
async def exampleadmin(session_id: str = Cookie(None)):
    if session_id is None:
        raise NotLoggedInException()
    check_user_type(session_id, 1)
    
    return {"message": "Welcome to the admin dashboard"}

