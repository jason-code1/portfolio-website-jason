// Check if already logged in (as user or admin)
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

if (currentUser && !isAdminLoggedIn) {
    window.location.href = 'user-dashboard.html';
} else if (isAdminLoggedIn) {
    window.location.href = 'admin-dashboard.html';
}

// Tab switching
const authTabs = document.querySelectorAll('.auth-tab-btn');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Update active tab button
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active form
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === targetTab + 'Form') {
                form.classList.add('active');
            }
        });
    });
});

// Login Form
const loginForm = document.getElementById('loginForm');
const loginErrorMessage = document.getElementById('loginErrorMessage');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.toLowerCase().trim();
    const password = document.getElementById('loginPassword').value;
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email);
    
    if (user && user.password === password) {
        // Set current user session
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || 'Not provided',
            registeredDate: user.registeredDate
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        window.location.href = 'user-dashboard.html';
    } else {
        loginErrorMessage.textContent = 'Invalid email or password';
        loginErrorMessage.classList.add('show');
        setTimeout(() => {
            loginErrorMessage.classList.remove('show');
        }, 3000);
    }
});

// Register Form
const registerForm = document.getElementById('registerForm');
const registerErrorMessage = document.getElementById('registerErrorMessage');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.toLowerCase().trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password.length < 6) {
        registerErrorMessage.textContent = 'Password must be at least 6 characters';
        registerErrorMessage.classList.add('show');
        return;
    }
    
    if (password !== confirmPassword) {
        registerErrorMessage.textContent = 'Passwords do not match';
        registerErrorMessage.classList.add('show');
        setTimeout(() => {
            registerErrorMessage.classList.remove('show');
        }, 3000);
        return;
    }
    
    // Get all users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email)) {
        registerErrorMessage.textContent = 'An account with this email already exists';
        registerErrorMessage.classList.add('show');
        setTimeout(() => {
            registerErrorMessage.classList.remove('show');
        }, 3000);
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone || '',
        password: password, // In production, this should be hashed
        registeredDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || 'Not provided',
        registeredDate: newUser.registeredDate
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    alert('Account created successfully! Redirecting to your dashboard...');
    window.location.href = 'user-dashboard.html';
});
