const style = document.createElement('style');
style.innerHTML = `

.pAdeblc {
    font-family: 'MS Sans Serif', sans-serif;
    position: fixed;
    top: 25%;
    left: 25%;
    width: 50vw;
    height: 34vw;
    background: #c0c0c0;
    border: 0.15vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    z-index: 9999999999999999999999999999;
    box-sizing: border-box
}

.pAdeblc-content {
    background: #000080;
    color: #ffffff;
    height: 26.8vw;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1vw;
    overflow-y: scroll;
    overflow-wrap: break-word;
    outline: 0;
}
.pAdeblc-content-new {
    background: silver;
    color: #ffffff;
    height: 92.1%;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1vw;
    overflow: hidden;
    outline: 0;
}

.pAdeblc-content::-webkit-scrollbar, .pAdeblc-txeditor::-webkit-scrollbar {
    width: 1.6vw;
    height: 1.6vw;
}

.pAdeblc-content::-webkit-scrollbar-track, .pAdeblc-txeditor::-webkit-scrollbar-track{
  image-rendering: optimizeSpeed;
  image-rendering: pixelated;
  image-rendering: optimize-contrast;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAyIDIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyI+CjxtZXRhZGF0YT5NYWRlIHdpdGggUGl4ZWxzIHRvIFN2ZyBodHRwczovL2NvZGVwZW4uaW8vc2hzaGF3L3Blbi9YYnh2Tmo8L21ldGFkYXRhPgo8cGF0aCBzdHJva2U9IiNjMGMwYzAiIGQ9Ik0wIDBoMU0xIDFoMSIgLz4KPC9zdmc+");
  background-position: 0 0;
  background-repeat: repeat;
  background-size: 0.05vw;
}



.pAdeblc-content::-webkit-scrollbar-thumb, .pAdeblc-content::-webkit-scrollbar-button,.pAdeblc-txeditor::-webkit-scrollbar-thumb, .pAdeblc-txeditor::-webkit-scrollbar-button {
  width: 1.6vw;
  height: 1.6vw;
  background: silver;
  box-shadow: inset 1px 1px #dfdfdf, inset -1px -1px gray;
  border: 1px solid;
  border-color: silver #000 #000 silver;
}

.pAdeblc-content::-webkit-scrollbar-thumb:hover,.pAdeblc-txeditor::-webkit-scrollbar-thumb:hover {
    background: #606060;
}

.pAdeblc-content::-webkit-scrollbar-corner, .pAdeblc-txeditor::-webkit-scrollbar-corner {
    background: #c0c0c0;
}
.pAdeblc-content::-webkit-scrollbar-button:single-button:vertical:decrement, .pAdeblc-txeditor::-webkit-scrollbar-button:single-button:vertical:decrement {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTcgNWgxTTYgNmgzTTUgN2g1TTQgOGg3IiAvPgo8L3N2Zz4=");
}

.pAdeblc-content::-webkit-scrollbar-button:single-button:vertical:increment, .pAdeblc-txeditor::-webkit-scrollbar-button:single-button:vertical:increment {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTQgNWg3TTUgNmg1TTYgN2gzTTcgOGgxIiAvPgo8L3N2Zz4=");
}

.pAdeblc-content::-webkit-scrollbar-button:single-button:horizontal:decrement, .pAdeblc-txeditor::-webkit-scrollbar-button:single-button:horizontal:decrement {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTggM2gxTTcgNGgyTTYgNWgzTTUgNmg0TTYgN2gzTTcgOGgyTTggOWgxIiAvPgo8L3N2Zz4=");
}

.pAdeblc-content::-webkit-scrollbar-button:single-button:horizontal:increment, .pAdeblc-txeditor::-webkit-scrollbar-button:single-button:horizontal:increment {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTYgM2gxTTYgNGgyTTYgNWgzTTYgNmg0TTYgN2gzTTYgOGgyTTYgOWgxIiAvPgo8L3N2Zz4=");
}

.pAdeblc-content::-webkit-scrollbar-corner, .pAdeblc-txeditor::-webkit-scrollbar-corner {
  background: silver;
}

.pAdeblc-input {
    display: block;
    font-family: 'MS Sans Serif', sans-serif;
    top:93%;
    left;0;
    font-size: 1vw;
    width: 100% !important; 
    height: 7%;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    outline: none;
    box-sizing: border-box;
    position: absolute;
}


.pAdeblc-top {
    cursor: move;
    text-align: left; /* Align text to the left */
    height: 1.8vw;
    background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); /* Chrome, Safari */
    background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); /* Firefox */
    background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226));
    padding: 0.4vw;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1.4vw;
    color: #000080;
    font-weight: bold;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: space-between
}

.pAdeblc-top .title {
    margin-left: 0.5vw; /* Adjust the margin for text spacing */
}

.pAdeblc-top-no-bind {
    cursor: inherit;
}

.pAdeblc-bt {
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    color: #000;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    padding: 0.15vw 0.5vw;
    cursor: pointer;
}
.pAdeblc-bt:hover {
    border: 0.1vw solid #fff;
    border-right-color:#fff;
    border-bottom-color:#fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
    cursor: pointer;
} 

#pAdeblc {
    z-index: 999;
}
.tabs {
  font-family: Arial, sans-serif;
  overflow-y: hidden;
  width: 100%;
  height: 85%;
}

.tab-buttons button {
  padding: 0.5vw 3vw;
  cursor: pointer;
  background:rgb(158, 158, 158);
  box-shadow: inset 0.1vw 0.1vw  #dfdfdf, inset -0.1vw -0.1vw gray;
  border: 0.1vw solid;
  border-color: silver #000 #000 silver;
  border-bottom: none;
  font-size: 0.8vw;
}

.tab-buttons button.active {
  background: #c0c0c0;
  box-shadow: inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw 0 gray;
  border-bottom: none;
}

.tab-content {
  display: none;
  background: #c0c0c0;
  border: 0.1vw solid #ccc;
  overflow-y: hidden;
  overflow-x: hidden;
  box-sizing: border-box;
}

.tab-content.active {
  display: block;
}
.pAdeblc-txeditor{
    left:0;
    width: 100% !important; 
    height: 93.1%;
    font-size: 1vw;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    outline: none;
    resize: none;
}
.pAdeblc-txeditor::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      border-bottom: 0.1vw solid rgb(56, 56, 56);
    }
.pAdeblc-txeditor-topbar{
    height: 2vw;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    padding: 0.35vw;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1.4vw;
    color: #000080;
    font-weight: bold;
    z-index: 10000;
    display: flex;
    align-items: center;
}
.pAdeblc-txeditor-bt {
    margin-left: 0.5vw;
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    height: 1.8vw;
    color: #000;
    background-color: #C0C0C0;
    padding: 0.4vw;
    cursor: pointer;
    border: 0.1vw solid #C0C0C0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.pAdeblc-dropdown {
  position: relative;
  display: inline-block;
}

.pAdeblc-dropdown-content {
    display: none;
    width: 7vw;
    position: absolute;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    z-index: 10;
    padding: 0.4vw;
    font-size: 1vw;
}

.pAdeblc-dropdown-content a {
  color: white;
  background-color: #C0C0C0;
  border: 0.1vw solid #C0C0C0;
  padding: 0.4vw 1.6vw;
  text-decoration: none;
  display: block;
}

.pAdeblc-dropdown-content a:hover {
    border: 0.1vw solid #fff;
    border-right-color:#fff;
    border-bottom-color:#fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
}

.pAdeblc-dropdown.show .pAdeblc-dropdown-content {
  display: block;
}
.pAdeblc-txeditor-bt:hover {
    border: 0.1vw solid #fff;
    border-right-color:#fff;
    border-bottom-color:#fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
} 
.pAdeblc-image {
  width: 1.5vw;
  height: 1.5vh;   
  image-rendering: pixelated;
   object-fit: contain;
}
`;
document.body.appendChild(style);
let current_tab = "LogOutput";
function bringToFront(windowElement) {
    const allWindows = document.querySelectorAll('.pAdeblc');
    let highestZIndex = 1;
    allWindows.forEach(window => {
        const zIndex = parseInt(window.style.zIndex, 10) || 1;
        if (zIndex > highestZIndex) {
            highestZIndex = zIndex;
        }
    });

    windowElement.style.zIndex = highestZIndex + 1;
}
let editor;

