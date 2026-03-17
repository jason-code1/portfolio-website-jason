// Check authentication - must be admin, not regular user
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

if (!isAdminLoggedIn) {
    // If regular user is logged in, redirect them to their dashboard
    if (currentUser) {
        window.location.href = 'user-dashboard.html';
    } else {
        window.location.href = 'admin-login.html';
    }
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser'); // Clear any user session too
    window.location.href = 'index.html';
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Load content for active tab
        if (tabName === 'contacts') {
            loadContacts();
        } else if (tabName === 'products') {
            loadProducts();
        }
        // Settings tab doesn't need loading
    });
});

// Load and display contacts
function loadContacts() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const contactsList = document.getElementById('contactsList');
    const noContacts = document.getElementById('noContacts');
    
    if (submissions.length === 0) {
        contactsList.innerHTML = '';
        noContacts.style.display = 'block';
        return;
    }
    
    noContacts.style.display = 'none';
    contactsList.innerHTML = submissions.reverse().map(submission => {
        const date = new Date(submission.date);
        return `
            <div class="contact-card">
                <div class="contact-header">
                    <div class="contact-name">${escapeHtml(submission.name)}</div>
                    <div class="contact-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
                </div>
                <div class="contact-info">
                    <div class="contact-info-item">
                        <strong>Email:</strong>
                        <span>${escapeHtml(submission.email)}</span>
                    </div>
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

// Load and display products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const furnitureProducts = document.getElementById('furnitureProducts');
    const decorationProducts = document.getElementById('decorationProducts');
    
    const furniture = products.filter(p => p.category === 'furniture');
    const decorations = products.filter(p => p.category === 'decoration');
    
    furnitureProducts.innerHTML = furniture.length > 0 
        ? furniture.map(product => renderProduct(product)).join('')
        : '<p class="empty-state">No furniture products yet. Click "Add Product" to get started.</p>';
    
    decorationProducts.innerHTML = decorations.length > 0
        ? decorations.map(product => renderProduct(product)).join('')
        : '<p class="empty-state">No decoration products yet. Click "Add Product" to get started.</p>';
    
    // Reset selection state after loading
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
    updateBulkDeleteButton();
}

function renderProduct(product) {
    const imageHtml = product.image 
        ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>🖼️</div>'">`
        : '<div class="product-image-placeholder">🖼️</div>';
    
    // Build sizes and prices display for decoration products
    let sizesPricesHtml = '';
    if (product.category === 'decoration' && product.prices) {
        const sizes = [];
        if (product.prices.small !== null && product.prices.small !== undefined) {
            sizes.push(`<div class="size-price-item"><span class="size-label">Small:</span> <span class="price-value">$${product.prices.small.toFixed(2)}</span></div>`);
        }
        if (product.prices.medium !== null && product.prices.medium !== undefined) {
            sizes.push(`<div class="size-price-item"><span class="size-label">Medium:</span> <span class="price-value">$${product.prices.medium.toFixed(2)}</span></div>`);
        }
        if (product.prices.large !== null && product.prices.large !== undefined) {
            sizes.push(`<div class="size-price-item"><span class="size-label">Large:</span> <span class="price-value">$${product.prices.large.toFixed(2)}</span></div>`);
        }
        
        if (sizes.length > 0) {
            sizesPricesHtml = `
                <div class="product-sizes-prices">
                    <strong style="display: block; margin-bottom: 0.5rem; color: var(--primary-color);">Available Sizes & Prices:</strong>
                    ${sizes.join('')}
                </div>
            `;
        }
    }
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-checkbox">
                <input type="checkbox" class="product-select-checkbox" data-product-id="${product.id}" onchange="updateBulkDeleteButton()">
            </div>
            ${imageHtml}
            <div class="product-info">
                <div class="product-name">${escapeHtml(product.name)}</div>
                <div class="product-description">${escapeHtml(product.description)}</div>
                ${sizesPricesHtml}
                <div class="product-actions">
                    <button class="btn btn-secondary btn-small" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Product modal
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.getElementById('closeModal');
const cancelProduct = document.getElementById('cancelProduct');

addProductBtn.addEventListener('click', () => {
    openProductModal();
});

closeModal.addEventListener('click', () => {
    closeProductModal();
});

cancelProduct.addEventListener('click', () => {
    closeProductModal();
});

productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});

