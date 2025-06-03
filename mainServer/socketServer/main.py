from fastapi import FastAPI, WebSocket, HTTPException, status, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import Error
from typing import Dict, List, Tuple
import mysql
import json
import mysql.connector
from pydantic import BaseModel, ValidationError

app = FastAPI()
groups: Dict[str, List[WebSocket]] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

class Message(BaseModel):
    user_id: int
    group_id: str
    text: str

db = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "BookStore"
}

def connection_to_database():
    connection = None
    try:
        connection = mysql.connector.connect(**db)
        if connection.is_connected():
            return connection
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed database connection")
    except Error as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database connection error: {e}")
    
def insert_message(group_id: str, user_id: int, text: str) -> Tuple[int, str]:
    try:
        db = connection_to_database()
        cursor = db.cursor()
        
        sql = "INSERT INTO comments(user_id_fk, text, group_id) VALUES (%s, %s, %s)"
        cursor.execute(sql, (user_id, text, group_id))
        db.commit()
        id_c = cursor.lastrowid

        cursor.execute("SELECT date FROM comments WHERE id_c = %s", (id_c,))
        result = cursor.fetchone()
        if result:
            date = result[0]
            return id_c, date
        else:
            raise HTTPException(status_code=404, detail="Date not found")

    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message error!")
    
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


def get_user_data(user_id: int):
    try:
        db = connection_to_database()
        cursor = db.cursor(dictionary=True)

        sql = """
        select u.username, p.banner_url, p.border_url, p.avatar_url from users as u
        INNER JOIN profiles as p on p.user_id_fk = u.user_id
        where u.user_id = %s
        group by u.username, p.banner_url, p.avatar_url
        """

        cursor.execute(sql, (user_id,))
        data = cursor.fetchone()
        return data
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message error!")
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@app.websocket("/ws/{group_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, group_id: str, player_id: str):
    await websocket.accept()

    if group_id not in groups:
        groups[group_id] = []
    groups[group_id].append(websocket)

    print(f"User {player_id} joined group {group_id}")

    try:
        while True:
            raw_data = await websocket.receive_text()
            print(f"Received from {player_id}: {raw_data}")
            id_c = None
            data = None
            date = None

            try:
                message = Message.parse_raw(raw_data) 
                (id_c, date) = insert_message(message.group_id, message.user_id, message.text)
                data = get_user_data(message.user_id)
            except ValidationError as e:
                await websocket.send_text(json.dumps({"error": "Invalid message", "details": e.errors()}))
                continue

            group_id = message.group_id

            enriched_message = {
                "id_c": id_c,
                "user_id": message.user_id,
                "text": message.text,
                "group_id": message.group_id,
                "user_data": data,
                "date": date.isoformat() if date else None
            }

            for conn in groups[group_id]:
                await conn.send_text(json.dumps(enriched_message))

    except WebSocketDisconnect:
        groups[group_id].remove(websocket)
        print(f"User {player_id} disconnected from group {group_id}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)