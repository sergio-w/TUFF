 // set the alt+tab thing to work or not
 const switchElement = document.getElementById('redirectswitch');
 switchElement.addEventListener('change', () => {
   if (switchElement.checked) {
     localStorage.setItem('redirect', true);
   } else {
     localStorage.setItem('redirect', false);
   }
 });
 // url bootstrap (thanks 3kh0 :D)
 function applyBootstrapUrl() {
     const url = document.getElementById("url-target");
     const urlObj = new window.URL(window.location.href);
     var data = document.getElementById('UrlBt').value;
     var newdata = 'https://' + data;
     const win = window.open();
     win.document.body.style.margin = "0";
     win.document.body.style.height = "100vh";
     const iframe = win.document.createElement("iframe");
     iframe.style.border = "none";
     iframe.style.width = "100%";
     iframe.style.height = "100%";
     iframe.style.margin = "0";
     iframe.referrerpolicy = "no-referrer";
     iframe.allow = "fullscreen";
     iframe.src = newdata;
     win.document.body.appendChild(iframe);
 }
 document.getElementById('UrlButton').onclick = function(){
     applyBootstrapUrl()
 }
 // file bootstrap :))) (my own)
  function applyBootstrapFile() {
      const fileInput = document.getElementById('FileInputBt').files[0]; 
      const reader = new FileReader();

      reader.onload = function (e) {
          const data = e.target.result;
          const newWindow = window.open();
          newWindow.document.open();
          newWindow.document.write(data);
          newWindow.document.title = "about:blank";
      };
      reader.readAsText(fileInput);
     }
     // panic button thing
     const startButton = document.getElementById('panicbutton');
     const resultInput = document.getElementById('result');
     let detecting = false;

     startButton.addEventListener('click', () => {
       detecting = true;
       resultInput.value = "Listening for key presses...";
       resultInput.focus();
     });
     document.addEventListener('keydown', function(event) {
       if (detecting) {
         event.preventDefault();
         const keys = [];
         if (event.key != "Enter" ){
           if (event.ctrlKey) keys.push('Ctrl');
           if (event.altKey) keys.push('Alt');
           if (event.shiftKey) keys.push('Shift');
           if (event.metaKey) keys.push('Meta');
           keys.push(event.key);
           resultInput.value =keys.join('+');
         } else {
           setpanickey(resultInput.value);
         }
     }
     });
     function setpanickey(keys){
       detecting = false;
       localStorage.setItem("panickey", keys);
     }
 document.getElementById('toggleButton').addEventListener('click', toggleMenu);
 function myFunction() {

 var checkBox = document.getElementById("myCheck");

 var text = document.getElementById("text");


 if (checkBox.checked == true){
     text.style.display = "block";
 } else {
     text.style.display = "none";
  }
 }  
 function TabCloak(selectedValue, faviconUrl, name) {
     document.getElementById("SettingDropdown").innerHTML = "TabCloaker - " + name;
     document.title = selectedValue;
     document.querySelector("link[rel='shortcut icon']").href = faviconUrl;
     localStorage.setItem("Title", selectedValue);
     localStorage.setItem("Favi", faviconUrl);
 }