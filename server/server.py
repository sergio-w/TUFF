import asyncio
from websockets.server import serve
import websockets
import json
import mysql.connector
import hashlib
import uuid
import os
import base64
import sqlite3

# Database connection
"""
conn = mysql.connector.connect(
    host="38.22.104.155",
    port=1059,
    user="root",
    password="JustStudy2025!",
    database="PencilPost"
)
"""
conn = sqlite3.connect("server/database.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS Accounts (
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT NOT NULL
)
""")


def generate_token():
    token = os.urandom(128)
    b64_token = base64.b64encode(token)
    return b64_token.decode("utf-8")

def setup_token(username):
    new_token = generate_token()
    query = "UPDATE Accounts SET token = ? WHERE username = ?"
    cursor.execute(query, (new_token, username))
    conn.commit()
    return new_token

async def send_message(websocket, message):
    try:
        if isinstance(message, dict):
            message = json.dumps(message)
        await websocket.send(message)
    except Exception as e:
        print(f"Error sending message: {e}")
async def CreateAccount(username, password, websocket):
    try:
        query = "SELECT username FROM Accounts WHERE username = ?"
        cursor.execute(query, (username,))
        dupe = cursor.fetchone()

        if dupe:
            response = {
                "type": "CreateAccount",
                "status": "error",
                "message": "Account already exists."
            }
        else:
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            query = "INSERT INTO Accounts (username, password, token) VALUES (?, ?, ?)"
            cursor.execute(query, (username, hashed_password, ""))
            conn.commit()
            response = {
                "type": "CreateAccount",
                "status": "success",
                "message": "Account created successfully."
            }

        # Send response
        await send_message(websocket, response)
    except Exception as e:
        response = {
            "type": "CreateAccount",
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }
        await send_message(websocket, response)


async def Login(account, password, userid, websocket):
    try:
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        query = "SELECT password, token FROM Accounts WHERE username = ?"
        cursor.execute(query, (account,))
        result = cursor.fetchone()

        if result:
            got_password, token = result
            if hashed_password == got_password:
                token = setup_token(account)
                print("Logged in successfully.")
                response = {
                    "type": "Login",
                    "status": "success",
                    "message": "Logging in!",
                    "userID": userid,
                    "token": token
                }

            else:
                response = {
                    "type": "Login",
                    "status": "error",
                    "message": "Incorrect password."
                }
        else:
            response = {
                "type": "Login",
                "status": "error",
                "message": "Account not found."
            }
        await send_message(websocket, response)
    except Exception as e:
        response = {
            "type": "Login",
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }
        await send_message(websocket, response)
        
async def handle_client(websocket, path):
    print(f"Client connected: {websocket.remote_address}")
    try:
        async for message in websocket:
            try:
                formated_message = json.loads(message)
                message_type = formated_message.get("type")
                data = formated_message.get("data", {})

                if message_type == "create_account":
                    await CreateAccount(data["username"], data["password"], websocket)
                elif message_type == "login":
                    await Login(data["username"], data["password"], data.get("myuuid"), websocket)
                else:
                    response = {"status": "error", "message": "Unknown message type"}
                    await send_message(websocket, response)
            except Exception as e:
                error_message = {"status": "error", "message": f"Failed to process message: {str(e)}"}
                await send_message(websocket, error_message)
    except websockets.ConnectionClosed as e:
        print(f"Client disconnected: {e}")


PORT = 9001
async def main():
    async with serve(handle_client, "localhost", PORT):
        print(f"WebSocket server running on ws://localhost:{PORT}")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
"""
if not token:
    pass
else:
    return
    response = {
        "type": "Login",
        "status": "error",
        "message": "Account already logged in on a different device"
    }
"""