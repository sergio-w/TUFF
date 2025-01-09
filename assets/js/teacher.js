const style = document.createElement('style');
style.innerHTML = `
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

'pAdeblc-content::-webkit-scrollbar-thumb:hover,.pAdeblc-txeditor::-webkit-scrollbar-thumb:hover {
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
  color: black;
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
let current_tab = "MainOutput";
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
function hoverBtIn(element) {
    element.style.borderRightColor = "#fff";
    element.style.borderBottomColor = "#fff";
    element.style.borderTopColor = "rgb(56, 56, 56)";
    element.style.borderLeftColor = "rgb(56, 56, 56)";
}

function hoverBtOut(element) {
    element.style.borderRightColor = "rgb(56, 56, 56)";
    element.style.borderBottomColor = "rgb(56, 56, 56)";
    element.style.borderTopColor = "#fff";
    element.style.borderLeftColor = "#fff";
}
function hoverTabBtIn(element) {
    if (element.tagName === 'BUTTON') {
        element.style.padding = '0.5vw 3vw';
        element.style.cursor = 'pointer';
        element.style.background = 'rgb(158, 158, 158)';
        element.style.boxShadow = 'inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw -0.1vw gray';
        element.style.border = '0.1vw solid';
        element.style.borderColor = 'silver #000 #000 silver';
        element.style.borderBottom = 'none';
        element.style.fontSize = '0.8vw';
    }
}

function hoverTabBtOut(element) {
    if (element.tagName === 'BUTTON') {
        element.style.background = '#c0c0c0';
        element.style.boxShadow = 'inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw 0 gray';
        element.style.borderBottom = 'none';
    }
}

let editor;

function loadAceScript(callback) {
    var script = document.createElement('script');
    script.src = '/assets/src-noconflict/ace.js';
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
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 50vw; height: 34vw; background: #c0c0c0; border: 0.15vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";
    newWindow.innerHTML = `
        <div id="pAdeblc-top-txeditor" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin-left: 0.5vw;">
                <img src="/assets/img/win_icons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">
                JustStudy CE Text Editor
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-txeditor-main').style.display = 'none'; textwindow_open = false;">X</button>
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
            <input type="file" id="CookieInput" style="display: none;" onchange="handleCookieData(event)"/>
            <div id="pAdeblc-txeditor" class="pAdeblc-txeditor"></div>
        </div>
    `;
    document.body.appendChild(newWindow);
    newWindow.style.display = "none";
    makeDraggable(newWindow);
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    bringToFront(newWindow);
    editor = ace.edit("pAdeblc-txeditor");
    editor.setTheme("ace/theme/monokai"); 
    editor.session.setMode("ace/mode/javascript");
    editor.setValue("console.log('Hello World!'); // Press run to run the script and check the console!");
}

const consoleDiv = document.createElement('div');
consoleDiv.id = "pAdeblc";
consoleDiv.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 50vw; height: 32vw; background: #c0c0c0; border: 0.15vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";
consoleDiv.innerHTML = `
    <div id="pAdeblc-top" style="cursor: move; text-align: left; height: 1.8vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
        <span style="margin-left: 0.5vw;"><img src="/assets/img/win_icons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">JustStudy CE Dev Console</span>
        <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc').style.display = 'none'; window_open = false;">X</button>
    </div>
    <div style="font-family: Arial, sans-serif; overflow-y: hidden; width: 100%; height: 85%;">
        <div class="tab-list">
            <button data-tab="LogOutputTab" id="TabBT" onclick="switchTab('LogOutput')" style="padding: 0.5vw 3vw; cursor: pointer; background: rgb(158, 158, 158); box-shadow: inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw -0.1vw gray; border: 0.1vw solid; border-color: silver #000 #000 silver; border-bottom: none; font-size: 0.8vw;
">Console Output</button>
            <button data-tab="MainOutputTab" id="TabBT" onclick="switchTab('MainOutput')" style="padding: 0.5vw 3vw; cursor: pointer; background: rgb(158, 158, 158); box-shadow: inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw -0.1vw gray; border: 0.1vw solid; border-color: silver #000 #000 silver; border-bottom: none; font-size: 0.8vw;
