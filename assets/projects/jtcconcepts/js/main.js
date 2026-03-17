// js/main.js (public interactive)
document.addEventListener('DOMContentLoaded', function() {
  // mobile menu toggle
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('show'));

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // portfolio filter & modal (if on portfolio page)
  if (document.getElementById('portfolio-gallery')) {
    const gallery = document.getElementById('portfolio-gallery');
    const modal = document.getElementById('portfolio-modal');
    const modalImg = modal.querySelector('.modal-img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const closeModal = modal.querySelector('.close-modal');

    // sample portfolio data
    const items = [
      { cat: 'kitchen', title: 'Minimal kitchen', img: '#', desc: 'Walnut and bronze handles.' },
      { cat: 'kitchen', title: 'Island unit', img: '#', desc: 'Large format storage.' },
      { cat: 'wardrobe', title: 'Walk-in', img: '#', desc: 'Custom shelving and drawers.' },
      { cat: 'wall', title: 'Library wall', img: '#', desc: 'Floor to ceiling oak.' }
    ];
    function renderGallery(filter = 'all') {
      gallery.innerHTML = '';
      items.filter(i => filter === 'all' || i.cat === filter).forEach(item => {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.style.backgroundImage = 'linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(https://placehold.co/600x400/5A3E2B/white?text=Wood)';
        div.innerHTML = `<span>${item.title}</span>`;
        div.addEventListener('click', () => {
          modal.style.display = 'block';
          modalImg.src = 'https://placehold.co/800x500/3a2a1d/white?text=Craft';
          modalTitle.textContent = item.title;
          modalDesc.textContent = item.desc;
        });
        gallery.appendChild(div);
      });
    }
    renderGallery();
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
      });
    });
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
  }

  // contact form validation + localStorage
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        showNotification('Please fill required fields', 'error');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        showNotification('Invalid email', 'error');
        return;
      }
      const submission = { name, email, phone, message, date: new Date().toISOString() };
      let subs = JSON.parse(localStorage.getItem('contacts') || '[]');
      subs.push(submission);
      localStorage.setItem('contacts', JSON.stringify(subs));
      showNotification('Message sent (demo)');
      contactForm.reset();
    });
  }
  function showNotification(msg, type = 'success') {
    const notif = document.getElementById('form-notification') || document.createElement('div');
    notif.textContent = msg;
    notif.style.background = type==='success' ? '#5A3E2B' : '#8b0000';
    notif.style.color = '#E8E1D8';
    notif.style.padding = '1rem';
    if (!document.getElementById('form-notification')) {
      notif.id = 'form-notification';
      contactForm.appendChild(notif);
    }
    setTimeout(() => notif.remove(), 3000);
  }

  // fade-in on scroll
  const faders = document.querySelectorAll('.section-preview, .process-step');
  const appearOptions = { threshold: 0.2 };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('fade-in'); observer.unobserve(entry.target); }
    });
  }, appearOptions);
  faders.forEach(f => appearOnScroll.observe(f));
});