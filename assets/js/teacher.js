const pAdeblcstyle = document.createElement('style');
pAdeblcstyle.innerHTML = `
.pAdeblc-content-new {
    background: silver;
    color: #ffffff;
    height: 33.5vw;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1vw;
    overflow: hidden;
    outline: 0;
}
.cewlborder-in {
    border: 0.15vw solid #fff;
    border-right: 0.1vw solid #fff;
    border-bottom: 0.1vw solid #fff;
    border-top: 0.15vw solid rgb(56, 56, 56);
    border-left: 0.15vw solid rgb(56, 56, 56);
}

.cewlborder-out{
    border: 0.2vw solid #fff;
    border-right-color:rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    border-left-color: #fff;
}
.pAdeblc-cool-scroll::-webkit-scrollbar {
    width: 1.6vw;
    height: 1.6vw;
}

.pAdeblc-cool-scroll::-webkit-scrollbar-track {
    image-rendering: optimizeSpeed;
    image-rendering: pixelated;
    image-rendering: optimize-contrast;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAyIDIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyI+CjxtZXRhZGF0YT5NYWRlIHdpdGggUGl4ZWxzIHRvIFN2ZyBodHRwczovL2NvZGVwZW4uaW8vc2hzaGF3L3Blbi9YYnh2Tmo8L21ldGFkYXRhPgo8cGF0aCBzdHJva2U9IiNjMGMwYzAiIGQ9Ik0wIDBoMU0xIDFoMSIgLz4KPC9zdmc+");
    background-position: 0 0;
    background-repeat: repeat;
    background-size: 0.05vw;
}

.pAdeblc-cool-scroll::-webkit-scrollbar-thumb {
    width: 1.6vw;
    height: 1.6vw;
    background: silver;
    box-shadow: inset 0.0625vw 0.0625vw #dfdfdf, inset -0.0625vw -0.0625vw gray;
    border: 0.0625vw solid;
    border-color: silver #000 #000 silver;
}

.pAdeblc-cool-scroll::-webkit-scrollbar-thumb:hover {
    background: #606060;
}

.pAdeblc-cool-scroll::-webkit-scrollbar-corner {
    background:rgba(192, 192, 192, 0);
}

.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:vertical:decrement,
.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:vertical:increment,
.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:horizontal:decrement,
.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:horizontal:increment {
    background-color: silver;
    width: 2vw;  
    height: 1.5vw; 
    border: 0.2vw solid #fff;
    border-right-color:rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    border-left-color: #fff;
}

.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YXRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTcgNWgxTTYgNmgzTTUgN2g1TTQgOGg3IiAvPgo8L3N2Zz4=");
}

.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YXRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTQgNWg3TTUgNmg1TTYgN2gzTTcgOGgxIiAvPgo8L3N2Zz4=");
}

.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:horizontal:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YXRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTggM2gxTTcgNGgyTTYgNWgzTTUgNmg0TTYgN2gzTTcgOGgyTTggOWgxIiAvPgo8L3N2Zz4=");
}

.pAdeblc-cool-scroll::-webkit-scrollbar-button:single-button:horizontal:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YXRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTYgM2gxTTYgNGgyTTYgNWgzTTYgNmg0TTYgN2gzTTYgOGgyTTYgOWgxIiAvPgo8L3N2Zz4=");
}

.resizer {
    background: #fff;
    z-index: 1;
    
}
.resizer.vertical {
    width: 0.2vw;
    height: 10vw;
    background: #333;
    cursor: ns-resize;
    border: 0.1vw solid #fff;
    border-right-color:rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    border-left-color: #fff;
}
.pAdeblc-filesystem-bt:hover {
    border: 0.1vw solid #fff;
    border-right-color:#fff;
    border-bottom-color:#fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
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
  padding: 0.5vw 0.6vw;
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

.tx-editor-tabs-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0vw;
    height: 3vw;
    max-height: 3vw;
    background-color: #A0A0A0;
    border: 0.1vw solid #fff;
    border-top-color: #fff;
    border-left-color: #fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    padding: 0 0.5vw;
    outline: none;
    cursor: default;
    overflow-x: scroll;
    scrollbar-width: thin;
    overflow-y : hidden;
}

.tx-editor-tab {
    padding: 0.3vw 1vw;
    font-size: 1.2vw;
    background-color: #D0D0D0;
    border: 0.1vw solid #808080;
    margin-right: 0.5vw;
    user-select: none;
    position: relative;
    width: auto;
    max-height: 2.5vw;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    outline: none;
    cursor: pointer;
}

.tx-editor-tab.active {
    color: white;
    border-top-color:rgb(56, 56, 56);
    border-left-color:rgb(56, 56, 56);
    border-right-color: #fff;
    border-bottom-color: #fff;
}

.tx-editor-tab-name {
    background-color: transparent;
    border: none;
    outline: none;
    color: black;
    font-weight: bold;
    text-overflow: ellipsis;
    width: 10vw;
    font-size: 0.8vw;
    white-space: nowrap;
    cursor: pointer;
}
.tx-editor-tab-name:hover {
    cursor: text;
}
.tx-editor-tab-name.active {
    color: white;
}

.tx-editor-tab-content {
    display: none;
    height: 29.4vw;
    background-color: #D0D0D0;
    border: 0.1vw solid #808080;
}

.tx-editor-tab-content.active {
    display: block;
    bottom: 5vw;
}

.tx-editor-tabs-actions {
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
}

.tx-editor-add-tab-btn {
    background-color: #4D4D4D;
    color: white;
    border: 0.2vw solid #808080;
    height: 2vw;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 2vw;
    font-size: 1.4vw;
    cursor: pointer;
    padding: 0;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    outline: none;
}

.tx-editor-add-tab-btn:hover {
    background-color: #000080;
}

.tx-editor-close-tab-btn {
    background-color: #A0A0A0;
    color: black;
    border: 1px solid #808080;
    position: absolute;
    top: 0.3vw;
    right: 0.5vw;
    font-size: 1.2vw;
    padding: 0;
    width: 1.4vw;
    height: 1.4vw;
    background-color: #C0C0C0;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    outline: none;
    cursor: pointer;
}

.tx-editor-close-tab-btn:hover {
    background-color: #FF0000;
    color: white;
}
.ace_editor{
    highlight: none !important;
}
`;
document.body.appendChild(pAdeblcstyle);
let current_tab = "MainOutput";
let current_txeditor_tab = null;
function waitForElement(selector, callback, interval = 100) {
    const checkExist = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(checkExist);
            callback(element);
        }
    }, interval);
}

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
    script.onload = () => {
        const autocomplete = document.createElement("script");
        autocomplete.src = "/assets/src-noconflict/ext-language_tools.js";
        autocomplete.onload = () => {
            const script2 = document.createElement("script");
            script2.src = "/assets/js/FileSaver.js";
            script2.onload = callback;
            document.body.appendChild(script2);
            script2.onload = () => {
                const script3 = document.createElement("script");
                script3.src = "/assets/src-noconflict/ext-searchbox.js";
                script3.onload = callback;
                document.body.appendChild(script3);
                script3.onload = () => {
                    const script4 = document.createElement("script");
                    script4.src = "/assets/src-noconflict/ext-settings_menu.js";
                    console.log("worked? 4")
                    script4.onload = callback;
                    document.body.appendChild(script4);
                }
            }
        };
        document.body.appendChild(autocomplete);
    };
    document.body.appendChild(script);
}