">JustStudy Shell</button>
        </div>
        <div class="tab-contents">
            <div id="TabContent" class="pAdeblc-content no-style" data-tab="LogOutput" style="display: none; background: #c0c0c0; border: 0.1vw solid #ccc; overflow-y: hidden; overflow-x: hidden; box-sizing: border-box;">
                <div style="background: rgb(32, 32, 70); color: #ffffff; height: 25.2vw; font-family: 'MS Sans Serif', sans-serif !important; font-size: 1vw !important; overflow-y: scroll; overflow-wrap: break-word; outline: 0;" id="pAdeblc-content-output"></div>
            </div>
            <div id="TabContent" class="pAdeblc-content no-style" data-tab="MainOutput" style="display: none; background: #c0c0c0; border: 0.1vw solid #ccc; overflow-y: hidden; overflow-x: hidden; box-sizing: border-box;">
                <div style="background: rgb(32, 32, 70); color: #ffffff; height: 25.2vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1vw; overflow-y: scroll; overflow-wrap: break-word; outline: 0;
" id="pAdeblc-content" ></div>
            </div>
        </div>
    </div>

    <input style="display: block; font-family: 'MS Sans Serif', sans-serif; top: 94%; left: 0; font-size: 1vw; width: 100% !important; height: 5%; background-color: #white; border: 0.2vw solid #c0c0c0; border-right-color:c0c0c0#fff; border-bottom-color: #fff; border-top-color: rgb(56, 56, 56); border-left-color: rgb(56, 56, 56); outline: none; box-sizing: border-box; position: absolute;"
id="pAdeblc-input" type="text" />
`;
consoleDiv.style.display = "none";
document.body.appendChild(consoleDiv);
consoleDiv.addEventListener("click", () => bringToFront(consoleDiv));
logToConsole("JUSTSTUDY CONSOLE v1.0", "yellow",true);
let capturedLogs = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let window_open = false;
let textwindow_open = false;
switchTab("LogOutput");
function makeDraggable(element) {
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    if (element.querySelector('#pAdeblc-top') || element.querySelector('#pAdeblc-top-txeditor')) {
       if (element.querySelector('#pAdeblc-top')) {
        element.querySelector('#pAdeblc-top').onmousedown = dragMouseDown;
       } else {
        element.querySelector('#pAdeblc-top-txeditor').onmousedown = dragMouseDown;
       }
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
    dropdown.classList.toggle('show');
    const dropdowns = document.querySelectorAll('.pAdeblc-dropdown');
    dropdowns.forEach(item => {
        if (item !== dropdown) {
            item.classList.remove('show');
        }
    });
}
function switchTab(tabName) {
    if (tabName != current_tab) {
        const allTabs = document.querySelectorAll(`#TabContent`);
        const allButtons = document.querySelectorAll('#TabBT');
        allTabs.forEach(tab => {
            tab.style = "display: none;";
        });
        allButtons.forEach(button => {
            hoverTabBtIn(button);
        });
        document.querySelector(`[data-tab="${tabName}"]`).style = "display: block;"
        const activeButton = document.querySelector(`[data-tab="${tabName}Tab"]`);
        hoverTabBtOut(activeButton);
        current_tab = tabName;   
    }
}
  
