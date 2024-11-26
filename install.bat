@echo off

REM Step 1: Remove the virtual environment if it exists
IF EXIST "backend\venv" (
    attrib -r /s /d backend\venv\*.*
    RMDIR /S /Q backend\venv
)

REM Step 2: Create the virtual environment
python -m venv backend\venv

REM Step 3: Activate the virtual environment
CALL backend\venv\Scripts\activate.bat

REM Step 4: Install requirements
pip install -r backend\requirements.txt

REM Step 5: Remove the node_modules directory if it exists
cd app
IF EXIST "node_modules" (
    REM Remove the node_modules directory
    RMDIR /S /Q node_modules
)

REM Step 6: Run npm install
npm install
