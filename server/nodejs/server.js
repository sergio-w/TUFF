const WebSocket = require("ws");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

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
      -- You could add time/timestamp columns as well
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

/**
 * Store/Update user as 'online' in the DB, but keep the actual ws connection
 * in our in-memory activeConnections map.
 */
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
          console.error("Error marking user online:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

/**
 * Mark user offline in the DB. You can remove them from activeConnections if you want,
 * or simply rely on the close event to do that.
 */
function markUserOffline(username) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE OnlineUsers SET status = 'offline' WHERE username = ?`,
      [username],
      (err) => {
        if (err) {
          console.error("Error marking user offline:", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

/**
 * Periodic cleanup: if a user hasn't pinged for some time, mark them offline. 
 * This is just an example. You might want to store more info in DB (like last_ws_ping).
 */
function cleanupStaleUsers(timeoutSeconds = 60) {
  const cutoff = Date.now() - timeoutSeconds * 1000;
  // We'll do a naive approach: get all OnlineUsers,
  // if last_seen is older than cutoff, set them offline.
  db.all(`SELECT username, last_seen FROM OnlineUsers WHERE status='online'`, [], (err, rows) => {
    if (err) {
      console.error("Error reading from OnlineUsers:", err);
      return;
    }
    rows.forEach((row) => {
      const lastSeenTime = new Date(row.last_seen).getTime();
      if (lastSeenTime < cutoff) {
        // Mark offline
        markUserOffline(row.username);
      }
    });
  });
}

/**
 * Helper to set up a new token for a user in the DB
 */
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

/**
 * Send data to a WebSocket (safe JSON stringify)
 */
function sendToClient(ws, data) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error("WebSocket not open or invalid, cannot send message");
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

/**
 * Create Account
 */
function createAccount(username, password, userID, ws) {
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  db.get(`SELECT username FROM Accounts WHERE username=?`, [username], (err, row) => {
    if (err) {
      sendToClient(ws, {
        type: "CreateAccount",
        status: "error",
        userID,
        message: "DB error: " + err.message,
      });
      return;
    }
    if (row) {
      // user exists
      sendToClient(ws, {
        type: "CreateAccount",
        status: "error",
        userID,
        message: "Account already exists.",
      });
    } else {
      // create
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
              message: "DB insert error: " + err2.message,
            });
            return;
          }
          sendToClient(ws, {
            type: "CreateAccount",
            status: "success",
            userID,
            message: "Account created successfully.",
          });
        }
      );
    }
  });
}

/**
 * Login
 */
function login(account, password, userID, ws) {
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  db.get(`SELECT password, token, groups FROM Accounts WHERE username=?`, [account], async (err, row) => {
    if (err) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "DB error: " + err.message,
      });
      return;
    }
    if (!row) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "Account not found.",
      });
      return;
    }
    const dbPassword = row.password;
    if (dbPassword !== hashedPassword) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "Incorrect password.",
      });
      return;
    }
    // Correct password: Set up new token, mark user online, etc.
    try {
      const newToken = await setupToken(account);
      await markUserOnline(account);
      // Remember the WebSocket in activeConnections
      activeConnections.set(account, ws);

      sendToClient(ws, {
        type: "Login",
        status: "success",
        message: "Logging in!",
        userID,
        username: account,
        groups: row.groups,
        token: newToken,
      });
    } catch (e) {
      sendToClient(ws, {
        type: "Login",
        status: "error",
        message: "An error occurred: " + e.message,
      });
    }
  });
}

/**
 * Example function: Get group data
 */
// node server.js
function getGroupData(groupID) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT username, message FROM Messages WHERE groupid=?`, [groupID], (err, rows) => {
      if (err) return reject(err);

      db.get(`SELECT members FROM Groups WHERE groupid=?`, [groupID], (err, row) => {
        if (err) {
          console.error("DB error:", err.message);
          return reject(err);
        }
        if (!row || !row.members) {
          console.error("Group not found or no members available.");
          return reject(new Error("Group not found or no members available."));
        }

        let groupMembers = [];
        try {
          groupMembers = JSON.parse(row.members);
          console.log("Group members: ", groupMembers);
        } catch (parseErr) {
          console.error("Failed to parse group members:", parseErr.message);
          return reject(parseErr);
        }

        if (groupMembers.length === 0) {
          console.log("No members in the group.");
          return resolve({ data: rows.map((r) => ({ username: r.username, message: r.message, time: "" })), allmembers: [] });
        }

        const memberPromises = groupMembers.map((username) => {
          return new Promise((resolve, reject) => {
            db.get(`SELECT username, icon FROM Accounts WHERE username=?`, [username], (err, accountRow) => {
              if (err) return reject(err);
              resolve(accountRow || { username, icon: "/assets/img/user.svg" });
            });
          });
        });

        Promise.all(memberPromises)
          .then((allmemberdata) => {
            const data = rows.map((r) => ({
              username: r.username,
              message: r.message,
              time: "",
            }));

            resolve({ data, allmembers: allmemberdata });
          })
          .catch((err) => {
            console.error("Error fetching member data:", err);
            reject(err);
          });
      });
    });
  });
}



/**
 * Handle inbound messages of type "sendmessage"
 */
