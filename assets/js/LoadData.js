window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-KW15Q1QG97');
var can_redirect = false;

function LoadData() {
    var TitleData = localStorage.getItem("Title");
    var FaviData = localStorage.getItem("Favi");
    console.log("Loaded title `" + TitleData + "` with icon `" + "/" + FaviData + "`");
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
document.addEventListener('keydown', function (event) {
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
window.addEventListener("blur", () => {
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
function MakeThing() {
    if (!document.body || !document.head) {
        console.error("DOM not ready, delaying script execution.");
        document.addEventListener("DOMContentLoaded", MakeThing);
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = `body { overflow: hidden; }`;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.src = "/assets/js/teacher.js";
    script.onerror = function () {
        console.error("Failed to load the script:", script.src);
    };
    document.head.appendChild(script);
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
    script.onerror = function () {
        console.error("Failed to load the script:", script.src);
    };
    document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function () {
    MakeThing();
});


// Very secret things

// (function () {
//     const STATUS_PAGE_URL = `${window.location.protocol}//${window.location.host}`;
//     const STATUS_API = `${STATUS_PAGE_URL}/status`;

//     document.addEventListener("DOMContentLoaded", function() {
//         var banner = document.createElement('div');
//         banner.style.position = 'fixed';
//         banner.style.top = '0';
//         banner.style.left = '0';
//         banner.style.width = '100vw';
//         banner.style.background = '#ffa500';
//         banner.style.color = '#000';
//         banner.style.padding = '1vh 2vw';
//         banner.style.textAlign = 'center';
//         banner.style.fontSize = '2vh';
//         banner.style.fontFamily = 'Arial, sans-serif';
//         banner.style.display = 'none';
//         banner.style.zIndex = '10000';
//         banner.style.overflow = 'hidden';
//         banner.style.display = 'flex';
//         banner.style.alignItems = 'center';
//         banner.style.justifyContent = 'space-between';

//         var bannerTextWrapper = document.createElement('div');
//         bannerTextWrapper.style.flex = '1';
//         bannerTextWrapper.style.overflow = 'hidden';
        
//         var bannerText = document.createElement('span');
//         bannerText.style.overflow = 'hidden';
//         bannerText.style.whiteSpace = 'nowrap';
//         bannerText.style.textOverflow = 'ellipsis';
//         bannerText.style.display = 'inline-block';
//         bannerText.style.maxWidth = '65vw';
//         bannerTextWrapper.appendChild(bannerText);
//         banner.appendChild(bannerTextWrapper);

//         var controlsWrapper = document.createElement('div');
//         controlsWrapper.style.display = 'flex';
//         controlsWrapper.style.alignItems = 'center';

//         var viewDetails = document.createElement('a');
//         viewDetails.innerText = ' View Details';
//         viewDetails.href = 'https://status.juststudying.uk';
//         viewDetails.target = '_blank';
//         viewDetails.style.marginLeft = '1vw';
//         viewDetails.style.color = '#000';
//         viewDetails.style.textDecoration = 'underline';
//         controlsWrapper.appendChild(viewDetails);

//         var bannerClose = document.createElement('span');
//         bannerClose.innerText = ' ✖';
//         bannerClose.style.cursor = 'pointer';
//         bannerClose.style.marginLeft = '1vw';
//         bannerClose.style.fontWeight = 'bold';
//         bannerClose.style.padding = '0 1vw';
//         bannerClose.onclick = function() {
//             banner.style.display = 'none';
//         };
//         controlsWrapper.appendChild(bannerClose);

//         banner.appendChild(controlsWrapper);
//         document.body.appendChild(banner);

//         function fetchStatus() {
//             fetch(STATUS_API)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.incident && data.incident.title) {
//                         let message = `${data.incident.title}: ${data.incident.content}`;
//                         bannerText.innerText = message;
//                         bannerText.title = message;
//                         banner.style.display = 'flex';
//                     } else {
//                         banner.style.display = 'none';
//                     }
//                 })
//                 .catch(err => {
//                     console.error('Error fetching Uptime Kuma status:', err);
//                     bannerText.innerText = 'Error fetching status';
//                 });
//         }
        
//         fetchStatus();
//         setInterval(fetchStatus, 60000);
//     });
// })(); 

