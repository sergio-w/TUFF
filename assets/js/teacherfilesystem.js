const filestyle = document.createElement('style');
filestyle.innerHTML = `
.pAdeblc-filesystem-topbar{
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
.pAdeblc-filesystem-bt {
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
.pAdeblc-image {
  width: 1.5vw;
  height: 1.5vh;   
  image-rendering: pixelated;
   object-fit: contain;
}
.pAdeblc-content-new{
    overflow-x: hidden;
}
.pAdeblc-filesystem-side-container {
    width: 12vw;
    margin-right: 0.5vw;
    margin-left: 0.5vw;
    background: rgb(245, 244, 209);
    height: 30vw;
    margin-top: 0.2vw;
}
.pAdeblc-filesystem-main-container {
    width: 50vw;
    margin-top: 0.2vw;
    height: 30vw;
    background: rgb(245, 244, 209);
    overflow-y: scroll;
    overflow-x: scroll;
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
.pAdeblc-filesystem-filename{
    background: rgba(245, 244, 209, 0);
    outline: none;
    border: none;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1vw;
    color: rgb(0, 0, 0);
    font-weight: bold;
    width: 32vw;
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
.pAdeblc-filesystem-bt:hover {
    border: 0.1vw solid #fff;
    border-right-color:#fff;
    border-bottom-color:#fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
}
.pAdeblc-filesystem-filename{
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    color: #000;
    background-color:rgba(255, 255, 255, 0);
    border: none;
    margin-bottom: 0vw;
    margin-top: 0vw;
    margin-left: 0.8vw;
    margin-right: 0.5vw;
    outline: none;
    width: 38vw;
    cursor: default;
    text-align: left; 
}
`;
document.body.appendChild(filestyle);
let isResizing = false;
let currentResizer = null;
let previousBox = null;
let nextBox = null;
let startX = 0, startPrevSize = 0, startNextSize = 0;

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