function loadAceScript(callback) {
    var script = document.createElement('script');
    script.src = '/src-noconflict/ace.js';
    script.onload = callback;
    document.body.appendChild(script);
    const script2 = document.createElement("script");
    script2.src = "/assets/js/FileSaver.js";
    document.body.appendChild(script2);
}

function CreateTextEditor() {
    const newWindow = document.createElement('div');
    newWindow.classList.add("pAdeblc");
    newWindow.id = "pAdeblc-txeditor-main";
    newWindow.innerHTML = `
        <div class="pAdeblc-top">
            <span class="title">
                <img src="/assets/img/win_icons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">
                JustStudy CE Text Editor
            </span>
            <button class="pAdeblc-bt" onclick="document.getElementById('pAdeblc-txeditor-main').style.display = 'none'; textwindow_open = false;">X</button>
        </div>
        <div class="pAdeblc-content-new" id="pAdeblc-content-new">
            <div class="pAdeblc-txeditor-topbar">
                <div class="pAdeblc-dropdown" id="fileselector">
                    <button class="pAdeblc-txeditor-bt" onclick="toggleDropdown(this.parentElement)">
                        <img src="/assets/img/win_icons/folder-edit.png" class="pAdeblc-image">File
                    </button>
                    <div class="pAdeblc-dropdown-content">
                        <a href="#" onclick="document.getElementById('fileInput').click()">Open</a>
                        <a href="#" onclick="saveFile()">Save</a>
                    </div>
                </div>
                <div class="pAdeblc-dropdown" id="editselector">
                    <button class="pAdeblc-txeditor-bt" onclick="toggleDropdown(this.parentElement)">
                        <img src="/assets/img/win_icons/texticon.png" class="pAdeblc-image">Edit
                    </button>
                    <div class="pAdeblc-dropdown-content">
                        <a href="#" onclick="findText()">Find</a>
                        <a href="#" onclick="findAndReplace()">Find & Replace</a>
                        <a href="#" onclick="copyText()">Copy</a>
                    </div>
                </div>
                <button class="pAdeblc-txeditor-bt" onclick="run(editor.getValue())">
                    <img src="/assets/img/win_icons/run.png" class="pAdeblc-image">Run
                </button>
            </div>
            <input type="file" id="fileInput" style="display: none;" onchange="handleFileSelect(event)"/>
            <div id="pAdeblc-txeditor" class="pAdeblc-txeditor"></div>
        </div>
    `;
    document.body.appendChild(newWindow);
    newWindow.style.display = "none";
    makeDraggable(newWindow);
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    editor = ace.edit("pAdeblc-txeditor");
    editor.setTheme("ace/theme/monokai"); 
    editor.session.setMode("ace/mode/javascript");
    editor.setValue("console.log('Hello World!'); // Press run to run the script and check the console!");
}

