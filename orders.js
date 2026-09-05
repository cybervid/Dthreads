/* ================================================================
   D THREADS — orders.js
   My Orders page logic
   ================================================================ */

'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const fmt = (n) => `$${Number(n).toFixed(2)}`;


/* ── Toast ───────────────────────────────────────────────────── */
const toast = $('#toast');
let toastTimer;

function showToast(msg, color = 'cyan') {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.borderColor = color === 'pink' ? 'var(--border-pink)' : 'var(--border-cyan)';
  toast.style.boxShadow   = color === 'pink' ? 'var(--pink-glow)'   : 'var(--cyan-glow)';
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ── Navbar ──────────────────────────────────────────────────── */
const hamburgerBtn = $('#hamburgerBtn');
const navLinks     = $('#navLinks');
const accountBtn   = $('#accountBtn');
const accountMenu  = $('#accountDropdown .dropdown-menu');
const helpBtn      = $('#helpBtn');
const helpMenu     = $('#helpDropdown .dropdown-menu');

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', open);
    hamburgerBtn.setAttribute('aria-expanded', String(open));
  });
}

function closeAllDropdowns() {
  [accountMenu, helpMenu].forEach(m => m && m.classList.remove('open'));
  [accountBtn, helpBtn].forEach(b => b && b.setAttribute('aria-expanded', 'false'));
}

if (accountBtn && accountMenu) {
  accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (helpMenu) helpMenu.classList.remove('open');
    accountMenu.classList.toggle('open');
    accountBtn.setAttribute('aria-expanded', String(accountMenu.classList.contains('open')));
  });
}

if (helpBtn && helpMenu) {
  helpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (accountMenu) accountMenu.classList.remove('open');
    helpMenu.classList.toggle('open');
    helpBtn.setAttribute('aria-expanded', String(helpMenu.classList.contains('open')));
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) closeAllDropdowns();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeTrackModal();
  }
});


/* ── Scroll reveal ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

$$('.reveal').forEach(el => revealObserver.observe(el));


/* ── Order data ──────────────────────────────────────────────── */

/**
 * Status keys: processing | dispatched | delivered | cancelled | returned
 */
