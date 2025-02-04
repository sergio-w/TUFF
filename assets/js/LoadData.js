window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KW15Q1QG97');
var can_redirect = false;

function LoadData(){
    var TitleData = localStorage.getItem("Title");
    var FaviData = localStorage.getItem("Favi");
    console.log("Loaded title `" + TitleData  + "` with icon `" + "/" + FaviData + "`");
    if (TitleData === null) {
    document.title = "JustStudy";
    document.querySelector("link[rel='shortcut icon']").href = '/assets/img/favicon.ico';
    }
    else {
        document.title = TitleData;
        document.querySelector("link[rel='shortcut icon']").href = "/" + FaviData;
    }
    
};
let key_input_data = "";
document.addEventListener('keydown', function(event) {
    key_input_data = "";
    const keys = new Set();

    if (event.ctrlKey) keys.add('Ctrl');
    if (event.altKey) keys.add('Alt');
    if (event.shiftKey) keys.add('Shift');
    if (event.metaKey) keys.add('Meta');
    keys.add(event.key);
    key_input_data = Array.from(keys).join('+');

    const urls = [
        "https://senecalearning.com/",
        "https://www.sparxmaths.com",
        "https://www.tassomai.com"
    ];

    if (key_input_data == localStorage.getItem("panickey")) {
        if (localStorage.getItem("Title") == "Seneca - Learn 2x Faster") {
            window.location.href = urls[0];   
        } else if (localStorage.getItem("Title") == "Sparx Maths - Home") {
            window.location.href = urls[1];
        } else if (localStorage.getItem("Title") == "Tassomai") {
            window.location.href = urls[2];
        } else if (localStorage.getItem("Title") == "JustStudy") {
            window.location.href = urls[Math.floor(Math.random() * 3)];
        }
    }

});
window.addEventListener("blur",()=>{
    if (key_input_data == "Alt" && localStorage.getItem("redirect") === 'true') {
        const urls = [
            "https://senecalearning.com/",
            "https://www.sparxmaths.com",
            "https://www.tassomai.com"
        ];
        if (localStorage.getItem("Title") == "Seneca - Learn 2x Faster") {
            console.log("redirecting")
            window.location.href = urls[0];   
        } else if (localStorage.getItem("Title") == "Sparx Maths - Home") {
            window.location.href = urls[1];
        } else if (localStorage.getItem("Title") == "Tassomai") {
            window.location.href = urls[2];
        } else if (localStorage.getItem("Title") == "JustStudy") {
            console.log("redirecting")
            window.location.href = urls[Math.floor(Math.random() * 3)];
        }
    }
})
function MakeThing(){
    const script = document.createElement("script");
    script.src = "/assets/js/teacherfilesystem.js";
    document.body.appendChild(script);
}
LoadData();
function MakeThing() {
    const style = document.createElement('style');
    style.innerHTML = `
    body{
        overflow: hidden;
    }
    `;
    document.body.appendChild(style);
    const script = document.createElement("script");
    script.src = "/assets/js/teacher.js";
    script.onerror = function() {
        console.error("Failed to load the script:", script.src);
    };
    document.head.appendChild(script);
}
MakeThing();