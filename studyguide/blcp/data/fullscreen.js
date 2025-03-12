(function () {
  // Function to enter fullscreen mode
 function enterFullscreen() {
    if (!document.fullscreenElement) {
      const docElement = document.documentElement; // Entire document
      if (docElement && docElement.requestFullscreen) {
        docElement.requestFullscreen()
          .then(() => {
            console.log("Entered fullscreen mode for the entire document.");
            // Optionally hide/show UI elements as needed
            const fsButton = document.getElementById("fullscreen-btn");
            if (fsButton) {
              fsButton.style.display = "none";
            }
          })
          .catch((err) => {
            console.error(`Failed to enter fullscreen: ${err.message}`);
          });
      } else {
        console.error("Fullscreen mode is not supported or document not found.");
      }
    }
  }

  // Function to reset zoom
  function resetZoom() {
    const canvas = document.getElementById("game-container-main"); // Unity WebGL canvas element
    if (canvas) {
      canvas.style.transform = "scale(1)"; // Reset the scale
      console.log("Canvas zoom reset after fullscreen exit.");
    }
  }

  // Simple check for mobile user agent (not always perfect)
  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Create a big fullscreen button if on mobile
  function createFullscreenButton() {
    const button = document.createElement("button");
    button.id = "fullscreen-btn";
    button.innerText = "Go Fullscreen";
    button.style.position = "absolute";
    button.style.top = "50%";
    button.style.left = "50%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.zIndex = "9999";
    button.style.padding = "20px 40px";
    button.style.fontSize = "24px";
    button.style.cursor = "pointer";
    button.style.backgroundColor = "#f0ad4e";
    button.style.border = "none";
    button.style.borderRadius = "8px";

    // On click, enter fullscreen
    button.addEventListener("click", enterFullscreen);

    document.body.appendChild(button);
  }

  // Initialize fullscreen logic
// Initialize fullscreen logic
  function initializeFullscreen() {
    // If on mobile, show big button
    if (isMobileDevice()) {
      createFullscreenButton();
    }

    // Listen for fullscreen changes (enter or exit)
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        console.log("Fullscreen mode entered.");
      } else {
        console.log("Exited fullscreen mode.");
        // resetZoom();

        // If user exits fullscreen, re-show the button on mobile (if it exists)
        const fsButton = document.getElementById("fullscreen-btn");
        if (fsButton && isMobileDevice()) {
          fsButton.style.display = "block";
        }
      }
    });

    console.log("Fullscreen functionality initialized.");
  }

  // Initialize immediately
  initializeFullscreen();
})();
