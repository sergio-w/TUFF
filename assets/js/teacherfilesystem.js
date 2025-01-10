const style = document.createElement('style');
style.innerHTML = `
.pAdeblc-image {
  width: 1.5vw;
  height: 1.5vh;   
  image-rendering: pixelated;
   object-fit: contain;
}
.pAdeblc-filesystem-side-container {
    width: 12vw;
    margin-right: 0.5vw;
    margin-left: 0.5vw;
    margin-top: 3vw;
    height: 30vw;
}
.pAdeblc-filesystem-main-container {
    width: 50vw;
    margin-right: 0.5vw;
    margin-left: 0.5vw;
    margin-top: 3vw;
    height: 30vw;
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
`;
document.body.appendChild(style);
function MakeFileSystem(){
    const newWindow = document.createElement('div');
    newWindow.classList.add("pAdeblc");
    newWindow.id = "pAdeblc-txeditor-main";
    newWindow.style = "font-family: 'MS Sans Serif', sans-serif; position: fixed; top: 25%; left: 25%; width: 56vw; height: 36vw; background: #c0c0c0; border: 0.2vw solid #fff; border-top-color:#fff; border-left-color:#fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); z-index: 9999; box-sizing: border-box;";
    newWindow.innerHTML = `
        <div id="pAdeblc-top-txeditor" style="cursor: move; text-align: left; height: 1.5vw; background: -webkit-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: -moz-linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); background: linear-gradient(to right, rgb(29, 47, 216), rgb(2, 107, 226)); padding: 0.4vw; font-family: 'MS Sans Serif', sans-serif; font-size: 1.4vw; color: rgb(255, 255, 255); font-weight: bold; z-index: 10000; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin-left: 0.5vw;">
                <img src="/assets/img/winicons/window.png" class="pAdeblc-image" style="width: 2vw; height: 2vh;">
                Juststudy CE File System
            </span>
            <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; cursor: pointer;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="document.getElementById('pAdeblc-txeditor-main').style.display = 'none'; textwindow_open = false;">X</button>
        </div>
        <div class="pAdeblc-content-new" id="pAdeblc-content-new" style="display: flex;">
            <div class="pAdeblc-filesystem-side-container cewlborder-in">
                 <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="">
                    Cookies
                 </button>
                  <button style="font-family: 'Tahoma', sans-serif; font-size: 1vw; color: #000; background-color: #C0C0C0; border: 0.1vw solid #fff; margin-bottom: 0.5vw; margin-top: 0.5vw; margin-left: 0.5vw; margin-right: 0.5vw; border-top-color: #fff; border-left-color: #fff; border-right-color: rgb(56, 56, 56); border-bottom-color: rgb(56, 56, 56); padding: 0.15vw 0.5vw; width: 10vw; cursor: pointer; text-align: left;" onmouseover="hoverBtIn(this)" onmouseout="hoverBtOut(this)" onclick="">
                    LocalStorage
                 </button>
            </div>
             <div class="pAdeblc-filesystem-main-container cewlborder-in">
            </div>
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
};
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