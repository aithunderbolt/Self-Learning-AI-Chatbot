// Admin script - Basic Frontend Authentication
console.log('Admin script loaded.');

const loginSection = document.getElementById('login-section');
const settingsSection = document.getElementById('settings-section');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');
const settingsDisplay = document.getElementById('settings-display'); 
const settingsForm = document.getElementById('settings-form'); 
const googleSheetIdInput = document.getElementById('googleSheetId'); 
const googleSheetRangeInput = document.getElementById('googleSheetRange'); 
const saveButton = document.getElementById('save-settings-button'); 
const saveStatus = document.getElementById('save-status'); 

// --- VERY INSECURE - For demonstration purposes ONLY --- 
const CORRECT_PASSWORD = 'admin123'; 
const ADMIN_API_TOKEN = 'mystrongPaS$wordGeNeRator'; // <-- !!! REPLACE THIS WITH YOUR ACTUAL TOKEN !!!
// ------------------------------------------------------

function showLogin() {
    loginSection.style.display = 'block';
    settingsSection.style.display = 'none';
    loginError.textContent = '';
    passwordInput.value = '';
    sessionStorage.removeItem('isAdminAuthenticated');
}

async function fetchAndDisplaySettings() {
    settingsDisplay.innerHTML = '<p>Loading settings...</p>'; // Show loading state
    try {
        const response = await fetch('http://localhost:3001/admin/settings', {
            method: 'GET',
            headers: {
                'X-Admin-Token': ADMIN_API_TOKEN 
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching settings: ${response.status} ${response.statusText} - ${errorData.error || ''}`);
        }

        const settings = await response.json();

        // Format and display settings
        let settingsHTML = '<p><strong>Current Configuration:</strong></p>';
        settingsHTML += `<p><strong>Google Sheet ID:</strong> ${settings.googleSheetId || '<em>Not Set</em>'}</p>`;
        settingsHTML += `<p><strong>Google Sheet Range:</strong> ${settings.googleSheetRange || '<em>Not Set</em>'}</p>`;
        settingsHTML += `<p><strong>Google Credentials:</strong> ${settings.googleCredentialsSet ? 'Set' : '<em>Not Set</em>'}</p>`;
        settingsHTML += `<p><strong>OpenRouter API Key:</strong> ${settings.openRouterConfigured ? 'Configured' : '<em>Not Configured</em>'}</p>`;
        settingsHTML += `<p><strong>Supabase Config:</strong> ${settings.supabaseConfigured ? 'Configured' : '<em>Not Configured</em>'}</p>`;
        // Add more settings as needed

        settingsDisplay.innerHTML = settingsHTML;

        // --- Populate form fields with current values --- 
        googleSheetIdInput.value = settings.googleSheetId || '';
        googleSheetRangeInput.value = settings.googleSheetRange || '';

    } catch (error) {
        console.error('Failed to fetch settings:', error);
        settingsDisplay.innerHTML = `<p class="error">Error loading settings: ${error.message}</p>`;
    }
}

function showSettings() {
    loginSection.style.display = 'none';
    settingsSection.style.display = 'block';
    loginError.textContent = '';
    fetchAndDisplaySettings(); // Fetch and display settings when showing the section
}

function handleLogin() {
    const enteredPassword = passwordInput.value;
    if (enteredPassword === CORRECT_PASSWORD) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        showSettings();
    } else {
        loginError.textContent = 'Incorrect password.';
        passwordInput.value = '';
    }
}

// Event Listeners
loginButton.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleLogin();
    }
});

logoutButton.addEventListener('click', showLogin);

// --- Settings Form Submit Handler --- 
settingsForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default page reload
    saveStatus.textContent = 'Saving...';
    saveStatus.style.color = 'inherit'; // Reset color

    const newSettings = {
        googleSheetId: googleSheetIdInput.value.trim(),
        googleSheetRange: googleSheetRangeInput.value.trim()
    };

    try {
        const response = await fetch('http://localhost:3001/admin/settings', { // Use absolute URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Token': ADMIN_API_TOKEN
            },
            body: JSON.stringify(newSettings)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error saving settings: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
        }

        const result = await response.json(); // Get the response from backend
        saveStatus.textContent = result.message; // Use message from backend
        saveStatus.style.color = 'green';
        // Refresh the displayed settings to show the update
        await fetchAndDisplaySettings(); 

    } catch (error) {
        console.error('Failed to save settings:', error);
        saveStatus.textContent = `Error: ${error.message}`;
        saveStatus.style.color = 'red';
    }
});

// Initial Check: See if user is already logged in (via sessionStorage)
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
        showSettings();
    } else {
        showLogin(); // Ensure login is shown by default
    }
});
