require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai'); // Import OpenAI
const { getSheetData } = require('./googleSheetsService'); // Import the service

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
console.log('Supabase client initialized:', supabase ? 'Client object exists' : 'Client is null/undefined');
if (supabase && typeof supabase.from !== 'function') {
    console.error('Supabase client does not have a "from" method. Initialization likely failed.');
} else if (supabase) {
    // Test basic Supabase connection and load initial data
    (async () => {
        try {
            const { data, error } = await supabase.from('conversations').select('id').limit(1);
            if (error) {
                console.error('Error testing Supabase connection (select):', JSON.stringify(error, null, 2));
            } else {
                console.log('Successfully connected to Supabase and fetched data (test select):', data);
            }
        } catch (e) {
            console.error('Exception during Supabase connection test:', e);
        }

        // Load FAQ data from Google Sheets on startup
        await loadFaqData();
    })();
}

// In-memory storage for FAQ data from Google Sheets
let faqDataMap = new Map();

// Function to load FAQ data from Google Sheets
async function loadFaqData() {
    const spreadsheetId = '1z77gwVZrfifQxBDZJTFtrtx49eV3iKjy--IvGhqJzmI'; // Keep consistent
    const range = 'Sheet1!A2:B16'; // The FAQ range
    console.log(`Attempting to load FAQ data from Google Sheet: ${spreadsheetId}, Range: ${range}`);
    try {
        const rows = await getSheetData(spreadsheetId, range);
        if (rows && rows.length > 0) {
            const tempMap = new Map();
            rows.forEach(row => {
                // Assuming Column A is Question, Column B is Answer
                if (row[0] && row[1]) { // Ensure both question and answer exist
                    const question = row[0].trim().toLowerCase(); // Normalize question
                    const answer = row[1].trim();
                    tempMap.set(question, answer);
                }
            });
            faqDataMap = tempMap; // Replace old map with new data
            console.log(`Successfully loaded ${faqDataMap.size} FAQ entries into memory.`);
        } else {
            console.log('No FAQ data loaded from Google Sheets (Sheet/Range empty or access issue).');
            faqDataMap.clear(); // Ensure map is empty if load fails
        }
    } catch (error) {
        console.error('Failed to load initial FAQ data from Google Sheets:', error.message);
        faqDataMap.clear(); // Ensure map is empty if load fails
    }
}

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

// Function to get conversation history
async function getConversationHistory(sessionId, limit = 3) {
    if (!sessionId) {
        return [];
    }

    const { data, error } = await supabase
        .from('conversations')
        .select('user_query, ai_response')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching conversation history:', error);
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    // Format for OpenRouter and reverse to maintain chronological order for the model
    const historyMessages = [];
    // Data is currently newest-to-oldest, so iterate backwards to push oldest-first
    for (let i = data.length - 1; i >= 0; i--) {
        const record = data[i];
        if (record.user_query) {
            historyMessages.push({ role: 'user', content: record.user_query });
        }
        if (record.ai_response) {
            historyMessages.push({ role: 'assistant', content: record.ai_response });
        }
    }
    return historyMessages;
}

// Routes
app.get('/', (req, res) => {
    res.send('AI Chatbot Backend is running!');
});

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body; // Extract sessionId

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Log the incoming message and sessionId
    if (sessionId) {
        console.log(`Received message: "${message}" (Session ID: ${sessionId})`);
    } else {
        console.log(`Received message: "${message}" (No Session ID provided)`);
    }

    let aiResponse = 'Sorry, I encountered an error.'; // Default error response
    let openRouterModel = 'google/gemini-flash-1.5'; // Default model
    let responseSource = 'NLU'; // Track where the response came from ('FAQ' or 'NLU')

    // Task 2.3/2.4: Check FAQ map first
    const userMessageLower = message.toLowerCase().trim();
    if (faqDataMap.has(userMessageLower)) {
        aiResponse = faqDataMap.get(userMessageLower);
        responseSource = 'FAQ';
        console.log(`FAQ Hit for: "${message}". Using predefined answer.`);
    } else {
        // Only call NLU if no FAQ match
        console.log(`FAQ Miss for: "${message}". Proceeding to NLU.`);
        responseSource = 'NLU';
        try {
            // Fetch conversation history if sessionId is present
            const historicalMessages = await getConversationHistory(sessionId);

            // Prepare messages for OpenRouter
            const messagesToOpenRouter = [
                { role: 'system', content: 'You are a helpful AI assistant.' }, // Optional system prompt
                ...historicalMessages, // Prepend history
                { role: 'user', content: message },
            ];

            // Task 1.3 - Integrate NLU (Gemini-2.5-flash via OpenRouter)
            const completion = await openai.chat.completions.create({
                model: openRouterModel, 
                messages: messagesToOpenRouter,
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
    }

    // Log to Supabase
    try {
        const { data: logData, error: logError } = await supabase
            .from('conversations')
            .insert([
                {
                    user_query: message,
                    ai_response: aiResponse,
                    session_id: sessionId || null, // Use extracted sessionId here
                    platform: 'website',
                    model_used: responseSource === 'FAQ' ? 'google_sheet_faq' : openRouterModel // Log 'FAQ' or the NLU model
                }
            ])
            .select();

        if (logError) {
            console.error('Supabase logError object (raw):', logError);
            console.error(`Error logging conversation to Supabase: ${logError.message}`);
            if (logError.details) console.error('Supabase logError details:', logError.details);
            if (logError.hint) console.error('Supabase logError hint:', logError.hint);
        } else {
            console.log('Conversation logged to Supabase:', logData);
        }

    } catch (error) {
        // Enhanced error logging for server-side debugging
        console.error('-------------------- ERROR IN /CHAT ENDPOINT --------------------');
        console.error('Timestamp:', new Date().toISOString());
        console.error('Error Message:', error.message);
        if (error.stack) {
            console.error('Stack Trace:', error.stack);
        }
        if (error.response && error.response.data) {
            console.error('OpenRouter Error Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        if (error.code) console.error('Error Code:', error.code);
        if (error.hint) console.error('Error Hint:', error.hint); // Typically from Supabase errors
        console.error('-------------------------------------------------------------------');

        // Set a user-friendly fallback message
        aiResponse = "I'm currently experiencing some technical difficulties and can't process your request. Please try again in a little while.";
        
        // We could attempt to log the failure to Supabase here if desired, including the original user_query and the fallback aiResponse
        // For now, the existing log call will log this fallback aiResponse if it's reached after an OpenRouter failure.
    }

    res.json({ response: aiResponse, sessionId: sessionId }); // Return sessionId in response
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
