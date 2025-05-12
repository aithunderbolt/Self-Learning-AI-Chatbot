function initializeChatWidget() {
    console.log('Chat widget script loaded and DOM ready.');

    // 1. Get DOM element references
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // 2. Manage Session ID (generate/retrieve from sessionStorage)
    let sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // Use built-in crypto for UUID
        sessionStorage.setItem('chatSessionId', sessionId);
        console.log('Generated new session ID:', sessionId);
    } else {
        console.log('Using existing session ID:', sessionId);
    }

    // Ensure initial scroll to bottom if needed (e.g., loading history)
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 5. Implement addMessageToUI function
    function addMessageToUI(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        // Correctly add classes based on sender type
        if (sender === 'user') {
            messageElement.classList.add('user-message');
        } else if (sender === 'ai loading') {
            messageElement.classList.add('ai-message', 'loading');
        } else if (sender === 'ai error') {
            messageElement.classList.add('ai-message', 'error');
        } else { // Default AI message
            messageElement.classList.add('ai-message');
        }

        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);

        // Auto-scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 6. Implement sendMessage function (handles user input and backend comms)
    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return; // Don't send empty messages

        // Display user message immediately
        addMessageToUI(messageText, 'user');
        chatInput.value = ''; // Clear input field

        // Show loading indicator
        addMessageToUI('Thinking...', 'ai loading'); // Simple text loading indicator

        // Prepare data for backend
        const requestData = {
            message: messageText,
            sessionId: sessionId
        };

        // 7. Backend Communication (Fetch API)
        try {
            const response = await fetch('http://localhost:3001/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            // Remove loading indicator
            const potentialLoadingIndicator = chatMessages.lastChild;
            if (potentialLoadingIndicator && potentialLoadingIndicator.classList.contains('loading')) {
                chatMessages.removeChild(potentialLoadingIndicator);
            }

            if (!response.ok) {
                console.error('Backend error:', response.status, await response.text());
                addMessageToUI(`Error: ${response.statusText || 'Failed to get response'}`, 'ai error');
            } else {
                const data = await response.json();
                console.log('Backend Response:', data);

                if (data && data.response) { 
                    addMessageToUI(data.response, 'ai'); 
                } else {
                    addMessageToUI('Received an empty response from the AI.', 'ai error');
                }
            }

        } catch (error) {
             // Remove loading indicator in case of network error
            const potentialLoadingIndicatorOnError = chatMessages.lastChild;
            if (potentialLoadingIndicatorOnError && potentialLoadingIndicatorOnError.classList.contains('loading')) {
                chatMessages.removeChild(potentialLoadingIndicatorOnError);
            }
            console.error('Error sending message to backend:', error);
            addMessageToUI('Sorry, there was a problem connecting to the chat service.', 'ai error');
        }
    }

    // 3. Add event listener for sending messages (button click)
    sendButton.addEventListener('click', sendMessage);

    // 4. Add event listener for sending messages (Enter key)
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if input is inside a form
            sendMessage();
        }
    });

    // Add a welcome message or initial prompt if desired
    addMessageToUI('Hello! How can I help you today?', 'ai');
}
