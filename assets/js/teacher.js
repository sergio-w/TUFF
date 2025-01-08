const style = document.createElement('style');
style.innerHTML = `
    .pAdeblc {
        position: absolute;
        top: 0%;
        left: 0%;
        width: 40vw;
        height: 25vw;
        border-radius: 1vw;
        border: none;
        box-shadow: 0.1vw 0.1vw 0.4vw rgba(0,0,0,0.9), -0.1vw 0.1vw 0.4vw rgba(0,0,0,0.9);
        background: #fff;
    }

    .pAdeblc-content {
        background: #000;
        color: #31f10a;
        height: 100%;
        font-family: monospace;
        padding: 5px;
        overflow-y: hidden;
        overflow-wrap: break-word;
    }

    .pAdeblc-input {
        display: block;
        font-family: monospace;
        width: calc(100% - 1.2vw);
        background-color: #000;
        color: #fff;
        border: 0.4vw solid #fff;
        border-bottom-right-radius: 0.5vw;
        border-bottom-left-radius: 0.5vw;
        padding: 0.2vw;
        position: relative;
        bottom: 0;
        left: 0;
        right: 0;
        outline: 0;
    }

    .pAdeblc-top, .pAdeblc-top-no-bind {
        cursor: move;
        text-align: right;
        height: 2vw;
        border-bottom: 0.1vw solid rgba(0,0,0,0.5);
        border-top-right-radius: 0.5vw;
        border-top-left-radius: 0.5vw;
        padding: 0.5vw;
        background-color: #ddd;
    }

    .pAdeblc-top-no-bind {
        cursor: inherit;
    }

    .pAdeblc-round {
        height: 1.3vw;
        width: 1.3vw;
        border-radius: 50vw;
        border: none;
        margin-right: 6px;
        box-shadow: 1px 1px 2px #000;
    }

    .pAdeblc-red {
        cursor: pointer;
        background-color: red;
    }

    #pAdeblc {
        z-index: 999;
    }
`;
document.body.appendChild(style);

// Create the console window
const consoleDiv = document.createElement('div');
consoleDiv.id = "pAdeblc";
consoleDiv.classList.add("pAdeblc");
consoleDiv.innerHTML = `
    <div class="pAdeblc-top">
        <button class="pAdeblc-round pAdeblc-red"></button>
    </div>
    <div class="pAdeblc-content" id="pAdeblc-content">
    </div>
    <input class="pAdeblc-input" id="pAdeblc-input" type="text" />
`;
consoleDiv.style.display = "none";
document.body.appendChild(consoleDiv);

let capturedLogs = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let window_open = false;

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

makeDraggable(document.querySelector('#pAdeblc'));
function logToConsole(message,text_colour) {
    const consoleDiv = document.getElementById('pAdeblc-content');
    const newMessage = document.createElement('p');
    newMessage.textContent = "> " + message;
    newMessage.style.color = text_colour;
    consoleDiv.appendChild(newMessage);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}
document.addEventListener('click', e => {
    if (e.target.closest('.pAdeblc-round.pAdeblc-red')) {
        document.getElementById("pAdeblc").style.display = "none";
        window_open = false;
    }
});

document.addEventListener('keydown', e => {
    if (window_open && e.key === '`') {
        document.getElementById("pAdeblc").style.display = "none";
        window_open = false;
    } else if (e.key === '`') {
        document.getElementById("pAdeblc").style.display = "block";
        window_open = true;
        document.getElementById("00g5iGe-input").focus();
    }
});

function isJavaScript(code) {
    try {
        new Function(code);
        const hasSyntax = /[{}();.=+\-*/]/.test(code);
        return hasSyntax;
    } catch (e) {
        return false; // Invalid JavaScript
    }
}

const input = document.getElementById("pAdeblc-input");
input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (isJavaScript(input.value)) {
            run(input.value);
        } else {
            logToConsole(input.value,"white");
            if (input.value == "files") {
                logToConsole("All runnable files: ","white");
                logToConsole("-- alert.js","blue");
            }
            if (input.value.split(` `)[0] == "run") {
                file("/assets/js/runnable/" + input.value.split(` `)[1]);
                logToConsole("Ran script: " + input.value,"white");
            }
        }
        input.value = "";
    }
});
input.addEventListener("keydown", (event) => {
    event.stopPropagation(); 
});
// Run the script entered in the console
function run(string) {
    const script = document.createElement("script");
    script.textContent = string;
    document.body.appendChild(script);
    document.body.removeChild(script);
}
function file(loc) {
    const script = document.createElement("script");
    script.src = loc;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

console.log = function (message) {
    logToConsole(message,"#31f10a");
    originalConsoleLog.apply(console, arguments);
};
console.warn = function (message) {
    logToConsole(message,"yellow");
    originalConsoleWarn.apply(console, arguments);
};
console.error = function (message) {
    logToConsole(message,"red");
    originalConsoleError.apply(console, arguments);
};
