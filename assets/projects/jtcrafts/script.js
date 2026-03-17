// Logo handling - show logo if it exists
const logo = document.getElementById('logo');
if (logo) {
    logo.onload = function() {
        this.classList.add('active');
    };
    logo.onerror = function() {
        // Logo file doesn't exist yet, keep it hidden
        this.style.display = 'none';
    };
    // Trigger check by setting src (if not already set)
    if (!logo.src || logo.src === window.location.href) {
        logo.src = 'logo.png';
    }
}

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        id: Date.now().toString(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'Not provided',
        message: document.getElementById('message').value,
        date: new Date().toISOString()
    };
    
    // Save to localStorage
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe gallery items and sections
document.querySelectorAll('.gallery-item, .about-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Load and display products from localStorage
function loadProductsOnMainSite() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const furnitureGallery = document.querySelector('#furniture .gallery');
    const decorationGallery = document.querySelector('#decorations .gallery');
    
    const furniture = products.filter(p => p.category === 'furniture');
    const decorations = products.filter(p => p.category === 'decoration');
    
    // Load furniture products
    if (furniture.length > 0 && furnitureGallery) {
        furnitureGallery.innerHTML = furniture.map(product => {
            const imageHtml = product.image 
                ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" style="width: 100%; height: 300px; object-fit: cover;" onerror="this.parentElement.innerHTML='<div class=\\'gallery-placeholder\\'><span class=\\'placeholder-icon\\'>🪑</span><p>${escapeHtml(product.name)}</p></div>'">`
                : '';
            return `
                <div class="gallery-item" style="cursor: pointer;" onclick="showProductDetail('${product.id}')">
                    ${imageHtml || `<div class="gallery-placeholder">
                        <span class="placeholder-icon">🪑</span>
                        <p>${escapeHtml(product.name)}</p>
                    </div>`}
                    ${product.description ? `<div style="padding: 1rem;"><p style="color: var(--text-light); font-size: 0.9rem;">${escapeHtml(product.description)}</p></div>` : ''}
                </div>
            `;
        }).join('');
    }
    
    // Load decoration products
    if (decorations.length > 0 && decorationGallery) {
        decorationGallery.innerHTML = decorations.map(product => {
            const imageHtml = product.image 
                ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" style="width: 100%; height: 300px; object-fit: cover;" onerror="this.parentElement.innerHTML='<div class=\\'gallery-placeholder\\'><span class=\\'placeholder-icon\\'>🎄</span><p>${escapeHtml(product.name)}</p></div>'">`
                : '';
            
            // Build sizes and prices display
            let sizesPricesHtml = '';
            if (product.prices) {
                const sizes = [];
                if (product.prices.small !== null && product.prices.small !== undefined) {
                    sizes.push(`<div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--muted-border);"><span style="font-weight: 600;">Small:</span> <span style="font-weight: 600; color: var(--primary-color);">$${product.prices.small.toFixed(2)}</span></div>`);
                }
                if (product.prices.medium !== null && product.prices.medium !== undefined) {
                    sizes.push(`<div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--muted-border);"><span style="font-weight: 600;">Medium:</span> <span style="font-weight: 600; color: var(--primary-color);">$${product.prices.medium.toFixed(2)}</span></div>`);
                }
                if (product.prices.large !== null && product.prices.large !== undefined) {
                    sizes.push(`<div style="display: flex; justify-content: space-between; padding: 0.5rem 0;"><span style="font-weight: 600;">Large:</span> <span style="font-weight: 600; color: var(--primary-color);">$${product.prices.large.toFixed(2)}</span></div>`);
                }
                
                if (sizes.length > 0) {
                    sizesPricesHtml = `
                        <div style="padding: 0 1rem 1rem; background: var(--bg-light); margin-top: 0.5rem; border-left: 3px solid var(--primary-color);">
                            <strong style="display: block; margin-bottom: 0.5rem; color: var(--primary-color);">Available Sizes & Prices:</strong>
                            ${sizes.join('')}
                        </div>
                    `;
                }
            }
            
            return `
                <div class="gallery-item" style="cursor: pointer;" onclick="showProductDetail('${product.id}')">
                    ${imageHtml || `<div class="gallery-placeholder">
                        <span class="placeholder-icon">🎄</span>
                        <p>${escapeHtml(product.name)}</p>
                    </div>`}
                    ${product.description ? `<div style="padding: 1rem;"><p style="color: var(--text-light); font-size: 0.9rem;">${escapeHtml(product.description)}</p></div>` : ''}
                    ${sizesPricesHtml}
                </div>
            `;
        }).join('');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Check login status and update navigation
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');
    const logoutLink = document.getElementById('logoutLink');
    
    if (currentUser || isAdminLoggedIn) {
        // User or admin is logged in
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (userNavItem) {
            userNavItem.style.display = 'block';
            if (isAdminLoggedIn) {
                userNavItem.querySelector('a').textContent = 'Admin Dashboard';
                userNavItem.querySelector('a').href = 'admin-dashboard.html';
            } else {
                userNavItem.querySelector('a').textContent = 'My Account';
                userNavItem.querySelector('a').href = 'user-dashboard.html';
            }
        }
        if (logoutNavItem) logoutNavItem.style.display = 'block';
    } else {
        // No one is logged in
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (userNavItem) userNavItem.style.display = 'none';
        if (logoutNavItem) logoutNavItem.style.display = 'none';
    }
    
    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('adminLoggedIn');
            updateNavigation();
            window.location.reload();
        });
    }
}

