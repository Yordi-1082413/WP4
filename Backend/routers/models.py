from pydantic import BaseModel
from typing import Dict, Any
class SignupData(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenUpdate(BaseModel):
    expoPushToken: str

class SubmitAssignmentInfo(BaseModel):
    SubjectId: int

class StudentUpdate(BaseModel):
    id: int
    name: str
    studentClass: str
class Inlevering(BaseModel):
    GameID: int
    GebruikersID: int
    OpdrachtInlevering: str
    GameNaam: str
    VakNaam: str
    StudentEmail: str
    UserName: str

class PushMessage(BaseModel):
    body: str
    data: Dict[str, Any]

class SubmitDeleteRequest(BaseModel):
    SubjectId: int