document.addEventListener("DOMContentLoaded", function() {
    var updateMode = 0; // 0 for off, 1 for major update, 2 for minor update

    if (updateMode !== 0) {
        // Create the overlay div
        var overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = updateMode === 1 ? "100%" : "auto";
        overlay.style.backgroundColor = updateMode === 1 ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = updateMode === 1 ? "center" : "center";
        overlay.style.alignItems = updateMode === 1 ? "center" : "flex-start";
        overlay.style.color = "white";
        overlay.style.textAlign = "center";
        overlay.style.zIndex = "9999"; // Ensure the overlay is on top
        overlay.style.pointerEvents = updateMode === 1 ? "auto" : "none"; // Enable pointer events for major updates only

        if (updateMode === 1) {
            // Disable pointer events for the rest of the page for major updates
            document.body.style.pointerEvents = "none";
        }

        // Create the message div
        var message = document.createElement("div");
        message.innerText = updateMode === 1 ? 
            "Game is being updated, we'll be back shortly." : 
            "Game is being updated. Issues may occur.";
        message.style.fontSize = "1.5em";
        message.style.padding = updateMode === 1 ? "20px" : "10px";
        // message.style.margin = updateMode === 1 ? "0" : "10px auto";
        message.style.border = "2px solid white";
        message.style.borderRadius = "10px";
        message.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

        // For minor updates, make the banner smaller and at the top center
        if (updateMode === 2) {
            message.style.width = "40%";
            message.style.position = "fixed";
            message.style.bottom = "10px";
            message.style.left = "50%";
            message.style.transform = "translateX(-50%) scale(0.75)";
        }

        // Append the message to the overlay
        overlay.appendChild(message);

        // Append the overlay to the body
        document.body.appendChild(overlay);

        if (updateMode === 1) {
            // Make sure the overlay is the only element that can receive pointer events
            overlay.addEventListener("click", function(event) {
                event.stopPropagation(); // Prevent clicks from propagating through the overlay
            });
        }
    }
});
