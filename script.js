// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
});

// Testimonials carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials
setInterval(nextTestimonial, 4000);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const grid = document.querySelector('.neon-grid');
    
    if (hero && grid) {
        grid.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add floating animation to particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: var(--neon-blue);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--neon-blue);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 0;
            pointer-events: none;
            animation: floatParticle ${10 + Math.random() * 10}s infinite linear;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(60px) translateX(0) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: translateY(60px) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(-60px) scale(1);
        }
        100% {
            transform: translateY(-80px) translateX(30px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize floating particles
createFloatingParticles();

// Add hover effects to product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add glitch effect to hero logo on hover
const heroLogo = document.querySelector('.hero-logo');
if (heroLogo) {
    heroLogo.addEventListener('mouseenter', () => {
        heroLogo.style.animation = 'glitch 0.3s ease-in-out';
    });
    
    heroLogo.addEventListener('mouseleave', () => {
        heroLogo.style.animation = 'glow 2s ease-in-out infinite alternate';
    });
}

// Add glitch animation
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(glitchStyle);

// Add intersection observer for scroll animations
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

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add neon cursor trail
function createCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--neon-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${mouseX}px;
            top: ${mouseY}px;
            box-shadow: 0 0 10px var(--neon-cyan);
            animation: fadeOut 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    });
    
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

// Initialize cursor trail
createCursorTrail();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add smooth reveal animation for product cards
const productObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    productObserver.observe(card);
});

// Add keyboard navigation for testimonials
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    } else if (e.key === 'ArrowRight') {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
});

// Product data with WhatsApp images
const products = [
    {
        id: 1,
        name: "Neon Street Hoodie",
        image: "WhatsApp Image 2025-08-17 at 20.28.55_fb49f972.jpg",
        price: "$89.99",
        description: "Premium cyberpunk hoodie with neon accents. Perfect for night rides and urban adventures."
    },
    {
        id: 2,
        name: "LED Runner Sneakers",
        image: "WhatsApp Image 2025-08-17 at 20.29.00_7c708092.jpg",
        price: "$129.99",
        description: "Light-up sneakers with customizable LED patterns. Stand out in any crowd."
    },
    {
        id: 3,
        name: "Tech Armor Jacket",
        image: "WhatsApp Image 2025-08-17 at 20.29.01_e6cbb5f8.jpg",
        price: "$199.99",
        description: "Futuristic jacket with built-in tech features and weather-resistant materials."
    },
    {
        id: 4,
        name: "Cyber Visor Cap",
        image: "WhatsApp Image 2025-08-17 at 20.29.01_f3cc5299.jpg",
        price: "$49.99",
        description: "Holographic visor cap with UV protection and cyberpunk styling."
    },
    {
        id: 5,
        name: "Neon Combat Boots",
        image: "WhatsApp Image 2025-08-17 at 20.29.02_3df1b078.jpg",
        price: "$159.99",
        description: "Heavy-duty boots with neon trim and reinforced steel toes."
    },
    {
        id: 6,
        name: "Tech Utility Vest",
        image: "WhatsApp Image 2025-08-17 at 20.29.02_bd041185.jpg",
        price: "$119.99",
        description: "Multi-pocket vest with charging ports and reflective strips."
    },
    {
        id: 7,
        name: "Holographic Backpack",
        image: "WhatsApp Image 2025-08-17 at 20.29.11_04594340.jpg",
        price: "$79.99",
        description: "Shimmering backpack with holographic panels and laptop compartment."
    },
    {
        id: 8,
        name: "Neon Face Mask",
        image: "WhatsApp Image 2025-08-17 at 20.29.11_48059066.jpg",
        price: "$29.99",
        description: "LED face mask with breathing effects and customizable patterns."
    },
    {
        id: 9,
        name: "Cyber Gloves",
        image: "WhatsApp Image 2025-08-17 at 20.29.13_5b6c40fe.jpg",
        price: "$69.99",
        description: "Touchscreen-compatible gloves with neon knuckle protection."
    },
    {
        id: 10,
        name: "Tech Cargo Pants",
        image: "WhatsApp Image 2025-08-17 at 20.29.13_5b9db99a.jpg",
        price: "$99.99",
        description: "Water-resistant pants with multiple tech pockets and neon piping."
    },
    {
        id: 11,
        name: "Neon Windbreaker",
        image: "WhatsApp Image 2025-08-17 at 20.29.13_06afcc57.jpg",
        price: "$139.99",
        description: "Lightweight windbreaker with reflective neon details and hood."
    },
    {
        id: 12,
        name: "LED Belt",
        image: "WhatsApp Image 2025-08-17 at 20.29.14_d9098019.jpg",
        price: "$39.99",
        description: "Programmable LED belt with multiple color modes and patterns."
    },
    {
        id: 13,
        name: "Cyber Sunglasses",
        image: "WhatsApp Image 2025-08-17 at 20.29.15_bfc87f7a.jpg",
        price: "$89.99",
        description: "Futuristic sunglasses with UV protection and neon frames."
    },
    {
        id: 14,
        name: "Neon Wristbands",
        image: "WhatsApp Image 2025-08-17 at 20.29.16_d5eb5d03.jpg",
        price: "$19.99",
        description: "Set of glowing wristbands with adjustable brightness."
    },
    {
        id: 15,
        name: "Tech Sneakers",
        image: "WhatsApp Image 2025-08-17 at 20.29.17_5d452680.jpg",
        price: "$149.99",
        description: "High-tech sneakers with memory foam and neon accents."
    },
    {
        id: 16,
        name: "Holographic Jacket",
        image: "WhatsApp Image 2025-08-17 at 20.29.18_bd5cf0e1.jpg",
        price: "$179.99",
        description: "Iridescent jacket that changes color in different lighting."
    }
];