const ORDERS = [
  {
    id: 'DT-00412',
    date: 'Sep 2, 2026',
    status: 'dispatched',
    statusLabel: 'Dispatched',
    total: 234.00,
    carrier: 'DHL Express',
    tracking: 'DHL-9374651234',
    eta: 'Sep 6, 2026',
    address: '45 Neon Ave, Lagos, NG',
    items: [
      { name: 'Neon Street Hoodie',  size: 'L',  qty: 1, price: 89,  image: 'source/clothes/1.jpg' },
      { name: 'Plasma Cargo Pants',  size: 'M',  qty: 1, price: 115, image: 'source/clothes/5.jpg' },
      { name: 'Signal Tee',          size: 'L',  qty: 1, price: 42,  image: 'source/clothes/6.jpg' },
    ],
    timeline: [
      { label: 'Order Placed',       desc: 'Your order was confirmed and payment received.',      time: 'Sep 1, 10:24 AM',  status: 'complete' },
      { label: 'Processing',         desc: 'Your items are being picked and packed.',              time: 'Sep 1, 2:15 PM',   status: 'complete' },
      { label: 'Dispatched',         desc: 'Your order has been handed to DHL Express.',          time: 'Sep 2, 9:00 AM',   status: 'active'   },
      { label: 'Out for Delivery',   desc: 'Arriving with the courier. Stay reachable!',          time: '—',                status: 'pending'  },
      { label: 'Delivered',          desc: 'Package delivered to your address.',                  time: '—',                status: 'pending'  },
    ],
  },
  {
    id: 'DT-00399',
    date: 'Aug 28, 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    total: 145.00,
    carrier: 'FedEx',
    tracking: 'FX-7823019283',
    eta: 'Delivered Aug 31, 2026',
    address: '45 Neon Ave, Lagos, NG',
    items: [
      { name: 'LED Runner Sneakers', size: '42', qty: 1, price: 145, image: 'source/clothes/2.jpg' },
    ],
    timeline: [
      { label: 'Order Placed',       desc: 'Order confirmed.',                                    time: 'Aug 26, 11:00 AM', status: 'complete' },
      { label: 'Processing',         desc: 'Picked and packed.',                                  time: 'Aug 26, 3:30 PM',  status: 'complete' },
      { label: 'Dispatched',         desc: 'Handed to FedEx.',                                    time: 'Aug 27, 8:45 AM',  status: 'complete' },
      { label: 'Out for Delivery',   desc: 'With the courier.',                                   time: 'Aug 31, 7:00 AM',  status: 'complete' },
      { label: 'Delivered',          desc: 'Delivered to your address. Enjoy! 🎉',               time: 'Aug 31, 1:14 PM',  status: 'complete' },
    ],
  },
  {
    id: 'DT-00500',
    date: 'Sep 4, 2026',
    status: 'processing',
    statusLabel: 'Processing',
    total: 268.00,
    carrier: 'UPS',
    tracking: '—',
    eta: 'Sep 8–10, 2026',
    address: '45 Neon Ave, Lagos, NG',
    items: [
      { name: 'Tech Armor Jacket',   size: 'M',  qty: 1, price: 220, image: 'source/clothes/3.jpg' },
      { name: 'Cyber Gloves',        size: 'L/XL', qty: 1, price: 48, image: 'source/clothes/4.jpg' },
    ],
    timeline: [
      { label: 'Order Placed',       desc: 'Order confirmed and payment received.',               time: 'Sep 4, 8:05 PM',   status: 'complete' },
      { label: 'Processing',         desc: 'Your items are being picked and packed.',             time: 'Sep 5 (est.)',      status: 'active'   },
      { label: 'Dispatched',         desc: 'Awaiting dispatch.',                                  time: '—',                status: 'pending'  },
      { label: 'Out for Delivery',   desc: '—',                                                   time: '—',                status: 'pending'  },
      { label: 'Delivered',          desc: '—',                                                   time: '—',                status: 'pending'  },
    ],
  },
  {
    id: 'DT-00288',
    date: 'Jul 15, 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    total: 113.00,
    carrier: 'DHL',
    tracking: 'DHL-4421987654',
    eta: 'Delivered Jul 20, 2026',
    address: '45 Neon Ave, Lagos, NG',
    items: [
      { name: 'Void Runner Cap',     size: 'One Size', qty: 1, price: 35, image: 'source/clothes/7.jpg' },
      { name: 'Signal Tee',          size: 'M',  qty: 2, price: 42, image: 'source/clothes/6.jpg' },
    ],
    timeline: [
      { label: 'Order Placed',       desc: 'Order confirmed.',                                    time: 'Jul 14, 9:12 AM',  status: 'complete' },
      { label: 'Processing',         desc: 'Picked and packed.',                                  time: 'Jul 15, 1:00 PM',  status: 'complete' },
      { label: 'Dispatched',         desc: 'Handed to DHL.',                                      time: 'Jul 16, 8:00 AM',  status: 'complete' },
      { label: 'Out for Delivery',   desc: 'With the courier.',                                   time: 'Jul 20, 8:30 AM',  status: 'complete' },
      { label: 'Delivered',          desc: 'Delivered to your address.',                          time: 'Jul 20, 12:05 PM', status: 'complete' },
    ],
  },
  {
    id: 'DT-00201',
    date: 'Jun 3, 2026',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    total: 78.00,
    carrier: '—',
    tracking: '—',
    eta: '—',
    address: '45 Neon Ave, Lagos, NG',
    items: [
      { name: 'Neural Mesh Vest',    size: 'S',  qty: 1, price: 78, image: 'source/clothes/8.jpg' },
    ],
    timeline: [
      { label: 'Order Placed',       desc: 'Order placed.',                                       time: 'Jun 3, 3:00 PM',   status: 'complete' },
      { label: 'Cancelled',          desc: 'Order was cancelled at your request.',                time: 'Jun 3, 4:22 PM',   status: 'active'   },
    ],
  },
];

/* ── Build the stats ─────────────────────────────────────────── */
function updateStats(list) {
  const total     = list.length;
  const active    = list.filter(o => ['processing','dispatched'].includes(o.status)).length;
  const delivered = list.filter(o => o.status === 'delivered').length;

  const statTotal     = $('#statTotal');
  const statActive    = $('#statActive');
  const statDelivered = $('#statDelivered');

  if (statTotal)     statTotal.textContent     = total;
  if (statActive)    statActive.textContent    = active;
  if (statDelivered) statDelivered.textContent = delivered;
}

updateStats(ORDERS);


