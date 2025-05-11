require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai'); // Import OpenAI

const app = express();
const port = process.env.PORT || 3001;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined in .env file');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// OpenRouter (OpenAI compatible) Configuration
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
if (!openRouterApiKey) {
    console.error('Error: OPENROUTER_API_KEY must be defined in .env file');
    process.exit(1);
}

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: openRouterApiKey,
    // dangerouslyAllowBrowser: true, // Not needed for backend
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('AI Chatbot Backend is running!');
});

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Received message: "${message}" (Session ID: ${sessionId || 'N/A'})`);

    let aiResponse = 'Sorry, I encountered an error.'; // Default error response

    try {
        // Task 1.3 - Integrate NLU (Gemini-2.5-flash via OpenRouter)
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.5-flash-preview', // Corrected model name for Gemini Flash 1.5 on OpenRouter
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant.' }, // Optional system prompt
                { role: 'user', content: message },
            ],
        });

        if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
            aiResponse = completion.choices[0].message.content;
        } else {
            console.error('OpenRouter response format unexpected:', completion);
            aiResponse = 'I received a response, but could not understand it.';
        }

    } catch (error) {
        console.error('Error calling OpenRouter:', error.response ? error.response.data : error.message);
        // Keep the default error response
    }

    // Log to Supabase (example - will be refined in Task 1.4)
    try {
        const { data: logData, error: logError } = await supabase
            .from('conversations')
            .insert([
                { user_query: message, ai_response: aiResponse, session_id: sessionId, platform: 'website' }
            ])
            .select();
        if (logError) throw logError;
        console.log('Conversation logged to Supabase:', logData);
    } catch (error) {
        console.error('Error logging to Supabase:', error.message);
    }

    res.json({ response: aiResponse, sessionId: sessionId });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
