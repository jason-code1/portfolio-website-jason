// js/auth.js
(function() {
  // ensure default admin exists and has expected credentials
  (function ensureAdmin() {
    var users = JSON.parse(localStorage.getItem('users')) || [];
    var adminEmail = 'admin@jtc.com';
    var adminPlain = 'admin123';
    var adminIndex = -1;
    for (var i = 0; i < users.length; i++) {
      if (users[i].role === 'admin' || users[i].email === adminEmail) { adminIndex = i; break; }
    }
    var adminUser = {
      id: (adminIndex !== -1 && users[adminIndex].id) ? users[adminIndex].id : 'u1',
      name: 'Admin',
      email: adminEmail,
      password: btoa(adminPlain), // encode password in storage
      role: 'admin'
    };
    if (adminIndex === -1) {
      users.unshift(adminUser);
    } else {
      users[adminIndex] = adminUser;
    }
    localStorage.setItem('users', JSON.stringify(users));
  })();

  // login handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pwd = document.getElementById('login-password').value;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === btoa(pwd));
      if (user) {
        localStorage.setItem('session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
        window.location.href = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-client.html';
      } else {
        document.getElementById('login-message').textContent = 'Invalid credentials';
      }
    });
  }

  // registration
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const pwd = document.getElementById('reg-password').value;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.email === email)) {
        document.getElementById('register-message').textContent = 'Email already exists';
        return;
      }
      const newUser = {
        id: 'u' + Date.now(),
        name, email,
        password: btoa(pwd),
        role: 'client'
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      document.getElementById('register-message').textContent = 'Registration successful, you may login';
      regForm.reset();
    });
  }

  // logout buttons
  document.querySelectorAll('#client-logout, #admin-logout').forEach(btn => {
    if (btn) btn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('session');
      window.location.href = 'login.html';
    });
  });

  // protect dashboard pages
  const protectedPages = ['dashboard-client.html', 'dashboard-admin.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage)) {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session) window.location.href = 'login.html';
    if (currentPage === 'dashboard-admin.html' && session.role !== 'admin') window.location.href = 'dashboard-client.html';
    if (currentPage === 'dashboard-client.html' && session.role !== 'client') window.location.href = 'dashboard-admin.html';
  }
})();