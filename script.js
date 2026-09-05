/* ================================================================
   D THREADS — script.js
   Interactive storefront logic
   ================================================================ */

'use strict';

/* ── 1. PRODUCT DATA ──────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Neon Street Hoodie',
    category: 'Hoodies',
    price: 89,
    originalPrice: null,
    badge: 'NEW',
    badgeClass: 'badge-new',
    image: 'source/clothes/1.jpg',
    stars: 5,
    desc: 'Heavyweight cotton-poly blend with reflective trim and custom embroidered logo. Engineered for the streets — built to glow. Unisex oversized fit.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 'In Stock — 12 left',
  },
  {
    id: 2,
    name: 'LED Runner Sneakers',
    category: 'Footwear',
    price: 145,
    originalPrice: 180,
    badge: 'HOT',
    badgeClass: 'badge-hot',
    image: 'source/clothes/2.jpg',
    stars: 5,
    desc: 'Ultra-lightweight mesh upper with reactive LED strip embedded in the sole. Rechargeable via USB-C. Available in three luminosity modes.',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    stock: 'In Stock — 8 left',
  },
  {
    id: 3,
    name: 'Tech Armor Jacket',
    category: 'Outerwear',
    price: 220,
    originalPrice: null,
    badge: 'LIMITED',
    badgeClass: 'badge-limited',
    image: 'source/clothes/3.jpg',
    stars: 5,
    desc: 'Water-resistant shell with detachable thermal liner and integrated cable management channels. Six functional pockets. Statement silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 'Low Stock — 3 left',
  },
  {
    id: 4,
    name: 'Cyber Gloves',
    category: 'Accessories',
    price: 48,
    originalPrice: null,
    badge: 'NEW',
    badgeClass: 'badge-new',
    image: 'source/clothes/4.jpg',
    stars: 4,
    desc: 'Touchscreen-compatible tactical gloves with reinforced knuckle guards and laser-etched D Threads branding. One size fits most.',
    sizes: ['S/M', 'L/XL'],
    stock: 'In Stock',
  },
  {
    id: 5,
    name: 'Plasma Cargo Pants',
    category: 'Bottoms',
    price: 115,
    originalPrice: 140,
    badge: 'SALE',
    badgeClass: 'badge-sale',
    image: 'source/clothes/5.jpg',
    stars: 4,
    desc: 'Relaxed-fit technical cargos with eight pockets, adjustable ankle cuffs, and a subtle holographic sheen. Stretchy ripstop fabric.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 'In Stock — 20 left',
  },
  {
    id: 6,
    name: 'Signal Tee',
    category: 'T-Shirts',
    price: 42,
    originalPrice: null,
    badge: 'NEW',
    badgeClass: 'badge-new',
    image: 'source/clothes/6.jpg',
    stars: 5,
    desc: 'Heavyweight 240gsm cotton tee with a large UV-reactive print on the back. Boxy silhouette. Pre-washed for extra softness.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 'In Stock',
  },
  {
    id: 7,
    name: 'Void Runner Cap',
    category: 'Accessories',
    price: 35,
    originalPrice: null,
    badge: 'HOT',
    badgeClass: 'badge-hot',
    image: 'source/clothes/7.jpg',
    stars: 5,
    desc: 'Six-panel structured cap with embroidered D Threads logo and an adjustable strap. Built for everyday wear, designed for the future.',
    sizes: ['One Size'],
    stock: 'In Stock',
  },
  {
    id: 8,
    name: 'Neural Mesh Vest',
    category: 'Tops',
    price: 78,
    originalPrice: 95,
    badge: 'LIMITED',
    badgeClass: 'badge-limited',
    image: 'source/clothes/8.jpg',
    stars: 4,
    desc: 'Open-weave technical vest layered over a built-in crop top base. Metallic thread weave catches light from every angle. Festival-ready.',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 'Low Stock — 5 left',
  },
  {
    id: 9,
    name: 'Stealth Crossbody',
    category: 'Bags',
    price: 64,
    originalPrice: null,
    badge: 'NEW',
    badgeClass: 'badge-new',
    image: 'source/clothes/9.jpg',
    stars: 5,
    desc: 'Compact crossbody bag in recycled nylon with a slash-proof base layer and RFID-blocking inner pocket. Magnetic quick-release buckle.',
    sizes: ['One Size'],
    stock: 'In Stock — 15 left',
  },
  {
    id: 10,
    name: 'Hyperdrive Shorts',
    category: 'Bottoms',
    price: 56,
    originalPrice: null,
    badge: 'HOT',
    badgeClass: 'badge-hot',
    image: 'source/clothes/10.jpg',
    stars: 4,
    desc: 'Performance hybrid shorts with a 4-way stretch shell, contrast mesh panel, and reflective piping. Move unrestricted.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 'In Stock',
  },
];

/* How many products to show initially before "Load More" */
const INITIAL_PRODUCTS_SHOWN = 8;
let productsShown = INITIAL_PRODUCTS_SHOWN;


