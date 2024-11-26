from fastapi import Request
from fastapi.responses import JSONResponse

class NotLoggedInException(Exception):
    pass

async def notloggedin_handler(request: Request, exc: NotLoggedInException):
    return JSONResponse(
        status_code=403,
        content={"message": "Oops! User not logged in."}
    )
