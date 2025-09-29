// Data (mock)
const products = [
  { id: 1, title: "Laptop Gamer Nitro 5", price: 3299, category: "PC Portable", badge: "Promo", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
  { id: 2, title: "Smartphone Galaxy S24", price: 4599, category: "Smartphone", badge: "Nouveau", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
  { id: 3, title: "TV 55\" 4K QLED", price: 3599, category: "TV & Audio", badge: "Top", image: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=800&q=80" },
  { id: 4, title: "Casque Bluetooth ANC", price: 399, category: "TV & Audio", badge: "Best", image: "https://images.unsplash.com/photo-1518443757345-b6f3f66c5d49?w=800&q=80" },
  { id: 5, title: "Clavier Mécanique RGB", price: 199, category: "Périphériques", badge: "Hot", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
  { id: 6, title: "Écran 27\" 144Hz", price: 899, category: "Périphériques", badge: "Gaming", image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&q=80" },
  { id: 7, title: "Aspirateur Robot", price: 1099, category: "Maison", badge: "Smart", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" },
  { id: 8, title: "Machine à Café", price: 549, category: "Cuisine", badge: "Daily", image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80" },
  { id: 9, title: "Disque SSD 1To", price: 289, category: "Composants", badge: "Rapide", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
  { id: 10, title: "Imprimante Wi‑Fi", price: 399, category: "Bureautique", badge: "Office", image: "https://images.unsplash.com/photo-1515165562835-c3b8c1e3b9f0?w=800&q=80" }
];

const STORAGE_KEYS = { CART: "vendo_cart" };

function readCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]"); } catch { return []; }
}
function writeCart(items) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  updateCartCount();
}
function updateCartCount() {
  const count = readCart().reduce((sum, it) => sum + it.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = String(count);
}

function formatPrice(tnd) { return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(tnd); }

function uniqueCategories(list) {
  return Array.from(new Set(list.map(p => p.category)));
}

function populateCategories() {
  const select = document.getElementById("categorySelect");
  if (!select) return;
  uniqueCategories(products).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat; select.appendChild(opt);
  });
}

function getFilters() {
  const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const cat = document.getElementById('categorySelect')?.value || '';
  const sort = document.getElementById('sortSelect')?.value || 'pop';
  return { q, cat, sort };
}

function applyFilters(list, { q, cat }) {
  let result = list;
  if (q) {
    result = result.filter(p => p.title.toLowerCase().includes(q));
  }
  if (cat) {
    result = result.filter(p => p.category === cat);
  }
  return result;
}

function applySort(list, sort) {
  const sorted = [...list];
  switch (sort) {
    case 'priceAsc': sorted.sort((a,b) => a.price - b.price); break;
    case 'priceDesc': sorted.sort((a,b) => b.price - a.price); break;
    case 'new': sorted.sort((a,b) => b.id - a.id); break;
    default: break; // popularity (no data) -> keep original order
  }
  return sorted;
}

function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');
  if (!grid || !empty) return;

  grid.innerHTML = '';
  if (!list.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const fragment = document.createDocumentFragment();
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>
      <div class="body">
        <div class="title">${p.title}</div>
        <div class="meta">
          <div class="price">${formatPrice(p.price)}</div>
          <span class="badge">${p.badge}</span>
        </div>
        <div class="actions">
          <button class="btn" data-id="${p.id}" data-action="add">Ajouter au panier</button>
          <button class="btn primary" data-id="${p.id}" data-action="buy">Acheter</button>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}

function addToCart(productId, qty = 1) {
  const item = products.find(p => p.id === productId);
  if (!item) return;
  const cart = readCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += qty; else cart.push({ id: item.id, title: item.title, price: item.price, image: item.image, qty });
  writeCart(cart);
}

function handleGridClick(e) {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (!action) return;
  const id = Number(target.dataset.id);
  if (!id) return;
  if (action === 'add') addToCart(id, 1);
  if (action === 'buy') {
    addToCart(id, 1);
    window.location.href = 'cart.html';
  }
}

function attachEvents() {
  const grid = document.getElementById('productGrid');
  if (grid) grid.addEventListener('click', handleGridClick);

  const form = document.getElementById('searchForm');
  if (form) form.addEventListener('submit', (ev) => { ev.preventDefault(); update(); });

  const cat = document.getElementById('categorySelect');
  if (cat) cat.addEventListener('change', update);

  const sort = document.getElementById('sortSelect');
  if (sort) sort.addEventListener('change', update);
}

function update() {
  const { q, cat, sort } = getFilters();
  const filtered = applyFilters(products, { q, cat });
  const sorted = applySort(filtered, sort);
  renderProducts(sorted);
}

function init() {
  document.getElementById('year').textContent = String(new Date().getFullYear());
  populateCategories();
  attachEvents();
  updateCartCount();
  update();
}

document.addEventListener('DOMContentLoaded', init);


