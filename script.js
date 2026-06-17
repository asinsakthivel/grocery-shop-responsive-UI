// ===== script.js - Today Shop Single Page =====

// ===== PRODUCT DATA =====
const products = [
    { id: 1, name: "Fresh Cheese", category: "Dairy", price: 30, desc: "Premium cheese slice", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfqa1tNWMns3VbCfRUc-JbUHZt-wA30KEnyg&s" },
    { id: 2, name: "Organic Apples - 1kg", category: "Produce", price: 150, desc: "Crisp & juicy", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=140&fit=crop" },
    { id: 3, name: "Fresh Chicken - 1kg", category: "Meat", price: 350, desc: "Farm raised, Halal", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=140&fit=crop" },
    { id: 4, name: "Farm Fresh Milk", category: "Dairy", price: 30, desc: "Pure cow milk", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=140&fit=crop" },
    { id: 5, name: "Sourdough Bread", category: "Bakery", price: 85, desc: "Freshly baked", img: "https://www.kingarthurbaking.com/sites/default/files/2021-07/Rustic-Sourdough-Loaf_0049__0.jpg" },
    { id: 6, name: "Vanilla Ice Cream", category: "Frozen", price: 120, desc: "Creamy vanilla", img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&h=140&fit=crop" },
    { id: 7, name: "Orange Juice", category: "Beverages", price: 60, desc: "100% natural", img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=140&fit=crop" },
    { id: 8, name: "Laundry Detergent", category: "Household", price: 180, desc: "Stain removal", img: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=200&h=140&fit=crop" }
];

// ===== STATE =====
let cart = [];
let currentCategory = 'all';
let searchTerm = '';

// ===== DOM REFS =====
const $ = id => document.getElementById(id);
const productsContainer = $('productsContainer');
const cartSidebar = $('cartSidebar');
const cartOverlay = $('cartOverlay');
const cartItemsList = $('cartItemsList');
const cartCountBadge = $('cartCountBadge');
const cartTotalQtySpan = $('cartTotalQty');
const cartTotalPriceSpan = $('cartTotalPrice');
const toastMsg = $('toastMessage');
const searchInput = $('searchInput');

// ===== TOAST =====
function showToast(msg) {
    toastMsg.innerHTML = msg;
    toastMsg.classList.add('show');
    setTimeout(() => toastMsg.classList.remove('show'), 2000);
}

// ===== CART FUNCTIONS =====
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
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
            `<div class="empty-cart"><i class="bi bi-cart-x" style="font-size:48px;"></i><p class="mt-2">Your cart is empty</p></div>`;
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
        cart.splice(idx, 1);
    } else {
        cart[idx].qty = newQty;
    }
    updateCartUI();
    renderProducts();
};

window.removeCartItem = function(idx) {
    if (cart[idx]) {
        cart.splice(idx, 1);
        updateCartUI();
        renderProducts();
    }
};

function addToCart(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;

    const existing = cart.find(x => x.id === productId);
    if (existing) {
        existing.qty++;
        showToast(`${p.name} quantity increased`);
    } else {
        cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
        showToast(`${p.name} added to cart! 🛒`);
    }
    updateCartUI();
    renderProducts();
    openCart();
}

function getCartQty(id) {
    const item = cart.find(x => x.id === id);
    return item ? item.qty : 0;
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    let filtered = products;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

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

    productsContainer.innerHTML = filtered.map(p => {
        const qty = getCartQty(p.id);
        const badge = {
            'Produce': 'produce-badge',
            'Meat': 'meat-badge',
            'Bakery': 'bakery-badge',
            'Frozen': 'frozen-badge',
            'Beverages': 'beverages-badge',
            'Household': 'household-badge'
        } [p.category] || '';

        return `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="product-card">
                    <div class="product-category-badge ${badge}">${p.category.toUpperCase()}</div>
                    <div class="product-img-wrapper">
                        <img src="${p.img}" alt="${p.name}" class="product-img" onerror="this.src='https://placehold.co/200x130?text=Food'">
                    </div>
                    <h4 class="product-name">${p.name}</h4>
                    <div class="product-price">₹${p.price}</div>
                    <p class="product-desc">${p.desc}</p>
                    <div class="product-actions">
                        <button class="btn-details" onclick="showProductDetails(${p.id})">Details</button>
                        <button class="btn-add-cart" onclick="addToCart(${p.id})">
                            ${qty > 0 ? `🛒 Cart (${qty})` : 'Add to cart'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== SHOW PRODUCT DETAILS =====
window.showProductDetails = function(productId) {
    const p = products.find(x => x.id === productId);
    if (p) {
        alert(`📦 ${p.name}\n💰 Price: ₹${p.price}\n📝 ${p.desc}\n🏷️ Category: ${p.category}`);
    }
};

// ===== CATEGORY FILTERS =====
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
        renderProducts();
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
    alert(`✅ Order placed!\n\nTotal Items: ${totalItems}\nTotal Price: ₹${totalPrice}\n\nThank you for shopping at Today Shop! 🎉`);
    cart = [];
    updateCartUI();
    renderProducts();
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

    alert(`✅ Message Sent!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${msg}\n\nWe'll get back within 24h.`);
    document.getElementById('contactForm').reset();
    showToast('Message sent! 📧');
    return false;
};

// ===== FAQ FUNCTIONS =====
window.toggleFAQ = function(el) {
    const item = el.closest('.faq-item');
    document.querySelectorAll('.faq-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
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

// ===== START SHOPPING BUTTON =====
$('startShoppingBtn').addEventListener('click', () => {
    document.getElementById('productsContainer').scrollIntoView({ behavior: 'smooth' });
});

// ===== INIT =====
renderProducts();
updateCartUI();