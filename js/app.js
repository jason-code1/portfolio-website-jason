// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Initial Load Animation & Loader
window.addEventListener('DOMContentLoaded', () => {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const text = "Jason Touma"; // Explicitly set to avoid any innerHTML issues
    heroName.innerHTML = text.split('').map(char => 
        `<span class="hero-letter">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    const letters = document.querySelectorAll('.hero-letter');
    const progressBar = document.getElementById('progress-bar');
    const tl = gsap.timeline();

    // 1. Animate Progress Bar (Faster)
    tl.to(progressBar, { 
        width: "100%", 
        duration: 0.8, 
        ease: "power2.inOut" 
    });

    // 2. Hide Loader
    tl.to("#loader", { 
        clipPath: "circle(0% at 50% 50%)",
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
            document.getElementById('loader').style.display = 'none';
        }
    }, "-=0.2");

    // 3. Animate Hero Name Construction (Staggered almost at once)
    letters.forEach((letter) => {
        const xDir = (Math.random() - 0.5) * 600;
        const yDir = (Math.random() - 0.5) * 600;
        const rotation = (Math.random() - 0.5) * 360;

        tl.fromTo(letter, 
            { x: xDir, y: yDir, rotation: rotation, opacity: 0 },
            { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" },
            "<0.02" // Each letter starts 0.02s after the previous one in the loop
        );
    });

    // 4. Reveal rest of Hero (Simultaneous with name finishing)
    tl.fromTo(".hero-subtitle", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
        "-=0.5"
    )
    .fromTo(".hero-actions", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
        "-=0.6"
    )
    .fromTo(".glass-nav", 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 
        "-=0.8"
    );
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

const unflipAllCards = () => {
    document.querySelectorAll('.flip-card.is-flipped').forEach(card => {
        card.classList.remove('is-flipped');
        const btn = card.querySelector('.btn-flip');
        if (btn) btn.innerText = "View Certificate";
    });
};

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
    unflipAllCards();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalIframe.src = '';
        document.body.style.overflow = 'auto';
        unflipAllCards();
    }
});

// Spotlight Effect for Contact Card
const contactCard = document.querySelector('.glow-card');
if (contactCard) {
    contactCard.addEventListener('mousemove', (e) => {
        const rect = contactCard.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        contactCard.style.setProperty('--mouse-x', `${x}%`);
        contactCard.style.setProperty('--mouse-y', `${y}%`);
    });
}

console.log("iOS 26 Engine Active | Creative Features Loaded");