/* ── 2. CART STATE (localStorage) ────────────────────────────── */
const CART_KEY = 'dthreads_cart';

/** @returns {CartItem[]} */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/** @param {CartItem[]} cart */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();


/* ── 3. DOM REFERENCES ───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Navbar
const hamburgerBtn  = $('#hamburgerBtn');
const navLinks      = $('#navLinks');
const accountBtn    = $('#accountBtn');
const accountMenu   = $('#accountDropdown .dropdown-menu');
const helpBtn       = $('#helpBtn');
const helpMenu      = $('#helpDropdown .dropdown-menu');

// Cart
const cartBtn       = $('#cartBtn');
const cartBadge     = $('#cartBadge');
const cartDrawer    = $('#cartDrawer');
const cartOverlay   = $('#cartOverlay');
const cartCloseBtn  = $('#cartCloseBtn');
const cartItemsList = $('#cartItemsList');
const cartEmpty     = $('#cartEmpty');
const cartFooter    = $('#cartFooter');
const cartTotal     = $('#cartTotal');
const clearCartBtn  = $('#clearCartBtn');
const checkoutBtn   = $('#checkoutBtn');
const cartShopLink  = $('#cartShopLink');

// Product grid
const productsGrid  = $('#productsGrid');
const loadMoreBtn   = $('#loadMoreBtn');

// Modal
const modalOverlay  = $('#modalOverlay');
const productModal  = $('#productModal');
const modalCloseBtn = $('#modalCloseBtn');
const modalImg      = $('#modalImg');
const modalBadge    = $('#modalBadge');
const modalCategory = $('#modalCategory');
const modalTitle    = $('#modalTitle');
const modalStars    = $('#modalStars');
const modalDesc     = $('#modalDesc');
const modalSizes    = $('#modalSizes');
const modalPrice    = $('#modalPrice');
const modalStock    = $('#modalStock');
const modalAddBtn   = $('#modalAddToCart');

// Toast
const toast = $('#toast');


/* ── 4. UTILITY HELPERS ──────────────────────────────────────── */

/**
 * Show a brief toast notification.
 * @param {string} msg  - Message text
 * @param {'cyan'|'pink'} [color='cyan']
 */
let toastTimer;
function showToast(msg, color = 'cyan') {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.borderColor = color === 'pink' ? 'var(--border-pink)' : 'var(--border-cyan)';
  toast.style.boxShadow   = color === 'pink' ? 'var(--pink-glow)' : 'var(--cyan-glow)';
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/** Format price as $XX.XX */
const fmt = (n) => `$${Number(n).toFixed(2)}`;

/** Generate star string from rating (1–5) */
function renderStars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

/**
 * Bump the cart badge with a small scale animation.
 */
function bumpBadge() {
  if (!cartBadge) return;
  cartBadge.classList.remove('bump');
  // Force reflow to restart animation
  void cartBadge.offsetWidth;
  cartBadge.classList.add('bump');
  setTimeout(() => cartBadge.classList.remove('bump'), 300);
}


/* ── 5. NAVBAR ───────────────────────────────────────────────── */

// Hamburger toggle (existing button #hamburgerBtn → controls #navLinks)
if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/**
 * toggleMobileMenu — alias wired to the hamburger for any inline onclick
 * usage in future HTML additions; delegates to the existing hamburgerBtn handler.
 */
function toggleMobileMenu() {
  if (hamburgerBtn) hamburgerBtn.click();
}

// Highlight active nav link on scroll
const sectionIds = ['home', 'products', 'about', 'reviews'];

function updateActiveNav() {
  const scrollY = window.scrollY + 80;
  let current = 'home';
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const hash = href.includes('#') ? href.split('#').pop() : href.replace('#', '');
    link.classList.toggle('active', hash === current);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// Close hamburger menu when a link is clicked
if (navLinks && hamburgerBtn) {
  navLinks.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
      navLinks.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── 6. DROPDOWN MENUS ───────────────────────────────────────── */

/**
 * Toggle a dropdown open/closed.
 * @param {HTMLElement} btn
 * @param {HTMLElement} menu
 */
function toggleDropdown(btn, menu) {
  const isOpen = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(isOpen));
}

/**
 * Close all dropdowns.
 */
function closeAllDropdowns() {
  [accountMenu, helpMenu].forEach(m => m && m.classList.remove('open'));
  [accountBtn, helpBtn].forEach(b => b && b.setAttribute('aria-expanded', 'false'));
}

if (accountBtn && accountMenu) {
  accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (helpMenu) helpMenu.classList.remove('open');
    if (helpBtn) helpBtn.setAttribute('aria-expanded', 'false');
    toggleDropdown(accountBtn, accountMenu);
  });
}

