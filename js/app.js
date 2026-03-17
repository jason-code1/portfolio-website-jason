window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('progress-fill');
    const percent = document.getElementById('loader-percent');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        fill.style.width = `${progress}%`;
        percent.textContent = `${Math.floor(progress)}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 600);
        }
    }, 150);
});


const observerOptions = {
    threshold: 0.25,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            // Fade out when leaving view
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});

// Smooth scroll for nav if needed later
// console.log("Professional Portfolio Engine Online | 2026");