// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Select all elements with the 'reveal' class
document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});

// Extra: Console Log for debugging on your Zenbook
console.log("JT Portfolio Loaded Successfully | 2026");