const consoleDiv = document.createElement('div');
consoleDiv.id = "pAdeblc";
consoleDiv.classList.add("pAdeblc");
consoleDiv.innerHTML = `
    <div class="pAdeblc-top">
        <span class="title"><img src="/assets/img/win_icons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">JustStudy CE Dev Console</span>
        <button class="pAdeblc-bt" onclick="document.getElementById('pAdeblc').style.display = 'none'; window_open = false;">X</button>
    </div>
    <div class="tabs">
        <div class="tab-buttons">
            <button data-tab="LogOutput" class="active" onclick="switchTab('LogOutput')">Console Output</button>
            <button data-tab="MainOutput" onclick="switchTab('MainOutput')">JustStudy Shell</button>
        </div>
        <div class="tab-contents">
            <div id="LogOutput" class="tab-content active">
                <div class="pAdeblc-content" id="pAdeblc-content-output"></div>
            </div>
            <div id="MainOutput" class="tab-content">
                <div class="pAdeblc-content" id="pAdeblc-content"></div>
            </div>
        </div>
    </div>

    <input class="pAdeblc-input" id="pAdeblc-input" type="text" />
`;
consoleDiv.style.display = "none";
document.body.appendChild(consoleDiv);
consoleDiv.addEventListener("click", () => bringToFront(consoleDiv));
logToConsole("JUSTSTUDY CONSOLE v1.0", "yellow");
let capturedLogs = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let window_open = false;
let textwindow_open = false;

