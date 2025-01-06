
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KW15Q1QG97');

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
document.addEventListener('keydown', function(event) {
    
    event.preventDefault();
    let input = "";
    const keys = [];
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.altKey) keys.push('Alt');
    if (event.shiftKey) keys.push('Shift');
    if (event.metaKey) keys.push('Meta');
    keys.push(event.key);
    input = keys.join('+');
    if (input == localStorage.getItem("panickey")) {
        if (localStorage.getItem("Title") == "Seneca") {
            window.location.href = "https://senecalearning.com/";   
        } if (localStorage.getItem("Title") == "Sparx Maths"){
            window.location.href = "https://www.sparxmaths.com/";
        } if (localStorage.getItem("Title") == "Tassomai"){
            window.location.href = "https://www.tassomai.com/";
        } if (localStorage.getItem("Title") == "JustStudy CE"){
            window.location.href = "";
        }
    }
});
LoadData();