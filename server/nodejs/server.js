const WebSocket = require("ws");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = 9001;
const activeConnections = new Map();

function generateToken() {
  return crypto.randomBytes(64).toString("base64");
}

const dbFile = path.join(__dirname, "database.db");
const dbExists = fs.existsSync(dbFile);
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Accounts (
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      token TEXT NOT NULL,
      icon TEXT NOT NULL,
      groups TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Groups (
      groupid TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      name TEXT NOT NULL,
      members TEXT NOT NULL,
      icon TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Messages (
      groupid TEXT NOT NULL,
      username TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS OnlineUsers (
      username TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      last_seen TEXT NOT NULL
    )
  `);
});

function markUserOnline(username) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.run(
      `
      INSERT INTO OnlineUsers (username, status, last_seen)
      VALUES (?, 'online', ?)
      ON CONFLICT(username) DO UPDATE SET
        status = 'online',
        last_seen = excluded.last_seen
    `,
      [username, now],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

function markUserOffline(username) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE OnlineUsers SET status = 'offline' WHERE username = ?`,
      [username],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

function cleanupStaleUsers(timeoutSeconds = 60) {
  const cutoff = Date.now() - timeoutSeconds * 1000;
  db.all(`SELECT username, last_seen FROM OnlineUsers WHERE status='online'`, [], (err, rows) => {
    if (err) {
      return;
    }
    rows.forEach((row) => {
      const lastSeenTime = new Date(row.last_seen).getTime();
      if (lastSeenTime < cutoff) {
        markUserOffline(row.username);
      }
    });
  });
}
async function CheckTokenAuth(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT token FROM Accounts WHERE username=?`, [username], (err, row) => {
      if (err) {
        return resolve(false);
      }
      if (!row) {
        return resolve(false);
      }
      resolve(row.token);
    });
  });
}

function setupToken(username) {
  return new Promise((resolve, reject) => {
    const newToken = generateToken();
    db.run(
      `UPDATE Accounts SET token = ? WHERE username = ?`,
      [newToken, username],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve(newToken);
      }
    );
  });
}

function sendToClient(ws, data) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return;
  }
  let payload;
  if (typeof data === "object") {
    payload = JSON.stringify(data);
  } else {
    payload = data;
  }
  ws.send(payload);
}

function createAccount(username, password, userID, ws) {
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  db.get(`SELECT username FROM Accounts WHERE username=?`, [username], (err, row) => {
    if (err) {
      sendToClient(ws, {
        type: "CreateAccount",
        status: "error",
        userID,
        message: "DB error: " + err.message
      });
      return;
    }
    if (row) {
      sendToClient(ws, {
        type: "CreateAccount",
        status: "error",
        userID,
        message: "Account already exists."
      });
    } else {
      const initialToken = "None";
      const defaultIcon = "/assets/img/favicon.ico";
      const emptyGroups = "[]";
      db.run(
        `INSERT INTO Accounts (username, password, token, icon, groups) VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, initialToken, defaultIcon, emptyGroups],
        (err2) => {
          if (err2) {
            sendToClient(ws, {
              type: "CreateAccount",
              status: "error",
              userID,
              message: "DB insert error: " + err2.message
            });
            return;
          }
          sendToClient(ws, {
            type: "CreateAccount",
            status: "success",
            userID,
            message: "Account created successfully."
          });
        }
      );
    }
  });
}

function login(account, password, userID, ws) {
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  db.get(`SELECT password, token, groups FROM Accounts WHERE username=?`, [account], async (err, row) => {
    if (err) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "DB error: " + err.message
      });
      return;
    }
    if (!row) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "Account not found."
      });
      return;
    }
    const dbPassword = row.password;
    if (dbPassword !== hashedPassword) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "Incorrect password."
      });
      return;
    }
    try {
      const newToken = await setupToken(account);
      await markUserOnline(account);
      activeConnections.set(account, ws);
      sendToClient(ws, {
        type: "Login",
        status: "success",
        message: "Logging in!",
        userID,
        token: newToken,
        username: account,
        groups: row.groups,
        token: newToken
      });
    } catch (e) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "An error occurred: " + e.message
      });
    }
  });
}

