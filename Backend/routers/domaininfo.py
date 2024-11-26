from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Union
import sqlite3

router = APIRouter()

#ophalen totaal
def get_domain_data() -> List[Dict[str, Union[int, str]]]:
    conn = sqlite3.connect('./database/database.db', check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DomainID, Naam, Beschrijving FROM Domain")
        rows = cursor.fetchall()
        print("Aantal domeinen gevonden:", len(rows))
        if not rows:
            raise HTTPException(status_code=404, detail="Geen domeinen gevonden")
        columns = [column[0] for column in cursor.description]
        domains = [{columns[i]: row[i] for i in range(len(columns))} for row in rows]
        return domains
    finally:
        conn.close()

#ophalen op id
def get_domain_by_id(domain_id: int) -> Dict[str, Union[int, str]]:
    conn = sqlite3.connect('./database/database.db', check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DomainID, Naam, Beschrijving FROM Domain WHERE DomainID = ?", (domain_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Domein niet gevonden")
        columns = [column[0] for column in cursor.description]
        domain = {columns[i]: row[i] for i in range(len(columns))}
        return domain
    finally:
        conn.close()


#updaten van
def update_domain(domain_id: int, data: Dict[str, Union[int, str]]) -> Dict[str, Union[int, str]]:
    conn = sqlite3.connect('./database/database.db', check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE Domain SET Naam = ?, Beschrijving = ? WHERE DomainID = ?",
            (data["naam"], data["omschrijving"], domain_id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Domein niet gevonden")
        
        updated_domain = {
            "DomainID": domain_id,
            "Naam": data["naam"],
            "Beschrijving": data["omschrijving"]
        }
        return updated_domain
    finally:
        conn.close()

#aanmaken van
def add_new_domain(data: Dict[str, Union[int, str]]) -> Dict[str, Union[int, str]]:
    conn = sqlite3.connect('./database/database.db', check_same_thread=False)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Domain (Naam, Beschrijving) VALUES (?, ?)",
            (data["naam"], data["beschrijving"])
        )
        conn.commit()
        
        domain_id = cursor.lastrowid
        new_domain = {
            "DomainID": domain_id,
            "Naam": data["naam"],
            "Beschrijving": data["beschrijving"]
        }
        return new_domain
    finally:
        conn.close()

#routers voor de domainen:

@router.get("/domaininfo")
async def get_domain_info():
    domains = get_domain_data()
    return domains

@router.post("/domaininfo")
async def add_new_domain_info(data: Dict[str, Union[int, str]] = Body(...)):
    new_domain = add_new_domain(data)
    return new_domain

@router.get("/domaininfo/{domain_id}")
async def get_domain_info_by_id(domain_id: int):
    domain = get_domain_by_id(domain_id)
    return domain

@router.put("/domaininfo/{domain_id}")
async def update_domain_info(domain_id: int, data: Dict[str, Union[int, str]] = Body(...)):
    updated_domain = update_domain(domain_id, data)
    return updated_domain
