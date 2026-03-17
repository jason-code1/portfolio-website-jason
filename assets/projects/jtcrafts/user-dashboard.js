// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

if (!currentUser && !isAdminLoggedIn) {
    window.location.href = 'user-login.html';
} else if (isAdminLoggedIn) {
    window.location.href = 'admin-dashboard.html';
}

// Display user information
if (currentUser) {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('displayName').textContent = currentUser.name;
    document.getElementById('displayEmail').textContent = currentUser.email;
    document.getElementById('displayPhone').textContent = currentUser.phone;
    
    const registeredDate = new Date(currentUser.registeredDate);
    document.getElementById('displayDate').textContent = registeredDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Load user's contact submissions
function loadUserSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const userSubmissions = submissions.filter(s => s.email.toLowerCase() === currentUser.email.toLowerCase());
    const submissionsContainer = document.getElementById('userSubmissions');
    const noSubmissions = document.getElementById('noUserSubmissions');
    
    if (userSubmissions.length === 0) {
        submissionsContainer.innerHTML = '';
        noSubmissions.style.display = 'block';
        return;
    }
    
    noSubmissions.style.display = 'none';
    submissionsContainer.innerHTML = userSubmissions.reverse().map(submission => {
        const date = new Date(submission.date);
        return `
            <div class="contact-card">
                <div class="contact-header">
                    <div class="contact-name">Message</div>
                    <div class="contact-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
                </div>
                <div class="contact-info">
                    <div class="contact-info-item">
                        <strong>Phone:</strong>
                        <span>${escapeHtml(submission.phone)}</span>
                    </div>
                    <div class="contact-message">
                        <strong>Message:</strong><br>
                        ${escapeHtml(submission.message)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load user submissions on page load
loadUserSubmissions();