let editors = [];
let currenteditor = null;
let txEditorTabCount = 0;
let draggedTxEditorTab = null;
let global_tabcontainer = null;
let global_tabbt = null;
let total_tab = 0;

const filesystemjs = document.createElement("script");
filesystemjs.src = "/assets/js/teacherfilesystem.js";
document.body.appendChild(filesystemjs);

const filepickerjs = document.createElement("script");
filepickerjs.src = "/assets/js/teacherfilepicker.js";
document.body.appendChild(filepickerjs);

function createUniqueTabId(baseName, editors) {
    let tabId = baseName;
    let counter = 1;

    const existingIds = Object.keys(editors);

    while (existingIds.includes(tabId)) {
        tabId = `${baseName}_${counter}`;
        counter++;
    }

    return tabId;
}
function HandleEditorZoom(level, isadd) {
    level = parseFloat(level);
    if (currenteditor) {
        if (isadd) {
            currenteditor.setFontSize(currenteditor.getFontSize() + level);
            document.getElementById('pAdeblc-txeditor-zoom').value = currenteditor.getFontSize();
        } else {
            if (!isNaN(level) && level > 0) {
                currenteditor.setFontSize(level);
            }
        }
    }
}
function setTheme(theme) {
    if (currenteditor) {
        currenteditor.setTheme(`ace/theme/${theme}`);
    }
}

