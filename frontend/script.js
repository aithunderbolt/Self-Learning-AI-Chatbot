document.addEventListener('DOMContentLoaded', () => {
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

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 4. Implement sendMessage function (with backend call)
    async function sendMessage() { // Make the function async
        const messageText = chatInput.value.trim();

        if (messageText) {
            // Display user message
            addMessageToUI(messageText, 'user');

            // Clear the input field immediately
            chatInput.value = '';

            // Optional: Show a simple loading indicator
            addMessageToUI('Thinking...', 'ai loading'); // Use a temporary class for styling
            const loadingIndicator = chatMessages.lastChild;

            // Backend API call (Task 3.3)
            const backendUrl = 'http://localhost:3001/chat'; // Ensure backend is running

            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: messageText, 
                        sessionId: sessionId 
                    }),
                });

                // Remove loading indicator
                const potentialLoadingIndicator = chatMessages.lastChild;
                if (potentialLoadingIndicator && potentialLoadingIndicator.classList.contains('loading')) {
                    chatMessages.removeChild(potentialLoadingIndicator);
                }

                if (!response.ok) {
                    // Handle HTTP errors (like 500 Internal Server Error)
                    const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
                    console.error('Backend Error Status:', response.status);
                    console.error('Backend Error Data:', errorData);
                    addMessageToUI(`Sorry, couldn't reach the AI. Error: ${response.status} ${response.statusText}`, 'ai error'); // Add specific error class
                    return; // Stop processing
                }

                const data = await response.json();
                console.log('Backend Response:', data);

                if (data && data.response) { 
                    addMessageToUI(data.response, 'ai'); 
                } else {
                    addMessageToUI('Received an empty response from the AI.', 'ai error');
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
        } else {
            console.log('Input is empty, not sending.');
        }
    }

    // 3. Add event listener for send button/enter key
    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (event) => {
        // Check if the key pressed was 'Enter'
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if input is inside a form
            sendMessage();
        }
    });

    // Add a welcome message or initial prompt if desired
    addMessageToUI('Hello! How can I help you today?', 'ai');

});
