

const pickerstyle = document.createElement('style');
pickerstyle.innerHTML = `
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
    overflow-y: hidden;
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
.pAdeblc-filepicker-bt:hover {
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
    overflow-y: scroll;
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
    text-align: center; 
    width: 1.5vw;
    flex: 0 1 auto;
    margin-right: 0.5vw;
    padding: unset;
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
    padding: unset;
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
.pAdeblc-filepicker-container {
    display: flex;
    flex-direction: column;
    padding: 0.5vw;
    box-sizing: border-box;
    background: #C0C0C0;
    border: 0.1vw solid #fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
    border-top-color: #fff;
    border-left-color: #fff;
}

.pAdeblc-filepicker-title {
    font-size: 1vw;
    font-family: 'Tahoma', sans-serif;
    text-align: left;
    color: #000;
    margin-bottom: 0.5vw;
}
.pAdeblc-filepicker-bt {
    font-family: 'Tahoma', sans-serif;
    font-size: 1vw;
    height: 1.8vw;
    color: #000;
    background-color: #C0C0C0;
    width: 3.5vw;
    cursor: pointer;
    border: 0.1vw solid #fff;
    border-top-color:#fff;
    border-left-color:#fff;
    border-right-color: rgb(56, 56, 56);
    border-bottom-color: rgb(56, 56, 56);
]
}
.pAdeblc-filepicker-input-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: left;
    gap: 0.5vw;
    width: 100%;
}
.pAdeblc-filepicker-input {
    flex: 1 1 auto;
    height: 1.8vw;
    border: 0.1vw solid #fff;
    border-left-color: rgb(56, 56, 56);
    border-bottom-color: #fff;
    border-top-color: rgb(56, 56, 56);
    border-right-color: #fff;
    outline: none;
    font-size: 1vw;
    background: rgb(255, 255, 255);
    padding: 0.2vw;
}

`;
document.head.appendChild(pickerstyle);

let CurrentSelectedFile = "";
let CurrentSelectedFolder = "";
let CurrentSelectedFileName = "";
let FileData = "";


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
function getFileContent(path, filename) {
    const folder = getFolderByPath(path);
    const file = folder.contents.find(item => item.type === 'file' && item.name === filename);
    return file.data;
}
function setFileContent(path,filename,data) {
    const folder = getFolderByPath(path);
    const file = folder.contents.find(item => item.type === 'file' && item.name === filename);
    file.data = data;
    file.file_size = getStringSizeUsingBlob(data);
    saveFilesystem();
    if (current_menu == "personalfiles") {
        UpdatePersonalFileSystem();
    }
}
function MakeFilePicker(data){
    const newWindow = document.createElement('div');
    newWindow.classList.add(".pAdeblc");
    newWindow.classList.add("pAdeblc-filepicker-main");
    newWindow.classList.add(".pAdeblc-main")
    newWindow.id = "pAdeblc-filepicker-main";
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 45vw; background: #c0c0c0; border: 0.2vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";

    newWindow.innerHTML = `
        <div id="pAdeblc-top-filesystem" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin: 0.5vw;">
                <img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2.5vw; height: 2.5vh;">
                Juststudy CE File Selector
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-filepicker-main').style.display = 'none';">X</button>
        </div>
        <div class="pAdeblc-filesystem-extra-container pAdeblc-cool-scroll" id="pAdeblc-filepicker-content">
        </div>
    `;
    FileData = data;
    document.body.appendChild(newWindow);
    makeFileManagerDraggable(newWindow);
    newWindow.addEventListener("click", () => bringToFront(newWindow));
    bringToFront(newWindow);
}
function stopResizing() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
}
function CloseFilePicker(){
    try{
        document.getElementById("pAdeblc-filepicker-main").remove()
        CurrentSelectedFile = null;
        CurrentSelectedFileName = null;
        CurrentSelectedFolder = null;
    } catch(e){}
}
function createPickerDivs(isgetdata) {
        document.getElementById("pAdeblc-filepicker-content").innerHTML = `
            <div class="pAdeblc-filemanager-panel">
                <div style="display: flex; align-items: center;">
                    <input class='folder-input' id="pAdeblc-filemanager-folder-input" type="text" style="flex: 1 1 auto;" placeholder="Enter folder path..." value="/root"/> 
                    <button class="pAdeblc-filemanager-go-root" id="pAdeblc-filemanager-go-root">*</button>
                    <button class="pAdeblc-filemanager-go-up" id="pAdeblc-filemanager-go-up">V</button>
                </div>
                
                <div class="file-list pAdeblc-cool-scroll" id="file-list" style="height: 18vw;"></div>
                 <div class="pAdeblc-filepicker-container cewlborder-in">
                    <div class="pAdeblc-filepicker-title">Select a file</div>
                    <div class="pAdeblc-filepicker-input-group">
                        <input class="pAdeblc-filepicker-input" placeholder="Enter file name..." id="pAdeblc-filepicker-input">
                        <button class="pAdeblc-filepicker-bt" id="pAdeblc-filepicker-select" >Select</button>
                        <button class="pAdeblc-filepicker-bt" id="pAdeblc-filepicker-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        `; 
        document.getElementById("pAdeblc-filepicker-content").style.display = "flex";
        document.getElementById("pAdeblc-filepicker-content").style.flexDirection = "row";
        const container = document.getElementById('pAdeblc-filepicker-content');
        const Input = document.getElementById('pAdeblc-filemanager-folder-input');
        const FileName = document.getElementById('pAdeblc-filepicker-input');
        const GoRoot = document.getElementById('pAdeblc-filemanager-go-root');
        const GoUp = document.getElementById('pAdeblc-filemanager-go-up');
        const SelectBT = document.getElementById('pAdeblc-filepicker-select');
        const CancelBT = document.getElementById('pAdeblc-filepicker-cancel');

        SelectBT.addEventListener('click', () => {
            const path = `${CurrentSelectedFolder}`;
            let filedata;
            if (isgetdata){
                filedata = getFileContent(path, CurrentSelectedFile);
                const file_extension = file_types_clean[CurrentSelectedFile.split('.').pop()];
                try{
                    if (txEditorTabCount <= 20){
                        createNewTxEditorTab(CurrentSelectedFile,filedata,global_tabbt,global_tabcontainer,file_extension);
                        txEditorTabCount += 1;
                    }
                } catch(e) {
                    
                }
            } else {
                setFileContent(path, CurrentSelectedFile,FileData);
            }
            CloseFilePicker();
        })
        CancelBT.addEventListener('click', () => {
            CloseFilePicker();
        });
        GoRoot.addEventListener('click', () => {
            const path = `/root`;
            renderPanel(container.querySelector('#file-list'), path);
            Input.value = path;
        });
        container.querySelector('#file-list').addEventListener('mousedown', (e) => {
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'file') {
                const file_extension = file_types[target.dataset.name.split('.').pop()];
                CurrentSelectedFile = target.dataset.name;
                CurrentSelectedFolder = Input.value.trim();
                FileName.value = target.dataset.name;
            }
        })
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
            }
        });
        const path = `/root`;
        renderPanel(container.querySelector('#file-list'), path);
}