function openProductModal(product = null) {
    document.getElementById('modalTitle').textContent = product ? 'Edit Product' : 'Add Product';
    const decorationFields = document.getElementById('decorationFields');
    const categorySelect = document.getElementById('productCategory');
    
    // Show/hide decoration fields based on category
    function toggleDecorationFields() {
        if (categorySelect.value === 'decoration') {
            decorationFields.style.display = 'block';
        } else {
            decorationFields.style.display = 'none';
        }
    }
    
    // Listen for category changes
    categorySelect.removeEventListener('change', toggleDecorationFields);
    categorySelect.addEventListener('change', toggleDecorationFields);
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image || '';
        
        // Load prices if they exist
        if (product.prices) {
            document.getElementById('priceSmall').value = product.prices.small || '';
            document.getElementById('priceMedium').value = product.prices.medium || '';
            document.getElementById('priceLarge').value = product.prices.large || '';
        } else {
            document.getElementById('priceSmall').value = '';
            document.getElementById('priceMedium').value = '';
            document.getElementById('priceLarge').value = '';
        }
        
        toggleDecorationFields();
    } else {
        productForm.reset();
        document.getElementById('productId').value = '';
        toggleDecorationFields();
    }
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    productForm.reset();
}

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const category = document.getElementById('productCategory').value;
    
    const product = {
        id: productId || Date.now().toString(),
        name: document.getElementById('productName').value,
        category: category,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };
    
    // Add prices for decoration products
    if (category === 'decoration') {
        const priceSmall = document.getElementById('priceSmall').value;
        const priceMedium = document.getElementById('priceMedium').value;
        const priceLarge = document.getElementById('priceLarge').value;
        
        product.prices = {
            small: priceSmall ? parseFloat(priceSmall) : null,
            medium: priceMedium ? parseFloat(priceMedium) : null,
            large: priceLarge ? parseFloat(priceLarge) : null
        };
    }
    
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = product;
        }
    } else {
        // Add new product
        products.push(product);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    updateMainWebsite();
    closeProductModal();
});

// Edit and delete functions (called from rendered HTML)
window.editProduct = function(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
};

window.deleteProduct = function(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        updateMainWebsite();
    }
};

// Refresh contacts button
document.getElementById('refreshContacts').addEventListener('click', () => {
    loadContacts();
});

// Update main website with products
function updateMainWebsite() {
    // This will be called when products are updated
    // The main website will read from localStorage on page load
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Bulk selection functionality
const selectAllCheckbox = document.getElementById('selectAllProducts');
const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.product-select-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
        updateBulkDeleteButton();
    });
}

if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener('click', () => {
        const selectedCheckboxes = document.querySelectorAll('.product-select-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select at least one product to delete.');
            return;
        }
        
        const count = selectedCheckboxes.length;
        if (confirm(`Are you sure you want to delete ${count} product(s)? This action cannot be undone.`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-product-id'));
            
            let products = JSON.parse(localStorage.getItem('products') || '[]');
            products = products.filter(p => !selectedIds.includes(p.id));
            localStorage.setItem('products', JSON.stringify(products));
            
            loadProducts();
            updateMainWebsite();
            selectAllCheckbox.checked = false;
            updateBulkDeleteButton();
            
            alert(`${count} product(s) deleted successfully.`);
        }
    });
}

// Update bulk delete button visibility
window.updateBulkDeleteButton = function() {
    const selectedCheckboxes = document.querySelectorAll('.product-select-checkbox:checked');
    const totalCheckboxes = document.querySelectorAll('.product-select-checkbox');
    
    if (bulkDeleteBtn) {
        if (selectedCheckboxes.length > 0) {
            bulkDeleteBtn.style.display = 'inline-block';
            bulkDeleteBtn.textContent = `Delete Selected (${selectedCheckboxes.length})`;
        } else {
            bulkDeleteBtn.style.display = 'none';
        }
    }
    
    // Update select all checkbox state
    if (selectAllCheckbox && totalCheckboxes.length > 0) {
        selectAllCheckbox.checked = selectedCheckboxes.length === totalCheckboxes.length;
        selectAllCheckbox.indeterminate = selectedCheckboxes.length > 0 && selectedCheckboxes.length < totalCheckboxes.length;
    }
};

// Reset Password Functionality
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const messageDiv = document.getElementById('passwordResetMessage');
        
        const storedPassword = localStorage.getItem('adminPassword');
        
        // Validate current password
        if (currentPassword !== storedPassword) {
            messageDiv.textContent = 'Current password is incorrect';
            messageDiv.style.color = 'var(--error-color)';
            messageDiv.classList.add('show');
            setTimeout(() => messageDiv.classList.remove('show'), 3000);
            return;
        }
        
        // Validate new password
        if (newPassword.length < 6) {
            messageDiv.textContent = 'New password must be at least 6 characters';
            messageDiv.style.color = 'var(--error-color)';
            messageDiv.classList.add('show');
            setTimeout(() => messageDiv.classList.remove('show'), 3000);
            return;
        }
        
        // Validate password match
        if (newPassword !== confirmNewPassword) {
            messageDiv.textContent = 'New passwords do not match';
            messageDiv.style.color = 'var(--error-color)';
            messageDiv.classList.add('show');
            setTimeout(() => messageDiv.classList.remove('show'), 3000);
            return;
        }
        
        // Update password
        localStorage.setItem('adminPassword', newPassword);
        messageDiv.textContent = 'Password reset successfully!';
        messageDiv.style.color = 'var(--success-color)';
        messageDiv.classList.add('show');
        resetPasswordForm.reset();
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 3000);
    });
}

// Product Detail Modal
const productDetailModal = document.getElementById('productDetailModal');
const closeProductDetail = document.getElementById('closeProductDetail');

if (closeProductDetail) {
    closeProductDetail.addEventListener('click', () => {
        productDetailModal.classList.remove('active');
    });
}

if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
        if (e.target === productDetailModal) {
            productDetailModal.classList.remove('active');
        }
    });
}

// Function to show product details
window.showProductDetails = function(productId) {
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

// Load initial data
loadContacts();
loadProducts();
