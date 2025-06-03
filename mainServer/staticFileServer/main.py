from pathlib import Path
from fastapi import FastAPI,HTTPException, status, Request, Response
import mysql.connector
from mysql.connector.errors import Error
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List
from bson import ObjectId
from bson.errors import InvalidId

class Item(BaseModel):
    name: str = Field(...)
    description: Optional[str]
    price: float

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["order"]
collection = database["order_database"]

db = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "BookStore"
}

class Book(BaseModel):
    id: str
    title: str
    price: float
    cover: Optional[str] = None
    quantity: Optional[int] = 1

class Order(BaseModel):
    user_id: int  
    price: float        
    books: List[Book]

class UserData(BaseModel):
    id_u: int
    item_type: str
    sum: int
    item_id: str
    item_url: str

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

app = FastAPI()


@app.middleware("http")
async def block_socket_io(request: Request, call_next):
    if request.url.path.startswith("/socket.io"):
        return Response(status_code=403, content="Forbidden")
    return await call_next(request)

BASE_DIR = Path(__file__).parent.resolve() 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/order")
async def create_order(order: Order):
    order_dict = order.dict()
    print(order)
    result = await collection.insert_one(order_dict)
    return {"order_id": str(result.inserted_id)}

AVATARS_DIR = BASE_DIR / "static" / "avatars"
@app.get("/avatars")
async def get_all_avatars():
    print("Current working directory:", os.getcwd())
    print("Avatars dir exists?", AVATARS_DIR.exists())
    print("Avatars dir absolute path:", AVATARS_DIR.resolve())

    if not AVATARS_DIR.exists():
        return {"files": []}

    files = [
        f"http://localhost:8001/static/avatars/{file.name}"
        for file in AVATARS_DIR.iterdir()
        if file.is_file()
    ]
    return {"files": files}

BANNERS_DIR = Path("static/banners")
@app.get("/banners")
async def get_all_banners():
    if not BANNERS_DIR.exists():
        return {"files": []}

    files = [
        f"http://localhost:8001/static/banners/{file.name}"
        for file in BANNERS_DIR.iterdir()
        if file.is_file()
    ]
    return {"files": files}

BORDERS_DIR = Path("static/borders")
@app.get("/borders")
async def get_all_borders():
    if not BORDERS_DIR.exists():
        return {"files": []}

    files = [
        f"http://localhost:8001/static/borders/{file.name}"
        for file in BORDERS_DIR.iterdir()
        if file.is_file()
    ]
    return {"files": files}

@app.post("/item", tags=["Item"])
async def buy_item(data: UserData):
    try:
        db = connection_to_database()
        cursor = db.cursor()

        sql = "INSERT INTO user_decoration(user_id_fk, type, item_url) VALUES (%s, %s, %s)"
        cursor.execute(sql, (data.id_u, data.item_type, data.item_url))

        sql2 = "INSERT INTO decoration_purchase_history(user_id_fk, item_id, sum) VALUES (%s, %s, %s)"
        cursor.execute(sql2, (data.id_u, data.item_id, data.sum))

        sql3 = "UPDATE profiles SET money = money - %s WHERE user_id_fk = %s"
        cursor.execute(sql3, (data.sum, data.id_u))

        db.commit()
        return {"message": "Purchase successful"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error: {str(e)}")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)