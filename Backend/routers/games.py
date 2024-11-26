from fastapi import APIRouter, HTTPException
import json

router = APIRouter()

@router.get("/quiz/{game_id}")
def get_quiz_data(game_id: str):
    try:
        with open('games/quiz.json', 'r') as file:
            quizzes = json.load(file)
        
        if game_id in quizzes['games']:
            return quizzes['games'][game_id]
        else:
            raise HTTPException(status_code=404, detail="Quiz not found for given game ID")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Quiz file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding the JSON data")