/* ── Status badge HTML ───────────────────────────────────────── */
function statusBadgeHTML(order) {
  const map = {
    processing: 'status-processing',
    dispatched: 'status-dispatched',
    delivered:  'status-delivered',
    cancelled:  'status-cancelled',
    returned:   'status-returned',
  };
  const cls = map[order.status] || '';
  return `<span class="order-status-badge ${cls}" aria-label="Status: ${order.statusLabel}">${order.statusLabel}</span>`;
}


/* ── Build order card ────────────────────────────────────────── */
function createOrderCard(order) {
  const article = document.createElement('article');
  article.className = 'order-card reveal';
  article.setAttribute('role', 'listitem');
  article.setAttribute('data-status', order.status);
  article.setAttribute('data-order-id', order.id);
  article.setAttribute('aria-label', `Order ${order.id}`);

  // Items HTML
  const itemsHTML = order.items.map(item => `
    <div class="order-item-row">
      <img class="order-item-thumb" src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="order-item-info">
        <p class="order-item-name">${item.name}</p>
        <div class="order-item-meta">
          <span>Size: ${item.size}</span>
          <span>Qty: ${item.qty}</span>
        </div>
      </div>
      <span class="order-item-price">${fmt(item.price * item.qty)}</span>
    </div>
  `).join('');

  // Show items-toggle if more than 2 items
  const showToggle = order.items.length > 2;
  const toggleBtn = showToggle
    ? `<button class="items-toggle" aria-label="Show all items">+ ${order.items.length - 2} more item${order.items.length - 2 !== 1 ? 's' : ''}</button>`
    : '';

  // Track button: only for non-cancelled orders
  const trackBtn = order.status !== 'cancelled'
    ? `<button class="track-order-btn" data-order-id="${order.id}" aria-label="Track order ${order.id}">📡 Track Order</button>`
    : '';

  // Reorder button: only for delivered/cancelled
  const reorderBtn = ['delivered', 'cancelled'].includes(order.status)
    ? `<button class="reorder-btn" data-order-id="${order.id}" aria-label="Reorder items from ${order.id}">🔁 Reorder</button>`
    : '';

  article.innerHTML = `
    <!-- Card header -->
    <div class="order-card-header">
      <div class="order-meta">
        <p class="order-id">${order.id}</p>
        <p class="order-date">Placed ${order.date}</p>
      </div>
      ${statusBadgeHTML(order)}
      <p class="order-total">${fmt(order.total)}</p>
    </div>

    <!-- Items -->
    <div class="order-items${showToggle ? ' collapsed' : ''}" aria-label="Items in order ${order.id}">
      ${itemsHTML}
    </div>
    ${toggleBtn}

    <!-- Footer actions -->
    <div class="order-card-footer">
      <div class="order-footer-info">
        <p>Ships to: <strong>${order.address}</strong></p>
        ${order.carrier !== '—' ? `<p>Carrier: <strong>${order.carrier}</strong></p>` : ''}
      </div>
      <div class="order-actions">
        ${trackBtn}
        ${reorderBtn}
      </div>
    </div>
  `;

  // Items toggle
  if (showToggle) {
    const toggle = article.querySelector('.items-toggle');
    const itemsList = article.querySelector('.order-items');
    toggle.addEventListener('click', () => {
      const isCollapsed = itemsList.classList.toggle('collapsed');
      toggle.textContent = isCollapsed
        ? `+ ${order.items.length - 2} more item${order.items.length - 2 !== 1 ? 's' : ''}`
        : '▲ Show less';
    });
  }

  // Track button
  const trackBtnEl = article.querySelector('.track-order-btn');
  if (trackBtnEl) {
    trackBtnEl.addEventListener('click', () => openTrackModal(order.id));
  }

  // Reorder button
  const reorderBtnEl = article.querySelector('.reorder-btn');
  if (reorderBtnEl) {
    reorderBtnEl.addEventListener('click', () => {
      showToast(`🛒 Items from ${order.id} added to cart!`, 'cyan');
    });
  }

  return article;
}


/* ── Render orders ───────────────────────────────────────────── */
const ordersList  = $('#ordersList');
const ordersEmpty = $('#ordersEmpty');