function getGroupData(groupID) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT username, message FROM Messages WHERE groupid=?`, [groupID], (err, rows) => {
      if (err) return reject(err);
      db.get(`SELECT groupid, members, owner, name, icon FROM Groups WHERE groupid=?`, [groupID], (err2, groupRow) => {
        if (err2) return reject(err2);
        if (!groupRow) return reject(new Error("Group not found."));
        let groupMembers = [];
        try {
          groupMembers = JSON.parse(groupRow.members || "[]");
        } catch (parseErr) {
          return reject(parseErr);
        }
        const memberPromises = groupMembers.map((uname) => {
          return new Promise((res, rej) => {
            db.get(`SELECT username, icon FROM Accounts WHERE username=?`, [uname], (er, accountRow) => {
              if (er) return rej(er);
              res(accountRow || { username: uname, icon: "/assets/img/user.svg" });
            });
          });
        });
        Promise.all(memberPromises)
          .then((allmemberdata) => {
            const data = rows.map((r) => ({
              username: r.username,
              message: r.message
            }));
            resolve({
              data,
              allmembers: allmemberdata,
              owner: groupRow.owner,
              groupName: groupRow.name,
              groupIcon: groupRow.icon
            });
          })
          .catch((e) => reject(e));
      });
    });
  });
}

async function sendMessage(groupID, userID, messagecontent, username, ws) {
  db.get(`SELECT groupid FROM Groups WHERE groupid=?`, [groupID], (err, groupRow) => {
    if (err) {
      return sendToClient(ws, {
        type: "SendMessage",
        status: "error",
        message: "DB error: " + err.message
      });
    }
    if (!groupRow) {
      return sendToClient(ws, {
        type: "SendMessage",
        status: "error",
        message: "Group does not exist!"
      });
    }
    db.run(
      `INSERT INTO Messages (groupid, username, message) VALUES (?, ?, ?)`,
      [groupID, username, messagecontent],
      async (insertErr) => {
        if (insertErr) {
          return sendToClient(ws, {
            type: "SendMessage",
            status: "error",
            message: "DB insert error: " + insertErr.message
          });
        }
        sendToClient(ws, {
          type: "SendMessage",
          status: "success",
          groupID,
          message: messagecontent
        });
        const data = await getGroupData(groupID).catch(() => null);
        if(data){
          sendToClient(ws, {
            type: "groupMessages",
            status: "success",
            data,
            userID
          });
        }
      }
    );
  });
}

function joinGroup(id, userID, username, ws) {
  db.get(`SELECT groupid, members FROM Groups WHERE groupid=?`, [id], (err, groupRow) => {
    if (err) {
      return sendToClient(ws, {
        type: "JoinGroup",
        status: "error",
        message: "DB error: " + err.message,
      });
    }
    if (!groupRow) {
      return sendToClient(ws, {
        type: "JoinGroup",
        status: "error",
        message: "Group not found!",
      });
    }
    let groupMembers = [];
    try {
      groupMembers = JSON.parse(groupRow.members || "[]");
    } catch (parseErr) {
      return sendToClient(ws, {
        type: "JoinGroup",
        status: "error",
        message: "Failed to parse group members.",
      });
    }
    db.get(`SELECT groups FROM Accounts WHERE username=?`, [username], (err2, row) => {
      if (err2) {
        return sendToClient(ws, {
          type: "JoinGroup",
          status: "error",
          message: "DB error: " + err2.message,
        });
      }
      if (!row) {
        return sendToClient(ws, {
          type: "JoinGroup",
          status: "error",
          message: "Account not found.",
        });
      }
      let userGroups = [];
      try {
        userGroups = JSON.parse(row.groups || "[]");
      } catch (parseErr) {
        userGroups = [];
      }
      if (!userGroups.includes(id)) {
        userGroups.push(id);
      }
      if (!groupMembers.includes(username)) {
        groupMembers.push(username);
      }
      const updatedUserGroups = JSON.stringify(userGroups);
      const updatedGroupMembers = JSON.stringify(groupMembers);
      db.run(`UPDATE Groups SET members=? WHERE groupid=?`, [updatedGroupMembers, id], (err3) => {
        if (err3) {
          return sendToClient(ws, {
            type: "JoinGroup",
            status: "error",
            message: "DB update error (Groups): " + err3.message,
          });
        }
        db.run(`UPDATE Accounts SET groups=? WHERE username=?`, [updatedUserGroups, username], (err4) => {
          if (err4) {
            return sendToClient(ws, {
              type: "JoinGroup",
              status: "error",
              message: "DB update error (Accounts): " + err4.message,
            });
          }
          sendToClient(ws, {
            type: "JoinGroup",
            status: "success",
            message: "Joined group successfully.",
            groupid: id,
            groups: updatedUserGroups,
            userID,
            username,
          });
        });
      });
    });
  });
}

function makeGroup(name, icon, userID, username, ws) {
  db.get(`SELECT name FROM Groups WHERE name=?`, [name], (err, row) => {
    if (err) {
      return sendToClient(ws, {
        type: "MakeGroup",
        status: "error",
        message: "DB error: " + err.message
      });
    }
    if (row) {
      sendToClient(ws, {
        type: "MakeGroup",
        status: "error",
        message: "Group already exists."
      });
    } else {
      const groupid = crypto.randomUUID().replace(/-/g, "");
      const chosenIcon = icon || "/assets/img/defaultgroupicon.png";
      db.run(
        `INSERT INTO Groups (groupid, name, owner, icon, members) VALUES (?, ?, ?, ?, ?)`,
        [groupid, name, username, chosenIcon, JSON.stringify([username])],
        (err2) => {
          if (err2) {
            return sendToClient(ws, {
              type: "MakeGroup",
              status: "error",
              message: "DB insert error: " + err2.message
            });
          }
          joinGroup(groupid, userID, username, ws);
          sendToClient(ws, {
            type: "MakeGroup",
            status: "success",
            message: "Group created successfully."
          });
        }
      );
    }
  });
}

function getUserGroupList(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT groups FROM Accounts WHERE username=?`, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve([]);
      let groups = [];
      try {
        groups = JSON.parse(row.groups);
      } catch {
        groups = [];
      }
      if (!groups.length) return resolve([]);
      const placeholders = groups.map(() => "?").join(",");
      db.all(
        `SELECT groupid, name, icon FROM Groups WHERE groupid IN (${placeholders})`,
        groups,
        (err2, groupRows) => {
          if (err2) return reject(err2);
          const grouplist = groupRows.map((g) => ({
            id: g.groupid,
            name: g.name,
            icon: g.icon
          }));
          resolve(grouplist);
        }
      );
    });
  });
}