function setSyntax(type) {
    const syntax = type;
    if (syntax && currenteditor) {
        currenteditor.getSession().setMode(`ace/mode/${syntax}`);
    }
}

function toggleWordWrap() {
    if (currenteditor) {
        const wrap = currenteditor.getSession().getUseWrapMode();
        currenteditor.getSession().setUseWrapMode(!wrap);
        document.getElementById('wordwrap').textContent = "Word Wrap" + (currenteditor.getSession().getUseWrapMode() ? " ✔" : " ✖");
    }
}

function createNewTxEditorTab(name, code, tabbt, tabcontainer, syntaxtype) {
    let tabnumber = 0;
    total_tab += 1;
    if (txEditorTabCount <= 20) {
        const baseName = `txEditorTab${total_tab}`;
        const tabId = createUniqueTabId(baseName, editors);

        const newTab = document.createElement('div');
        newTab.classList.add('tx-editor-tab');
        newTab.setAttribute('data-target', tabId);
        current_txeditor_tab = tabId;
        if (name == null) {
            newTab.innerHTML = `
            <input type="text" class="tx-editor-tab-name" id="${tabId}_name" value="Untitled tab ${total_tab}">
            <button class="tx-editor-close-tab-btn" ">X</button>
        `;
        } else {
            newTab.innerHTML = `
            <input type="text" class="tx-editor-tab-name" id="${tabId}_name" value="${name}">
            <button class="tx-editor-close-tab-btn"">X</button>
        `;
        }
        newTab.setAttribute('draggable', 'true');

        const newContent = document.createElement('div');
        newContent.classList.add('tx-editor-tab-content');
        newContent.setAttribute('id', tabId);
        newContent.innerHTML = `<div id="editor-${tabId}" class="pAdeblc-txeditor"></div>`;
        tabcontainer.insertBefore(newTab, tabbt);
        document.getElementById('txEditorTabContainer').appendChild(newContent);
        const editor = ace.edit(`editor-${tabId}`);
        editor.setTheme("ace/theme/idle_fingers");
        editor.setOption("enableBasicAutocompletion", true);
        editor.setOption("enableLiveAutocompletion", true);
        editor.setOption("enableSnippets", true);
        editor.setOption("cursorStyle", "smooth");
        editor.setKeyboardHandler("ace/keyboard/vscode");
        editor.execCommand("trimTrailingSpace");
        editor.setShowPrintMargin(false);
        editor.textInput.getElement().addEventListener('keydown', (event) => {
            event.stopPropagation();
        });
        if (syntaxtype) {
            editor.session.setMode(`ace/mode/${syntaxtype}`);
        } else {
            editor.session.setMode("ace/mode/javascript");
        }
        if (code != null) {
            editor.setValue(code);
        }
        editor.setFontSize(20);
        editors[tabId] = editor;
        let id = Object.keys(editors);
        newTab.addEventListener('click', (e) => {
            switchTxEditorTab(e, id, false);
        });
        document.getElementById(tabId + "_name").addEventListener("keydown", (key) => {
            if (key.key == "enter") {
                const file_types_clean = {
                    "html": "html",
                    "css": "css",
                    "js": "javascript",
                    "json": "json",
                    "txt": "plain",
                }
                const file_extension = file_types_clean[target.dataset.name.split('.').pop()];
                if (syntaxtype) {
                    editors[`editor-${tabId}`].session.setMode(`ace/mode/${syntaxtype}`);
                } else {
                    editors[`editor-${tabId}`].session.setMode("ace/mode/javascript");
                }
            }
        });

        const closeButton = newTab.querySelector('.tx-editor-close-tab-btn');
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closeTxEditorTab(event);
        });
        try {
            switchTxEditorTab(null, id[id.length - 1], false);
        } catch (e) {
            console.error("No valid editor or ID array found.");
        }
    } else {
        console.warn("Can't make more tabs!");
    }
}
function openBackgroundDropdown(id) {
    const alldropdowns = document.querySelectorAll(".pAdeblc-dropdown-content-extra");
    alldropdowns.forEach((dropdown) => {
        if (dropdown !== document.getElementById(id)) {
            dropdown.style.display = 'none';
        };
    });
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}
function CreateTextEditor() {
    const newWindow = document.createElement('div');
    newWindow.classList.add("pAdeblc");
    newWindow.classList.add(".pAdeblc-main")
    newWindow.id = "pAdeblc-txeditor-main";
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 56vw; height: 36vw; background: #c0c0c0; border: 0.2vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: content-box;";
    newWindow.innerHTML = `
        <div id="pAdeblc-top" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin-left: 0.5vw;">
                <img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">
                JustStudy CE Text Editor
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-txeditor-main').style.display = 'none'; textwindow_open = false;">X</button>
        </div>
        <div class="pAdeblc-content-new" id="pAdeblc-content-new">
            <div class="pAdeblc-txeditor-topbar">
                <div class="pAdeblc-dropdown" id="fileselector">
                    <button class="pAdeblc-txeditor-bt" onclick="toggleDropdown(this.parentElement)">
                        <img src="/assets/img/winicons/folder-edit.png" class="pAdeblc-image">File
                    </button>
                    <div class="pAdeblc-dropdown-content">
                        <a href="#" onclick="document.getElementById('fileInput').click()">Open</a>
                        <a href="#" onclick="saveFile()">Save</a>
                        <a href="#" onclick="saveLocalFile()">Save to Local</a>
                        <a href="#" onclick="openLocalFile()">Open Local</a>
                    </div>
                </div>
                <div class="pAdeblc-dropdown" id="customizeselector">
                <button class="pAdeblc-txeditor-bt" onclick="toggleDropdown(this.parentElement)">
                    <img src="/assets/img/winicons/texticon.png" class="pAdeblc-image">Customize
                </button>
                <div class="pAdeblc-dropdown-content" style="width: 9vw;">
                    <a href="#" onclick="openBackgroundDropdown('txbackgroundDropdown')">Background</a>
                    <div id="txbackgroundDropdown" class="pAdeblc-dropdown-content pAdeblc-dropdown-content-extra" style="display: none; position: absolute; left: 100%; top: 0;">
                        <a href="#" onclick="setTheme('monokai')">Monokai</a>
                        <a href="#" onclick="setTheme('github')">GitHub</a>
                        <a href="#" onclick="setTheme('dracula')">Dracula</a>
                        <a href="#" onclick="setTheme('eclipse')">Eclipse</a>
                        <a href="#" onclick="setTheme('idle_fingers')">Idle Fingers</a>
                    </div>
                    <a href="#" onclick="openBackgroundDropdown('txsyntaxDropdown')">Syntax Type</a>
                    <div id="txsyntaxDropdown" class="pAdeblc-dropdown-content pAdeblc-dropdown-content-extra" style="display: none; position: absolute; left: 100%; top: 0;">
                        <a href="#" onclick="setSyntax('html')">HTML</a>
                        <a href="#" onclick="setSyntax('javascript')">JavaScript</a>
                        <a href="#" onclick="setSyntax('json')">JSON</a>
                        <a href="#" onclick="setSyntax('text')">Plain</a>
                    </div>
                    <a href="#" onclick="toggleWordWrap()" id="wordwrap">Word Wrap ✖</a>
                </div>
            </div>
                <button class="pAdeblc-txeditor-bt" onclick="run()">
                    <img src="/assets/img/winicons/run.png" class="pAdeblc-image">Run
                </button>
                <button class="pAdeblc-txeditor-bt" onclick="runall()">
                    <img src="/assets/img/winicons/run.png" class="pAdeblc-image">Run All
                </button>
                <button class="tx-editor-add-tab-btn" style="margin-left: 0.5vw; margin-right: 0.5vw;" onclick="HandleEditorZoom(-1,true)">
                    -
                </button>
                <input id="pAdeblc-txeditor-zoom" class="cewlborder-in" style="margin-right: 0.5vw; width: 3vw; height: 1.5vw; font-size: 1vw; outline: none;" value="20"></input>
                <button class="tx-editor-add-tab-btn" style="margin-right: 0.5vw;" onclick="HandleEditorZoom(1,true)">
                    +
                </button>
            </div>
            <input type="file" id="fileInput" style="display: none;" onchange="handleFileSelect(event)"/>
            <input type="file" id="CookieInput" style="display: none;" onchange="handleCookieData(event)"/>
            <div id="txEditorTabContainer">
                <div class="tx-editor-tabs-container" id="txEditorTabs">
                    <button class="tx-editor-add-tab-btn" id="txEditorAddTabBtn">+</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(newWindow);
    const zoominput = document.getElementById("pAdeblc-txeditor-zoom");
    zoominput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            HandleEditorZoom(zoominput.value, false);
        }
    });
    global_tabcontainer = document.getElementById('txEditorTabs');
    global_tabbt = document.getElementById('txEditorAddTabBtn');
    document.getElementById('txEditorAddTabBtn').addEventListener('click', (event) => {
        event.stopPropagation();
        createNewTxEditorTab(null, null, global_tabbt, global_tabcontainer);
        txEditorTabCount += 1;
        const container = document.getElementById('txEditorTabs');
        container.scrollLeft = container.scrollWidth;

    });
    newWindow.style.display = "none";
    makeDraggable(newWindow);
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    bringToFront(newWindow);
    global_tabcontainer.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('tx-editor-tab') || event.target.classList.contains('tx-editor-tab-name')) {
            draggedTxEditorTab = event.target.closest('.tx-editor-tab');
            setTimeout(() => draggedTxEditorTab.style.display = 'none', 0);
        }
    });

    global_tabcontainer.addEventListener('dragend', (event) => {
        setTimeout(() => {
            draggedTxEditorTab.style.display = 'block';
            draggedTxEditorTab = null;
        }, 0);
    });

    global_tabcontainer.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    global_tabcontainer.addEventListener('dragenter', (event) => {
        if (event.target.classList.contains('tx-editor-tab') || event.target.classList.contains('tx-editor-tab-name')) {
            event.target.closest('.tx-editor-tab').style.borderBottom = '0.1vw solid rgb(255, 211, 17)';
        }
    });

    global_tabcontainer.addEventListener('dragleave', (event) => {
        if (event.target.classList.contains('tx-editor-tab') || event.target.classList.contains('tx-editor-tab-name')) {
            event.target.closest('.tx-editor-tab').style.borderBottom = '0.1vw solid rgb(51, 51, 51)';
        }
    });

    global_tabcontainer.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('tx-editor-tab') || event.target.classList.contains('tx-editor-tab-name')) {
            event.target.closest('.tx-editor-tab').style.borderBottom = '0.1vw solid rgb(51, 51, 51)';
            global_tabcontainer.insertBefore(draggedTxEditorTab, event.target.closest('.tx-editor-tab'));
            reorderEditors();
        }
    });

}


function closeTxEditorTab(event) {
    if (txEditorTabCount <= 1) {
        console.warn("Cant close more tabs");
        return;
    }
    const selectedTab = event.target.closest('.tx-editor-tab');
    if (selectedTab) {
        const targetId = selectedTab.getAttribute('data-target');
        delete editors[targetId];
        txEditorTabCount -= 1;

        selectedTab.remove();
        switchTxEditorTab(null, null, true);

    }
    event.stopPropagation();
}
function reorderEditors() {
    let tabOrder = [];
    document.querySelectorAll('.tx-editor-tab').forEach(tab => {
        let tabId = tab.getAttribute('data-target');
        tabOrder.push(tabId);
    });
    const reorderedEditors = {};
    tabOrder.forEach(tabId => {
        if (editors[tabId]) {
            reorderedEditors[tabId] = editors[tabId];
        }
    });
    editors = reorderedEditors;
}
function switchTxEditorTab(event, tabId, closingtab) {
    let selectedTab;
    if (closingtab) {
        const id = Object.keys(editors);
        if (id.length > 0) {
            selectedTab = document.querySelector(`.tx-editor-tab[data-target="${id[id.length - 1]}"]`);
        } else {
            console.warn("No tabs to switch to");
            return;
        }
    }
    else if (event) {
        selectedTab = event.target.closest('.tx-editor-tab');
    }
    else if (tabId) {
        selectedTab = document.querySelector(`.tx-editor-tab[data-target="${tabId}"]`);
    }
    if (selectedTab) {

        document.querySelectorAll('.tx-editor-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tx-editor-tab-content').forEach(content => content.classList.remove('active'));
        selectedTab.classList.add('active');
        const targetId = selectedTab.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.classList.add('active');
        } else {
            console.error(`Element with id ${targetId} not found.`);
        }
        const editor = editors[targetId];
        currenteditor = editor;
        document.getElementById('pAdeblc-txeditor-zoom').value = currenteditor.getFontSize();

    } else {
        console.error("Selected tab not found.");
    }
}

const consoleDiv = document.createElement('div');
consoleDiv.id = "pAdeblc";
consoleDiv.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 50vw; height: 32vw; background: #c0c0c0; border: 0.15vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";
consoleDiv.innerHTML = `
    <div id="pAdeblc-top" style="cursor: move; text-align: left; height: 1.8vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
        <span style="margin-left: 0.5vw;"><img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">JustStudy CE Dev Console</span>
        <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc').style.display = 'none'; window_open = false;">X</button>
    </div>
    <div style="font-family: Arial, sans-serif; overflow-y: hidden; width: 100%; height: 85%;">
        <div class="tab-list">
            <button data-tab="LogOutputTab" id="TabBT" onclick="switchTab('LogOutput')" style="padding: 0.5vw 3vw; cursor: pointer; background: rgb(158, 158, 158); box-shadow: inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw -0.1vw gray; border: 0.1vw solid; border-color: silver #000 #000 silver; border-bottom: none; font-size: 0.8vw;
">Console Output</button>
            <button data-tab="MainOutputTab" id="TabBT" onclick="switchTab('MainOutput')" style="padding: 0.5vw 3vw; cursor: pointer; background: rgb(158, 158, 158); box-shadow: inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw -0.1vw gray; border: 0.1vw solid; border-color: silver #000 #000 silver; border-bottom: none; font-size: 0.8vw;
">JustStudy Shell</button>
            <button data-tab="NetworkOutputTab" id="TabBT" onclick="switchTab('NetworkOutput')" style="padding: 0.5vw 3vw; cursor: pointer; background: rgb(158, 158, 158); box-shadow: inset 0.1vw 0.1vw #dfdfdf, inset -0.1vw -0.1vw gray; border: 0.1vw solid; border-color: silver #000 #000 silver; border-bottom: none; font-size: 0.8vw;
            ">Network Tab</button>
        </div>
        <div class="tab-contents">
            <div id="TabContent" class="pAdeblc-content no-style " data-tab="LogOutput" style="display: none; background: #c0c0c0; border: 0.1vw solid #ccc; overflow-y: hidden; overflow-x: hidden; box-sizing: border-box;">
                <div class="pAdeblc-cool-scroll" style="background: rgb(32, 32, 70); color: #ffffff; height: 25vw; font-family: 'MS Sans Serif', sans-serif !important; font-size: 1vw !important; overflow-y: scroll; overflow-wrap: break-word; outline: 0;" id="pAdeblc-content-output"></div>
            </div>
            <div id="TabContent" class="pAdeblc-content no-style" data-tab="MainOutput" style="display: none; background: #c0c0c0; border: 0.1vw solid #ccc; overflow-y: hidden; overflow-x: hidden; box-sizing: border-box;">
                <div style="background: rgb(32, 32, 70); color: #ffffff; height: 25vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1vw; overflow-y: scroll; overflow-wrap: break-word; outline: 0;
" id="pAdeblc-content" class="pAdeblc-cool-scroll"></div>
            </div>
            <div id="TabContent" class="pAdeblc-content no-style" data-tab="NetworkOutput" style="display: none; background: #c0c0c0; border: 0.1vw solid #ccc; overflow-y: hidden; overflow-x: hidden; box-sizing: border-box;">
                <div style="background: rgb(32, 32, 70); color: #ffffff; height: 25vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1vw; overflow-y: scroll; overflow-wrap: break-word; outline: 0;
" id="pAdeblc-content-network" class="pAdeblc-cool-scroll"></div>
            </div>
        </div>
    </div>

    <input style="display: block; font-family: 'MS Sans Serif', sans-serif; top: 94%; left: 0; font-size: 1vw; width: 100% !important; height: 5%; background-color: #white; border: 0.2vw solid #c0c0c0; border-right-color:c0c0c0#fff; border-bottom-color: #fff; border-top-color: rgb(56, 56, 56); border-left-color: rgb(56, 56, 56); outline: none; box-sizing: border-box; position: absolute;"
id="pAdeblc-input" type="text" />
`;
consoleDiv.style.display = "none";
document.body.appendChild(consoleDiv);
consoleDiv.addEventListener("click", () => bringToFront(consoleDiv));
logToConsole("JUSTSTUDY CONSOLE v1.0", "yellow", true);
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
function logToConsole(message, text_colour, log, isnetwork) {
    let consoleDiv = null;
    if (isnetwork) {
        consoleDiv = document.getElementById('pAdeblc-content-network');
    } else {
        if (log) {
            consoleDiv = document.getElementById('pAdeblc-content-output');
        } else {
            consoleDiv = document.getElementById(`pAdeblc-content`);
        }
    }
    const newMessage = document.createElement('p');
    const newLine = document.createElement('br');
    newMessage.textContent = "C:\\User> " + message;
    newMessage.style.color = text_colour;
    consoleDiv.appendChild(newMessage);
    if (!log) {
        consoleDiv = document.getElementById('pAdeblc-content-output');
        const newMessage = document.createElement('p');
        const newLine = document.createElement('br');
        newMessage.textContent = "C:\\User> " + message;
        newMessage.style.color = text_colour;
        consoleDiv.appendChild(newMessage);
    }

    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

const pAdeblcinput = document.getElementById("pAdeblc-input");
document.addEventListener('keydown', e => {
    if (window_open && e.key === '`') {
        e.preventDefault();
        document.getElementById("pAdeblc").style.display = "none";
        window_open = false;
    } else if (e.key === '`') {
        e.preventDefault();
        document.getElementById("pAdeblc").style.display = "block";
        window_open = true;
        pAdeblcinput.focus();
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

pAdeblcinput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const inputValue = pAdeblcinput.value.trim();
        logToConsole(inputValue, "wheat");

        if (inputValue.toLowerCase() === "jsfm") {
            document.getElementById("pAdeblc-filesystem-main").style.display = "block";
            bringToFront(document.getElementById("pAdeblc-filesystem-main"));
        }
        if (inputValue.toLowerCase() === "savecookies") {
            saveCookies();
        } else if (inputValue.toLowerCase() === "loadcookies") {
            document.getElementById('CookieInput').click()
        } else if (inputValue === "help") {
            logToConsole("Available commands:", "white");
            logToConsole("help - Display available commands", "white");
            logToConsole("clear - Clear console", "white");
            logToConsole("files - Display all premade runnable files", "white");
            logToConsole("jste - Open Text Editor", "white");
            logToConsole("jsfm - Open File Manager", "white");
            logToConsole("savecookies - Saves your cookie data into a json file", "white");
            logToConsole("loadcookies - Imports cookie data from the json file you saved", "white");
        } else if (inputValue === "clear") {
            if (current_tab == "LogOutput") {
                document.getElementById("pAdeblc-content-output").innerHTML = "";
            } else {
                document.getElementById("pAdeblc-content").innerHTML = "";
            }
        } else if (inputValue === 'jste') {
            if (!textwindow_open) {
                document.getElementById("pAdeblc-txeditor-main").style.display = "block";
                textwindow_open = true;
                bringToFront(document.getElementById("pAdeblc-txeditor-main"));
            }
            logToConsole("New JustStudy CE Text Editor window opened.", "green");
        } else {
            if (isJavaScript(inputValue)) {
                run(true);
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
    var content = currenteditor.getValue();
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-8",
    });

    saveAs(blob, document.getElementById(current_txeditor_tab + "_name").value);

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
        reader.onload = function (e) {
            if (txEditorTabCount <= 20) {
                createNewTxEditorTab(file.name, e.target.result, global_tabbt, global_tabcontainer);
                txEditorTabCount += 1;
            }
        };
        reader.readAsText(file);
    }
}
loadAceScript(CreateTextEditor);

