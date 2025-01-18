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
import arrow
"""
conn = mysql.connector.connect(
    host="38.22.104.155",
    port=1059,
    user="root",
    password="JustStudy2025!",
    database="PencilPost"
)
"""
currentusers = {}
conn = sqlite3.connect("server/database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS Accounts (
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT NOT NULL,
    icon TEXT NOT NULL,
    groups TEXT NOT NULL
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS Groups (
    groupid TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS Messages (
    groupid TEXT NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (groupid) REFERENCES Groups(groupid)
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS OnlineUsers (
    username TEXT PRIMARY KEY,
    status TEXT NOT NULL, 
    last_seen TEXT NOT NULL,
    websocket TEXT NOT NULL
)
""")

async def mark_user_online(username,websocket):
    try:
        now = arrow.utcnow().isoformat()
        print(now) 
        cursor.execute("""
            INSERT INTO OnlineUsers (username, status, last_seen, websocket)
            VALUES (?, 'online', ?, ?)
            ON CONFLICT(username) DO UPDATE SET
                status = 'online',
                last_seen = excluded.last_seen
        """, (username, now, websocket))
        conn.commit()
    except Exception as e:
        print(f"Error marking user online: {e}")
async def mark_user_offline(username):
    try:
        cursor.execute("""
            UPDATE OnlineUsers
            SET status = 'offline'
            WHERE username = ?
            WHERE websocket = ?
        """, (username,None))
        conn.commit()
    except Exception as e:
        print(f"Error marking user offline: {e}")
async def get_user_status(username):
    cursor.execute("SELECT status FROM OnlineUsers WHERE username = ?", (username,))
    row = cursor.fetchone()
    if row:
        return row[0]
    else:
        return None

def cleanup_stale_users(timeout_seconds=20):
    try:
        cutoff_time = arrow.utcnow().shift(seconds=-timeout_seconds).isoformat()
        cursor.execute("""
            UPDATE OnlineUsers
            SET status = 'offline'
            WHERE last_seen < ?
        """, (cutoff_time,))
        conn.commit()
        print("cleaned thing")
    except Exception as e:
        print(f"Error cleaning up stale users: {e}")
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

async def CreateAccount(username, password, userid,websocket):
    try:
        query = "SELECT username FROM Accounts WHERE username = ?"
        cursor.execute(query, (username,))
        dupe = cursor.fetchone()
        if dupe:
            response = {
                "type": "CreateAccount",
                "status": "error",
                "userID": userid,
                "message": "Account already exists."
            }
        else:
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            query = "INSERT INTO Accounts (username, password, token, icon, groups) VALUES (?, ?, ?, ?, ?)"
            cursor.execute(
                query,
                (username, hashed_password, "None", "/assets/img/favicon.ico", "[]")
            )
            conn.commit()
            response = {
                "type": "CreateAccount",
                "status": "success",
                "userID": userid,
                "message": "Account created successfully."
            }

        await send_message(websocket, response)
    except Exception as e:
        response = {
            "type": "CreateAccount",
            "status": "error",
            "userID": userid,
            "message": f"An error occurred: {str(e)}"
        }
        print(f"An error occurred: {str(e)}")
        await send_message(websocket, response)

async def SendMessage(group, userid, messagecontent,username, websocket):
    try:
        if not group:
            raise ValueError("Invalid group ID")

        cursor.execute("SELECT groupid FROM Groups WHERE groupid = ?", (group,))
        group_exists = cursor.fetchone()
        if not group_exists:
            raise ValueError("Group does not exist")
        query = "INSERT INTO Messages (groupid, username, message) VALUES (?, ?, ?)"
        cursor.execute(query, (group, username, messagecontent))
        conn.commit()

        response = {
            "type": "SendMessage",
            "status": "success",
            "groupID": group,
            "message": messagecontent
        }
        await send_message(websocket, response)
        messages = await get_group_messages(group)
        response = {
            "type": "groupMessages",
            "status": "success",
            "messages": messages,
            "userID": userid
        }
        await send_message(websocket, response)
    except Exception as e:
        print(f"Error in SendMessage: {e}")
        response = {
            "type": "SendMessage",
            "status": "error",
            "message": f"Error processing message: {str(e)}"
        }
        await send_message(websocket, response)

async def JoinGroup(id, userid, username, websocket):
    try:
        query = "SELECT groupid FROM Groups WHERE groupid = ?"
        cursor.execute(query, (id,))
        dupe = cursor.fetchone()
        if dupe is None:
            response = {
                "type": "JoinGroup",
                "status": "error",
                "message": "Group not found!"
            }
            await send_message(websocket, response)
        else:
            cursor.execute("SELECT groups FROM Accounts WHERE username = ?", (username,))
            result = cursor.fetchone()

            if result:
                groups = json.loads(result[0]) 

                if id in groups:
                    response = {
                        "type": "JoinGroup",
                        "status": "error",
                        "message": "Already in group."
                    }
                    await send_message(websocket, response)
                    return
            cursor.execute("SELECT groups FROM Accounts WHERE username = ?", (username,))
            result = cursor.fetchone()
            if result:
                groups = json.loads(result[0])
                if id not in groups:
                    query = "SELECT groups FROM Accounts WHERE username = ?"
                    cursor.execute(query, (username,))
                    groupsresult = cursor.fetchone()
                    if groupsresult:
                        groups.append(id)
                        updated_groups_json = json.dumps(groups)
                        query = "UPDATE Accounts SET groups = ? WHERE username = ?"
                        cursor.execute(query, (updated_groups_json, username))
                        conn.commit()
                        
                        query = "SELECT * FROM Groups WHERE groupid = ?"
                        cursor.execute(query, (id,))
                        groupinfo = cursor.fetchone()
                        response = {
                            "type": "JoinGroup",
                            "status": "success",
                            "message": "Joined group successfully.",
                            "serverid": id,
                            "servers": updated_groups_json,
                            "userID": userid,
                            "username": username
                        }
                        await send_message(websocket, response)
                else:
                    response = {
                        "type": "JoinGroup",
                        "status": "error",
                        "message": "Already in group."
                    }
                    await send_message(websocket, response)
            else:
                response = {
                    "type": "JoinGroup",
                    "status": "error",    
                    "message": "Account not found."
                }
            await send_message(websocket, response)
    except Exception as e:
        response = {
            "type": "JoinGroup",
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }
async def MakeGroup(name, icon, userid,username,websocket):
    try:
        query = "SELECT name FROM Groups WHERE name = ?"
        cursor.execute(query, (name,))
        dupe = cursor.fetchone()
        if dupe:
            response = {
                "type": "MakeGroup",
                "status": "error",
                "message": "Group already exists."
            }
            await send_message(websocket, response)
            return
        else:
            groupid = uuid.uuid4().hex
            if icon is None:
                icon = "/assets/img/defaultgroupicon.png"
                query = "INSERT INTO Groups (groupid, name,owner, icon) VALUES (?, ?, ?, ?)"
                cursor.execute(query, (groupid, name, username,icon))
                conn.commit()
                await JoinGroup(groupid,userid,username,websocket)
                query = "SELECT groups FROM Accounts WHERE username = ?"
                cursor.execute(query, (username,))
                groupsresult = cursor.fetchone()
                print(groupid)
                response = {
                    "type": "MakeGroup",
                    "status": "success",
                    "groupids": groupsresult,
                    "userID": userid,
                    "groupid":groupid,
                    "message": "Group created successfully."
                }
                await send_message(websocket, response)
    except Exception as e:
        response = {
            "type": "MakeGroup",
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }
        await send_message(websocket, response)
async def Login(account, password, userid, websocket):
    try:
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        query = "SELECT password,token,groups FROM Accounts WHERE username = ?"
        cursor.execute(query, (account,))
        result = cursor.fetchone()

        if result:
            got_password, token,groups = result
            if hashed_password == got_password:
                token = setup_token(account)
                response = {
                    "type": "Login",
                    "status": "success",
                    "message": "Logging in!",
                    "userID": userid,
                    "username": account,
                    "groups": groups,
                    "token": token
                }
                await mark_user_online(account,websocket)
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
async def GetUserGroupList(username):
    try:
        cursor.execute("SELECT groups FROM Accounts WHERE username = ?", (username,))
        result = cursor.fetchone()
        if result:
            groups = json.loads(result[0]) 
            server_list = []
            for group_id in groups:
                cursor.execute("SELECT groupid, name, icon FROM Groups WHERE groupid = ?", (group_id,))
                group_result = cursor.fetchone()
                if group_result:
                    server_list.append({
                        "id": group_result[0],
                        "name": group_result[1],
                        "icon": group_result[2]
                    })
            return server_list
        else:

            return "No servers found for this user."
    except Exception as e:
        return  f"An error occurred: {str(e)}"

async def get_group_messages(groupID):
    cursor.execute("SELECT username, message FROM Messages WHERE groupid = ?", (groupID,))
    rows = cursor.fetchall()
    messages = []
    for row in rows:
        username, msg = row
        messages.append({
            "username": username,
            "message": msg,
            "time": ""
        })
    return messages
async def global_message(message):
    cursor.execute("SELECT online FROM OnlineUsers")
    rows = cursor.fetchall()
    for i in range(len(rows)):
        await asyncio.gather(*(client.send(message) for client in users))
async def handle_client(websocket, path):
    print(f"Client connected: {websocket.remote_address}")
    try:
        async for message in websocket:
            try:
                formated_message = json.loads(message)
                message_type = formated_message.get("type")
                data = formated_message.get("data", {})
                print("Message type:", message_type)
                if message_type == "ping":
                    #await mark_user_online(formated_message["username"],websocket)
                    pass
                elif message_type == "create_account":
                    await CreateAccount(data["username"], data["password"],formated_message["userID"], websocket)

                elif message_type == "login":
                    await Login(
                        data["username"],
                        data["password"],
                        data["userID"],
                        websocket
                    )
                    
                elif message_type == "makegroup":
                    await MakeGroup(formated_message["servername"], None,formated_message["userID"],formated_message["username"], websocket)
                    
                elif message_type == "joingroup":
                    await JoinGroup(formated_message["id"], formated_message["userID"],formated_message["username"], websocket)
                    
                elif message_type == "sendmessage":
                    groupID = formated_message["groupID"]
                    userID = formated_message["userID"]
                    messagecontent = formated_message["message"]
                    await SendMessage(groupID, userID, messagecontent,formated_message["name"], websocket)
                    await global_message(message)

                elif message_type == "requestGroupMessages":
                    groupID = formated_message["groupID"]
                    userID = formated_message["userID"]
                    messages = await get_group_messages(groupID)
                    response = {
                        "type": "groupMessages",
                        "status": "success",
                        "messages": messages,
                        "userID": userID
                    }
                    await send_message(websocket, response)
                    
                elif message_type == "GetUserGroupList":
                    username = formated_message.get("username")
                    userID = formated_message.get("userID")
                    try:
                        response = await GetUserGroupList(username)
                        packet = {
                            "type": "getGroupList",
                            "status": "success",
                            "groups": response,
                            "userID": userID
                        }
                    except Exception as e:
                        packet = {
                            "type": "getGroupList",
                            "status": "error",
                            "message": f"An error occurred: {str(e)}"
                        }
                    await send_message(websocket, packet)
                    
                else:
                    response = {
                        "status": "error",
                        "message": "Unknown message type"
                    }
                    await send_message(websocket, response)
            except Exception as e:
                error_message = {
                    "status": "error",
                    "message": f"Failed to process message: {str(e)}"
                }
                await send_message(websocket, error_message)
    except websockets.ConnectionClosed as e:
        print(f"Client disconnected: {e}")
async def periodic_cleanup(interval):
    try:
        await asyncio.sleep(interval)
        cleanup_stale_users()
        print("Cleanup completed.")
    except asyncio.CancelledError:
        print("Periodic cleanup task cancelled.")
    finally:
        await asyncio.sleep(interval)
        asyncio.create_task(periodic_cleanup(interval))
PORT = 9001
async def main():
    cleanup_task = asyncio.create_task(periodic_cleanup(5))
    async with serve(handle_client, "localhost", PORT):
        print(f"WebSocket server running on ws://localhost:{PORT}")
        try:
            await asyncio.Future()
        finally:
            cleanup_task.cancel()

asyncio.run(main())