function getCookies() {
    let cookies = document.cookie.split(';');
    let cookieArray = [];
    
    cookies.forEach(cookie => {
        let [key, value] = cookie.trim().split('=');
        cookieArray.push({key, value});
    });
    
    return cookieArray;
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

function updateStorage(type) {
        const keys = document.querySelectorAll('#pAdeblc-filesystem-Names input');
        const values = document.querySelectorAll('#pAdeblc-filesystem-Values input');

        keys.forEach((keyInput, index) => {
            const key = keyInput.value.trim();
            const value = values[index].value.trim();

            if (key) {
                localStorage.setItem(key, value);
            }
        });

        console.log("LocalStorage updated!");
        const keys2 = document.querySelectorAll('#pAdeblc-filesystem-Names input');
        const values2 = document.querySelectorAll('#pAdeblc-filesystem-Values input');

        keys2.forEach((keyInput, index) => {
            const key = keyInput.value.trim();
            const value = values[index].value.trim();

            if (key) {
                document.cookie = `${key}=${value}; path=/`;
            }
        });
        console.log("Cookies updated!");
        const keys3 = document.querySelectorAll('#pAdeblc-filesystem-Names input');
        const values3 = document.querySelectorAll('#pAdeblc-filesystem-Values input');

        keys3.forEach((keyInput, index) => {
            const key = keyInput.value.trim();
            const value = values[index].value.trim();

            if (key) {
                sessionStorage.setItem(key, value);
            }
        });
        console.log("SessionStorage updated!");
}
function show(){
    style.display = 'block';
}
function makediv(value, isvalue, isdropdown,content,isdarker) {
    let newDiv = document.createElement('div');
    newDiv.style.margin = '0 0';
    document.getElementById("resizer").style.height = 'auto';
    // Create button
    let button = document.createElement('button');
    button.style.fontFamily = "'Tahoma', sans-serif";
    button.style.fontSize = '1vw';
    button.style.color = '#000';
    if (isdarker == 1){
     button.style.background = 'rgb(160, 160, 160)';
    } else {
     button.style.background = '#C0C0C0';
    }
    button.style.border = '0.1vw solid #fff';
    button.style.marginBottom = '0vw';
    button.style.marginTop = '0vw';
    button.style.marginLeft = '0.8vw';
    button.style.marginRight = '0.5vw';
    button.style.borderTopColor = '#fff';
    button.style.borderLeftColor = '#fff';
    button.style.borderRightColor = 'rgb(56, 56, 56)';
    button.style.borderBottomColor = 'rgb(56, 56, 56)';
    button.style.width = '38vw';
    button.style.height = '1.5vw';  
    button.style.cursor = 'pointer';
    button.style.textAlign = 'left';
    button.style.display = "flex";
    button.style.alignItems = "center";

    button.setAttribute('onmouseover', 'hoverBtIn(this)');
    button.setAttribute('onmouseout', 'hoverBtOut(this)');
    
    // Add icon to button
    let img = document.createElement('img');
    img.src = '/assets/img/winicons/folder.png';
    img.className = 'pAdeblc-image';
    img.style.width = '1.1vw';
    img.style.height = '2vh';
    
    // Add input to button for file name
    let input = document.createElement('input');
    input.className = 'pAdeblc-filesystem-filename';
    button.appendChild(img);
    button.appendChild(input);
    input.value = value;
    
    newDiv.appendChild(button);

    // Create dropdown content (hidden by default)
    if (isdropdown) {
        let dropdownContent = document.createElement('div');
        dropdownContent.style.display = 'none'; // Initially hidden
        dropdownContent.id = dropdownid;
        dropdownContent.style.marginTop = '0.1vw';
        dropdownContent.style.fontFamily = "'Tahoma', sans-serif";
        dropdownContent.style.fontSize = '1vw';
        dropdownContent.style.border = '0.1vw solid #fff';
        dropdownContent.style.color = '#000';
        dropdownContent.style.backgroundColor = '#C0C0C0';
        dropdownContent.style.borderTopColor = '#fff';
        dropdownContent.style.borderLeftColor = '#fff';
        dropdownContent.style.borderRightColor = 'rgb(56, 56, 56)';
        dropdownContent.style.borderBottomColor = 'rgb(56, 56, 56)';
        dropdownContent.style.padding = '0.15vw 0.5vw';
        dropdownContent.style.width = '38vw';
        dropdownContent.style.cursor = 'pointer';
        dropdownContent.style.marginLeft = '0.8vw';
        dropdownContent.style.marginRight = '0.5vw';
        dropdownContent.style.textAlign = 'left';

        let dropdownItem = document.createElement('div');
        dropdownItem.textContent = content;
        dropdownContent.appendChild(dropdownItem);

        button.addEventListener('click', function() {
            if (dropdownContent.style.display === 'none') {
                dropdownContent.style.display = 'block';
            } else {
                dropdownContent.style.display = 'none'; 
            }
        });
        newDiv.appendChild(dropdownContent);
    }

    if (!isvalue) {
        document.getElementById("pAdeblc-filesystem-Names").appendChild(newDiv);
    } else {
        document.getElementById("pAdeblc-filesystem-Values").appendChild(newDiv);
    }

    if (isdropdown) {
        document.getElementById(dropdownid).appendChild(button);
    }
}


function CloseDropdowns() {
    const dropdowns = document.querySelectorAll('.pAdeblc-dropdown');
    dropdowns.forEach(element => {
        if (element.classList.contains('show')) {
            element.classList.remove('show');
        }
    });
}

function createDivs(type) {
    let darker = 0;
    document.getElementById("pAdeblc-filesystem-Names").innerHTML = `<button class="pAdeblc-filesystem-filename">Name</button>`;
    document.getElementById("pAdeblc-filesystem-Values").innerHTML = `<button class="pAdeblc-filesystem-filename">Value</button>`;
    if (type === "cookie") {
        let cookieArray = getCookies();
        cookieArray.forEach(cookie => {
            if (darker == 0) {
                darker = 1;
            }
            else {
                darker = 0;
            }
            makediv(cookie.value, true,false ,false, darker); 
            makediv(cookie.key, false,false ,false, darker);
        });
    } else if (type === "localstorage") {
        for (let i = 0; i < localStorage.length; i++) {
            if (darker == 0) {
                darker = 1;
            }
            else {
                darker = 0;
            }
            let key = localStorage.key(i); 
            let value = localStorage.getItem(key);
            makediv(value, true,false ,false,darker); 
            makediv(key, false,false ,false,darker);
        }
    } else if (type === "sessionstorage") {
        for (let i = 0; i < sessionStorage.length; i++) {
            if (darker == 0) {
                darker = 1;
            }
            else {
                darker = 0;
            }
            let key = sessionStorage.key(i); 
            let value = sessionStorage.getItem(key);
            makediv(value, true,false ,false,darker); 
            makediv(key, false,false ,false,darker);
        }
    }
}



function LoadFiles(type) {
    createDivs(type);
}

function resize(e) {
    if (!isResizing) return;

    const dx = e.clientX - startX;
    if (currentResizer.classList.contains('vertical')) {
        const newPrevWidth = startPrevSize + dx;
        const newNextWidth = startNextSize - dx;

        previousBox.style.width = `${newPrevWidth}px`;
        nextBox.style.width = `${newNextWidth}px`;
    }
}

function stopResizing() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
}
function copyText() {
    
}
function findAndReplace(){
    CloseDropdowns();
    const keys = document.querySelectorAll('#pAdeblc-filesystem-Names input');
    const values = document.querySelectorAll('#pAdeblc-filesystem-Values input');
    const query = prompt("Enter text to find:");
    const replace = prompt("Text to replace with:");
    console.log(replace);
    if (query) {
        keys.forEach((keyInput, index) => {
            if (keyInput.value.toLowerCase().includes(query.toLowerCase())) {
                keyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                keyInput.focus();
                keyInput.value = replace;
            }
        });
        values.forEach((valueInput, index) => {
            if (valueInput.value.toLowerCase().includes(query.toLowerCase())) { 
                valueInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                valueInput.focus();
                valueInput.value = replace;
            }
        });
        } else {
            alert('Text not found');
        }
}
function findText(){
    CloseDropdowns();
    const keys = document.querySelectorAll('#pAdeblc-filesystem-Names input');
    const values = document.querySelectorAll('#pAdeblc-filesystem-Values input');
    const query = prompt("Enter text to find:");
    if (query) {
        keys.forEach((keyInput, index) => {
            if (keyInput.value.toLowerCase().includes(query.toLowerCase())) {
                keyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                keyInput.focus();
            }
        });
        values.forEach((valueInput, index) => {
            if (valueInput.value.toLowerCase().includes(query.toLowerCase())) { 
                valueInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                valueInput.focus();
            }
        });
        } else {
            alert('Text not found');
        }
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
function MakeFileSystem(){
    const script = document.createElement("script");
    script.src = "/assets/js/FileSaver.js";
    document.body.appendChild(script);
    const newWindow = document.createElement('div');
    newWindow.classList.add("pAdeblc");
    newWindow.id = "pAdeblc-filesystem-main";
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 56vw; height: 36vw; background: #c0c0c0; border: 0.2vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";

    newWindow.innerHTML = `
        <div id="pAdeblc-top-filesystem" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin-left: 0.5vw;">
                <img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2.5vw; height: 2.5vh;">
                Juststudy CE Storage Manager
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-filesystem-main').style.display = 'none'; textwindow_open = false;">X</button>
        </div>
        <div class="pAdeblc-filesystem-topbar">
                <div class="pAdeblc-dropdown" id="fileselector">
                    <button class="pAdeblc-filesystem-bt" onclick="toggleDropdown(this.parentElement)">
                        <img src="/assets/img/winicons/folder-edit.png" class="pAdeblc-image">File
                    </button>
                    <div class="pAdeblc-dropdown-content">
                        <a href="#" onclick="document.getElementById('FilesystemCookieInput').click();">Open File</a>
                        <a href="#" onclick="updateStorage()">Save changes</a>
                        <a href="#" onclick="saveCookies()">Save as</a>
                    </div>
                </div>
                <div class="pAdeblc-dropdown" id="editselector">
                    <button class="pAdeblc-filesystem-bt" onclick="toggleDropdown(this.parentElement)">
                        <img src="/assets/img/winicons/texticon.png" class="pAdeblc-image">Edit
                    </button>
                    <div class="pAdeblc-dropdown-content">
                        <a href="#" onclick="findText()">Find</a>
                        <a href="#" onclick="findAndReplace()">Find & Replace</a>
                        <a href="#" onclick="copyText()">Copy</a>
                    </div>
                </div>
            </div>
        <div class="pAdeblc-content-new" id="pAdeblc-content-new" style="display: flex;">
            <div class="pAdeblc-filesystem-side-container pAdeblc-cool-scroll cewlborder-in" >
                 <button onclick="LoadFiles('cookie')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/data.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">Cookies
                 </button>
                  <button onclick="LoadFiles('localstorage')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: rgb(160, 160, 160); border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/data.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">LocalStorage
                 </button>
                 <button onclick="LoadFiles('sessionstorage')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/data.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">SessionStorage
                 </button>
            </div>
            <div class="pAdeblc-filesystem-main-container pAdeblc-cool-scroll cewlborder-in" id="pAdeblc-filesystem">
                <div class="pAdeblc-filesystem-row" style="display: flex; align-items: stretch;">
                    <div id="pAdeblc-filesystem-Names" style="flex-grow: 1; overflow-y: auto; overflow-x:hidden;">
                        
                    </div>
                    <div class="resizer vertical" id="resizer" style="cursor: ew-resize; margin-left:0.8vw; width: 0.2vw; background: #333;"></div>
                    <div id="pAdeblc-filesystem-Values" style="flex-grow: 2; overflow-y: auto; overflow-x:hidden; margin-left: 0vw;">
                        
                    </div>
                </div>
            </div>
            <input type="file" id="FilesystemCookieInput" style="display: none;" onchange="handleCookieData(event)"/>
        </div>
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
    newWindow.style.display = 'none';
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    const button = document.querySelectorAll("pAdeblc-filesystem-bt");
    const resizer = document.getElementById('resizer');
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        currentResizer = resizer;
        previousBox = resizer.previousElementSibling;
        nextBox = resizer.nextElementSibling;
        startX = e.clientX;
        startPrevSize = previousBox.getBoundingClientRect().width;
        startNextSize = nextBox.getBoundingClientRect().width;
    
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    });
    LoadFiles("cookie")
    
};
function makeDraggable(element) {
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    if (element.querySelector('#pAdeblc-top') || element.querySelector('#pAdeblc-top-filesystem')) {
       if (element.querySelector('#pAdeblc-top')) {
        element.querySelector('#pAdeblc-top').onmousedown = dragMouseDown;
       } else {
        element.querySelector('#pAdeblc-top-filesystem').onmousedown = dragMouseDown;
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
MakeFileSystem();