function openLocalFile() {
    CloseDropdowns();
    const picker = document.getElementById("pAdeblc-filepicker-main");
    if (picker) {
        picker.remove()
    }
    MakeFilePicker(null);
    createPickerDivs(true);
}
function saveLocalFile() {
    CloseDropdowns();
    const picker = document.getElementById("pAdeblc-filepicker-main");
    if (picker) {
        picker.remove()
    }
    MakeFilePicker(currenteditor.getValue());
    createPickerDivs(false);
}
function run(isconsole) {
    const script = document.createElement("script");
    if (isconsole) {
        script.textContent = `
        (function() {
            ${document.getElementById("pAdeblc-input").value}
        })();
        `;
    } else {
        script.textContent = `
        (function() {
            ${currenteditor.getValue()}
        })();
        `;
    }
    document.body.appendChild(script);
    document.body.removeChild(script);
}
function runall() {
    Object.keys(editors).forEach(key => {
        const script = document.createElement("script");
        script.textContent = `
        (function() {
            ${editors[key].getValue()}
        })();
        `;
        document.body.appendChild(script);
        document.body.removeChild(script);
    });
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


let isHandlingError = false;



console.log = function (message) {
    logToConsole(message, "#31f10a", true);
    originalConsoleLog.apply(console, arguments);
};


console.warn = function (message) {
    logToConsole(message, "yellow", true);
    originalConsoleWarn.apply(console, arguments);
};


console.error = function (message) {
    if (!isHandlingError) {
        logToConsole(message, "red", true);
    }
    originalConsoleError.apply(console, arguments);
};


window.onerror = function (message, source, lineno, colno, error) {
    if (isHandlingError) return false;
    isHandlingError = true;

    if (error instanceof TypeError) {
        logToConsole(`TypeError: ${message} at ${source}:${lineno}:${colno}`, 'red', true);
    } else {
        logToConsole(`Uncaught Error: ${message} at ${source}:${lineno}:${colno}`, 'red', true);
    }

    let stackInfo = '';
    if (error && error.stack) {
        stackInfo = extractStackInfo(error.stack);
        logToConsole(`Stack Trace: ${stackInfo}`, 'white', true);
    }

    isHandlingError = false;
    return true;
};



window.addEventListener('unhandledrejection', function (event) {
    logToConsole(`Unhandled Promise Rejection: ${event.reason}`, 'red', true);
    console.error(event.reason);
});

window.addEventListener('storage', function (event) {
    logToConsole(`Storage Event: ${event.key} changed`, 'orange', true);
});

window.addEventListener('blocked', function (event) {
    logToConsole(`Blocked by Tracking Prevention: ${event.message}`, 'orange', true);
});

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    try {
        const response = await originalFetch(...args);
        if (!response.ok) {
            logToConsole(`Fetch Error: ${response.status} - ${response.statusText} (URL: ${args[0]})`, 'red', true);
        }
        return response;
    } catch (error) {
        logToConsole(`Fetch Failed: ${error.message} (URL: ${args[0]})`, 'red', true);
        console.error(error);
        throw error;
    }
};

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
window.addEventListener("load", () => {
    const entries = performance.getEntriesByType("resource");
    entries.forEach((entry) => {
        logToConsole(`Resource Load: ${entry.name}`, "green", true, true);
    });
});


