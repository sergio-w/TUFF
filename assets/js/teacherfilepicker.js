

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
    margin: 0.5vw;
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
.pAdeblc-filemanager-content-new{
    overflow-y: hidden;
    height: 30vw;
}
.pAdeblc-filesystem-extra-container {
    width: 44.7vw;
    background: rgb(255, 255, 255);
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: side;
}
.pAdeblc-filesystem-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5vw;
}
.cewlborder-in {
    border: 0.15vw solid #fff;
    border-right: 0.1vw solid #fff;
    border-bottom: 0.1vw solid #fff;
    border-top: 0.15vw solid rgb(56, 56, 56);
    border: 0.15vw solid rgb(56, 56, 56);
}
.cewlborder-out{
    border: 0.2vw solid #fff;
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
.padeblc-filesystem-filename:hover{
    color: #ffffff;
}
.pAdeblc-filemanager-content {
    overflow: hidden;
}

.pAdeblc-filemanager-panel {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background: rgb(255, 255, 255);
    border: 0.1vw solid rgb(56, 56, 56);
    box-sizing: border-box;
    min-width: 7vw;
}

.pAdeblc-filemanager-panel .folder-input {
    margin: 0.3vw;
    padding: 0.2vw;
    border: 0.1vw solid #fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
    border-right-color: #fff;
    border-bottom-color: #fff;
    outline: none;
    font-size: 1vw;
    background: rgb(156, 202, 255);
    min-width: 1vw;
    width: 25vh;

}

.pAdeblc-filemanager-panel .file-list {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.3vw;
    background: rgb(255, 255, 255);
}

.pAdeblc-filemanager-panel .file-item {
    display: flex;
    align-items: center;
    padding: 0.2vw;
    border: 0.1vw solid rgb(85, 85, 85);
    background: rgb(231, 231, 231) !important;
    border-radius: 0.05vw;
    margin-bottom: 0.2vw;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    color: #000;
}
.pAdeblc-filemanager-panel .file-item:hover {
    border: 0.1vw solid rgb(82, 183, 241);
}

.pAdeblc-filemanager-panel .file-item img {
    width: 1.5vw;
    height: 1.5vw;
    margin-right: 0.5vw;
}

.pAdeblc-filemanager-resizer {
    width: 0.15vw;
    margin: 0vw;
    margin-right: 0vw;
    background: #333;
    cursor: ew-resize;
}

.pAdeblc-filemanager-go-up{
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    border: 0.1vw solid #fff;
    border-right-color:rgb(56, 56, 56);
    border-left-color: #fff;
    border-bottom-color: rgb(56, 56, 56);
    cursor: pointer;
    width: 1vw;
    text-align: center; 
    width: 1.5vw;
    flex: 0 1 auto;
    margin-right: 0.5vw;
}
.pAdeblc-filemanager-go-root{
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    margin-right: 0.5vw;
    width: 1.5vw;
    border: 0.1vw solid #fff;
    border-right-color:rgb(56, 56, 56);
    border-left-color: #fff;
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    cursor: pointer;
    text-align: center; 
    flex: 0 1 auto;
}
.custom-context-menu {
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 1vw;
    border-radius: 0.2vw;
}
.custom-context-menu div:hover {
    background: rgb(82, 183, 241);
    color: #fff;
}
.pAdeblc-file-name{
    background-color:rgba(192, 192, 192, 0);
    outline: none;
    border: none;
    font-size: 1vw;
    color: #000;
    user-select: none;
}
`;
document.head.appendChild(filestyle);

let CurrentSelectedFile = "";
let CurrentSelectedFolder = "";
let CurrentSelectedFileName = "";

let filesystemmain = [
    {
        type: 'folder',
        name: 'root',
        contents: []
    }
];

function getStringSizeUsingBlob(str) {
    const blob = new Blob([str]); 
    return blob.size;
}
function openDatabase(onSuccess) {
    const request = indexedDB.open("pAdbelc-personal-filesystem", 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("filesystem")) {
            const store = db.createObjectStore("filesystem", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        if (onSuccess) onSuccess(db);
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
}
openDatabase(function(db) {
    const transaction = db.transaction("filesystem", "readonly");
    const store = transaction.objectStore("filesystem");

    const getRequest = store.get(1);

    getRequest.onsuccess = function(event) {
        if (getRequest.result) {
            filesystemmain = getRequest.result.data;
        } else {
            filesystemmain = [
                {
                    type: 'folder',
                    name: 'root',
                    contents: []
                }
            ];
        }
        createDivs();
    };

    getRequest.onerror = function(event) {
        console.error("Error loading data from IndexedDB:", event.target.error);
    };
});


function getFolderByPath(path, fileSystem = filesystemmain) {
    const parts = path.split('/').filter(part => part !== '');
    if (parts.length === 0) return null;
    
    let current = filesystemmain.find(entry => entry.type === 'folder' && entry.name === parts[0]);
    if (!current) return null;
    
    for (const part of parts.slice(1)) {
        if (!current.contents) return null;
        current = current.contents.find(item => item.type === 'folder' && item.name === part);
        if (!current) return null;
    }
    return current;
}
const handleFileNFolderContextMenu = (event, name, type) => {
    event.preventDefault();
    if (document.getElementById("context-menu-rightclick")) {
        document.body.removeChild(document.getElementById("context-menu-rightclick"));
    }

    const contextMenu = document.createElement("div");
    contextMenu.id = "context-menu-rightclick";
    contextMenu.classList.add("pAdeblc-dropdown-content");
    contextMenu.style.position = "absolute";
    contextMenu.style.left = event.pageX + "px";
    contextMenu.style.top = event.pageY + "px";
    contextMenu.style.width = "10vw";
    contextMenu.style.display = "block";
    bringToFront(contextMenu);

    const renameOption = document.createElement("a");
    renameOption.href = "#";
    renameOption.textContent = `Rename ${type}`;
    renameOption.addEventListener("click", (e) => RenameItem(event));
    const deleteOption = document.createElement("a");
    deleteOption.href = "#";
    deleteOption.textContent = `Delete ${type}`;
    deleteOption.addEventListener("click", (e) => DeleteItem(event));

    contextMenu.appendChild(renameOption);
    contextMenu.appendChild(deleteOption);
    document.body.appendChild(contextMenu);

    contextMenu.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            document.body.removeChild(contextMenu);
        }
    });
};
function DeleteItem(event) {
    const target = event.target.closest('.file-item');
    if (target) {
        const fileName = target.dataset.name;
        const fileType = target.dataset.type;
        const panel = target.closest('.pAdeblc-filemanager-panel');
        const input = panel.querySelector('.folder-input');
        const path = input.value.trim();
        const folder = getFolderByPath(path);
        if (!folder) return;

        if (confirm(`Delete ${fileType} "${fileName}"?`)) {
            const index = folder.contents.findIndex(item => item.name === fileName && item.type === fileType);
            if (index !== -1) {
                folder.contents.splice(index, 1);
                renderPanel(panel.querySelector('.file-list'), path);
                UpdatePersonalFileSystem();
            }
        }
    }
}

function RenameItem(event) {
    const target = event.target.closest('.file-item');
    if (target) {
        const fileName = target.dataset.name;
        const fileType = target.dataset.type;
        const panel = target.closest('.pAdeblc-filemanager-panel');
        const input = target.querySelector('.pAdeblc-file-name');
        const path = panel.querySelector('.folder-input').value.trim();
        const folder = getFolderByPath(path);
        if (!folder) return;
        input.disabled = false;
        input.style.pointerEvents = 'all';
        input.focus(); 

        input.addEventListener('keydown', function handleKeydown(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const newName = input.value.trim();
                if (newName && newName !== fileName) {
                    let finalName = newName;
                    let counter = 1;
                    while (folder.contents.some(item => item.name === finalName && item.type === fileType)) {
                        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
                        const extension = newName.includes('.') ? newName.substring(newName.lastIndexOf('.')) : '';
                        finalName = `${baseName} (${counter++})${extension}`;
                    }

                    const index = folder.contents.findIndex(item => item.name === fileName && item.type === fileType);
                    if (index !== -1) {
                        folder.contents[index].name = finalName;
                        UpdatePersonalFileSystem();
                    }
                }

                input.disabled = true;
                input.style.pointerEvents = 'none';
                input.removeEventListener('keydown', handleKeydown);
            }
        });

        input.addEventListener('blur', function handleBlur() {
            const newName = input.value.trim();
            if (newName && newName !== fileName) {
                let finalName = newName;
                let counter = 1;
                while (folder.contents.some(item => item.name === finalName && item.type === fileType)) {
                    finalName = `${newName} (${counter++})`;
                }

                const index = folder.contents.findIndex(item => item.name === fileName && item.type === fileType);
                if (index !== -1) {
                    folder.contents[index].name = finalName;
                    UpdatePersonalFileSystem();
                }
            }

            input.disabled = true;
            input.style.pointerEvents = 'none';
            input.removeEventListener('blur', handleBlur);
        });
    }
}

function renderPanel(fileListElement, path) {
    fileListElement.innerHTML = '';
    const folder = getFolderByPath(path);
    if (!folder) {
        console.warn(`Path "${path}" not found.`);
        return;
    }
    folder.contents.forEach(item => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.dataset.type = item.type;
        fileItem.dataset.name = item.name;
        fileItem.dataset.location = item.path;
        fileItem.dataset.size = item.file_size;
        fileItem.dataset.date = item.time_made;
        fileItem.dataset.contents = item.data

        fileItem.setAttribute('draggable', 'true');

        const img = document.createElement('img');
        if (item.type === 'folder') {
            img.src = '/assets/img/winicons/folder.png';
        } else {
            const fileType = item.name.split('.').pop().toLowerCase();
            img.src = `/assets/img/winicons/${fileType}file.png`;
        }

        const nameSpan = document.createElement('input');
        nameSpan.value = item.name;
        nameSpan.classList.add('pAdeblc-file-name');
        nameSpan.disabled = true;
        nameSpan.style.pointerEvents = 'none';
        fileItem.appendChild(img);
        fileItem.appendChild(nameSpan);
        fileListElement.appendChild(fileItem);
    });
}


function navigatePath(currentPath, folderName){
    if(currentPath === '/' || currentPath === ''){
        return `/${folderName}`;
    } else {
        return `${currentPath}/${folderName}`;
    }
}

function bringToFront(windowElement) {
    const allWindows = document.querySelectorAll('.pAdeblc-filesystem-main');
    let highestZIndex = 10000;
    allWindows.forEach(window => {
        const zIndex = parseInt(window.style.zIndex, 10) || 10000;
        if(zIndex > highestZIndex){
            highestZIndex = zIndex;
        }
    });
    windowElement.style.zIndex = highestZIndex + 1;
}

function makeFileManagerDraggable(element) {
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    const handle = element.querySelector('#pAdeblc-top-filesystem');
    if (handle) {
        handle.onmousedown = dragMouseDown;
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

function MakeFileSystem(){
    const newWindow = document.createElement('div');
    newWindow.classList.add(".pAdeblc");
    newWindow.classList.add("pAdeblc-filesystem-main");
    newWindow.id = "pAdeblc-filesystem-main";
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 45vw; height: 30vw; background: #c0c0c0; border: 0.2vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";

    newWindow.innerHTML = `
        <div id="pAdeblc-top-filesystem" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin: 0.5vw;">
                <img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2.5vw; height: 2.5vh;">
                Juststudy CE File Selector
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-filesystem-main').style.display = 'none';">X</button>
        </div>
        <div class="pAdeblc-filesystem-extra-container pAdeblc-cool-scroll" id="pAdeblc-filesystem-content">
        </div>
    `;
    document.body.appendChild(newWindow);
    makeFileManagerDraggable(newWindow);
    newWindow.style.display = 'none';
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    bringToFront(newWindow);
}
MakeFileSystem();
function UpdatePersonalFileSystem(){
    const container = document.getElementById('pAdeblc-filesystem-content');
    let inputdata = document.getElementById("pAdeblc-filemanager-folder-input").value;
    renderPanel(container.querySelector('#file-list'), `${inputdata}`);

}
function stopResizing() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
}

function createDivs() {
        document.getElementById("pAdeblc-filesystem-content").innerHTML = `
            <div class="pAdeblc-filemanager-panel">
                <div style="display: flex; align-items: center;">
                    <input class='folder-input' id="pAdeblc-filemanager-folder-input" type="text" style="flex: 1 1 auto;" placeholder="Enter folder path..." value="/root"/> 

                    <button class="pAdeblc-filemanager-go-root" id="pAdeblc-filemanager-go-root">*</button>

                    <button class="pAdeblc-filemanager-go-up" id="pAdeblc-filemanager-go-up">▼</button>
                </div>
                <div class="file-list pAdeblc-filemanager-scrollbar" id="file-list" style="height: 24.4vw;"></div>
            </div>
        `; 
        document.getElementById("pAdeblc-filesystem-content").style.display = "flex";
        document.getElementById("pAdeblc-filesystem-content").style.flexDirection = "row";
        const container = document.getElementById('pAdeblc-filesystem-content');
        const Input = document.getElementById('pAdeblc-filemanager-folder-input');
        const GoRoot = document.getElementById('pAdeblc-filemanager-go-root');
        const GoUp = document.getElementById('pAdeblc-filemanager-go-up');
        GoRoot.addEventListener('click', () => {
            const path = `/root`;
            renderPanel(container.querySelector('#file-list'), path);
            Input.value = path;
        });
        
        
        GoUp.addEventListener('click', () => {
            const path = Input.value.trim().split('/').slice(0, -1).join('/');
            if (path == ""){
                return
            }
            renderPanel(container.querySelector('#file-list'), path);
            Input.value = path;
            
        });
        
        Input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const path = Input.value.trim();
                renderPanel(container.querySelector('#file-list'), path);
            }
        });
        const file_types = {
            "html": "text/html",
            "css": "text/css",
            "js": "text/javascript",
            "json": "application/json",
            "txt": "text/plain",
        }
        const file_types_clean = {
            "html": "html",
            "css": "css",
            "js": "javascript",
            "json": "json",
            "txt": "plain",
        }
        container.querySelector('#file-list').addEventListener('dblclick', (e) => {
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'folder') {
                const currentPath = Input.value.trim();
                const folderName = target.dataset.name;
                const newPath = navigatePath(currentPath, folderName);
                Input.value = newPath;
                renderPanel(container.querySelector('#file-list'), newPath);
            } else if (target && target.dataset.type === 'file') {
                CurrentSelectedFile = Input.value.trim();
            }
        });
        const path = `/root`;
        renderPanel(container.querySelector('#file-list'), path);
        

}