// Make the console window draggable
function makeDraggable(element) {
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    if (element.querySelector('.pAdeblc-top')) {
        element.querySelector('.pAdeblc-top').onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        currentPosX = previousPosX - e.clientX;
        currentPosY = previousPosY - e.clientY;
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        element.style.top = (element.offsetTop - currentPosY) + 'px';
        element.style.left = (element.offsetLeft - currentPosX) + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function toggleDropdown(object) {
    const dropdown = object;
    // Toggle the visibility of the clicked dropdown
    dropdown.classList.toggle('show');

    // Hide all other dropdowns
    const dropdowns = document.querySelectorAll('.pAdeblc-dropdown');
    dropdowns.forEach(item => {
        // Ensure other dropdowns are hidden
        if (item !== dropdown) {
            item.classList.remove('show');
        }
    });
}
function switchTab(tabName) {
    const allTabs = document.querySelectorAll('.tab-content');
    const allButtons = document.querySelectorAll('.tab-buttons button');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    activeButton.classList.add('active');
    current_tab = tabName;
}
  
makeDraggable(document.querySelector('#pAdeblc'));
function logToConsole(message,text_colour) {
    let consoleDiv = null;
    if (current_tab == "LogOutput") {
        consoleDiv = document.getElementById('pAdeblc-content-output');
    } else {
        consoleDiv = document.getElementById('pAdeblc-content');
    }
    const newMessage = document.createElement('p');
    const newLine = document.createElement('br');
    newMessage.textContent = "C:\\User> " + message;
    newMessage.style.color = text_colour;
    consoleDiv.appendChild(newMessage);

    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}


document.addEventListener('keydown', e => {
    if (window_open && e.key === '`') {
        document.getElementById("pAdeblc").style.display = "none";
        window_open = false;
    } else if (e.key === '`') {
        document.getElementById("pAdeblc").style.display = "block";
        window_open = true;
    }
});

function isJavaScript(code) {
    try {
        new Function(code);
        const hasSyntax = /[{}();.=+\-*/]/.test(code);
        return hasSyntax;
    } catch (e) {
        return false;
    }
}

const pAdeblcinput = document.getElementById("pAdeblc-input");
pAdeblcinput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const inputValue = pAdeblcinput.value.trim();
        if (inputValue === 'jstm') {
            if (!textwindow_open) {
                document.getElementById("pAdeblc-txeditor-main").style.display = "block";
                textwindow_open = true;
            }
            logToConsole("New JustStudy CE Text Editor window opened.", "green");
        } else {
            if (isJavaScript(inputValue)) {
                run(inputValue);
            } else {
                logToConsole(inputValue, "white");
                if (inputValue === "files") {
                    logToConsole("All runnable files: ", "white");
                    logToConsole("-- alert.js", "blue");
                }
                if (inputValue.split(` `)[0] === "run") {
                    file("/assets/js/runnable/" + inputValue.split(` `)[1]);
                    logToConsole("Ran script: " + inputValue, "white");
                }
            }
        }
        pAdeblcinput.value = "";
    }
});
pAdeblcinput.addEventListener("keydown", (event) => {
    event.stopPropagation();
});


function saveFile() {
    CloseDropdowns();
    var content = editor.getValue();
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-8",
     });
    
     saveAs(blob, "script.js");
     
}

function handleFileSelect(event) {
    CloseDropdowns();
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.setValue(e.target.result);
        };
        reader.readAsText(file);
    }
}

