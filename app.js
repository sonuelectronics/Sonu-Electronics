// Sonu Electronics - Interactive Application Logic

// Firebase Configuration for Multi-Device Realtime Cloud Sync
const firebaseConfig = {
  apiKey: "AIzaSyAVb2DW0-B6Z_K0PzFG2DIW8O_Pned0mBU",
  authDomain: "sonu-electronics.firebaseapp.com",
  databaseURL: "https://sonu-electronics-default-rtdb.firebaseio.com",
  projectId: "sonu-electronics",
  storageBucket: "sonu-electronics.firebasestorage.app",
  messagingSenderId: "1087980044642",
  appId: "1:1087980044642:web:87c298de56de7cdc306c3b",
  measurementId: "G-81H35K5XR3"
};

let firebaseDb = null;

if (typeof firebase !== "undefined") {
  try {
    firebase.initializeApp(firebaseConfig);
    // Only attempt DB if initialized
    try { if (firebase.database) firebaseDb = firebase.database(); } catch(e) {}
  } catch (err) {
    // Graceful offline fallback
  }
}

const PRODUCTS = [
  {
    id: 1,
    name: "RR Signature 90m Copper House Wire (1.5 sq mm HTFF)",
    category: "wires",
    categoryLabel: "Wires & Cables",
    price: 1520,
    unit: "per roll (90m)",
    image: "images/wire.png",
    badge: "RR Signature",
    specs: "RR Signature HTFF High-Temp Flame Retardant 100% Electrolytic Copper Wire for supreme safety.",
    popular: true
  },
  {
    id: 2,
    name: "Goldmedal Curve Designer Modular Switch Board (8-Module)",
    category: "switches",
    categoryLabel: "Modular Switches",
    price: 680,
    unit: "per board",
    image: "images/hero.png",
    badge: "Goldmedal",
    specs: "Goldmedal Curve Polycarbonate Fire-Resistant Switch Plate, Smooth Touch Switches & Power Sockets.",
    popular: true
  },
  {
    id: 3,
    name: "Luminous Eco Watt Heavy Inverter & 150Ah Battery Combo",
    category: "inverters",
    categoryLabel: "Inverters & Power",
    price: 14800,
    unit: "complete setup",
    image: "images/hero.png",
    badge: "Luminous",
    specs: "Luminous Sine Wave Home Inverter + 150Ah Tall Tubular Battery for maximum backup during power outages.",
    popular: true
  },
  {
    id: 4,
    name: "Anchor by Panasonic Modular Switch & Socket Set",
    category: "switches",
    categoryLabel: "Modular Switches",
    price: 450,
    unit: "per box",
    image: "images/hero.png",
    badge: "Anchor",
    specs: "Genuine Anchor Penta / Roma Switches and Heavy Sockets. Tested for 100,000+ clicks.",
    popular: true
  },
  {
    id: 5,
    name: "Havells Life Line 90m Copper Wire (2.5 sq mm Power)",
    category: "wires",
    categoryLabel: "Wires & Cables",
    price: 2450,
    unit: "per roll (90m)",
    image: "images/wire.png",
    badge: "Havells",
    specs: "Havells SHR FR PVC Insulated Industrial & Home Power Wire. Ideal for ACs, Geysers, and Motors.",
    popular: true
  },
  {
    id: 6,
    name: "Crompton / Havells High-Speed Ceiling Fan (1200mm)",
    category: "fans",
    categoryLabel: "Fans",
    price: 2150,
    unit: "per piece",
    image: "images/fan.png",
    badge: "Best Seller",
    specs: "1200mm Heavy-Duty 100% Copper Motor, High Speed 380 RPM, Aerodynamic Blades, Energy Efficient.",
    popular: true
  },
  {
    id: 7,
    name: "RR Signature 90m Power Wire (4.0 sq mm Main Cable)",
    category: "wires",
    categoryLabel: "Wires & Cables",
    price: 3850,
    unit: "per roll (90m)",
    image: "images/wire.png",
    badge: "RR Signature",
    specs: "Heavy gauge RR Signature cable for main line meter connection, high load circuits, and commercial supply.",
    popular: false
  },
  {
    id: 8,
    name: "Goldmedal 16A Power Switch & MCB Protection Box",
    category: "switches",
    categoryLabel: "Modular Switches",
    price: 320,
    unit: "per unit",
    image: "images/hero.png",
    badge: "Goldmedal",
    specs: "Heavy duty Goldmedal 16A socket with built-in miniature circuit breaker (MCB) for appliances protection.",
    popular: false
  },
  {
    id: 9,
    name: "Syska / Philips Bright LED Bulb Combo (9W / 12W Pack of 4)",
    category: "bulbs",
    categoryLabel: "LED Lighting",
    price: 380,
    unit: "pack of 4",
    image: "images/hero.png",
    badge: "Save 85% Power",
    specs: "Cool Daylight (6500K), High Lumens, Built-in Surge Protection, Long Lifespan with Warranty.",
    popular: false
  },
  {
    id: 10,
    name: "Tata Play / Dish TV HD Satellite Setup Box & Antenna",
    category: "dish",
    categoryLabel: "Dish & DTH",
    price: 1299,
    unit: "complete kit",
    image: "images/hero.png",
    badge: "Digital HD",
    specs: "Crystal Clear HD Picture & Dolby Sound. Kit includes Outdoor Dish Antenna, HD Setup Box, LNB & Cable.",
    popular: false
  },
  {
    id: 11,
    name: "Luminous Solar / Home Tubular Inverter Battery 180Ah",
    category: "inverters",
    categoryLabel: "Inverters & Power",
    price: 16500,
    unit: "per unit",
    image: "images/hero.png",
    badge: "Luminous",
    specs: "Extra capacity 180Ah Luminous battery designed for prolonged load shedding with 36 months warranty.",
    popular: false
  },
  {
    id: 12,
    name: "Digital Multimeter & Professional Electrical Tool Kit",
    category: "tools",
    categoryLabel: "Tools & Testing",
    price: 350,
    unit: "kit",
    image: "images/hero.png",
    badge: "Essential Kit",
    specs: "Includes LCD Digital Multimeter, Heavy Duty Soldering Iron, Voltage Tester & Electrical Insulation Tape.",
    popular: false
  }
];

