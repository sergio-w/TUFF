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
.pAdeblc-filemanager-content-new{
    overflow-y: hidden;
    height: 30vw;
}
.pAdeblc-filesystem-side-container {
    width: 12.5vw;
    margin-right: 0.5vw;
    margin-left: 0.5vw;
    background: rgb(252, 252, 236);
    height: 29.8vw;
    margin-top: 0.2vw;
    overflow-y: hidden;
    overflow-x: hidden;
}
.pAdeblc-filesystem-main-container {
    width: 50vw;
    margin-top: 0.2vw;
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
    margin-left: 0.5vw;
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
    margin-left: 0.4vw;
    margin-right: 0.5vw;
    outline: none;
    width: 38vw;
    cursor: default;
    text-align: left; 
}
.pAdeblc-filesystem-value{
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    background-color:rgba(255, 255, 255, 0);
    border: none;
    color: #000;
    margin-bottom: 0vw;
    margin-top: 0vw;
    margin-left: 0.4vw;
    margin-right: 0.5vw;
    outline: none;
    width: 38vw;
    cursor: pointer;
    text-align: left; 
}
.padeblc-filesystem-filename:hover{
    color: #ffffff;
}
h3{
    font-size: 1vw;
}
h5  {
    margin-top: revert;
    font-size: 0.8vw;
}
.pAdbelc-filemanager-folderlocation {
    outline: none;
    border-radius: none;
    border: 0.1vw solid #fff;
    border-right-color:#fff;
    border-bottom-color:#fff;
    border-top-color: rgb(56, 56, 56);
    border-left-color: rgb(56, 56, 56);
    background:rgb(156, 202, 255);
    width: 85%;
    margin-left: 0.4vw;
    margin-top: 0.2vw;
    margin-bottom: 0.2vw;
    height: 1.3vw;
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
    margin-left: 0vw;
    margin-right: 0vw;
    background: #333;
    cursor: ew-resize;
}
.pAdeblc-filesystem-row {
    display: flex;
    width: 100%;
}

#pAdeblc-filesystem-Names,
#pAdeblc-filesystem-Values {
    overflow: hidden;
}

#pAdeblc-filesystem-Names {
    flex-grow: 1;
}

#pAdeblc-filesystem-Values {
    flex-grow: 2;
}