function renderOrders(filter = 'all') {
  if (!ordersList) return;
  ordersList.innerHTML = '';

  const filtered = filter === 'all'
    ? ORDERS
    : ORDERS.filter(o => o.status === filter);

  if (filtered.length === 0) {
    ordersEmpty.hidden = false;
    ordersList.hidden  = true;
    return;
  }

  ordersEmpty.hidden = true;
  ordersList.hidden  = false;

  const frag = document.createDocumentFragment();
  filtered.forEach(order => {
    const card = createOrderCard(order);
    frag.appendChild(card);
  });
  ordersList.appendChild(frag);

  // Observe new cards
  $$('.reveal', ordersList).forEach(el => revealObserver.observe(el));
}

// Initial render
renderOrders();


/* ── Filter pills ────────────────────────────────────────────── */
$$('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    $$('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderOrders(pill.dataset.filter);
  });
});


/* ── Track order modal ───────────────────────────────────────── */
const trackOverlay   = $('#trackOverlay');
const trackModal     = $('#trackModal');
const trackModalClose = $('#trackModalClose');
const trackModalOrderId = $('#trackModalOrderId');
const trackTimeline  = $('#trackTimeline');
const carrierName    = $('#carrierName');
const carrierTracking = $('#carrierTracking');
const carrierETA     = $('#carrierETA');
const trackCopyBtn   = $('#trackCopyBtn');

let activeTrackingNumber = '';

function openTrackModal(orderId) {
  const order = ORDERS.find(o => o.id === orderId);
  if (!order || !trackModal) return;

  // Set header
  if (trackModalOrderId) trackModalOrderId.textContent = `Order ID: ${order.id}`;

  // Carrier info
  if (carrierName)     carrierName.textContent     = order.carrier;
  if (carrierTracking) carrierTracking.textContent  = order.tracking;
  if (carrierETA)      carrierETA.textContent       = order.eta;
  activeTrackingNumber = order.tracking;

  // Build timeline
  if (trackTimeline) {
    trackTimeline.innerHTML = '';
    order.timeline.forEach((step, i) => {
      const stepEl = document.createElement('div');
      stepEl.className = `timeline-step ${step.status}`;

      // emoji icon per step label
      const icons = {
        'Order Placed':     '🛍️',
        'Processing':       '⚙️',
        'Dispatched':       '📦',
        'Out for Delivery': '🚚',
        'Delivered':        '✅',
        'Cancelled':        '❌',
      };
      const icon = icons[step.label] || '●';

      const isLast = i === order.timeline.length - 1;
      stepEl.innerHTML = `
        ${!isLast ? '<div class="timeline-connector"></div>' : ''}
        <div class="timeline-dot" aria-hidden="true">${icon}</div>
        <div class="timeline-body">
          <p class="timeline-label">${step.label}</p>
          <p class="timeline-desc">${step.desc}</p>
          ${step.time !== '—' ? `<p class="timeline-time">${step.time}</p>` : ''}
        </div>
      `;
      trackTimeline.appendChild(stepEl);
    });
  }

  // Open
  trackModal.classList.add('open');
  trackModal.setAttribute('aria-hidden', 'false');
  if (trackOverlay) {
    trackOverlay.classList.add('open');
    trackOverlay.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
  if (trackModalClose) trackModalClose.focus();
}

function closeTrackModal() {
  if (!trackModal) return;
  trackModal.classList.remove('open');
  trackModal.setAttribute('aria-hidden', 'true');
  if (trackOverlay) {
    trackOverlay.classList.remove('open');
    trackOverlay.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

if (trackModalClose) trackModalClose.addEventListener('click', closeTrackModal);
if (trackOverlay)    trackOverlay.addEventListener('click', closeTrackModal);

// Copy tracking number
if (trackCopyBtn) {
  trackCopyBtn.addEventListener('click', () => {
    if (!activeTrackingNumber || activeTrackingNumber === '—') {
      showToast('ℹ️ No tracking number yet — check back soon.', 'pink');
      return;
    }
    navigator.clipboard.writeText(activeTrackingNumber).then(() => {
      showToast(`📋 Tracking number copied: ${activeTrackingNumber}`, 'cyan');
    }).catch(() => {
      showToast(`Tracking: ${activeTrackingNumber}`, 'cyan');
    });
  });
}


/* ── Logout ──────────────────────────────────────────────────── */
const logoutBtn = $('#logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    showToast('👋 Logged out successfully.', 'cyan');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}


/* ── Navbar scroll glow ──────────────────────────────────────── */
const navbar = $('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(0,243,255,0.2)'
      : 'var(--border)';
  }, { passive: true });
}
