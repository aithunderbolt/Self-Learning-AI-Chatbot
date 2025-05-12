// Admin script - Basic Frontend Authentication
console.log('Admin script loaded.');

const loginSection = document.getElementById('login-section');
const settingsSection = document.getElementById('settings-section');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');
const settingsDisplay = document.getElementById('settings-display'); // We'll use this later

// --- VERY INSECURE - For demonstration purposes ONLY --- 
const CORRECT_PASSWORD = 'admin123'; 
// ------------------------------------------------------

function showLogin() {
    loginSection.style.display = 'block';
    settingsSection.style.display = 'none';
    loginError.textContent = '';
    passwordInput.value = '';
    sessionStorage.removeItem('isAdminAuthenticated');
}

function showSettings() {
    loginSection.style.display = 'none';
    settingsSection.style.display = 'block';
    loginError.textContent = '';
    // Later: Fetch and display actual settings here (Task 4.4)
    settingsDisplay.innerHTML = '<p>Settings will be displayed here once loaded.</p>';
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

// Initial Check: See if user is already logged in (via sessionStorage)
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
        showSettings();
    } else {
        showLogin(); // Ensure login is shown by default
    }
});
