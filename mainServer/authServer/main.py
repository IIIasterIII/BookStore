from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv
from passlib.hash import bcrypt
import os
import jwt
import mysql.connector
from mysql.connector.errors import Error
from uuid import uuid4
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class User(BaseModel):
    username: str
    email: str
    password: str
    repeat_password: str

class TokenLoginData(BaseModel):
    loginData: str
    password: str

reset_tokens = {}

class UserPublic(BaseModel):
    user_id: int
    username: str
    email: str
    money: int
    avatar_url: Optional[str]
    banner_url: Optional[str]
    border_url: Optional[str]

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

db = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "BookStore"
}

description = """
API for user authentication and profile management — love by Aster.  
This service allows user registration, login, and profile retrieval.
"""

app = FastAPI( title="Auth&Profile API", description=description, version="1.0.1" )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12, deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("SECRET_KEY", os.getenv("MY_SECRET_KEY", "default_secret"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1020

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

def hash_user_password(password: str) -> str:
    return hash_password(password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str = Depends(oauth2_scheme)) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def generate_reset_token(email: str):
    token = str(uuid4())
    reset_tokens[token] = {
        "email": email,
        "expires": datetime.utcnow() + timedelta(hours=1)
    }
    return token

def send_reset_email(to_email: str, reset_link: str):
    sender_email = "pavl.miziuk095@gmail.com"
    sender_password = "rido iaqu qmvn jqaf"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your password"
    msg["From"] = sender_email
    msg["To"] = to_email

    text = f"Click the link to reset your password: {reset_link}"

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Reset your password</h2>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset your password. Click the button below to reset it:
          </p>
          <a href="{reset_link}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #888; margin-top: 20px;">
            If you didn’t request this, just ignore this email.
          </p>
        </div>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    msg.attach(part1)
    msg.attach(part2)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())


def validate_reset_token(token: str):
    data = reset_tokens.get(token)
    if not data or data["expires"] < datetime.utcnow():
        return None
    return data["email"]

@app.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    print(data)
    db = connection_to_database()
    cursor = db.cursor()
    sql = "select u.* from users as u where u.email = %s"
    cursor.execute(sql, (data.email,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    token = str(uuid4())
    reset_tokens[token] = {
        "email": data.email,
        "expires": datetime.utcnow() + timedelta(minutes=5)
    }
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    send_reset_email(data.email, reset_link)
    return {"message": "Reset link sent to your email"}


@app.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    db = connection_to_database()
    cursor = db.cursor()
    token_data = reset_tokens.get(req.token)
    if not token_data or token_data["expires"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    email = token_data["email"]
    hashed_password = hash_password(req.new_password)

    sql1 = "update users set hash_password = %s where email = %s"
    cursor.execute(sql1, (hashed_password,email,))

    del reset_tokens[req.token]

    return {"message": "Password updated"}

@app.post("/register", tags=["Auth"], summary="Register a new user", description="Create a new user with unique username and email")
async def register(data: User):
    db = None
    cursor = None
    try:
        if data.password != data.repeat_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        
        db = connection_to_database()
        cursor = db.cursor()

        cursor.execute("SELECT user_id FROM users WHERE username=%s OR email=%s", (data.username, data.email))
        result = cursor.fetchone()
        if result:
            raise HTTPException(status_code=400, detail="Username or Email already exists")

        sql = "insert into users(username, email, hash_password) values(%s, %s, %s)"
        hashed_password = hash_password(data.password)
        cursor.execute(sql, (data.username, data.email, hashed_password)) 
        db.commit()
        
        user_new_id = cursor.lastrowid
        sql = "insert into profiles(user_id_fk) values(%s)"
        cursor.execute(sql, (user_new_id,))
        db.commit()
        
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) 
    finally: 
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


@app.post("/token", tags=["Auth"], summary="Login and get token", description="Login with username/email and password to get JWT token")
async def token(data: TokenLoginData):
    try:
        db = connection_to_database()
        cursor = db.cursor()
        sql = "select hash_password from users where username = %s or email = %s"
        cursor.execute(sql, (data.loginData, data.loginData))
        user_password = cursor.fetchone()

        if not user_password or not verify_password(data.password, user_password[0]):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials")
        
        access_token = create_access_token({"sub": data.loginData})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Something was wrong!")
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@app.get("/protected", tags=["User"], summary="Get current user profile", description="Get public profile data of the authenticated user", response_model=UserPublic)
async def protected_route(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token missing in Authorization header")

    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    username = payload.get('sub')
    if not username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username not found in token")

    db = connection_to_database()
    cursor = db.cursor()

    sql = """
        SELECT user_id, username, email, money, avatar_url, banner_url, border_url
        FROM users as u
        INNER JOIN profiles as p ON u.user_id = p.user_id_fk 
        WHERE username = %s
    """
    cursor.execute(sql, (username,))
    user = cursor.fetchone()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserPublic(
        user_id=user[0],
        username=user[1],
        email=user[2],
        money=user[3],
        avatar_url=user[4],
        banner_url=user[5],
        border_url=user[6]
    )