window.addEventListener(
    "error",
    function (event) {
        if (event.target !== window) {
            if (event.target && event.target.src) {
                logToConsole(`Resource Load Error: ${event.target.src}`, "orange", true, true);
            } else {
                logToConsole(`Resource Load Error`, "orange", true, true);
            }
        }
    },
    true
);
`
{
    name: entry.name,
    type: entry.initiatorType,
    duration: entry.duration,
    size: entry.encodedBodySize
});
`


// Inject CSS styles for the toast
function injectToastStyles() {
    const existingStyle = document.querySelector('#toast-styles');
    if (existingStyle) return; // Prevent duplicate styles

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999999; /* Very high z-index to ensure visibility */
            pointer-events: none; /* Prevent blocking interaction with underlying elements */
        }
        .toast {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            background-color: #343a40;
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            pointer-events: auto; /* Allow interaction with the toast itself */
            animation: fade-in 0.3s ease-in-out, fade-out 0.5s ease-out 4.5s;
        }
        .toast-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #495057;
            color: #fff;
            padding: 5px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .toast-body {
            padding: 10px;
            font-size: 16px;
        }
        .btn-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
        }
        .btn-close:hover {
            color: #ff6b6b;
        }
        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes fade-out {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Fetch alerts and show toast
async function fetchAlerts() {
    try {
        const response = await fetch('/assets/data/alerts.json');
        if (response.ok) {
            const data = await response.json();
            if (data.message) {
                showToast(data.message);
            }
        } else {
            console.error('Failed to fetch alerts:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}

// Create and display toast
function showToast(message) {
    // Ensure a container exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create a toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast show';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" aria-label="Close">&times;</button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toastElement);

    // Close button handler
    const closeButton = toastElement.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        toastElement.remove();
    });

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        toastElement.classList.add('fade-out');
        toastElement.addEventListener('animationend', () => {
            toastElement.remove();
            if (toastContainer.childNodes.length === 0) {
                toastContainer.remove();
            }
        });
    }, 5000);
}

// Initialize toast functionality
document.addEventListener('DOMContentLoaded', () => {
    injectToastStyles();
    fetchAlerts();
    setInterval(fetchAlerts, 5000);
});