// Product Detail Modal Functionality
const productDetailModal = document.getElementById('productDetailModal');
const closeProductDetail = document.getElementById('closeProductDetail');
const imageWrapper = document.getElementById('imageWrapper');
const detailProductImage = document.getElementById('detailProductImage');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomResetBtn = document.getElementById('zoomResetBtn');

// Zoom state
let currentZoom = 1;
const minZoom = 1;
const maxZoom = 4;
const zoomStep = 0.2;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panOffsetX = 0;
let panOffsetY = 0;

if (closeProductDetail) {
    closeProductDetail.addEventListener('click', () => {
        productDetailModal.classList.remove('active');
        resetZoom();
    });
}

if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
        if (e.target === productDetailModal) {
            productDetailModal.classList.remove('active');
            resetZoom();
        }
    });
}

// Zoom In functionality
zoomInBtn.addEventListener('click', () => {
    if (currentZoom < maxZoom) {
        currentZoom += zoomStep;
        if (currentZoom > maxZoom) currentZoom = maxZoom;
        applyZoom();
    }
});

// Zoom Out functionality
zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > minZoom) {
        currentZoom -= zoomStep;
        if (currentZoom < minZoom) currentZoom = minZoom;
        applyZoom();
    }
});

// Reset Zoom functionality
zoomResetBtn.addEventListener('click', () => {
    resetZoom();
});

// Apply zoom transformation
function applyZoom() {
    const transform = `scale(${currentZoom}) translate(${panOffsetX}px, ${panOffsetY}px)`;
    detailProductImage.style.transform = transform;
    updateZoomButtonStates();
}

// Reset zoom to default
function resetZoom() {
    currentZoom = 1;
    panOffsetX = 0;
    panOffsetY = 0;
    detailProductImage.style.transform = 'scale(1) translate(0, 0)';
    updateZoomButtonStates();
}

// Update zoom button states
function updateZoomButtonStates() {
    zoomInBtn.disabled = currentZoom >= maxZoom;
    zoomOutBtn.disabled = currentZoom <= minZoom;
}

// Mouse wheel zoom support
imageWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (e.deltaY < 0) {
        // Scroll up - zoom in
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            if (currentZoom > maxZoom) currentZoom = maxZoom;
            applyZoom();
        }
    } else {
        // Scroll down - zoom out
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            if (currentZoom < minZoom) currentZoom = minZoom;
            applyZoom();
        }
    }
}, { passive: false });

// Pan functionality - mouse drag
imageWrapper.addEventListener('mousedown', (e) => {
    if (currentZoom > minZoom) {
        isPanning = true;
        panStartX = e.clientX - panOffsetX;
        panStartY = e.clientY - panOffsetY;
        imageWrapper.classList.add('dragging');
    }
});

document.addEventListener('mousemove', (e) => {
    if (isPanning) {
        panOffsetX = e.clientX - panStartX;
        panOffsetY = e.clientY - panStartY;
        applyZoom();
    }
});

document.addEventListener('mouseup', () => {
    isPanning = false;
    imageWrapper.classList.remove('dragging');
});

// Touch support for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchStartDistance = 0;

imageWrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // Calculate distance between two fingers for pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistance = Math.sqrt(dx * dx + dy * dy);
    }
});

imageWrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && currentZoom > minZoom) {
        // Pan with single finger
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        panOffsetX = deltaX;
        panOffsetY = deltaY;
        applyZoom();
    } else if (e.touches.length === 2) {
        // Pinch zoom
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const zoomFactor = currentDistance / touchStartDistance;
        
        if (zoomFactor > 1 && currentZoom < maxZoom) {
            // Zoom in
            currentZoom = Math.min(currentZoom * 1.05, maxZoom);
            applyZoom();
        } else if (zoomFactor < 1 && currentZoom > minZoom) {
            // Zoom out
            currentZoom = Math.max(currentZoom * 0.95, minZoom);
            applyZoom();
        }
        
        touchStartDistance = currentDistance;
    }
});

// Function to show product details
window.showProductDetail = function(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Set product image
    const detailImage = document.getElementById('detailProductImage');
    if (product.image) {
        detailImage.src = product.image;
        detailImage.style.display = 'block';
    } else {
        detailImage.style.display = 'none';
    }
    
    // Set product name
    document.getElementById('detailProductName').textContent = product.name;
    
    // Set product description
    document.getElementById('detailProductDescription').textContent = product.description;
    
    // Set product prices (for decorations)
    const pricesDiv = document.getElementById('detailProductPrices');
    if (product.category === 'decoration' && product.prices) {
        let pricesHtml = '<div class="detail-prices-header"><strong>Available Sizes & Prices:</strong></div><div class="detail-prices-list">';
        if (product.prices.small !== null && product.prices.small !== undefined) {
            pricesHtml += `<div class="detail-price-item"><span class="detail-size-label">Small:</span> <span class="detail-price-value">$${product.prices.small.toFixed(2)}</span></div>`;
        }
        if (product.prices.medium !== null && product.prices.medium !== undefined) {
            pricesHtml += `<div class="detail-price-item"><span class="detail-size-label">Medium:</span> <span class="detail-price-value">$${product.prices.medium.toFixed(2)}</span></div>`;
        }
        if (product.prices.large !== null && product.prices.large !== undefined) {
            pricesHtml += `<div class="detail-price-item"><span class="detail-size-label">Large:</span> <span class="detail-price-value">$${product.prices.large.toFixed(2)}</span></div>`;
        }
        pricesHtml += '</div>';
        pricesDiv.innerHTML = pricesHtml;
        pricesDiv.style.display = 'block';
    } else {
        pricesDiv.style.display = 'none';
    }
    
    // Show modal
    productDetailModal.classList.add('active');
};

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProductsOnMainSite();
    updateNavigation();
});
