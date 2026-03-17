// js/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session) return;

  // Common: load clients, projects, messages from localStorage (simulate)
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  let messages = JSON.parse(localStorage.getItem('messages')) || [];

  // helper toast
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  // ---------- CLIENT DASHBOARD ----------
  if (document.getElementById('client-dashboard')) {
    const client = users.find(u => u.id === session.id);
    document.getElementById('welcome-message').innerHTML = `<h2>Welcome back, ${client ? client.name : session.name}</h2>`;

    // client's projects
    const clientProjects = projects.filter(p => p.clientId === session.id);
    const container = document.getElementById('client-projects');
    if (clientProjects.length === 0) container.innerHTML = '<p>No active projects.</p>';
    else {
      clientProjects.forEach(p => {
        const stages = ['Consultation','Supplier','Assembly','Installation','Completed'];
        const progress = ((p.stage || 0) / 4) * 100;
        container.innerHTML += `
          <div class="project-card">
            <h3>${p.name}</h3>
            <div class="progress-bar-container"><div class="progress-fill" style="width:${progress}%"></div></div>
            <p>Current: ${stages[p.stage || 0]}</p>
          </div>
        `;
      });
    }

    // client messages
    const clientMessages = messages.filter(m => m.toClientId === session.id);
    const msgDiv = document.getElementById('client-messages');
    if (clientMessages.length) {
      msgDiv.innerHTML = '<h3>Messages</h3>' + clientMessages.map(m => `<p><strong>Admin:</strong> ${m.content} <em>${new Date(m.date).toLocaleDateString()}</em></p>`).join('');
    } else {
      msgDiv.innerHTML = '<p>No messages</p>';
    }
  }

  // ---------- ADMIN DASHBOARD ----------
  if (document.getElementById('admin-dashboard')) {
    // stats
    const totalClients = users.filter(u => u.role === 'client').length;
    const totalProjects = projects.length;
    const totalContacts = contacts.length;
    document.getElementById('admin-stats').innerHTML = `
      <div class="stat-card">Clients: ${totalClients}</div>
      <div class="stat-card">Projects: ${totalProjects}</div>
      <div class="stat-card">Contacts: ${totalContacts}</div>
    `;

    // populate client selects
    const clientSelects = [document.getElementById('project-client'), document.getElementById('msg-client')];
    const clientOptions = users.filter(u => u.role === 'client').map(c => `<option value="${c.id}">${c.name} (${c.email})</option>`).join('');
    clientSelects.forEach(sel => { if (sel) sel.innerHTML += clientOptions; });

    // show clients list
    const clientListDiv = document.getElementById('client-list');
    users.filter(u => u.role === 'client').forEach(c => {
      clientListDiv.innerHTML += `<p>${c.name} – ${c.email} <button class="delete-client" data-id="${c.id}">✖</button></p>`;
    });

    // show projects list with update stage / delete
    const projDiv = document.getElementById('projects-list');
    projects.forEach(p => {
      const clientName = users.find(u => u.id === p.clientId)?.name || 'unknown';
      projDiv.innerHTML += `
        <div class="project-row">
          ${p.name} (client: ${clientName}) – stage ${p.stage || 0}
          <button class="stage-up" data-id="${p.id}">+</button>
          <button class="delete-proj" data-id="${p.id}">🗑</button>
        </div>
      `;
    });

    // create project
    document.getElementById('create-project-form').addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('project-name').value;
      const clientId = document.getElementById('project-client').value;
      if (!name || !clientId) return;
      const newProj = { id: 'p'+Date.now(), name, clientId, stage: 0 };
      projects.push(newProj);
      localStorage.setItem('projects', JSON.stringify(projects));
      toast('Project created');
      location.reload();
    });

    // update stage (admin only)
    document.querySelectorAll('.stage-up').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const proj = projects.find(p => p.id === id);
        if (proj && proj.stage < 4) { proj.stage++; }
        localStorage.setItem('projects', JSON.stringify(projects));
        toast('Stage updated');
        location.reload();
      });
    });

    // delete project
    document.querySelectorAll('.delete-proj').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        toast('Project deleted');
        location.reload();
      });
    });

    // contact submissions list
    const subDiv = document.getElementById('contact-submissions-list');
    contacts.slice(-5).forEach(c => {
      subDiv.innerHTML += `<p><strong>${c.name}</strong> (${c.email}): ${c.message.substring(0,50)}...</p>`;
    });

    // admin send message
    document.getElementById('admin-message-form').addEventListener('submit', e => {
      e.preventDefault();
      const toClient = document.getElementById('msg-client').value;
      const content = document.getElementById('msg-content').value;
      if (!toClient || !content) return;
      const newMsg = { id: 'm'+Date.now(), fromAdmin: true, toClientId: toClient, content, date: new Date().toISOString() };
      messages.push(newMsg);
      localStorage.setItem('messages', JSON.stringify(messages));
      toast('Message sent');
      e.target.reset();
    });
  }
});