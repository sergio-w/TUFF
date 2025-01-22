var nextAdapterStudentConfig = null;
var nextOnConfigLoaded = null;

function nextAdapterMessageHandler(message) {
    if (message.data.type === 'game:config') {
      nextAdapterStudentConfig = message.data.payload.config;
      if (nextOnConfigLoaded !== null) {
        nextOnConfigLoaded();
      }
    }
}
window.addEventListener('message', nextAdapterMessageHandler);
window.parent.postMessage({ type: 'game:config', payload: {} }, '*');

// Retrieve the student config or null if not yet loaded
function getStudentConfig() {
    return nextAdapterStudentConfig;
}

// Invoke callback when the student config is loaded
function onMultStudentConfigLoaded(callback) {
  nextOnConfigLoaded = callback;
  if (nextAdapterStudentConfig !== null) {
    nextOnConfigLoaded();
  }
}

// Tracking game_start event
function nextAdapterGameStarted() {
  window.parent.postMessage({ type: 'game:started', payload: {}}, '*');
  // Remove the event once the game iframe is clicked once
  document.removeEventListener('click', nextAdapterGameStarted);
}
// If the game iframe area is clicked once, we assume the user is interacting with the game and regard the game as started
document.addEventListener('click', nextAdapterGameStarted);