// App State
let cart = [];
let activeCategory = "all";
let searchQuery = "";

// Theme Switcher Logic (Light Mode Default with Dark Mode Switch)
function initTheme() {
  const savedTheme = localStorage.getItem("sonu_theme") || "light";
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem("sonu_theme", theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById("theme-toggle");
  if (!themeBtn) return;
  if (theme === "dark") {
    themeBtn.innerHTML = '<i class="fas fa-sun" style="color: #fbbf24;"></i>';
    themeBtn.setAttribute("title", "Switch to Light Mode");
  } else {
    themeBtn.innerHTML = '<i class="fas fa-moon" style="color: #0284c7;"></i>';
    themeBtn.setAttribute("title", "Switch to Dark Mode");
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderProducts();
  setupEventListeners();
  updateCartUI();
});

// Render Products Grid
function renderProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;

  const filtered = PRODUCTS.filter(item => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-light);"></i>
        <h3>No products found</h3>
        <p>Try clearing your search query or selecting a different category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='images/hero.png'">
        <span class="product-badge"><i class="fas fa-bolt"></i> ${product.badge}</span>
      </div>
      <div class="product-body">
        <span class="product-category">${product.categoryLabel}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-spec">${product.specs}</p>
        <div class="product-price-row">
          <div class="price-tag">
            <span class="price-val">₹${product.price.toLocaleString("en-IN")}</span>
            <span class="price-note">${product.unit}</span>
          </div>
          <div class="card-actions">
            <button class="btn-icon-cart" onclick="quickView(${product.id})" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon-cart" onclick="addToCart(${product.id})" title="Add to Cart">
              <i class="fas fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// Event Listeners Setup
function setupEventListeners() {
  // Category tabs
  const catButtons = document.querySelectorAll(".cat-btn");
  catButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      catButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-category");
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Theme Toggle Button
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Cart Drawer toggles
  const cartTrigger = document.getElementById("cart-trigger");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartClose = document.getElementById("cart-close");

  if (cartTrigger) cartTrigger.addEventListener("click", openCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  const mobileBackdrop = document.getElementById("mobile-backdrop");

  function openMobileMenu() {
    navLinks?.classList.add("open");
    mobileBackdrop?.classList.add("open");
    mobileToggle?.classList.add("active");
    if (mobileToggle) {
      mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
  }

  function closeMobileMenu() {
    navLinks?.classList.remove("open");
    mobileBackdrop?.classList.remove("open");
    mobileToggle?.classList.remove("active");
    if (mobileToggle) {
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeMobileMenu);
    }

    const allNavLinks = navLinks.querySelectorAll("a");
    allNavLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        closeMobileMenu();
      }
    });
  }
}