// Function to create product cards
function createProductCards() {
    const productsGrid = document.getElementById('products-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <button class="quick-view" onclick="openModal(${product.id})">View Details</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Modal functionality
// Accepts either openModal(imageSrc, name, description) from inline HTML
// or openModal(productId) from dynamically generated cards
function openModal(imageOrId, name, description) {
    let image, title, desc, price;

    if (name !== undefined) {
        // Called from inline HTML: openModal(imageSrc, name, description)
        image = imageOrId;
        title = name;
        desc = description;
        // Look up price from products array by name
        const match = products.find(p => p.name === name);
        price = match ? match.price : '';
    } else {
        // Called from dynamically generated card: openModal(id)
        const product = products.find(p => p.id === imageOrId);
        if (!product) return;
        image = product.image;
        title = product.name;
        desc = product.description;
        price = product.price;
    }

    const modal = document.getElementById('neon-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const cartBtn = modal.querySelector('.add-to-cart-btn');

    modalImage.src = image;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = desc;

    // Update the modal cart button to add this specific product
    if (cartBtn && price) {
        const priceNum = parseFloat(String(price).replace('$', ''));
        cartBtn.textContent = `🛒 Add to Cart — ${price}`;
        cartBtn.onclick = () => {
            addToCart(title, priceNum);
            closeModal();
        };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('neon-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.getElementById('neon-modal').addEventListener('click', (e) => {
    if (e.target.id === 'neon-modal') {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize products when page loads
document.addEventListener('DOMContentLoaded', () => {
    createProductCards();
});

// Add click handlers for quick view buttons
document.querySelectorAll('.quick-view').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = e.target.parentElement.querySelector('h3').textContent;
        alert(`Quick view for ${productName} - Feature coming soon!`);
    });
});

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--neon-blue), var(--neon-magenta));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

createScrollProgress();


// =============================================
// Cart System
// =============================================

let cart = [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartCount();
    showCartToast(name);
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    countEl.textContent = total;

    // Bump animation
    countEl.classList.remove('cart-count-bump');
    // Force reflow so the animation re-triggers
    void countEl.offsetWidth;
    countEl.classList.add('cart-count-bump');
}

function showCartToast(name) {
    // Remove any existing toast
    const old = document.querySelector('.cart-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = `✓ ${name} added to cart`;
    document.body.appendChild(toast);

    // Trigger show on next frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Auto-dismiss after 2.5 s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function openCart() {
    if (cart.length === 0) {
        showCartToast('Your cart is empty');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const lines = cart.map(i => `• ${i.name} x${i.qty}  —  $${(i.price * i.qty).toFixed(2)}`).join('\n');
    alert(`🛒 YOUR CART\n\n${lines}\n\n──────────────\nTotal: $${total.toFixed(2)}`);
}

// =============================================
// Navigation Dropdown Menus
// =============================================

function toggleDropdown(id) {
    // Close any other open dropdowns first
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== id) {
            menu.classList.remove('show');
            // Reset arrow on the sibling button
            const btn = menu.previousElementSibling;
            if (btn) btn.classList.remove('open');
        }
    });

    const targetMenu = document.getElementById(id);
    if (!targetMenu) return;

    const isOpen = targetMenu.classList.toggle('show');

    // Rotate the arrow on the trigger button
    const triggerBtn = targetMenu.previousElementSibling;
    if (triggerBtn) triggerBtn.classList.toggle('open', isOpen);
}

// Close all dropdowns when clicking outside any .nav-dropdown
window.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            btn.classList.remove('open');
        });
    }
});

// =============================================
// Mobile Navigation Toggle
// =============================================

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    navMenu.classList.toggle('mobile-open');
}

// Close mobile menu when a nav link is clicked
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) navMenu.classList.remove('mobile-open');
        });
    });
});
