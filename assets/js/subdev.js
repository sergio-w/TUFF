// const comfortaa = document.createElement('link');
// comfortaa.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap';
// comfortaa.rel = 'stylesheet';
// document.head.appendChild(comfortaa);

const loaderstyle = document.createElement("style");
loaderstyle.innerHTML = `
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg);filter: blur(0vw); }
    25% {filter: blur(0.1vw); }
    50% { -webkit-transform: rotate(360deg);filter: blur(0vw); }
    100% { -webkit-transform: rotate(360deg);filter: blur(0vw); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg);filter: blur(0vw); }
    25% {filter: blur(0.1vw); }
    50% { transform: rotate(360deg);filter: blur(0vw)}
    100% { transform: rotate(360deg);filter: blur(0vw); }
  }

  .loadertext {
    position: absolute;
    left: 50%;
    top: 65%;
    transform: translate(-50%, -50%);
    color: rgb(255, 255, 255);
    font-size: 4vh;
    text-align: center;
    font-family: 'Comfortaa', cursive;
    z-index: 2;
  }
  .loaderpercent {
    position: absolute;
    left: 50%;
    top: 75%;
    transform: translate(-50%, -50%);
    color: rgb(255, 255, 255);
    font-size: 2vh;
    text-align: center;
    font-family: 'Comfortaa', cursive;
    z-index: 10;
  }
  .dot {
    margin-left: 0.3vw;
    animation: blink 1.5s infinite;
  }
  .dot:nth-child(2) {
    animation-delay: 0.3s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.6s;
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -11vh 0 0 -11vh;
    border: 0.1vw solid #f3f3f3;
    border-radius: 15%;
    height: 20vh;
    width: 20vh;
    animation: spin 1.2s ease-in-out infinite;
    z-index: 1;
  }

  .loaderbg {
    background-color: rgb(25, 25, 25);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .loaderbarparent {
    position: fixed;
    width: 50vw;
    height: 5vh;
    position: absolute;
    left: 50%;
    top: 75%;
    transform: translate(-50%, -50%);
    z-index: 5;
    border-radius: 0.5vw;
    background-color: rgb(46, 46, 46);
    overflow: hidden;
  }

  .loaderbar {
    position: absolute;
    width: 0%;
    transition: width 0.5s ease-in-out;
    height: 5vh;
    border-radius: 0.5vw;
    left: 0;
    top: 0;
    background: repeating-linear-gradient(45deg, rgb(150, 56, 232), rgb(150, 56, 232) 20px, rgb(94, 16, 163) 20px, rgb(94, 16, 163) 40px);
  }
`;
document.head.appendChild(loaderstyle);
const loadedScripts = new Set();
window.__scriptInjected = true;
async function loadPageContent() {
  try {
    const response = await fetch("sub.txt");
    const data = await response.text();

    const tempContainer = document.documentElement
    tempContainer.innerHTML = data;

    let scripts = [...tempContainer.querySelectorAll("script")];
    let inlineScripts = scripts.filter(script => !script.src);
    let externalScripts = scripts.filter(script => script.src);

    let onloaddata = null;
    if (tempContainer.querySelector("body")?.onload) {
      onloaddata = tempContainer.querySelector("body").onload.toString().match(/\{([\s\S]*)\}/)[1].trim();
      console.log("Extracted onload function:", onloaddata);
    }

    document.documentElement.innerHTML = tempContainer.innerHTML;
    for (const script of scripts) {
      if (script.src){
        await loadExternalScript(script.src, script.type, script.async);
      } else {
        await executeInlineScript(script);
      }
    };
  
    if (onloaddata) {
      console.log("Executing onload function...");
      setTimeout(() => {
        eval(onloaddata);
      }, 500);
    }
    console.log("All content and scripts loaded successfully.");

  } catch (error) {
    console.error("Failed to load content:", error);
  }
}

async function executeInlineScript(script) {
  if (script.hasAttribute("data-executed")) return;
  script.setAttribute("data-executed", "true");

  return new Promise((resolve) => {
    eval(script.textContent);
    resolve();
  });
}


async function loadExternalScript(src, type = "text/javascript", async = false,isbody) {
  console.log(`Loading script: ${src}`);
  if (loadedScripts.has(src)) {
    console.log(`Ignoring already executed script: ${src}`);
    return;
  }
  return new Promise((resolve) => {
    const newScript = document.createElement("script");
    newScript.src = src;
    newScript.async = async;
    newScript.onload = () => {
      console.log(`Loaded script: ${src} with content: ${newScript.textContent}`);
      loadedScripts.add(src);
      resolve();
    };
    newScript.onerror = (err) => {
      console.error(`Failed to load script: ${src}`, err);
      resolve();
    };
    if (isbody) {
      document.body.appendChild(newScript);
    } else {
      document.head.appendChild(newScript);
    }
  });
}

function initload() {
  const loadercontainer = document.createElement("div");
  loadercontainer.id = "loadercontainer";
  loadercontainer.classList.add("loaderbg");

  const loaderspin = document.createElement("img");
  loaderspin.id = "loader";
  loaderspin.src = "/assets/img/loader.png";
  loaderspin.classList.add("loader");

  const loadertext = document.createElement("div");
  loadertext.id = "loadertext";
  loadertext.innerHTML = `Loading<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
  loadertext.classList.add("loadertext");

  const loaderbarparent = document.createElement("div");
  loaderbarparent.id = "loaderbarparent";
  loaderbarparent.classList.add("loaderbarparent");

  const loaderbar = document.createElement("div");
  loaderbar.id = "loaderbar";
  loaderbar.classList.add("loaderbar");

  const loaderpercent = document.createElement("div");
  loaderpercent.id = "loaderpercent";
  loaderpercent.classList.add("loaderpercent");

  function loadbar() {
    let width = 25;
    loaderbar.style.width = width + "%";
    loaderpercent.innerHTML = width + "%";

    setTimeout(() => {
      const id = setInterval(() => {
        if (width >= 100) {
          clearInterval(id);
          loadertext.innerHTML = "Done loading!";
          setTimeout(loadPageContent, 1000);
        } else {
          width++;
          loaderbar.style.width = width + "%";
          loaderpercent.innerHTML = width + "%";
        }
      }, 40);
    }, 100);
  }

  loadbar();
  
  document.body.appendChild(loadercontainer);
  loadercontainer.appendChild(loaderspin);
  loadercontainer.appendChild(loadertext);
  loadercontainer.appendChild(loaderbarparent);
  loadercontainer.appendChild(loaderpercent);
  loaderbarparent.appendChild(loaderbar);
}

initload();
