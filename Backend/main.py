from fastapi import FastAPI, Request
from routers import beheerderdash
from routers import docentinfo, domaininfo
from routers import webapi, authentication, profile, pushnotifications, subjects, docent, dashboard, modules, submitassignment, games
from fastapi.middleware.cors import CORSMiddleware
from routers.error_handlers import NotLoggedInException, notloggedin_handler

app = FastAPI()

# Corrected origins list with proper formatting and commas
origins = [
    "http://localhost:3000",
    "http://localhost:19000",
    "http://localhost:19006",
    "http://localhost:8081",
    "http://localhost:8080",
    "http://localhost",
    "http://145.24.238.28",
    "http://192.168.2.144:8081",
    "http://192.168.2.144:59252",
    "http://192.168.2.74:8000",
    "http://192.168.2.74:8081",
    "http://127.0.0.1:56873",
    "http://192.168.2.54",
    "http://192.168.2.54:8000",
    "http://192.168.2.14",
    "http://192.168.2.14:8000",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8000",
    "http://127.0.0.1",
]

# Adding CORS middleware with the corrected origins list
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adding exception handler
app.add_exception_handler(NotLoggedInException, notloggedin_handler)

# Defining the root endpoint
@app.get('/')
def read_main():
    return {'API': 'Use /api/{Route} for calls'}

# Including routers with their respective prefixes
app.include_router(pushnotifications.router, prefix="/api")
app.include_router(authentication.router, prefix="/auth")
app.include_router(subjects.router, prefix="/subjects")
app.include_router(webapi.router, prefix="/api")
app.include_router(beheerderdash.router, prefix="/api")
app.include_router(docentinfo.router, prefix="/api/teacherinfo")
app.include_router(domaininfo.router, prefix="/api")
app.include_router(profile.router, prefix="/api/profile")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(modules.router, prefix="/modules")
app.include_router(submitassignment.router, prefix="/submitassignment")
app.include_router(games.router, prefix="/api")
app.include_router(docent.router, prefix="/api/docent")
app.include_router(beheerderdash.router, prefix="/api/beheerder")