// Cart Functions
function addToCart(productId) {
  const item = PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`Added "${item.name}" to your order list!`);
}

function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
  }
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.getElementById("cart-badge");
  const cartContainer = document.getElementById("cart-items-container");
  const cartTotal = document.getElementById("cart-total");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartBadge) cartBadge.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-text">
        <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-light);"></i>
        <p>Your order quote list is empty.</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Add items from our catalog to request direct pricing on WhatsApp!</p>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/hero.png'">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join("");
}

function openCart() {
  document.getElementById("cart-overlay")?.classList.add("open");
  document.getElementById("cart-drawer")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.getElementById("cart-drawer")?.classList.remove("open");
}

// WhatsApp Direct Order Formatter
function sendWhatsAppOrder(phoneNum = "9631985165") {
  if (cart.length === 0) {
    showToast("Please add items to your order quote first!", "warning");
    return;
  }

  let text = `Hello Sonu Electronics (Prop. Tanveer Alam),\nI would like to inquire/order the following items from your website:\n\n`;
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    text += `${index + 1}. *${item.name}*\n   Qty: ${item.qty} | Est. Price: ₹${itemTotal.toLocaleString("en-IN")}\n`;
  });

  text += `\n*Estimated Total:* ₹${total.toLocaleString("en-IN")}\n\nDelivery Address / Customer Inquiry:\nThana Road, Jadia Bazar, Supaul, Bihar region.\n\nPlease confirm availability and final wholesale/retail pricing. Thank you!`;

  const encoded = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/91${phoneNum}?text=${encoded}`;
  window.open(whatsappUrl, "_blank");
}

// Quick View Modal
function quickView(productId) {
  const item = PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");

  if (!modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: center;">
      <div>
        <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: var(--radius-md); background: #111;" onerror="this.src='images/hero.png'">
      </div>
      <div>
        <span style="color: var(--primary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">${item.categoryLabel}</span>
        <h2 style="font-size: 1.4rem; margin: 0.4rem 0;">${item.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">${item.specs}</p>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 1.5rem;">
          ₹${item.price.toLocaleString("en-IN")} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">${item.unit}</span>
        </div>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="addToCart(${item.id}); closeModal();">
            <i class="fas fa-cart-plus"></i> Add to Order
          </button>
          <button class="btn btn-whatsapp" onclick="sendWhatsAppDirect('${item.name}', ${item.price})">
            <i class="fab fa-whatsapp"></i> Buy Direct
          </button>
        </div>
        <div style="margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 0.8rem;">
          <button onclick="requestDeleteProduct(${item.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">
            <i class="fas fa-trash-alt"></i> Remove / Delete this product (Admin)
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add("open");
}

function requestDeleteProduct(productId) {
  const item = PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const modalContent = document.getElementById("modal-content");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <div style="padding: 2rem; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.8rem; color: #ef4444;">
        <i class="fas fa-trash-alt"></i>
      </div>
      <h2 style="font-size: 1.4rem; margin-bottom: 0.5rem; color: #fff;">Confirm Product Deletion</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
        Are you sure you want to remove <br><strong style="color: var(--accent-gold);">${item.name}</strong> from catalog?
      </p>

      <form onsubmit="confirmDeleteProduct(event, ${item.id})" style="max-width: 320px; margin: 0 auto;">
        <input type="password" id="delete-pin-input" required maxlength="10" placeholder="Enter Admin PIN" style="width: 100%; padding: 0.85rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-md); color: #fff; text-align: center; font-size: 1.2rem; letter-spacing: 4px; outline: none; margin-bottom: 1rem;">
        
        <div id="delete-pin-error" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; display: none;"></div>

        <div style="display: flex; gap: 1rem;">
          <button type="submit" class="btn" style="flex: 1; background: #ef4444; color: #fff; font-weight: bold; border: none; padding: 0.75rem; border-radius: var(--radius-sm); cursor: pointer;">
            <i class="fas fa-trash-alt"></i> Yes, Delete Item
          </button>
          <button type="button" class="btn btn-outline" onclick="quickView(${item.id})">Cancel</button>
        </div>
      </form>
    </div>
  `;
  setTimeout(() => {
    document.getElementById("delete-pin-input")?.focus();
  }, 100);
}