function broadcastAll(payload) {
  const data = typeof payload === "object" ? JSON.stringify(payload) : payload;
  for (const [username, ws] of activeConnections.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

function leaveGroup(groupID, userID, ws) {
}

function updateGroup(msg, ws) {
  const { groupID, requester, newName, newIcon, kickUser } = msg;
  db.get(`SELECT * FROM Groups WHERE groupid=?`, [groupID], (err, groupRow) => {
    if (err) {
      return sendToClient(ws, {
        type: "updateGroupResult",
        success: false,
        message: "DB error: " + err.message,
      });
    }
    if (!groupRow) {
      return sendToClient(ws, {
        type: "updateGroupResult",
        success: false,
        message: "Group not found.",
      });
    }
    if (groupRow.owner !== requester) {
      if (kickUser || newName || newIcon) {
        return sendToClient(ws, {
          type: "updateGroupResult",
          success: false,
          message: "Only the owner can modify group settings.",
        });
      }
    }
    let groupMembers = [];
    try {
      groupMembers = JSON.parse(groupRow.members);
    } catch {
      groupMembers = [];
    }
    if (kickUser && groupMembers.includes(kickUser)) {
      groupMembers = groupMembers.filter((u) => u !== kickUser);
      db.get(`SELECT groups FROM Accounts WHERE username=?`, [kickUser], (err2, row) => {
        if (!err2 && row) {
          let userGroups = [];
          try {
            userGroups = JSON.parse(row.groups);
          } catch {
            userGroups = [];
          }
          const updatedUserGroups = userGroups.filter((g) => g !== groupID);
          db.run(`UPDATE Accounts SET groups=? WHERE username=?`, [JSON.stringify(updatedUserGroups), kickUser]);
        }
      });
    }
    const newNameToUse = newName || groupRow.name;
    const newIconToUse = newIcon || groupRow.icon;
    const updatedMembers = JSON.stringify(groupMembers);
    db.run(
      `UPDATE Groups SET name=?, icon=?, members=? WHERE groupid=?`,
      [newNameToUse, newIconToUse, updatedMembers, groupID],
      async (err3) => {
        if (err3) {
          return sendToClient(ws, {
            type: "updateGroupResult",
            success: false,
            message: "Error updating group: " + err3.message,
          });
        }
        broadcastAll({
          type: "groupMessages",
          status: "success",
          data: {
            groupID,
            name: newNameToUse,
            icon: newIconToUse,
            members: groupMembers,
          },
        });
        const updatedData = await getGroupData(groupID).catch(()=>null);
        if(updatedData){
          broadcastAll({
            type: "refreshGroupData",
            status: "success",
            data: updatedData
          });
        }
        sendToClient(ws, {
          type: "updateGroupResult",
          success: true,
          message: "Group updated successfully.",
        });
      }
    );
  });
}
async function getUserData(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT username, icon FROM Accounts WHERE username=?`, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);
      resolve(row);
    });
  });
}
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

setInterval(() => {
  cleanupStaleUsers(60);
}, 10000);

wss.on("connection", (ws) => {
  ws.on("close", () => {
    for (const [uname, conn] of activeConnections.entries()) {
      if (conn === ws) {
        markUserOffline(uname);
        activeConnections.delete(uname);
        break;
      }
    }
  });
  ws.on("message", async (rawData) => {
    let msg;
    try {
      msg = JSON.parse(rawData.toString());
    } catch (e) {
      return;
    }
    let username = msg.username;
    let correcttoken = await CheckTokenAuth(username);
    const messageType = msg.type;
    if (correcttoken !== msg.token && messageType != "login" && messageType != "create_account") {
      return;
    }
    if (messageType === "ping") {
      const uname = msg.username;
      await markUserOnline(uname);
      if (!activeConnections.has(uname)) {
        activeConnections.set(uname, ws);
      }
      return;
    }
    if (messageType === "create_account") {
      createAccount(msg.data.username, msg.data.password, msg.userID, ws);
    } else if (messageType === "login") {
      login(msg.data.username, msg.data.password, msg.data.userID, ws);
    } else if (messageType === "makegroup") {
      makeGroup(msg.groupname, null, msg.userID, msg.username, ws);
    } else if (messageType === "joingroup") {
      joinGroup(msg.id, msg.userID, msg.username, ws);
      const userData = await getUserData(msg.username).catch(() => null);
      const groupData = await getGroupData(msg.id).catch(() => null);
      broadcastAll({
        type: "updateGroup",
        groupID: msg.id,
        newName: groupData.groupName || null,
        newIcon: groupData.groupIcon || null,
        kickUser: null,
        joinUser: userData || null
      });
    } else if (messageType === "sendmessage") {
      const { groupID, userID, message, username } = msg;
      sendMessage(groupID, userID, message, username, ws);
      const packet = {
        type: "sendmessage",
        groupID,
        userID,
        message,
        username
      }
      broadcastAll(packet);
    } else if (messageType === "requestGroupData") {
      try {
        const data = await getGroupData(msg.groupID);
        sendToClient(ws, {
          type: "groupMessages",
          status: "success",
          data,
          userID: msg.userID
        });
      } catch (e) {
        sendToClient(ws, {
          type: "groupMessages",
          status: "error",
          message: e.message
        });
      }
    } else if (messageType === "GetUserGroupList") {
      const uname = msg.username;
      try {
        const list = await getUserGroupList(uname);
        sendToClient(ws, {
          type: "getGroupList",
          status: "success",
          groups: list,
          userID: msg.userID
        });
      } catch (e) {
        sendToClient(ws, {
          type: "getGroupList",
          status: "error",
          message: e.message
        });
      }
    } else if (messageType === "leaveGroup") {
      leaveGroup(msg.groupID, msg.userID, ws);
    } else if (messageType === "updategroup") {
      updateGroup(msg, ws);
      broadcastAll({
        type: "updateGroup",
        groupID: msg.groupID,
        newName: msg.newName || null,
        newIcon: msg.newIcon || null,
        kickUser: msg.kickUser || null,
        joinUser: null
      });
    } else {
      sendToClient(ws, {
        status: "error",
        message: "Unknown message type"
      });
    }
  });
});

console.log("Server is starting up...");