makeDraggable(document.querySelector('#pAdeblc'));
function logToConsole(message,text_colour,log) {
    let consoleDiv = null;
    if (log) {
        consoleDiv = document.getElementById('pAdeblc-content-output');
    } else {
        consoleDiv = document.getElementById(`pAdeblc-content`);
    }
    const newMessage = document.createElement('p');
    const newLine = document.createElement('br');
    newMessage.textContent = "C:\\User> " + message;
    newMessage.style.color = text_colour;
    consoleDiv.appendChild(newMessage);
    if (!log){
        consoleDiv = document.getElementById('pAdeblc-content-output');
        const newMessage = document.createElement('p');
        const newLine = document.createElement('br');
        newMessage.textContent = "C:\\User> " + message;
        newMessage.style.color = text_colour;
        consoleDiv.appendChild(newMessage);
    }

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
        logToConsole(inputValue, "wheat");
        if (inputValue.toLowerCase() === "savecookies") {
            saveCookies();
        } else if (inputValue.toLowerCase() === "loadcookies") {
            document.getElementById('CookieInput').click()
        } else if (inputValue === "help") {
            logToConsole("Available commands:", "white");
            logToConsole("help - Display available commands", "white");
            logToConsole("clear - Clear console", "white");
            logToConsole("files - Display all premade runnable files", "white");
            logToConsole("jstm - Open Text Editor", "white");
            logToConsole("savecookies - Saves your cookie data into a json file", "white");
            logToConsole("loadcookies - Imports cookie data from the json file you saved", "white");
        } else if (inputValue === "clear") {
            if (current_tab == "LogOutput") {
                document.getElementById("pAdeblc-content-output").innerHTML = "";   
            } else {
                document.getElementById("pAdeblc-content").innerHTML = ""; 
            }
        } else if (inputValue === 'jstm') {
            if (!textwindow_open) {
                document.getElementById("pAdeblc-txeditor-main").style.display = "block";
                textwindow_open = true;
            }
            logToConsole("New JustStudy CE Text Editor window opened.", "green");
        } else {
            if (isJavaScript(inputValue)) {
                run(inputValue);
            } else {
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
function saveCookies() {
    CloseDropdowns();

    const allData = {
        cookies: document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {}),
        localStorage: Object.entries(localStorage).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {}),
        sessionStorage: Object.entries(sessionStorage).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {}),
    };

    const content = JSON.stringify(allData, null, 2);

    const blob = new Blob([content], {
        type: "application/json;charset=utf-8",
    });
    saveAs(blob, "cookies.json");
}

function handleCookieData(event) {
    CloseDropdowns();
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                let data = JSON.parse(e.target.result);
                console.log(e.target.result);
                const cookies = data.cookies;
                Object.entries(cookies).forEach(([key, value]) => {
                    document.cookie = `${key}=${value}; path=/`;
                });
                const local = data.localStorage;
                Object.entries(local).forEach(([key, value]) => {
                    localStorage.setItem(key, value);
                });
                const session = data.sessionStorage;
                Object.entries(session).forEach(([key, value]) => {
                    sessionStorage.setItem(key, value);
                });

                console.log("Cookies, localStorage, and sessionStorage loaded successfully!");
            } catch (err) {
                console.error("Failed to load data:", err);
            }
        };
        reader.readAsText(file);
    }
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
    logToConsole(message, "#31f10a",true);
    originalConsoleLog.apply(console, arguments);
};

console.warn = function (message) {
    logToConsole(message, "yellow",true);
    originalConsoleWarn.apply(console, arguments);
};

console.error = function (message) {
    logToConsole(message, "red",true);
    originalConsoleError.apply(console, arguments);
};

window.addEventListener('unhandledrejection', function (event) {
    logToConsole(`Unhandled Promise Rejection: ${event.reason}`, 'red',true);
    console.error(event.reason);
});

window.onerror = function (message, source, lineno, colno, error) {
    if (error instanceof TypeError) {
        logToConsole(`TypeError: ${message} at ${source}:${lineno}:${colno}`, 'red',true);
    } else {
        logToConsole(`Uncaught Error: ${message} at ${source}:${lineno}:${colno}`, 'red',true);
    }

    let stackInfo = '';
    if (error && error.stack) {
        stackInfo = extractStackInfo(error.stack);
        logToConsole(`Stack Trace: ${stackInfo}`, 'white',true);
    }

    console.error(error);
    return true;
};


window.addEventListener('error', function (event) {
    if (event.target && event.target.src) {
        logToConsole(`Resource Load Error: ${event.target.src}`, 'orange',true);
    } else {
        logToConsole(`General Error: ${event.message}`, 'orange',true);
    }
}, true);

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    try {
        const response = await originalFetch(...args);
        if (!response.ok) {
            logToConsole(`Fetch Error: ${response.status} - ${response.statusText} (URL: ${args[0]})`, 'red',true);
        }
        return response;
    } catch (error) {
        logToConsole(`Fetch Failed: ${error.message} (URL: ${args[0]})`, 'red',true);
        console.error(error);
        throw error;
    }
};

window.addEventListener('storage', function (event) {
    logToConsole(`Storage Event: ${event.key} changed`, 'orange',true);
});

window.addEventListener('blocked', function (event) {
    logToConsole(`Blocked by Tracking Prevention: ${event.message}`, 'orange',true);
});
window.addEventListener('unhandledrejection', function (event) {
    logToConsole(`Unhandled Promise Rejection: ${event.reason}`, 'red',true);
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