function confirmDeleteProduct(e, productId) {
  e.preventDefault();
  const inputPin = document.getElementById("delete-pin-input").value.trim();
  const errorMsg = document.getElementById("delete-pin-error");

  if (inputPin === ADMIN_PIN) {
    deleteProduct(productId);
  } else {
    if (errorMsg) {
      errorMsg.textContent = "❌ Incorrect Admin PIN! Deletion cancelled.";
      errorMsg.style.display = "block";
    }
  }
}

function deleteProduct(productId) {
  const index = PRODUCTS.findIndex(p => p.id === productId);
  if (index !== -1) {
    const deletedName = PRODUCTS[index].name;
    PRODUCTS.splice(index, 1);

    // Update LocalStorage custom products and deleted items list
    try {
      let saved = JSON.parse(localStorage.getItem("sonu_custom_products") || "[]");
      saved = saved.filter(p => p.id !== productId);
      localStorage.setItem("sonu_custom_products", JSON.stringify(saved));

      let deletedIds = JSON.parse(localStorage.getItem("sonu_deleted_ids") || "[]");
      if (!deletedIds.includes(productId)) deletedIds.push(productId);
      localStorage.setItem("sonu_deleted_ids", JSON.stringify(deletedIds));
    } catch(e) { console.error(e); }

    // Sync deletion across all customer devices via Firebase
    if (firebaseDb) {
      try { firebaseDb.ref("products/" + productId).remove(); } catch(e) { console.error(e); }
    }
    if (firestoreDb) {
      try { firestoreDb.collection("products").doc(String(productId)).delete(); } catch(e) { console.error(e); }
    }

    closeModal();
    renderProducts();
    showToast(`Deleted "${deletedName}" from catalog!`);
  }
}

function sendWhatsAppDirect(productName, price) {
  const text = `Hello Tanveer Alam (Sonu Electronics),\nI want to buy/inquire about: *${productName}* (Price approx ₹${price}). Please give me full details and store pickup/delivery timing at Jadia Bazar, Supaul.`;
  window.open(`https://wa.me/919631985165?text=${encodeURIComponent(text)}`, "_blank");
}

function closeModal() {
  document.getElementById("modal-overlay")?.classList.remove("open");
}

// Load saved custom products & remove deleted items from localStorage + Realtime Firebase Cloud Sync
(function loadCustomProducts() {
  try {
    const deletedIds = JSON.parse(localStorage.getItem("sonu_deleted_ids") || "[]");
    if (deletedIds.length > 0) {
      for (let i = PRODUCTS.length - 1; i >= 0; i--) {
        if (deletedIds.includes(PRODUCTS[i].id)) {
          PRODUCTS.splice(i, 1);
        }
      }
    }

    const saved = localStorage.getItem("sonu_custom_products");
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.forEach(item => {
        if (!deletedIds.includes(item.id) && !PRODUCTS.some(p => p.id === item.id)) {
          PRODUCTS.unshift(item);
        }
      });
    }
  } catch(e) { console.error(e); }

  // Firebase Realtime Cloud Listener (Syncs all devices live!)
  if (firebaseDb) {
    try {
      firebaseDb.ref("products").on("value", (snapshot) => {
        const val = snapshot.val();
        if (val) {
          Object.values(val).forEach(remoteProduct => {
            if (!PRODUCTS.some(p => p.id === remoteProduct.id)) {
              PRODUCTS.unshift(remoteProduct);
            } else {
              const idx = PRODUCTS.findIndex(p => p.id === remoteProduct.id);
              if (idx !== -1) PRODUCTS[idx] = remoteProduct;
            }
          });
          renderProducts();
        }
      }, (err) => {
        // Silently ignore if RTDB is not enabled yet in console
      });
    } catch(err) {}
  }

  // Firebase Firestore Listener (Syncs all devices live!)
  if (firestoreDb) {
    try {
      firestoreDb.collection("products").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const itemData = change.doc.data();
          if (change.type === "added" || change.type === "modified") {
            if (!PRODUCTS.some(p => p.id === itemData.id)) {
              PRODUCTS.unshift(itemData);
            } else {
              const idx = PRODUCTS.findIndex(p => p.id === itemData.id);
              if (idx !== -1) PRODUCTS[idx] = itemData;
            }
            renderProducts();
          }
          if (change.type === "removed") {
            const idx = PRODUCTS.findIndex(p => p.id === itemData.id);
            if (idx !== -1) {
              PRODUCTS.splice(idx, 1);
              renderProducts();
            }
          }
        });
      }, (err) => {
        // Silently ignore if Firestore API is disabled in console
      });
    } catch(err) {}
  }
})();

