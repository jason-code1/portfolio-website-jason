// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Initial Load Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.from(".hero-name", { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" })
      .from(".hero-subtitle", { y: 50, opacity: 0, duration: 1, ease: "power4.out" }, "-=1")
      .from(".hero-actions", { y: 30, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.8")
      .from(".glass-nav", { y: -100, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=1.2");
});

// Scroll Driven Animations
const revealElements = [
    { selector: ".glass-card", stagger: 0.2 },
    { selector: ".section-label", stagger: 0 },
    { selector: ".section-title", stagger: 0 }
];

revealElements.forEach(item => {
    gsap.utils.toArray(item.selector).forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: item.stagger,
            ease: "power3.out"
        });
    });
});

// Magnetic Button Effect
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Copy Email to Clipboard
const copyBtn = document.getElementById('copy-email-btn');
const emailText = document.getElementById('email-text');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailText.innerText).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied!";
            copyBtn.style.backgroundColor = "var(--accent-emerald)";
            copyBtn.style.color = "white";
            
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.backgroundColor = "var(--accent-champagne)";
                copyBtn.style.color = "#1A1A1A";
            }, 2000);
        });
    });
}

// 3D Card Flip Logic
const flipButtons = document.querySelectorAll('.btn-flip');
flipButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = btn.closest('.flip-card');
        card.classList.toggle('is-flipped');
        
        // Change button text based on state
        if (card.classList.contains('is-flipped')) {
            btn.innerText = "View Details";
        } else {
            btn.innerText = "View Certificate";
        }
    });
});

// Fullscreen Modal Logic
const modal = document.getElementById('cert-modal');
const modalIframe = document.getElementById('cert-iframe');
const closeModal = document.querySelector('.close-modal');
const fullscreenButtons = document.querySelectorAll('.btn-fullscreen');

fullscreenButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const certPath = btn.getAttribute('data-cert');
        modalIframe.src = certPath;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Disable scroll
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalIframe.src = '';
    document.body.style.overflow = 'auto'; // Enable scroll
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalIframe.src = '';
        document.body.style.overflow = 'auto';
    }
});

console.log("iOS 26 Engine Active | 3D Cards & Modal Loaded");
