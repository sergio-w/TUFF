// Save the original console methods
/*const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
};

// Custom function to handle logs, warnings, and errors
function customLogHandler(type, message, ...args) {
    // Forward to your custom logging system
    //console.log(`[Custom ${type}]`, message, ...args);
    
    // Example: Send logs to a server (uncomment if needed)
    // fetch('/log', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         type: type,
    //         message: message,
    //         args: args
    //     })
    // });
}

// Override console.log
console.log = function(message, ...args) {
    //customLogHandler('Log', message, ...args);
   // originalConsole.log.apply(console, [message, ...args]);
};

// Override console.warn
console.warn = function(message, ...args) {
    //customLogHandler('Warn', message, ...args);
    // originalConsole.warn.apply(console, [message, ...args]);
};


// Override console.error to capture logged errors
console.error = (function(origErrorFunc) {
    return function(message, ...args) {
        // Log the error as usual
        // origErrorFunc.apply(console, [message, ...args]);

        // Send error data to the server
        sendErrorToServer({
            type: "console.error",
            message: message,
            details: args,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    };
})(console.error);

// Capture unhandled errors
window.onerror = function(message, source, lineno, colno, error) {
    sendErrorToServer({
        type: "window.onerror",
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error ? error.stack : null,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });
};

// Capture unhandled promise rejections
window.onunhandledrejection = function(event) {
    sendErrorToServer({
        type: "unhandledrejection",
        message: event.reason ? event.reason.message : "Unknown rejection",
        stack: event.reason ? event.reason.stack : null,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });
};

// Function to send error data to your server
function sendErrorToServer(errorData) {
	        return;
    fetch("https://services.docskigames.com:2052/api/log-error", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(errorData)
    }).catch(err => {
        // In case the error reporting fails, log to console to avoid endless loop
        console.warn("Error logging failed:", err);
    });
}*/