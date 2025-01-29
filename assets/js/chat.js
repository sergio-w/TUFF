const chat = document.createElement('div');
const chatStyle = document.createElement('style');
const chatHead = document.createElement('script');
chatHead.src = 'https://cdn.socket.io/4.5.1/socket.io.min.js';
chatHead.onload = initializechat;
document.head.appendChild(chatHead);

chatStyle.innerHTML = `
    /* --------------------------
       GENERAL PAGE STYLING
    -------------------------- */
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f4f4f4;
    }

    /* --------------------------
       CHAT LAUNCHER ICON
    -------------------------- */
    .chat-launcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: #007bff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
      transition: transform 0.3s ease;
    }

    .chat-launcher:hover {
      background-color: #0056b3;
    }

    /* Icon inside the launcher (simple chat bubble icon) */
    .chat-launcher .launcher-icon {
      width: 24px;
      height: 24px;
      background: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='24' height='24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-message-square' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E") no-repeat center center;
      background-size: cover;
    }

    /* When the launcher is toggled to "Close" state (X) */
    .chat-launcher.close .launcher-icon {
      background: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='24' height='24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-x' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E") no-repeat center center;
      background-size: cover;
    }

    /* --------------------------
       CHAT CONTAINER
    -------------------------- */
    .chat-container {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      min-height: 400px;
      background: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      overflow: hidden;
      display: none;
      flex-direction: column;
      z-index: 9999;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
    }

    .chat-container.active {
      display: flex;
      transform: translateY(0);
      opacity: 1;
    }

    /* Chat Header */
    .chat-header {
      background: #007bff;
      color: #fff;
      padding: 10px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Chat messages area */
    .chat-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      background-color: #f9f9f9;
    }

    .message {
      margin-bottom: 8px;
    }

    .message .meta {
      font-size: 0.75rem;
      color: #888;
      margin-bottom: 2px;
    }

    .message .text {
      background: #eaeaea;
      display: inline-block;
      padding: 6px 10px;
      border-radius: 4px;
    }

    /* Chat form */
    .chat-form {
      display: flex;
      border-top: 1px solid #ddd;
    }

    .chat-form input {
      flex: 1;
      border: none;
      padding: 10px;
      font-size: 1rem;
    }

    .chat-form button {
      background: #007bff;
      color: #fff;
      border: none;
      padding: 0 16px;
      cursor: pointer;
    }

    .chat-form button:hover {
      background: #0056b3;
    }

    /* --------------------------
       MULTIPLE ROOMS SELECT
    -------------------------- */
    .room-select {
      background: #fff;
      border: 1px solid #ccc;
      color: #333;
      border-radius: 4px;
      margin-right: 5px;
    }
`;

document.head.appendChild(chatStyle);


chat.innerHTML = `

  <!-- Chat Launcher Button -->
  <div class="chat-launcher" id="chatLauncher">
    <div class="launcher-icon"></div>
  </div>

  <!-- Chat Container -->
  <div class="chat-container" id="chatContainer">
    <div class="chat-header">
      <span>Public Chat Room</span>
      <!-- Room Selector -->
      <select id="roomSelector" class="room-select">
        <option value="global">Global</option>
        <option value="custom">Custom</option>
      </select>
    </div>
    <div class="chat-messages" id="chatMessages">
      <!-- Messages will appear here -->
    </div>
    <form class="chat-form" id="chatForm">
      <input type="text" id="messageInput" placeholder="Type a message..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  </div>
`;


document.body.appendChild(chat);


// ===============================
// 1. Handle Username in localStorage
// ===============================
let username = localStorage.getItem('chatUsername');
if (!username) {
  username = prompt('Enter your username:');
  console.log(username + ' has joined the chat');
  if (!username) {
    username = 'Anonymous'; // fallback
  }
  localStorage.setItem('chatUsername', username);
}

// ===============================
// 2. Setup Socket.io
// ===============================
let socket;

function initializechat() {
  socket = io('wss://98.96.174.130:3000', { transports: ['websocket'] });
}
// Current room
let currentRoom = 'global';

// Join initial room
socket.emit('joinRoom', currentRoom);

// Store all messages in localStorage for each room
// (So if user refreshes, they see the messages again.)
// But note that real-time messages come from the server.
// localStorage is just for re-populating after refresh.
let localMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};

// Ensure current room’s message array exists in localMessages
if (!localMessages[currentRoom]) {
  localMessages[currentRoom] = [];
}

// ===============================
// 3. DOM Elements
// ===============================
const chatLauncher = document.getElementById('chatLauncher');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const roomSelector = document.getElementById('roomSelector');


let isOpen = false;
chatLauncher.addEventListener('click', () => {
  isOpen = !isOpen;
  chatLauncher.classList.toggle('close', isOpen);
  chatContainer.classList.toggle('active', isOpen);
});


roomSelector.addEventListener('change', (e) => {
  let newRoom = e.target.value;

  if (newRoom === 'custom') {
    newRoom = prompt('Enter a room name:');
    roomSelector.options[1].value = newRoom;
    roomSelector.options[1].text = newRoom;
  }

  localMessages[currentRoom] = getMessagesFromDom();
  localStorage.setItem('chatMessages', JSON.stringify(localMessages));

  chatMessages.innerHTML = '';

  currentRoom = newRoom;

  socket.emit('joinRoom', currentRoom);

  if (!localMessages[currentRoom]) {
    localMessages[currentRoom] = [];
  }

  localMessages[currentRoom].forEach((msgObj) => {
    addMessageToDOM(msgObj.username, msgObj.text, msgObj.timestamp);
  });
});


socket.on('initialMessages', (messages) => {
  chatMessages.innerHTML = '';
  messages.forEach((msg) => {
    addMessageToDOM(msg.username, msg.text, msg.timestamp);
  });
});

socket.on('newMessage', (msg) => {
  addMessageToDOM(msg.username, msg.text, msg.timestamp);

  if (!localMessages[currentRoom]) {
    localMessages[currentRoom] = [];
  }
  localMessages[currentRoom].push(msg);
  localStorage.setItem('chatMessages', JSON.stringify(localMessages));
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const timestamp = new Date().toLocaleString();
  const msgObj = {
    roomName: currentRoom,
    username,
    text,
    timestamp
  };

  socket.emit('chatMessage', msgObj);

  if (!localMessages[currentRoom]) {
    localMessages[currentRoom] = [];
  }
  localMessages[currentRoom].push(msgObj);
  localStorage.setItem('chatMessages', JSON.stringify(localMessages));

  // Clear input
  messageInput.value = '';
});

function addMessageToDOM(sender, message, time) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.innerHTML = `
        <div class="meta">${sender} • ${time}</div>
        <div class="text">${message}</div>
      `;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getMessagesFromDom() {
  return localMessages[currentRoom] || [];
}


if (localMessages[currentRoom]) {
  localMessages[currentRoom].forEach((msgObj) => {
    addMessageToDOM(msgObj.username, msgObj.text, msgObj.timestamp);
  });
}