// script.js - Today Shop Single Page

// ===== PRODUCT DATA =====
const products = [
    { id: 1, name: "Fresh Cheese", category: "Dairy", price: 30, originalPrice: 40, desc: "Premium cheese slice, creamy texture", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfqa1tNWMns3VbCfRUc-JbUHZt-wA30KEnyg&s", badge: "25% OFF", badgeType: "discount", rating: 4.8, reviews: 120, stock: 20 },
    { id: 2, name: "Organic Apples - 1kg", category: "Produce", price: 150, originalPrice: 180, desc: "Crisp and juicy, pesticide-free", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=140&fit=crop", badge: "⭐ Best Seller", badgeType: "bestseller", rating: 4.9, reviews: 245, stock: 14 },
    { id: 3, name: "Fresh Chicken - 1kg", category: "Meat", price: 350, originalPrice: 400, desc: "Farm raised, 100% Halal", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=140&fit=crop", badge: "12% OFF", badgeType: "discount", rating: 4.7, reviews: 89, stock: 30 },
    { id: 4, name: "Farm Fresh Milk", category: "Dairy", price: 30, originalPrice: 35, desc: "Pure cow milk, rich in calcium", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=140&fit=crop", badge: "⚡ Limited", badgeType: "limited", rating: 4.6, reviews: 310, stock: 8 },
    { id: 5, name: "Sourdough Bread", category: "Bakery", price: 85, originalPrice: 100, desc: "Freshly baked daily, crispy crust", img: "https://www.kingarthurbaking.com/sites/default/files/2021-07/Rustic-Sourdough-Loaf_0049__0.jpg", badge: "✨ New", badgeType: "new", rating: 4.5, reviews: 67, stock: 38 },
    { id: 6, name: "Vanilla Ice Cream", category: "Frozen", price: 120, originalPrice: 150, desc: "Creamy vanilla, perfect dessert", img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&h=140&fit=crop", badge: "20% OFF", badgeType: "discount", rating: 4.8, reviews: 156, stock: 12 },
    { id: 7, name: "Orange Juice", category: "Beverages", price: 60, originalPrice: 80, desc: "100% natural, no preservatives", img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=140&fit=crop", badge: "🏆 Top Rated", badgeType: "top", rating: 4.9, reviews: 198, stock: 19 },
    { id: 8, name: "Laundry Detergent", category: "Household", price: 180, originalPrice: 220, desc: "Powerful stain removal, fresh scent", img: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=200&h=140&fit=crop", badge: "18% OFF", badgeType: "discount", rating: 4.4, reviews: 234, stock: 25 }
];

// ===== STATE =====
let cart = [];
let currentCategory = null; // null means no category selected
let searchTerm = '';

// ===== DOM REFS =====
const $ = id => document.getElementById(id);
const productsContainer = $('productsContainer');
const categoryProductsContainer = $('categoryProductsContainer');
const cartSidebar = $('cartSidebar');
const cartOverlay = $('cartOverlay');
const cartItemsList = $('cartItemsList');
const cartCountBadge = $('cartCountBadge');
const cartTotalQtySpan = $('cartTotalQty');
const cartTotalPriceSpan = $('cartTotalPrice');
const toastMsg = $('toastMessage');
const searchInput = $('searchInput');

// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
        localStorage.setItem('darkMode', 'disabled');
    }
});

// ===== TOAST =====
function showToast(msg) {
    toastMsg.innerHTML = msg;
    toastMsg.classList.add('show');
    setTimeout(() => toastMsg.classList.remove('show'), 2500);
}

// ===== CART FUNCTIONS =====
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

$('cartIconBtn').addEventListener('click', openCart);
$('closeCartBtn').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function updateCartUI() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    cartCountBadge.innerText = totalItems;
    cartTotalQtySpan.innerText = totalItems;

    const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    cartTotalPriceSpan.innerText = `₹${totalPrice}`;

    if (cart.length === 0) {
        cartItemsList.innerHTML =
            `<div class="empty-cart"><i class="bi bi-cart-x" style="font-size:48px;"></i><p class="mt-2">Your cart is empty</p><p class="text-muted small">Start adding some items!</p></div>`;
        return;
    }

    cartItemsList.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${idx}, -1)">-</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button class="qty-btn" onclick="updateQuantity(${idx}, 1)">+</button>
                <button class="remove-item-btn" onclick="removeCartItem(${idx})"><i class="bi bi-trash3"></i></button>
            </div>
        </div>
    `).join('');
}

window.updateQuantity = function(idx, delta) {
    if (!cart[idx]) return;
    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) {
        const removedName = cart[idx].name;
        cart.splice(idx, 1);
        showToast(`${removedName} removed from cart`);
    } else {
        cart[idx].qty = newQty;
        showToast(`${cart[idx].name} quantity updated`);
    }
    updateCartUI();
    renderProducts();
    renderCategoryProducts();
};

window.removeCartItem = function(idx) {
    if (cart[idx]) {
        const removedName = cart[idx].name;
        cart.splice(idx, 1);
        updateCartUI();
        renderProducts();
        renderCategoryProducts();
        showToast(`${removedName} removed from cart`);
    }
};

function addToCart(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;

    const existing = cart.find(x => x.id === productId);
    if (existing) {
        if (existing.qty >= p.stock) {
            showToast(`Sorry! Only ${p.stock} items available`);
            return;
        }
        existing.qty++;
        showToast(`${p.name} quantity increased to ${existing.qty}`);
    } else {
        if (p.stock < 1) {
            showToast('Sorry! Out of stock');
            return;
        }
        cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
        showToast(`${p.name} added to cart! 🛒`);
    }
    updateCartUI();
    renderProducts();
    renderCategoryProducts();
    openCart();
}

function getCartQty(id) {
    const item = cart.find(x => x.id === id);
    return item ? item.qty : 0;
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(p) {
    const qty = getCartQty(p.id);
    
    const badgeClass = {
        'discount': 'badge-discount',
        'bestseller': 'badge-bestseller',
        'limited': 'badge-limited',
        'new': 'badge-new',
        'top': 'badge-top'
    } [p.badgeType] || '';

    const categoryBadge = {
        'Produce': 'produce-badge',
        'Meat': 'meat-badge',
        'Bakery': 'bakery-badge',
        'Frozen': 'frozen-badge',
        'Beverages': 'beverages-badge',
        'Household': 'household-badge'
    } [p.category] || '';

    const fullStars = Math.floor(p.rating);
    const hasHalfStar = p.rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="bi bi-star-half"></i>';
        } else {
            starsHTML += '<i class="bi bi-star"></i>';
        }
    }

    const stockText = p.stock > 0 ? `<span class="stock-text">Only ${p.stock} left</span>` : '<span class="stock-text out-of-stock">Out of Stock</span>';

    return `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="product-card">
                ${p.badge ? `<div class="product-badge ${badgeClass}">${p.badge}</div>` : ''}
                <div class="product-category-badge ${categoryBadge}">${p.category.toUpperCase()}</div>
                <div class="product-img-wrapper">
                    <img src="${p.img}" alt="${p.name}" class="product-img" onerror="this.src='https://placehold.co/200x130?text=Food'">
                </div>
                <h4 class="product-name">${p.name}</h4>
                <div class="product-rating">
                    ${starsHTML}
                    <span>(${p.rating})</span>
                    <span class="review-count">${p.reviews} reviews</span>
                </div>
                <div class="product-price-wrapper">
                    <span class="product-price">₹${p.price}</span>
                    ${p.originalPrice ? `<span class="product-price-original">₹${p.originalPrice}</span>` : ''}
                </div>
                ${stockText}
                <p class="product-desc">${p.desc}</p>
                <div class="product-actions">
                    <button class="btn-details" onclick="showProductDetails(${p.id})">Details</button>
                    <button class="btn-add-cart" onclick="addToCart(${p.id})" ${p.stock < 1 ? 'disabled' : ''}>
                        ${qty > 0 ? `🛒 (${qty})` : 'Add to cart'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

window.showProductDetails = function(productId) {
    const p = products.find(x => x.id === productId);
    if (p) {
        alert(`📦 ${p.name}\n💰 Price: ₹${p.price}${p.originalPrice ? ` (was ₹${p.originalPrice})` : ''}\n⭐ Rating: ${p.rating} (${p.reviews} reviews)\n📝 ${p.desc}\n🏷️ Category: ${p.category}\n📦 Stock: ${p.stock} units`);
    }
};

// ===== RENDER ALL PRODUCTS (always shows all products in products section) =====
function renderProducts() {
    let filtered = products;

    if (searchTerm.trim()) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        productsContainer.innerHTML =
            `<div class="col-12 text-center py-5"><i class="bi bi-emoji-frown" style="font-size:48px;"></i><p class="mt-3">No products found</p></div>`;
        return;
    }

    productsContainer.innerHTML = filtered.map(p => createProductCard(p)).join('');
}

// ===== RENDER CATEGORY PRODUCTS (only shows when a category is selected) =====
function renderCategoryProducts() {
    // If no category is selected, keep container completely empty (no space)
    if (currentCategory === null) {
        categoryProductsContainer.innerHTML = '';
        return;
    }

    let filtered = products.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        categoryProductsContainer.innerHTML =
            `<div class="col-12 text-center py-5"><i class="bi bi-emoji-frown" style="font-size:48px;"></i><p class="mt-3">No products found in this category</p></div>`;
        return;
    }

    categoryProductsContainer.innerHTML = filtered.map(p => createProductCard(p)).join('');
}

// ===== CATEGORY FILTERS =====
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all category buttons
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Set current category
        currentCategory = btn.dataset.cat;
        // Render category products
        renderCategoryProducts();
    });
});