function findText() {
    CloseDropdowns();
    const query = prompt("Enter text to find:");
    if (query) {
        const range = editor.find(query);
        if (range) {
            editor.scrollToLine(range.start.row, true, true, function () {});
        } else {
            alert('Text not found');
        }
    }
}

function findAndReplace() {
    CloseDropdowns();
    const query = prompt("Enter text to find:");
    const replacement = prompt("Enter replacement text:");
    if (query && replacement) {
        const range = editor.find(query);
        if (range) {
            editor.session.replace(range, replacement);
        } else {
            alert('Text not found');
        }
    }
}

function copyText() {
    CloseDropdowns();
    const selectedText = editor.getValue();
    if (selectedText) {
        navigator.clipboard.writeText(selectedText).then(() => {
            logToConsole("Copyed text", "green");
        });
    } else {
        logToConsole("No text to select", "green");
    }
}
loadAceScript(CreateTextEditor);

function run(string) {
    const script = document.createElement("script");
    script.textContent = string;
    document.body.appendChild(script);
    document.body.removeChild(script);
}
function CloseDropdowns() {
    const dropdowns = document.querySelectorAll('.pAdeblc-dropdown');
    dropdowns.forEach(element => {
        if (element.classList.contains('show')) {
            element.classList.remove('show');
        }
    });
}

function file(loc) {
    const script = document.createElement("script");
    script.src = loc;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

console.log = function (message) {
    logToConsole(message, "#31f10a");
    originalConsoleLog.apply(console, arguments);
};

console.warn = function (message) {
    logToConsole(message, "yellow");
    originalConsoleWarn.apply(console, arguments);
};

console.error = function (message) {
    logToConsole(message, "red");
    originalConsoleError.apply(console, arguments);
};

window.addEventListener('unhandledrejection', function (event) {
    logToConsole(`Unhandled Promise Rejection: ${event.reason}`, 'red');
    console.error(event.reason);
});

window.onerror = function (message, source, lineno, colno, error) {
    // Check if the error is a TypeError or any other uncaught error
    if (error instanceof TypeError) {
        logToConsole(`TypeError: ${message} at ${source}:${lineno}:${colno}`, 'red');
    } else {
        logToConsole(`Uncaught Error: ${message} at ${source}:${lineno}:${colno}`, 'red');
    }

    let stackInfo = '';
    if (error && error.stack) {
        stackInfo = extractStackInfo(error.stack);
        logToConsole(`Stack Trace: ${stackInfo}`, 'blue');
    }

    console.error(error);
    return true; // Prevent the default browser error handling
};


window.addEventListener('error', function (event) {
    if (event.target && event.target.src) {
        logToConsole(`Resource Load Error: ${event.target.src}`, 'orange');
    } else {
        logToConsole(`General Error: ${event.message}`, 'orange');
    }
}, true);

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    try {
        const response = await originalFetch(...args);
        if (!response.ok) {
            logToConsole(`Fetch Error: ${response.status} - ${response.statusText} (URL: ${args[0]})`, 'red');
        }
        return response;
    } catch (error) {
        logToConsole(`Fetch Failed: ${error.message} (URL: ${args[0]})`, 'red');
        console.error(error);
        throw error;
    }
};

window.addEventListener('storage', function (event) {
    logToConsole(`Storage Event: ${event.key} changed`, 'yellow');
});

window.addEventListener('blocked', function (event) {
    logToConsole(`Blocked by Tracking Prevention: ${event.message}`, 'yellow');
});
window.addEventListener('unhandledrejection', function (event) {
    logToConsole(`Unhandled Promise Rejection: ${event.reason}`, 'red');
    console.error(event.reason);
}, true);
function extractStackInfo(stack) {
    const stackLines = stack.split('\n');
    for (let i = 0; i < stackLines.length; i++) {
        const match = stackLines[i].match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
        if (match) {
            return `in ${match[2]} at ${match[3]}:${match[4]}`;
        }
    }
    return 'No stack trace available';
}