.resizer {
    width: 5px;
    background-color: #333;
    cursor: ew-resize;
}
.pAdeblc-filemanager-button {
    font-family: 'Tahoma', sans-serif;
    color: rgb(0, 0, 0) !important;
}
.pAdeblc-filemanager-button:hover {
    background: rgb(65, 113, 218) !important;
    color: rgb(255, 255, 255) !important;
}
.pAdeblc-filemanager-go-up{
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    border: 0.1vw solid #fff;
    border-right-color:rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    border-left-color: #fff;
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
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    border-left-color: #fff;
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

let isResizing = false;
let currentResizer = null;
let previousBox = null;
let nextBox = null;
let startX = 0, startPrevSize = 0, startNextSize = 0;
let current_menu;
const filesystemmain = [
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

function getFolderByPath(path, fileSystem = filesystemmain) {
    const parts = path.split('/').filter(part => part !== '');
    if (parts.length === 0) return null;
    
    let current = fileSystem.find(entry => entry.type === 'folder' && entry.name === parts[0]);
    if (!current) return null;
    
    for (const part of parts.slice(1)) {
        if (!current.contents) return null;
        current = current.contents.find(item => item.type === 'folder' && item.name === part);
        if (!current) return null;
    }
    return current;
}

function makefolder(name, path = '') {
    const parent = path ? getFolderByPath(path) : filesystemmain;
    if (parent) {
        if (!parent.contents) parent.contents = [];
        parent.contents.push({ name: name, type: 'folder', contents: [] });
    } else {
        console.error(`Path "${path}" not found.`);
    }
}

function makefile(name, data, path = '') {
    const parent = path ? getFolderByPath(path) : filesystemmain;
    if (parent) {
        if (!parent.contents) parent.contents = [];
        parent.contents.push({ 
            name: name,
            file_format: name.split('.').pop(),
            type: 'file', 
            data: data, 
            time_made: new Date().toLocaleString(), 
            file_size: getStringSizeUsingBlob(data),
            path: path
        });
    } else {
        console.error(`Path "${path}" not found.`);
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

function CloseDropdowns() {
    const dropdowns = document.querySelectorAll('.pAdeblc-dropdown');
    dropdowns.forEach(element => {
        if (element.classList.contains('show')) {
            element.classList.remove('show');
        }
    });
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
    contextMenu.style.height = "4vw";
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
                    const index = folder.contents.findIndex(item => item.name === fileName && item.type === fileType);
                    if (index !== -1) {
                        folder.contents[index].name = newName;
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
                const index = folder.contents.findIndex(item => item.name === fileName && item.type === fileType);
                if (index !== -1) {
                    folder.contents[index].name = newName;
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
    
        fileItem.addEventListener("contextmenu", (e) => handleFileNFolderContextMenu(e,item.name, item.type));
    
    });
}

function makediv(text, isValue, arg3, arg4, darker) {
    let newDiv = document.createElement('div');
    newDiv.style.margin = '0 0';
    document.getElementById("resizer").style.height = 'auto';

    let button = document.createElement('button');
    button.classList.add("pAdeblc-filemanager-button");
    button.style.fontFamily = "'Tahoma', sans-serif";
    button.style.fontSize = '1vw';
    if (darker == 1){
        button.style.background = 'rgb(255, 255, 255)';
       } else {
        button.style.background = 'rgb(221, 221, 221)';
    }
    button.style.marginBottom = '0vw';
    button.style.marginTop = '0vw';
    button.style.marginLeft = '0.8vw';
    button.style.marginRight = '0.5vw';
    button.style.border = '0.1vw solid rgb(136, 136, 136)';
    button.style.width = '38vw';
    button.style.height = '1.5vw';  
    button.style.cursor = 'pointer';
    button.style.textAlign = 'left';
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.setAttribute('data-darker', darker ? '1' : '0');
    
    let img = document.createElement('img');
    img.src = '/assets/img/winicons/folder.png';
    img.className = 'pAdeblc-image';
    img.style.width = '1.1vw';
    img.style.height = '2vh';
    
    let input = document.createElement('input');
    input.className = 'pAdeblc-filesystem-value';
    button.appendChild(img);
    button.appendChild(input);
    input.value = text;
    newDiv.appendChild(button);

    if (!isValue) {
        document.getElementById("pAdeblc-filesystem-Names").appendChild(newDiv);
    } else {
        document.getElementById("pAdeblc-filesystem-Values").appendChild(newDiv);
    }
}

function makeResizable(resizer, panels){
    let isResizing = false;
    let startX;
    let startLeftWidth;
    let startRightWidth;

    resizer.addEventListener('mousedown', function(e){
        isResizing = true;
        startX = e.clientX;
        const leftRect = panels[0].getBoundingClientRect();
        const rightRect = panels[1].getBoundingClientRect();
        startLeftWidth = leftRect.width;
        startRightWidth = rightRect.width;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e){
        if(!isResizing) return;
        const dx = e.clientX - startX;
        panels[0].style.width = `${startLeftWidth + dx}px`;
        panels[1].style.width = `${startRightWidth - dx}px`;
    }

    function stopResize(){
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
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
    const script = document.createElement("script");
    script.src = "/assets/js/FileSaver.js";
    document.body.appendChild(script);

    const newWindow = document.createElement('div');
    newWindow.classList.add(".pAdeblc");
    newWindow.classList.add("pAdeblc-filesystem-main");
    newWindow.id = "pAdeblc-filesystem-main";
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 56vw; height: 36vw; background: #c0c0c0; border: 0.2vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";

    newWindow.innerHTML = `
        <div id="pAdeblc-top-filesystem" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin-left: 0.5vw;">
                <img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2.5vw; height: 2.5vh;">
                Juststudy CE Storage Manager
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-filesystem-main').style.display = 'none';">X</button>
        </div>
        <div class="pAdeblc-filesystem-topbar">
            <div class="pAdeblc-dropdown" id="fileselector">
                <button class="pAdeblc-filesystem-bt" onclick="toggleDropdown(this.parentElement)">
                    <img src="/assets/img/winicons/folder-edit.png" class="pAdeblc-image">File
                </button>
                <div class="pAdeblc-dropdown-content">
                    <a href="#" onclick="document.getElementById('FilesystemCookieInput').click();">Open Data File</a>
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
        <div class="pAdeblc-filemanager-content-new" id="pAdeblc-filesystem-side-content" style="display: flex;">
            <div class="pAdeblc-filesystem-side-container pAdeblc-cool-scroll cewlborder-in" style="background:rgb(108, 181, 230);">
                <button onclick="LoadFiles('cookie')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/data.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">Cookies
                </button>
                <button onclick="LoadFiles('localstorage')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: rgb(160, 160, 160); border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/data.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">LocalStorage
                </button>
                <button onclick="LoadFiles('sessionstorage')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/data.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">SessionStorage
                </button>
                <button onclick="LoadFiles('personalfiles')" style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: rgb(160, 160, 160); border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)">
                    <img src="/assets/img/winicons/folder.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;">Personal Files
                </button>
                <h3 style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5vw; margin-top: 0vw;">
                    <img src="/assets/img/winicons/settingscog.png" class="pAdeblc-image" style="width: 1.1vw; height: 2vh;"> Properties 
                </h3>
                <div class="cewlborder-in" style="height: 16vw; width: 10vw; margin-left: 0.41vw; flex-direction: column; display: flex; background:rgb(235, 235, 235); color: black;"> 
                    <div style="display: flex; width: 100%; align-items: center; margin-bottom: -1vw;">
                        <h5 style="text-align: left; margin-left: 1vw;">file name:</h5>
                        <div style="flex-grow: 1; text-align: center;">
                            <h5 id="pAdeblc-filesystem-filename">main.js</h5>
                        </div>
                    </div>
                    <div style="display: flex; width: 100%; align-items: center; margin-top: -1vw;">
                        <h5 style="text-align: left; margin-left: 1vw">file type:</h5>
                        <div style="flex-grow: 1; text-align: center;">
                            <h5 id="pAdeblc-filesystem-filetype">javascript</h5>
                        </div>
                    </div>

                    <div style="width: 85%; height: 0.2vw; border-bottom: 0.1px solid black; align-self: center;"></div>

                    <div style="display: flex; width: 100%; align-items: center; margin-bottom: -1vw;">
                        <h5 style="text-align: left; margin-left: 1vw;">file size:</h5>
                        <div style="flex-grow: 1; text-align: center;">
                            <h5 id="pAdeblc-filesystem-filesize">10kb</h5>
                        </div>
                    </div>
                    <div style="display: flex; width: 100%; align-items: center; margin-top: -1vw;">
                        <h5 style="text-align: left; margin-left: 1vw">file location:</h5>
                        <div style="flex-grow: 1; text-align: center;">
                            <h5 id="pAdeblc-filesystem-filelocation">C:\\</h5>
                        </div>
                    </div>
                    <div style="display: flex; width: 100%; align-items: center; margin-top: -1vw;">
                        <h5 style="text-align: left; margin-left: 1vw">date of creation:</h5>
                        <div style="flex-grow: 1; text-align: center;">
                            <h5 id="pAdeblc-filesystem-filedate">12/01/2025</h5>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pAdeblc-filesystem-main-container pAdeblc-cool-scroll cewlborder-in" id="pAdeblc-filesystem-content">
            pAdeblc-filesystem-filedate
            </div>
            <input type="file" id="FilesystemCookieInput" style="display: none;" onchange="handleCookieData(event)"/>
        </div>
    `;
    document.body.appendChild(newWindow);
    makeFileManagerDraggable(newWindow);
    newWindow.style.display = 'none';
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    bringToFront(newWindow);
    const resizer = newWindow.querySelector('.pAdeblc-filemanager-resizer');
    if(resizer){
        const panels = newWindow.querySelectorAll('.pAdeblc-filemanager-panel');
        makeResizable(resizer, panels);
    }
    LoadFiles("cookie");
}
function getCookies() {
    const cookieString = document.cookie;
    
    const cookies = cookieString.split(';');
    const cookieArray = [];
    
    cookies.forEach(cookie => {
        const trimmedCookie = cookie.trim();
        
        const separatorIndex = trimmedCookie.indexOf('=');
        if (separatorIndex === -1) {
            return;
        }
        
        const key = trimmedCookie.substring(0, separatorIndex);
        const value = trimmedCookie.substring(separatorIndex + 1);
        
        cookieArray.push({ key, value });
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
                createDivs(current_menu);
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
            if(key && value){
                acc[key] = value;
            }
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

function updateStorage() {
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

    keys.forEach((keyInput, index) => {
        const key = keyInput.value.trim();
        const value = values[index].value.trim();

        if (key) {
            document.cookie = `${key}=${value}; path=/`;
        }
    });
    console.log("Cookies updated!");

    keys.forEach((keyInput, index) => {
        const key = keyInput.value.trim();
        const value = values[index].value.trim();

        if (key) {
            sessionStorage.setItem(key, value);
        }
    });
    console.log("SessionStorage updated!");
    makediv(current_menu);
}

function findAndReplace(){
    CloseDropdowns();
    const keys = document.querySelectorAll('#pAdeblc-filesystem-Names input');
    const values = document.querySelectorAll('#pAdeblc-filesystem-Values input');
    const query = prompt("Enter text to find:");
    const replace = prompt("Text to replace with:");
    if (query && replace !== null) {
        let found = false;
        keys.forEach((keyInput, index) => {
            if (keyInput.value.toLowerCase().includes(query.toLowerCase())) {
                keyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                keyInput.focus();
                keyInput.value = keyInput.value.replace(new RegExp(query, 'gi'), replace);
                found = true;
            }
        });
        values.forEach((valueInput, index) => {
            if (valueInput.value.toLowerCase().includes(query.toLowerCase())) { 
                valueInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                valueInput.focus();
                valueInput.value = valueInput.value.replace(new RegExp(query, 'gi'), replace);
                found = true;
            }
        });
        if (found) {
            console.log('Find and replace completed.');
        } else {
            console.warn('Text not found.');
        }
    } else {
        console.error('Operation cancelled or invalid input.');
    }
}


function findText(){
    CloseDropdowns();
    const keys = document.querySelectorAll('#pAdeblc-filesystem-Names input');
    const values = document.querySelectorAll('#pAdeblc-filesystem-Values input');
    const query = prompt("Enter text to find:");
    if (query) {
        let found = false;
        keys.forEach((keyInput, index) => {
            if (keyInput.value.toLowerCase().includes(query.toLowerCase())) {
                keyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                keyInput.focus();
                found = true;
            }
        });
        values.forEach((valueInput, index) => {
            if (valueInput.value.toLowerCase().includes(query.toLowerCase())) { 
                valueInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                valueInput.focus();
                found = true;
            }
        });
        if (!found) {
            console.warn('Text not found.');
        }
    } else {
        console.log('Search cancelled.');
    }
}

function copyText() {
    CloseDropdowns();
    const keys = document.querySelectorAll('#pAdeblc-filesystem-Names input');
    const values = document.querySelectorAll('#pAdeblc-filesystem-Values input');
    let textToCopy = '';
    keys.forEach((keyInput, index) => {
        textToCopy += `${keyInput.value}: ${values[index].value}\n`;
    });
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}



function showFileProperties(name,location,size,type,date,file_type) {
    document.getElementById("pAdeblc-filesystem-filename").textContent = name;
    document.getElementById("pAdeblc-filesystem-filetype").textContent = file_type;
    document.getElementById("pAdeblc-filesystem-filelocation").textContent = location;
    document.getElementById("pAdeblc-filesystem-filesize").textContent = size + "kb";
    document.getElementById("pAdeblc-filesystem-filetype").textContent = type;
    document.getElementById("pAdeblc-filesystem-filedate").textContent = date;
}
function UpdatePersonalFileSystem(){
    const container = document.getElementById('pAdeblc-filesystem-content');
    let leftinputdata = document.getElementById("pAdeblc-filemanager-folder-input-left").value;
    let rightinputdata = document.getElementById("pAdeblc-filemanager-folder-input-right").value;
    renderPanel(container.querySelector('#left-file-list'), `${leftinputdata}`);
    renderPanel(container.querySelector('#right-file-list'), `${rightinputdata}`);

}
function initializeFileSystem() {
makefile('ReadMe.txt', 'This is the root ReadMe file', 'root');
makefile('License.md', 'MIT License Information', 'root');
makefolder('Projects', 'root');
makefolder('Archives', 'root');

makefile('App.js', 'Main application file', 'root/Projects');
makefile('Config.json', '{ "setting": "value" }', 'root/Projects');
makefile('Data.csv', 'Name,Age,Location\nAlice,30,NY\nBob,25,LA', 'root/Projects');

makefolder('Backend', 'root/Projects');
makefile('Server.js', 'const express = require("express");', 'root/Projects/Backend');
makefile('Database.sql', 'CREATE TABLE users (id INT, name TEXT);', 'root/Projects/Backend');

makefile('OldApp.js', 'Deprecated app file', 'root/Archives');
makefile('Backup.zip', 'Backup archive data', 'root/Archives');

makefolder('Logs', 'root/Archives');
makefile('2025.log', 'System log data', 'root/Archives/Logs');
makefile('2024.log', 'System log data', 'root/Archives/Logs');

makefolder("Test","root")
makefile('TestFile.txt', 'Sample test data', 'root/Test');
makefile('Script.py', 'print("Hello, world!")', 'root/Test');
makefolder('SubTest', 'root/Test');
makefile('Details.txt', 'SubTest folder details', 'root/Test/SubTest');

}
initializeFileSystem();

function resize(e) {
    if (!isResizing) return;

    const dx = e.clientX - startX;
    const newPrevWidth = startPrevSize + dx;
    const newNextWidth = startNextSize - dx;
    previousBox.style.width = `${newPrevWidth}px`;
    nextBox.style.width = `${newNextWidth}px`;
    e.preventDefault();
}

function stopResizing() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
}
function CreateFileUsingContextMenu(path){
    const name = prompt("Enter the name of the file:");
    makefile(name,"",path)
    UpdatePersonalFileSystem();
}
function CreateFolderUsingContextMenu(path){
    const name = prompt("Enter the name of the folder:");
    makefolder(name,path)
    UpdatePersonalFileSystem();
}
function createDivs(type) {
    current_menu = type;
    if (type !== "personalfiles") {
        let darker = false;
        document.getElementById("pAdeblc-filesystem-content").innerHTML = `
            <div class="pAdeblc-filesystem-row" style="display: flex; align-items: stretch;">
                    <div id="pAdeblc-filesystem-Names" style="flex-grow: 1; overflow-y: hidden; overflow-x:hidden;">
                        
                    </div>
                    <div class="resizer vertical" id="resizer" style="cursor: ew-resize; margin-left:0.8vw; width: 0.2vw; background: #333;"></div>
                    <div id="pAdeblc-filesystem-Values" style="flex-grow: 2; overflow-y: hidden; overflow-x:hidden;">
                        
                    </div>
            </div>
        `;
        document.getElementById("pAdeblc-filesystem-content").style.display = "block";
        document.getElementById("pAdeblc-filesystem-content").style.flexDirection = "none";
        document.getElementById("pAdeblc-filesystem-Names").innerHTML = `<button class="pAdeblc-filesystem-filename">Name</button>`;
        document.getElementById("pAdeblc-filesystem-Values").innerHTML = `<button class="pAdeblc-filesystem-filename">Value</button>`;
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
        
        if (type === "cookie") {
            let cookieArray = getCookies();
            cookieArray.forEach(cookie => {
                darker = !darker;
                makediv(cookie.key, false, false, false, darker);
                makediv(cookie.value, true, false, false, darker);
            });
        } else if (type === "localstorage") {
            for (let i = 0; i < localStorage.length; i++) {
                darker = !darker;
                let key = localStorage.key(i); 
                let value = localStorage.getItem(key);
                makediv(key, false, false, false, darker);
                makediv(value, true, false, false, darker);
            }
        } else if (type === "sessionstorage") {
            for (let i = 0; i < sessionStorage.length; i++) {
                darker = !darker;
                let key = sessionStorage.key(i); 
                let value = sessionStorage.getItem(key);
                makediv(key, false, false, false, darker);
                makediv(value, true, false, false, darker);
            }
        }
    } else {

        document.getElementById("pAdeblc-filesystem-content").innerHTML = `
            <div class="pAdeblc-filemanager-panel">
                <div style="display: flex; align-items: center;">
                    <input class='folder-input' id="pAdeblc-filemanager-folder-input-left" type="text" style="flex: 1 1 auto;" placeholder="Enter folder path..." value="/root"/> 

                    <button class="pAdeblc-filemanager-go-root" id="pAdeblc-filemanager-go-root-left">*</button>

                    <button class="pAdeblc-filemanager-go-up" id="pAdeblc-filemanager-go-up-left">▼</button>
                </div>
                <div class="file-list pAdeblc-filemanager-scrollbar" id="left-file-list"></div>
            </div>
            <div class="pAdeblc-filemanager-resizer "></div>
            <div class="pAdeblc-filemanager-panel">
                <div style="display: flex; align-items: center;">
                    <input class='folder-input' id="pAdeblc-filemanager-folder-input-right" type="text" placeholder="Enter folder path..." value="/root"/> 

                    <button class="pAdeblc-filemanager-go-root" id="pAdeblc-filemanager-go-root-right">*</button>
                    
                    <button class="pAdeblc-filemanager-go-up" id="pAdeblc-filemanager-go-up-right">▼</button>
                </div>
                <div class="file-list pAdeblc-filemanager-scrollbar" id="right-file-list"></div>
            </div>
        `; 
        document.getElementById("pAdeblc-filesystem-content").style.display = "flex";
        document.getElementById("pAdeblc-filesystem-content").style.flexDirection = "row";
        const container = document.getElementById('pAdeblc-filesystem-content');
        const resizer = container.querySelector('.pAdeblc-filemanager-resizer');
        const panels = container.querySelectorAll('.pAdeblc-filemanager-panel');
        makeResizable(resizer, panels);
        
        const leftInput = document.getElementById('pAdeblc-filemanager-folder-input-left');
        const rightInput = document.getElementById('pAdeblc-filemanager-folder-input-right');
        
        const leftGoRoot = document.getElementById('pAdeblc-filemanager-go-root-left');
        const rightGoRoot = document.getElementById('pAdeblc-filemanager-go-root-right');
        const leftGoUp = document.getElementById('pAdeblc-filemanager-go-up-left');
        const rightGoUp = document.getElementById('pAdeblc-filemanager-go-up-right');

        leftGoRoot.addEventListener('click', () => {
            const path = `/root`;
            renderPanel(container.querySelector('#left-file-list'), path);
            leftInput.value = path;
        });
        
        rightGoRoot.addEventListener('click', () => {
            const path = "/root";
            renderPanel(container.querySelector('#right-file-list'), path);
            rightInput.value = path;
        });
        
        leftGoUp.addEventListener('click', () => {
            const path = leftInput.value.trim().split('/').slice(0, -1).join('/');
            if (path == ""){
                return
            }
            renderPanel(container.querySelector('#left-file-list'), path);
            leftInput.value = path;
            
        });
        
        rightGoUp.addEventListener('click', () => {
            const path = rightInput.value.trim().split('/').slice(0, -1).join('/');
            if (path == ""){
                return
            }
            renderPanel(container.querySelector('#right-file-list'), path);
            rightInput.value = path;
        });
        leftInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const path = leftInput.value.trim();
                renderPanel(container.querySelector('#left-file-list'), path);
            }
        });
        
        rightInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const path = rightInput.value.trim();
                renderPanel(container.querySelector('#right-file-list'), path);
            }
        });
        function openTxEditor(){
            const txeditor = document.getElementById('pAdeblc-txeditor-main');
            if (txEditorTabCount <= 20){
                txeditor.style.display = "block";
                bringToFront(txeditor);
                txEditorTabCount += 1;
            }
        }
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
        container.querySelector('#left-file-list').addEventListener('dblclick', (e) => {
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'folder') {
                const currentPath = leftInput.value.trim();
                const folderName = target.dataset.name;
                const newPath = navigatePath(currentPath, folderName);
                leftInput.value = newPath;
                renderPanel(container.querySelector('#left-file-list'), newPath);
            } else if (target && target.dataset.type === 'file') {
                openTxEditor();
                const file_extension = file_types_clean[target.dataset.name.split('.').pop()];
                try{
                    createNewTxEditorTab(target.dataset.name, target.dataset.contents ,global_tabbt,global_tabcontainer,file_extension);
                } catch(e) {
                    
                }
            }
        });
        container.querySelector('#left-file-list').addEventListener('mousedown', (e) => {
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'file') {
                const file_extension = file_types[target.dataset.name.split('.').pop()];
                showFileProperties(target.dataset.name,target.dataset.location,target.dataset.size,file_extension,target.dataset.date);
            }
        })
        container.querySelector('#right-file-list').addEventListener('mousedown', (e) => {
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'file') {
                const file_extension = file_types[target.dataset.name.split('.').pop()];
                showFileProperties(target.dataset.name,target.dataset.location,target.dataset.size,file_extension,target.dataset.date);
            }
        })
        container.querySelector('#right-file-list').addEventListener('dblclick', (e) => {
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'folder') {
                const currentPath = rightInput.value.trim();
                const folderName = target.dataset.name;
                const newPath = navigatePath(currentPath, folderName);
                rightInput.value = newPath;
                renderPanel(container.querySelector('#right-file-list'), newPath);
            } else if (target && target.dataset.type === 'file') {  
                openTxEditor();
                const file_extension = file_types_clean[target.dataset.name.split('.').pop()];
                try{
                    createNewTxEditorTab(target.dataset.name, target.dataset.contents ,global_tabbt,global_tabcontainer,file_extension);
                } catch(e) {
                    
                }
            }
        });
        
        renderPanel(container.querySelector('#left-file-list'), '/root');
        renderPanel(container.querySelector('#right-file-list'), '/root');
        const leftFileList = document.getElementById("left-file-list");
        const rightFileList = document.getElementById("right-file-list");
    
        const handleContextMenu = (event,container,pathInput,type) => {
            const folderPath = pathInput.value.trim();
            if (event.target === container) {
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
                contextMenu.style.height = "4vw";
                contextMenu.style.width = "10vw";
                contextMenu.style.display = "block";
                bringToFront(contextMenu);
                contextMenu.innerHTML = `
                    <a href="#" onclick="CreateFileUsingContextMenu('${folderPath}')">Create File</a>
                    <a href="#" onclick="CreateFolderUsingContextMenu('${folderPath}')">Create Folder</a>
                `;
                document.body.appendChild(contextMenu);
    
                contextMenu.addEventListener("click", (e) => {
                    if (e.target.tagName === "A") {
                        const action = e.target.textContent.trim();
                        document.body.removeChild(contextMenu);
                    }
                });
            }
        };
    
        if (leftFileList && leftInput) {
            leftFileList.addEventListener("contextmenu", (e) => handleContextMenu(e, leftFileList, leftInput));
        }
    
        if (rightFileList && rightInput) {
            rightFileList.addEventListener("contextmenu", (e) => handleContextMenu(e, rightFileList, rightInput));
        }
    }
    
}

function LoadFiles(type) {
    createDivs(type);
}
MakeFileSystem();
