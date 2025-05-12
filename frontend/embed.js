// embed.js
(function() {
    // Ensure this runs only once
    if (window.aiChatWidgetLoaded) {
        return;
    }
    window.aiChatWidgetLoaded = true;

    // Base path for assets (assuming embed.js is served from the same directory as style.css and script.js)
    // In a real deployment, this might need to be an absolute URL
    const basePath = './'; // Or determine dynamically if needed

    // Function to load CSS
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Function to load JS and run callback on load
    function loadJS(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true; // Keep defer for potential fallback
        if (callback) {
            script.onload = callback;
        }
        document.body.appendChild(script);
    }

    // Function to create chat widget HTML
    function createWidgetHTML() {
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'ai-chat-widget-container'; // Main container for potential future use
        widgetContainer.innerHTML = `
            <div id="chat-widget">
                <div id="chat-header">AI Assistant</div>
                <div id="chat-messages">
                    <!-- Messages will be added here -->
                </div>
                <div id="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Type your message...">
                    <button id="send-button">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(widgetContainer);
    }

    // Execute on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Create the HTML structure
        createWidgetHTML();

        // 2. Load the CSS
        loadCSS(basePath + 'style.css');

        // 3. Load the main chat script and initialize it *after* loading
        // Make sure this path is correct relative to where embed.js is served
        loadJS(basePath + 'script.js', () => {
            // Ensure the initialization function exists before calling
            if (typeof initializeChatWidget === 'function') {
                initializeChatWidget();
            } else {
                console.error('Error: initializeChatWidget function not found after loading script.js');
            }
        });
    });

})();
