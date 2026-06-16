// PRODUCT DATA
const products = [
    {
        id: 1,
        name: "Fresh Cheese",
        category: "Dairy",
        price: 30,
        desc: "Premium cheese slice, creamy texture",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfqa1tNWMns3VbCfRUc-JbUHZt-wA30KEnyg&s"
    },
    {
        id: 2,
        name: "Organic Apples - 1kg",
        category: "Produce",
        price: 150,
        desc: "Crisp and juicy, pesticide-free",
        img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=140&fit=crop"
    },
    {
        id: 3,
        name: "Fresh Chicken - 1kg",
        category: "Meat",
        price: 350,
        desc: "Farm raised, 100% Halal",
        img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=140&fit=crop"
    },
    {
        id: 4,
        name: "Farm Fresh Milk",
        category: "Dairy",
        price: 30,
        desc: "Pure cow milk, rich in calcium",
        img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=140&fit=crop"
    },
    {
        id: 5,
        name: "Sourdough Bread",
        category: "Bakery",
        price: 85,
        desc: "Freshly baked daily, crispy crust",
        img: "https://www.kingarthurbaking.com/sites/default/files/2021-07/Rustic-Sourdough-Loaf_0049__0.jpg"
    },
    {
        id: 6,
        name: "Vanilla Ice Cream",
        category: "Frozen",
        price: 120,
        desc: "Creamy vanilla, perfect dessert",
        img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&h=140&fit=crop"
    },
    {
        id: 7,
        name: "Orange Juice",
        category: "Beverages",
        price: 60,
        desc: "100% natural, no preservatives",
        img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=140&fit=crop"
    },
    {
        id: 8,
        name: "Laundry Detergent",
        category: "Household",
        price: 180,
        desc: "Powerful stain removal, fresh scent",
        img: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=200&h=140&fit=crop"
    }
];

// CART STATE
let cart = [];

// DOM ELEMENTS
const productsContainer = document.getElementById('productsContainer');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartTotalQtySpan = document.getElementById('cartTotalQty');
const cartTotalPriceSpan = document.getElementById('cartTotalPrice');
const toastMsg = document.getElementById('toastMessage');
const searchInput = document.getElementById('searchInput');

let currentCategory = 'all';
let searchTerm = '';

// TOAST FUNCTION
function showToast(message) {
    toastMsg.innerHTML = message;
    toastMsg.classList.add('show');
    setTimeout(() => {
        toastMsg.classList.remove('show');
    }, 2000);
}

// CART FUNCTIONS
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.innerText = totalItems;
    cartTotalQtySpan.innerText = totalItems;

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalPriceSpan.innerText = `₹${totalPrice}`;

    if (cart.length === 0) {
        cartItemsList.innerHTML =
            `<div class="empty-cart"><i class="bi bi-cart-x" style="font-size: 48px;"></i><p class="mt-2">Your cart is empty</p></div>`;
        return;
    }

    cartItemsList.innerHTML = cart.map((item, idx) => `
            <div class="cart-item" data-item-idx="${idx}">
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

window.updateQuantity = function(index, delta) {
    if (cart[index]) {
        const newQty = cart[index].qty + delta;
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].qty = newQty;
        }
        updateCartUI();
        renderProducts();
        showToast(cart[index] ? `${cart[index].name} quantity updated` : 'Item removed');
    }
};

window.removeCartItem = function(index) {
    if (cart[index]) {
        const removedName = cart[index].name;
        cart.splice(index, 1);
        updateCartUI();
        renderProducts();
        showToast(`${removedName} removed from cart`);
    }
};

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty++;
        showToast(`${product.name} quantity increased to ${existingItem.qty}`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
        showToast(`${product.name} added to cart! 🛒`);
    }

    updateCartUI();
    renderProducts();
    openCart();
}

function getCartQty(productId) {
    const item = cart.find(item => item.id === productId);
    return item ? item.qty : 0;
}

function getCategoryClass(category) {
    const map = {
        'Produce': 'produce-badge',
        'Meat': 'meat-badge',
        'Bakery': 'bakery-badge',
        'Frozen': 'frozen-badge',
        'Beverages': 'beverages-badge',
        'Household': 'household-badge'
    };
    return map[category] || '';
}

window.showProductDetails = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`📦 ${product.name}\n💰 Price: ₹${product.price}\n📝 ${product.desc}\n🏷️ Category: ${product.category}`);
    }
};

// RENDER PRODUCTS
function renderProducts() {
    let filteredProducts = products;

    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }

    if (searchTerm.trim()) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML =
            `<div class="col-12 text-center py-5"><i class="bi bi-emoji-frown" style="font-size: 48px;"></i><p class="mt-3">No products found</p></div>`;
        return;
    }

    productsContainer.innerHTML = filteredProducts.map(product => {
        const cartQty = getCartQty(product.id);
        const categoryClass = getCategoryClass(product.category);

        return `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="product-card">
                        <div class="product-category-badge ${categoryClass}">${product.category.toUpperCase()}</div>
                        <div class="product-img-wrapper">
                            <img src="${product.img}" alt="${product.name}" class="product-img" onerror="this.src='https://placehold.co/200x130?text=Food'">
                        </div>
                        <h4 class="product-name">${product.name}</h4>
                        <div class="product-price">₹${product.price}</div>
                        <p class="product-desc">${product.desc}</p>
                        <div class="product-actions">
                            <button class="btn-details" onclick="showProductDetails(${product.id})">Details</button>
                            <button class="btn-add-cart" onclick="addToCart(${product.id})">
                                ${cartQty > 0 ? `🛒 Cart (${cartQty})` : 'Add to cart'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }).join('');
}

// SETUP CATEGORY FILTERS
function setupCategoryFilters() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-cat');
            renderProducts();
        });
    });
}

// SETUP SEARCH
function setupSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderProducts();
        });
    }
}

// SETUP CHECKOUT
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty! Add some items first.');
            } else {
                const totalItems = cart.reduce((s, i) => s + i.qty, 0);
                const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
                alert(
                    `✅ Order placed successfully!\n\nTotal Items: ${totalItems}\nTotal Price: ₹${totalPrice}\n\nThank you for shopping at Today Shop! 🎉`
                );
                cart = [];
                updateCartUI();
                renderProducts();
                closeCart();
                showToast('Order placed! 🎉');
            }
        });
    }
}

// CONTACT FORM HANDLER
window.handleContactForm = function(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const subject = document.getElementById('subjectInput').value;
    const message = document.getElementById('messageInput').value;

    alert(`✅ Message Sent Successfully!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\nWe'll get back to you within 24 hours.`);

    document.getElementById('contactForm').reset();
    showToast('Message sent successfully! 📧');
    return false;
};

// FAQ TOGGLE
window.toggleFAQ = function(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });

    // Toggle this FAQ
    faqItem.classList.toggle('active');
};

// FAQ SEARCH
window.filterFAQs = function() {
    const searchQuery = document.getElementById('faqSearchInput').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p')?.textContent.toLowerCase() || '';

        if (question.includes(searchQuery) || answer.includes(searchQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    // Cart icon
    const cartIconBtn = document.getElementById('cartIconBtn');
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', openCart);
    }

    // Close cart
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Start shopping button
    const startBtn = document.getElementById('startShoppingBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const container = document.getElementById('productsContainer');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Initialize
    init();
});

// INITIALIZE
function init() {
    renderProducts();
    setupCategoryFilters();
    setupSearch();
    setupCheckout();
    updateCartUI();
}