// ===== SEARCH =====
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderProducts();
});

// ===== CHECKOUT =====
$('checkoutBtn').addEventListener('click', () => {
    if (!cart.length) {
        showToast('Your cart is empty!');
        return;
    }
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    alert(`✅ Order placed successfully!\n\nTotal Items: ${totalItems}\nTotal Price: ₹${totalPrice}\n\nThank you for shopping at Today Shop! 🎉`);
    cart = [];
    updateCartUI();
    renderProducts();
    renderCategoryProducts();
    closeCart();
    showToast('Order placed! 🎉');
});

// ===== CONTACT FORM =====
window.handleContactForm = function(e) {
    e.preventDefault();
    const name = $('nameInput').value;
    const email = $('emailInput').value;
    const subject = $('subjectInput').value;
    const msg = $('messageInput').value;

    alert(`✅ Message Sent Successfully!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${msg}\n\nWe'll get back to you within 24 hours.`);
    document.getElementById('contactForm').reset();
    showToast('Message sent! 📧');
    return false;
};

// ===== FAQ FUNCTIONS =====
window.toggleFAQ = function(el) {
    const item = el.closest('.faq-item');
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
    });
    
    if (!isActive) {
        item.classList.add('active');
    }
};

window.filterFAQs = function() {
    const q = document.getElementById('faqSearchInput').value.toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question span')?.textContent || '';
        const answer = item.querySelector('.faq-answer p')?.textContent || '';
        const text = (question + answer).toLowerCase();
        item.style.display = text.includes(q) ? 'block' : 'none';
    });
};

// ===== NAV ACTIVE STATE ON SCROLL =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-list a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== HERO BUTTONS =====
$('startShoppingBtn').addEventListener('click', () => {
    document.getElementById('productsContainer').scrollIntoView({ behavior: 'smooth' });
});

$('shopNowBtn').addEventListener('click', () => {
    document.getElementById('productsContainer').scrollIntoView({ behavior: 'smooth' });
});

$('browseCategoriesBtn').addEventListener('click', () => {
    document.getElementById('categoriesSection').scrollIntoView({ behavior: 'smooth' });
});

// ===== KEYBOARD SHORTCUT =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        closeCart();
    }
});

// ===== INIT =====
// Render all products in products section
renderProducts();
// Category section starts completely empty (no category selected)
renderCategoryProducts();
updateCartUI();