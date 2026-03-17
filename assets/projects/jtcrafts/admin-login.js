// Check if already logged in (as admin or user)
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

if (isAdminLoggedIn) {
    window.location.href = 'admin-dashboard.html';
} else if (currentUser) {
    // Regular user is logged in, redirect to user dashboard
    window.location.href = 'user-dashboard.html';
}

// Initialize admin credentials if not set
if (!localStorage.getItem('adminUsername')) {
    // Set default credentials (user should change these on first login)
    localStorage.setItem('adminUsername', 'admin');
    localStorage.setItem('adminPassword', 'admin123'); // User should change this
}

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const resetBtn = document.getElementById('resetBtn');

// Add reset credentials modal
const resetModal = document.createElement('div');
resetModal.id = 'resetModal';
resetModal.style.cssText = `
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
`;
resetModal.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 400px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
        <h2>Reset Admin Credentials</h2>
        <p style="color: var(--text-light); margin-bottom: 1.5rem;">What would you like to do?</p>
        
        <div id="resetOptions">
            <div style="margin-bottom: 1rem;">
                <button id="resetDefaultBtn" style="width: 100%; padding: 10px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">Reset to Default</button>
            </div>
            <div style="margin-bottom: 1rem;">
                <button id="setCustomBtn" style="width: 100%; padding: 10px; background: var(--accent-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">Set Custom Credentials</button>
            </div>
            <div style="margin-top: 1.5rem;">
                <button id="closeResetBtn" style="width: 100%; padding: 10px; background: var(--muted-border); color: var(--text-dark); border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">Cancel</button>
            </div>
        </div>
        
        <div id="customCredsForm" style="display: none; margin-top: 1rem;">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">New Username:</label>
                <input type="text" id="newUsername" placeholder="Enter new username" style="width: 100%; padding: 8px; border: 1px solid var(--muted-border); border-radius: 5px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">New Password:</label>
                <input type="password" id="newPassword" placeholder="Enter new password" style="width: 100%; padding: 8px; border: 1px solid var(--muted-border); border-radius: 5px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Confirm Password:</label>
                <input type="password" id="confirmPassword" placeholder="Confirm new password" style="width: 100%; padding: 8px; border: 1px solid var(--muted-border); border-radius: 5px;">
            </div>
            <div id="customFormMessage" style="margin-bottom: 1rem; padding: 10px; border-radius: 5px; display: none;"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <button id="saveCustomBtn" style="padding: 10px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
                <button id="backBtn2" style="padding: 10px; background: var(--muted-border); color: var(--text-dark); border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
            </div>
        </div>
    </div>
`;
document.body.appendChild(resetModal);

// Reset button click handler
resetBtn.addEventListener('click', () => {
    resetModal.style.display = 'flex';
});

// Reset to default
document.getElementById('resetDefaultBtn').addEventListener('click', () => {
    if (confirm('Reset credentials to default?')) {
        localStorage.setItem('adminUsername', 'admin');
        localStorage.setItem('adminPassword', 'admin123');
        localStorage.removeItem('adminLoggedIn');
        resetModal.style.display = 'none';
        document.getElementById('resetOptions').style.display = 'block';
        document.getElementById('customCredsForm').style.display = 'none';
        errorMessage.textContent = 'Credentials have been reset successfully!';
        errorMessage.style.background = '#d4edda';
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
});

// Set custom credentials
document.getElementById('setCustomBtn').addEventListener('click', () => {
    document.getElementById('resetOptions').style.display = 'none';
    document.getElementById('customCredsForm').style.display = 'block';
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
});

// Back button from custom form
document.getElementById('backBtn2').addEventListener('click', () => {
    document.getElementById('customCredsForm').style.display = 'none';
    document.getElementById('resetOptions').style.display = 'block';
});

// Save custom credentials
document.getElementById('saveCustomBtn').addEventListener('click', () => {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const formMessage = document.getElementById('customFormMessage');
    
    if (!newUsername) {
        formMessage.textContent = 'Please enter a username';
        formMessage.style.background = '#f8d7da';
        formMessage.style.color = '#721c24';
        formMessage.style.display = 'block';
        return;
    }
    
    if (!newPassword || newPassword.length < 6) {
        formMessage.textContent = 'Password must be at least 6 characters';
        formMessage.style.background = '#f8d7da';
        formMessage.style.color = '#721c24';
        formMessage.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        formMessage.textContent = 'Passwords do not match';
        formMessage.style.background = '#f8d7da';
        formMessage.style.color = '#721c24';
        formMessage.style.display = 'block';
        return;
    }
    
    localStorage.setItem('adminUsername', newUsername);
    localStorage.setItem('adminPassword', newPassword);
    localStorage.removeItem('adminLoggedIn');
    resetModal.style.display = 'none';
    document.getElementById('resetOptions').style.display = 'block';
    document.getElementById('customCredsForm').style.display = 'none';
    errorMessage.textContent = 'Credentials updated successfully! You can now login with your new credentials.';
    errorMessage.style.background = '#d4edda';
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
});

// Close reset modal
document.getElementById('closeResetBtn').addEventListener('click', () => {
    resetModal.style.display = 'none';
    document.getElementById('resetOptions').style.display = 'block';
    document.getElementById('customCredsForm').style.display = 'none';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const storedUsername = localStorage.getItem('adminUsername');
    const storedPassword = localStorage.getItem('adminPassword');
    
    if (username === storedUsername && password === storedPassword) {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin-dashboard.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.style.background = '#f8d7da';
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
});
