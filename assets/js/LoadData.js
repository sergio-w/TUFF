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
    
}
LoadData();