async function sendMessage(groupID, userID, messagecontent, username, ws) {
  // Insert into DB
  db.get(`SELECT groupid FROM Groups WHERE groupid=?`, [groupID], (err, groupRow) => {
    if (err) {
      return sendToClient(ws, {
        type: "SendMessage",
        status: "error",
        message: "DB error: " + err.message,
      });
    }
    if (!groupRow) {
      return sendToClient(ws, {
        type: "SendMessage",
        status: "error",
        message: "Group does not exist!",
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
            message: "DB insert error: " + insertErr.message,
          });
        }
        // Confirm to the sender
        sendToClient(ws, {
          type: "SendMessage",
          status: "success",
          groupID,
          message: messagecontent,
        });
        // Return updated messages if you want
        const data = await getGroupData(groupID);
        sendToClient(ws, {
          type: "groupMessages",
          status: "success",
          data,
          userID,
        });
      }
    );
  });
}

/**
 * Join a group
 */
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

    // Parse existing group members
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

    // Pull the user's existing groups
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




/**
 * Create a new group
 */
function makeGroup(name, icon, userID, username, ws) {
  db.get(`SELECT name FROM Groups WHERE name=?`, [name], (err, row) => {
    if (err) {
      return sendToClient(ws, {
        type: "MakeGroup",
        status: "error",
        message: "DB error: " + err.message,
      });
    }
    if (row) {
      sendToClient(ws, {
        type: "MakeGroup",
        status: "error",
        message: "Group already exists.",
      });
    } else {
      const groupid = crypto.randomUUID().replace(/-/g, "");
      const chosenIcon = icon || "/assets/img/defaultgroupicon.png";
      db.run(
        `INSERT INTO Groups (groupid, name, owner, icon,members) VALUES (?, ?, ?, ?, ?)`,
        [groupid, name, username, chosenIcon, JSON.stringify([username])],
        (err2) => {
          if (err2) {
            return sendToClient(ws, {
              type: "MakeGroup",
              status: "error",
              message: "DB insert error: " + err2.message,
            });
          }
          console.log("id is", groupid)
          joinGroup(groupid, userID, username, ws);

          sendToClient(ws, {
            type: "MakeGroup",
            status: "success",
            groupid,
            message: "Group created successfully.",
          });
        }
      );
    }
  });
}

/**
 * Return the user's group list with info
 */
function getUserGroupList(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT groups FROM Accounts WHERE username=?`, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve([]);
      let groups = [];
      try {
        groups = JSON.parse(row.groups);
      } catch (parseErr) {
        groups = [];
      }
      if (!groups.length) return resolve([]);

      // Now fetch details
      const placeholders = groups.map(() => "?").join(",");
      db.all(
        `SELECT groupid, name, icon FROM Groups WHERE groupid IN (${placeholders})`,
        groups,
        (err2, groupRows) => {
          if (err2) return reject(err2);
          const grouplist = groupRows.map((g) => ({
            id: g.groupid,
            name: g.name,
            icon: g.icon,
          }));
          resolve(grouplist);
        }
      );
    });
  });
}

/**
 * Broadcast or "global message" example:
 * We'll just iterate over activeConnections and send something to all connected websockets.
 */
function broadcastAll(payload) {
  const data = typeof payload === "object" ? JSON.stringify(payload) : payload;
  for (const ws of activeConnections.values()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

/**
 * WebSocket Server setup
 */
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

// Periodic cleanup of stale "online" statuses. For example, run every 10 seconds:
setInterval(() => {
  cleanupStaleUsers(60); 
}, 10000);

wss.on("connection", (ws) => {
  console.log("Client connected");

  // On close, remove from activeConnections
  ws.on("close", () => {
    console.log("Client disconnected");
    // We'll find which user had this connection
    for (const [username, conn] of activeConnections.entries()) {
      if (conn === ws) {
        markUserOffline(username);
        activeConnections.delete(username);
        break;
      }
    }
  });

  // On message from client
  ws.on("message", async (rawData) => {
    let msg;
    try {
      msg = JSON.parse(rawData.toString());
    } catch (e) {
      console.error("Invalid JSON received:", e.message);
      return;
    }
    const messageType = msg.type;
    console.log("Received Message:", msg);

    if (messageType === "ping") {
      const username = msg.username;
      await markUserOnline(username);
      if (!activeConnections.has(username)) {
        activeConnections.set(username, ws);
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
    } else if (messageType === "sendmessage") {
      const { groupID, userID, message, name } = msg;
      sendMessage(groupID, userID, message, name, ws);

      broadcastAll(rawData.toString());
    } else if (messageType === "requestGroupData") {
      try {
        const data = await getGroupData(msg.groupID);
        sendToClient(ws, {
          type: "groupMessages",
          status: "success",
          data,
          userID: msg.userID,
        });
      } catch (e) {
        sendToClient(ws, {
          type: "groupMessages",
          status: "error",
          message: e.message,
        });
      }
    } else if (messageType === "GetUserGroupList") {
      const username = msg.username;
      try {
        const list = await getUserGroupList(username);
        sendToClient(ws, {
          type: "getGroupList",
          status: "success",
          groups: list,
          userID: msg.userID,
        });
      } catch (e) {
        sendToClient(ws, {
          type: "getGroupList",
          status: "error",
          message: e.message,
        });
      }
    } else {
      // unknown type
      sendToClient(ws, {
        status: "error",
        message: "Unknown message type",
      });
    }
  });
});

console.log("Server is starting up...");