if (helpBtn && helpMenu) {
  helpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (accountMenu) accountMenu.classList.remove('open');
    if (accountBtn) accountBtn.setAttribute('aria-expanded', 'false');
    toggleDropdown(helpBtn, helpMenu);
  });
}

// Click outside → close dropdowns
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) closeAllDropdowns();
});

// Escape key → close dropdowns
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeCart();
    closeModal();
  }
});


/* ── 7. PRODUCT GRID ─────────────────────────────────────────── */

/**
 * Build a product card DOM element.
 * @param {object} product
 * @returns {HTMLElement}
 */
function createProductCard(product) {
  const article = document.createElement('article');
  article.className = 'product-card reveal';
  article.setAttribute('role', 'listitem');
  article.setAttribute('data-id', product.id);
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${product.name}, ${fmt(product.price)}`);

  const priceHTML = product.originalPrice
    ? `<span class="card-price">${fmt(product.price)}</span>
       <span class="card-price-original">${fmt(product.originalPrice)}</span>`
    : `<span class="card-price">${fmt(product.price)}</span>`;

  article.innerHTML = `
    <div class="card-img-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="card-badge ${product.badgeClass}">${product.badge}</span>
      <button class="card-quick-add" data-id="${product.id}" aria-label="Quick add ${product.name} to cart" title="Add to Cart">
        🛒
      </button>
    </div>
    <div class="card-body">
      <p class="card-category">${product.category}</p>
      <h3 class="card-title">${product.name}</h3>
      <div class="card-stars" aria-label="${product.stars} stars">${renderStars(product.stars)}</div>
      <div class="card-price-row">${priceHTML}</div>
      <div class="card-actions">
        <button class="btn btn-ghost card-view-btn" data-id="${product.id}">View Details</button>
      </div>
    </div>
  `;

  // "View Details" button
  article.querySelector('.card-view-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(product.id);
  });

  // Quick-add cart icon
  article.querySelector('.card-quick-add').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product.id, product.sizes[0] || null);
    showToast(`✅ ${product.name} added to cart!`);
  });

  // Card click → open modal
  article.addEventListener('click', () => openModal(product.id));

  // Keyboard accessibility: Enter or Space on card
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(product.id);
    }
  });

  return article;
}

/**
 * Render products into the grid up to `productsShown`.
 */
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  const slice = PRODUCTS.slice(0, productsShown);
  const frag = document.createDocumentFragment();
  slice.forEach(p => frag.appendChild(createProductCard(p)));
  productsGrid.appendChild(frag);

  // Trigger scroll reveal for newly added cards
  setTimeout(checkReveal, 50);

  // Hide "Load More" if all products are shown
  if (loadMoreBtn) {
    loadMoreBtn.style.display = productsShown >= PRODUCTS.length ? 'none' : 'inline-flex';
  }
}

// Load More
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    productsShown = Math.min(productsShown + 4, PRODUCTS.length);
    renderProducts();
  });
}

// Initial render
renderProducts();


/* ── 8. SCROLL REVEAL ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function checkReveal() {
  $$('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) revealObserver.observe(el);
  });
}

// Observe static sections
$$('.review-card, .about-inner, .hero-content, .hero-visual').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


/* ── 9. CART LOGIC ───────────────────────────────────────────── */

/**
 * Add a product to the cart (or increment qty if already present).
 * @param {number} productId
 * @param {string|null} size
 */
function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const key = `${productId}-${size}`;
  const existing = cart.find(item => item.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size || 'N/A',
      qty: 1,
    });
  }

  saveCart(cart);
  updateCartUI();
  bumpBadge();
}

/**
 * Remove a cart item by key.
 * @param {string} key
 */
function removeFromCart(key) {
  cart = cart.filter(item => item.key !== key);
  saveCart(cart);
  updateCartUI();
}

/**
 * Change quantity for a cart item.
 * @param {string} key
 * @param {number} delta  - +1 or -1
 */
function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartUI();
}

/**
 * Rebuild the cart drawer UI.
 */
function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Badge
  if (cartBadge) cartBadge.textContent = totalItems;
  if (!cartItemsList) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = '';
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.style.display = 'flex';
  cartTotal.textContent = fmt(totalPrice);

  // Rebuild items list
  cartItemsList.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('role', 'listitem');
    div.innerHTML = `
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-size">Size: ${item.size}</p>
        <p class="cart-item-price">${fmt(item.price * item.qty)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="qty-row">
          <button class="qty-btn" data-key="${item.key}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <span class="qty-value" aria-label="Quantity: ${item.qty}">${item.qty}</span>
          <button class="qty-btn" data-key="${item.key}" data-delta="1"  aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-btn" data-key="${item.key}" aria-label="Remove ${item.name} from cart">Remove</button>
      </div>
    `;
    cartItemsList.appendChild(div);
  });

  // Delegate qty and remove buttons
  cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(btn.dataset.key, Number(btn.dataset.delta));
    });
  });

  cartItemsList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.key);
      showToast('🗑️ Item removed from cart.', 'pink');
    });
  });
}

/** Open the cart drawer */
function openCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.add('open');
  if (cartOverlay) {
    cartOverlay.classList.add('open');
    cartOverlay.setAttribute('aria-hidden', 'false');
  }
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (cartCloseBtn) cartCloseBtn.focus();
}

/** Close the cart drawer */
function closeCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.remove('open');
  if (cartOverlay) {
    cartOverlay.classList.remove('open');
    cartOverlay.setAttribute('aria-hidden', 'true');
  }
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Close cart if user clicks the "Start Shopping" link inside empty state
if (cartShopLink) cartShopLink.addEventListener('click', closeCart);

// Clear cart button
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    saveCart(cart);
    updateCartUI();
    showToast('🗑️ Cart cleared.', 'pink');
  });
}

// Checkout (stub — just a toast in a static demo)
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    showToast('🚀 Checkout coming soon!');
  });
}

// Initial cart render
updateCartUI();


/* ── 10. PRODUCT MODAL ───────────────────────────────────────── */

/** Currently viewed product id */
let activeProductId = null;
/** Currently selected size in the modal */
let selectedSize = null;

/**
 * Open the quick-view modal for a product.
 * @param {number} productId
 */
function openModal(productId) {
  if (!productModal) return;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  activeProductId = productId;
  selectedSize = product.sizes[0] || null;

  // Populate modal fields
  modalImg.src   = product.image;
  modalImg.alt   = product.name;

  // Badge
  modalBadge.textContent  = product.badge;
  modalBadge.className    = `modal-badge ${product.badgeClass}`;

  modalCategory.textContent = product.category;
  modalTitle.textContent    = product.name;
  modalStars.textContent    = renderStars(product.stars);
  modalStars.setAttribute('aria-label', `${product.stars} out of 5 stars`);
  modalDesc.textContent     = product.desc;

  // Price
  modalPrice.textContent  = fmt(product.price);
  modalStock.textContent  = product.stock;

  // Size buttons
  modalSizes.innerHTML = '';
  product.sizes.forEach(size => {
    const btn = document.createElement('button');
    btn.className = `size-btn ${size === selectedSize ? 'selected' : ''}`;
    btn.textContent = size;
    btn.setAttribute('aria-pressed', String(size === selectedSize));
    btn.addEventListener('click', () => {
      selectedSize = size;
      modalSizes.querySelectorAll('.size-btn').forEach(b => {
        b.classList.toggle('selected', b.textContent === size);
        b.setAttribute('aria-pressed', String(b.textContent === size));
      });
    });
    modalSizes.appendChild(btn);
  });

  // Show modal
  productModal.classList.add('open');
  modalOverlay.classList.add('open');
  productModal.setAttribute('aria-hidden', 'false');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalCloseBtn.focus();
}

/** Close the product modal */
function closeModal() {
  if (!productModal) return;
  productModal.classList.remove('open');
  if (modalOverlay) modalOverlay.classList.remove('open');
  productModal.setAttribute('aria-hidden', 'true');
  if (modalOverlay) modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeProductId = null;
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Modal "Add to Cart" button
if (modalAddBtn) {
  modalAddBtn.addEventListener('click', () => {
    if (!activeProductId) return;
    addToCart(activeProductId, selectedSize);
    const product = PRODUCTS.find(p => p.id === activeProductId);
    showToast(`✅ ${product.name} (${selectedSize}) added to cart!`);
    closeModal();
    // Small delay then open cart
    setTimeout(openCart, 300);
  });
}


/* ── 11. NAVBAR SCROLL BEHAVIOUR ─────────────────────────────── */
// Add a subtle border glow once user scrolls
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(0,243,255,0.2)'
      : 'var(--border)';
  }, { passive: true });
}


/* ── 12. FOCUS TRAP FOR OVERLAYS ─────────────────────────────── */
/**
 * Trap keyboard focus inside an element (for accessibility).
 * @param {KeyboardEvent} e
 * @param {HTMLElement} container
 */
function trapFocus(e, container) {
  if (e.key !== 'Tab') return;
  const focusable = [...container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter(el => !el.closest('[aria-hidden="true"]'));

  if (focusable.length === 0) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}

document.addEventListener('keydown', (e) => {
  if (productModal && productModal.classList.contains('open')) trapFocus(e, productModal);
  else if (cartDrawer && cartDrawer.classList.contains('open'))  trapFocus(e, cartDrawer);
});


/* ── 13. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────── */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const offset = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: offset, behavior: 'smooth' });
});


/* ── 14. HERO IMAGE ERROR FALLBACK ───────────────────────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    // Replace broken image with a styled placeholder
    this.style.background = 'linear-gradient(135deg, rgba(0,243,255,0.08), rgba(255,0,85,0.08))';
    this.style.border = '1px solid rgba(0,243,255,0.2)';
    this.removeAttribute('src');
  });
});


/* ── 15. INIT ─────────────────────────────────────────────────── */
console.log('%cD THREADS', [
  'color: #00f3ff',
  'text-shadow: 0 0 8px #00f3ff, 0 0 20px #00f3ff',
  'font-family: monospace',
  'font-size: 28px',
  'font-weight: 900',
].join(';'));
console.log('%cWhere Style Meets the Future.', 'color: #ff0055; font-family: monospace;');


/* ================================================================
   16. CONTACT & SUPPORT SECTION
   ================================================================ */

/* ── DOM refs ─────────────────────────────────────────────────── */
const contactForm      = $('#contactForm');
const contactSubmitBtn = $('#contactSubmitBtn');
const submitBtnText    = contactSubmitBtn
                           ? contactSubmitBtn.querySelector('.submit-btn-text')
                           : null;

const trackOrderBtn    = $('#trackOrderBtn');
const trackOrderId     = $('#trackOrderId');
const trackResult      = $('#trackResult');

const calendlyOpenBtn  = $('#calendlyOpenBtn');
const calendlyModal    = $('#calendlyModal');
const calendlyOverlay  = $('#calendlyOverlay');
const calendlyCloseBtn = $('#calendlyCloseBtn');


/* ── 16a. CONTACT FORM ────────────────────────────────────────── */

/**
 * Validate a single form field.
 * Returns true if valid, false + sets error message if not.
 * @param {HTMLElement} input
 * @param {HTMLElement} errEl
 * @returns {boolean}
 */
function validateField(input, errEl) {
  const val = input.value.trim();
  let msg = '';

  if (input.required && !val) {
    msg = 'This field is required.';
  } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    msg = 'Please enter a valid email address.';
  }

  errEl.textContent = msg;
  input.classList.toggle('invalid', !!msg);
  return !msg;
}

if (contactForm) {
  /* Live validation — clear errors as soon as the user fixes a field */
  contactForm.querySelectorAll('.form-input').forEach(input => {
    const errId  = input.id + '-err';
    const errEl  = document.getElementById(errId);
    if (!errEl) return;

    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input, errEl);
    });

    input.addEventListener('blur', () => validateField(input, errEl));
  });

  /* Submit handler */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Validate all required fields */
    const fields = [
      { input: $('#cf-name'),    err: $('#cf-name-err') },
      { input: $('#cf-email'),   err: $('#cf-email-err') },
      { input: $('#cf-subject'), err: $('#cf-subject-err') },
      { input: $('#cf-message'), err: $('#cf-message-err') },
    ];

    const allValid = fields.every(({ input, err }) => validateField(input, err));
    if (!allValid) {
      /* Focus the first invalid field */
      const firstInvalid = contactForm.querySelector('.form-input.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* ── Sending state ── */
    contactSubmitBtn.classList.add('sending');
    if (submitBtnText) submitBtnText.textContent = 'Sending…';

    /*
      In a real implementation you would POST to your backend / EmailJS here.
      We simulate a short async delay then show success feedback.
    */
    setTimeout(() => {
      /* ── Success state ── */
      contactSubmitBtn.classList.remove('sending');
      contactSubmitBtn.classList.add('sent');
      if (submitBtnText) submitBtnText.textContent = '✅ Message Sent!';

      showToast('✅ Your message has been sent! We\'ll reply within 24 hrs.', 'cyan');

      /* Reset the form after a moment so the user sees the success state */
      setTimeout(() => {
        contactForm.reset();
        contactSubmitBtn.classList.remove('sent');
        if (submitBtnText) submitBtnText.textContent = 'Send Message 🚀';
        /* Clear any leftover validation states */
        contactForm.querySelectorAll('.form-input').forEach(el => el.classList.remove('invalid'));
        contactForm.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
      }, 3000);
    }, 1200);
  });
}


/* ── 16b. ORDER TRACKER (demo / stub) ────────────────────────── */

/**
 * Simulated order-status map.
 * Replace with a real API call in production.
 * @type {Record<string, {status: string, detail: string}>}
 */
const DEMO_ORDERS = {
  'DT-00001': { status: '📦 Shipped',       detail: 'Your order is on its way — estimated delivery in 3 days.' },
  'DT-00412': { status: '🚚 Out for Delivery', detail: 'Your order is with the courier and will arrive today.' },
  'DT-00099': { status: '✅ Delivered',      detail: 'Your order was delivered on Aug 28, 2026.' },
  'DT-00500': { status: '🔄 Processing',     detail: 'Your order is being prepared and will ship within 24 hours.' },
};

if (trackOrderBtn) {
  /* Trigger on button click */
  trackOrderBtn.addEventListener('click', runTrackOrder);

  /* Also allow Enter key inside the input */
  trackOrderId.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); runTrackOrder(); }
  });
}

function runTrackOrder() {
  const rawId   = trackOrderId.value.trim().toUpperCase();

  /* Clear previous result */
  trackResult.removeAttribute('hidden');
  trackResult.classList.remove('error');

  if (!rawId) {
    trackResult.innerHTML = '<strong>Please enter an order ID.</strong>';
    trackResult.classList.add('error');
    return;
  }

  /* Simulate network delay */
  trackResult.innerHTML = '<em style="color:var(--text-muted)">Searching…</em>';

  setTimeout(() => {
    const order = DEMO_ORDERS[rawId];
    if (order) {
      trackResult.innerHTML = `
        <strong style="color:var(--cyan);font-family:var(--font-head);font-size:0.82rem;">
          ${rawId}
        </strong><br/>
        <span style="color:var(--text)">${order.status}</span><br/>
        <span style="color:var(--text-muted);font-size:0.82rem;">${order.detail}</span>
      `;
    } else {
      trackResult.innerHTML = `
        <strong style="color:var(--pink)">Order not found.</strong><br/>
        <span style="color:var(--text-muted);font-size:0.82rem;">
          Double-check your order ID or <a href="mailto:support@dthreads.com"
          style="color:var(--cyan);text-decoration:underline">contact support</a>.
        </span>
      `;
      trackResult.classList.add('error');
    }
  }, 700);
}


/* ── 16c. FAQ ACCORDION ──────────────────────────────────────── */

/**
 * Open one FAQ item; optionally close others (single-open mode).
 * @param {HTMLButtonElement} trigger
 * @param {boolean} [closeOthers=true]
 */
function openFaqItem(trigger, closeOthers = true) {
  const body      = document.getElementById(trigger.getAttribute('aria-controls'));
  const isOpen    = trigger.getAttribute('aria-expanded') === 'true';
  const allItems  = $$('.faq-trigger');

  if (closeOthers) {
    /* Close every other open item first */
    allItems.forEach(t => {
      if (t !== trigger && t.getAttribute('aria-expanded') === 'true') {
        closeFaqItem(t);
      }
    });
  }

  if (isOpen) {
    closeFaqItem(trigger);
  } else {
    /* Open */
    body.removeAttribute('hidden');
    /* Allow the browser to register the element before animating */
    requestAnimationFrame(() => {
      body.style.maxHeight = body.scrollHeight + 'px';
      body.classList.add('open');
    });
    trigger.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Close one FAQ item.
 * @param {HTMLButtonElement} trigger
 */
function closeFaqItem(trigger) {
  const body = document.getElementById(trigger.getAttribute('aria-controls'));
  body.style.maxHeight = '0';
  body.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');

  /* Re-hide from accessibility tree after animation */
  body.addEventListener('transitionend', () => {
    if (!body.classList.contains('open')) body.setAttribute('hidden', '');
  }, { once: true });
}

/* Wire all FAQ triggers */
$$('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openFaqItem(trigger));
});


/* ── 16d. CALENDLY MODAL ─────────────────────────────────────── */

/** Open the Calendly booking modal */
function openCalendlyModal() {
  calendlyModal.classList.add('open');
  calendlyOverlay.classList.add('open');
  calendlyModal.setAttribute('aria-hidden', 'false');
  calendlyOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  /* Move focus to the close button for keyboard users */
  if (calendlyCloseBtn) calendlyCloseBtn.focus();
}

/** Close the Calendly booking modal */
function closeCalendlyModal() {
  calendlyModal.classList.remove('open');
  calendlyOverlay.classList.remove('open');
  calendlyModal.setAttribute('aria-hidden', 'true');
  calendlyOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  /* Return focus to the button that opened the modal */
  if (calendlyOpenBtn) calendlyOpenBtn.focus();
}

if (calendlyOpenBtn)  calendlyOpenBtn.addEventListener('click', openCalendlyModal);
if (calendlyCloseBtn) calendlyCloseBtn.addEventListener('click', closeCalendlyModal);
if (calendlyOverlay)  calendlyOverlay.addEventListener('click', closeCalendlyModal);

/* Extend the existing Escape-key handler to also close Calendly modal */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && calendlyModal && calendlyModal.classList.contains('open')) {
    closeCalendlyModal();
  }
});

/* Extend the existing focus-trap to cover the Calendly modal */
document.addEventListener('keydown', (e) => {
  if (calendlyModal && calendlyModal.classList.contains('open')) {
    trapFocus(e, calendlyModal);
  }
});


/* ── 16e. SCROLL REVEAL — contact section elements ───────────── */

/**
 * Register any `.reveal` elements inside #contact-support with
 * the already-running revealObserver.
 * We call this once after DOM is ready (script runs at end of body).
 */
(function observeContactSection() {
  const section = $('#contact-support');
  if (!section) return;

  section.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) {
      revealObserver.observe(el);
    }
  });
})();

/* Observe remaining .reveal elements (policy page, etc.) */
checkReveal();


/* ── 16f. NAV ACTIVE-LINK — include contact-support section ──── */

/*
  The existing updateActiveNav() reads from `sectionIds`.
  We push 'contact-support' into that array so the "Contact"
  nav link lights up when the user scrolls into the section.
*/
sectionIds.push('contact-support');
/* Re-run immediately so the active state is correct on load */
updateActiveNav();


/* ── LOGOUT BUTTON ────────────────────────────────────────────── */
const logoutBtn = $('#logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    showToast('👋 Logged out successfully.', 'cyan');
    /* In a real app you would clear session/token here */
  });
}