// Admin Security PIN (Default: 9631)
const ADMIN_PIN = "9631";

// Open Add New Product Modal with In-Modal PIN Verification
function openAddProductModal() {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");

  if (!modalOverlay || !modalContent) return;

  // Show PIN verification UI first
  modalContent.innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <div style="padding: 2rem; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(251, 191, 36, 0.15); border: 2px solid var(--accent-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.8rem; color: var(--accent-gold);">
        <i class="fas fa-user-lock"></i>
      </div>
      <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">Proprietor Admin Access</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
        Enter your 4-digit Admin Security PIN to add new products to Sonu Electronics.
      </p>

      <form onsubmit="verifyAdminPin(event)" style="max-width: 320px; margin: 0 auto;">
        <input type="password" id="admin-pin-input" required maxlength="10" placeholder="Enter Admin PIN" style="width: 100%; padding: 0.85rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-md); color: #fff; text-align: center; font-size: 1.2rem; letter-spacing: 4px; outline: none; margin-bottom: 1rem;">
        
        <div id="pin-error-msg" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; display: none;"></div>

        <button type="submit" class="btn btn-gold" style="width: 100%;">
          <i class="fas fa-key"></i> Unlock Admin Form
        </button>
      </form>
    </div>
  `;

  modalOverlay.classList.add("open");
  setTimeout(() => {
    document.getElementById("admin-pin-input")?.focus();
  }, 100);
}

function verifyAdminPin(e) {
  e.preventDefault();
  const inputPin = document.getElementById("admin-pin-input").value.trim();
  const errorMsg = document.getElementById("pin-error-msg");

  if (inputPin === ADMIN_PIN) {
    showAddProductFormUI();
  } else {
    if (errorMsg) {
      errorMsg.textContent = "❌ Incorrect Admin PIN! Access denied.";
      errorMsg.style.display = "block";
    }
  }
}

function showAddProductFormUI() {
  const modalContent = document.getElementById("modal-content");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <div style="padding: 1.5rem; max-height: 85vh; overflow-y: auto;">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--accent-gold);">
        <i class="fas fa-plus-circle"></i> Add New Product to Store Catalog
      </h2>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
        Unlocked! Fill in product details to publish to your website catalog.
      </p>

      <form id="add-product-form" onsubmit="handleNewProductSubmit(event)" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Product Name *</label>
          <input type="text" id="new-prod-name" required placeholder="e.g. Goldmedal Curve 16A Socket Plate" style="width: 100%; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Category *</label>
            <select id="new-prod-category" required style="width: 100%; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none;">
              <option value="wires">Wires & Cables</option>
              <option value="switches">Modular Switches & Boards</option>
              <option value="fans">Fans</option>
              <option value="bulbs">LED Bulbs & Lighting</option>
              <option value="dish">Dish & DTH</option>
              <option value="inverters">Inverters & Battery</option>
              <option value="tools">Tools & Testing</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Brand / Badge *</label>
            <input type="text" id="new-prod-badge" required placeholder="e.g. Goldmedal, RR Signature, Havells" style="width: 100%; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Price (₹) *</label>
            <input type="number" id="new-prod-price" required placeholder="e.g. 1250" min="1" style="width: 100%; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none;">
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Unit / Quantity Note</label>
            <input type="text" id="new-prod-unit" placeholder="e.g. per piece, per roll (90m)" defaultValue="per unit" style="width: 100%; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none;">
          </div>
        </div>

        <div>
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Product Image (Upload Photo or Paste Image Link)</label>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <label style="flex: 1; padding: 0.75rem; background: #070c1a; border: 1px dashed var(--accent-gold); border-radius: var(--radius-sm); color: var(--accent-gold); text-align: center; cursor: pointer; font-size: 0.85rem;">
              <i class="fas fa-camera" style="margin-right: 0.4rem;"></i> Upload Photo from Device
              <input type="file" id="new-prod-file" accept="image/*" onchange="handleImageFileSelect(this)" style="display: none;">
            </label>
            <span style="color: var(--text-muted); font-size: 0.8rem;">OR</span>
            <input type="text" id="new-prod-img-url" placeholder="Image URL / path..." style="flex: 1; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none; font-size: 0.85rem;">
          </div>
          <div id="image-preview-box" style="margin-top: 0.5rem; display: none; align-items: center; gap: 0.75rem; background: #070c1a; padding: 0.5rem; border-radius: var(--radius-sm);">
            <img id="image-preview-img" src="" alt="Preview" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            <span style="font-size: 0.8rem; color: var(--accent-gold);"><i class="fas fa-check-circle"></i> Photo Ready!</span>
          </div>
        </div>

        <div>
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Product Specifications & Description *</label>
          <textarea id="new-prod-specs" required rows="3" placeholder="e.g. 100% Electrolytic Copper, Fire Retardant insulation with 2 years warranty..." style="width: 100%; padding: 0.75rem; background: #070c1a; border: 1px solid var(--border-light); border-radius: var(--radius-sm); color: #fff; outline: none; font-family: inherit;"></textarea>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
          <button type="submit" class="btn btn-gold" style="flex: 1;">
            <i class="fas fa-check"></i> Publish Product Now
          </button>
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;
}

let uploadedBase64Image = "";

function handleImageFileSelect(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedBase64Image = e.target.result;
      const previewBox = document.getElementById("image-preview-box");
      const previewImg = document.getElementById("image-preview-img");
      if (previewBox && previewImg) {
        previewImg.src = uploadedBase64Image;
        previewBox.style.display = "flex";
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function handleNewProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("new-prod-name").value.trim();
  const category = document.getElementById("new-prod-category").value;
  const badge = document.getElementById("new-prod-badge").value.trim();
  const price = parseFloat(document.getElementById("new-prod-price").value);
  const unit = document.getElementById("new-prod-unit").value.trim() || "per unit";
  const specs = document.getElementById("new-prod-specs").value.trim();
  const customUrl = document.getElementById("new-prod-img-url")?.value.trim();

  const categoryLabels = {
    wires: "Wires & Cables",
    switches: "Modular Switches",
    fans: "Fans",
    bulbs: "LED Lighting",
    dish: "Dish & DTH",
    inverters: "Inverters & Power",
    tools: "Tools & Testing"
  };

  const imageMap = {
    wires: "images/wire.png",
    fans: "images/fan.png",
    switches: "images/hero.png",
    bulbs: "images/hero.png",
    dish: "images/hero.png",
    inverters: "images/hero.png",
    tools: "images/hero.png"
  };

  // Select image priority: Uploaded photo -> Custom URL -> Category default image
  let finalImage = imageMap[category] || "images/hero.png";
  if (uploadedBase64Image) {
    finalImage = uploadedBase64Image;
  } else if (customUrl) {
    finalImage = customUrl;
  }

  const newProduct = {
    id: Date.now(),
    name,
    category,
    categoryLabel: categoryLabels[category] || "Electronics",
    price,
    unit,
    image: finalImage,
    badge: badge || "New Arrival",
    specs,
    popular: true
  };

  PRODUCTS.unshift(newProduct);

  try {
    const saved = JSON.parse(localStorage.getItem("sonu_custom_products") || "[]");
    saved.unshift(newProduct);
    localStorage.setItem("sonu_custom_products", JSON.stringify(saved));
  } catch(err) { console.error(err); }

  // Sync new product across all customer devices live via Firebase Realtime Database
  if (firebaseDb) {
    try { firebaseDb.ref("products/" + newProduct.id).set(newProduct); } catch(e) { console.error(e); }
  }

  uploadedBase64Image = ""; // Reset
  closeModal();
  renderProducts();
  showToast(`Successfully published "${name}" to all customer devices!`);
}

// Toast Notifications
function showToast(msg, type = "info") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--primary);"></i> ${msg}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


