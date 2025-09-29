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

function renderCart() {
  const list = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const subEl = document.getElementById('subTotal');
  const grandEl = document.getElementById('grandTotal');
  if (!list || !empty || !subEl || !grandEl) return;

  const cart = readCart();
  list.innerHTML = '';

  if (!cart.length) {
    empty.hidden = false;
    subEl.textContent = '—';
    grandEl.textContent = '—';
    return;
  }
  empty.hidden = true;

  let subTotal = 0;
  const fragment = document.createDocumentFragment();
  cart.forEach(item => {
    subTotal += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div>
        <div style="font-weight:600">${item.title}</div>
        <div style="color:#9aa6b2; font-size:14px">${formatPrice(item.price)}</div>
      </div>
      <div class="qty">
        <button data-action="dec" data-id="${item.id}">–</button>
        <span>${item.qty}</span>
        <button data-action="inc" data-id="${item.id}">+</button>
        <button data-action="del" data-id="${item.id}" style="margin-left:10px;color:#ef4444">✕</button>
      </div>
    `;
    fragment.appendChild(row);
  });
  list.appendChild(fragment);

  subEl.textContent = formatPrice(subTotal);
  grandEl.textContent = formatPrice(subTotal); // livraison gratuite
}

function handleCartClick(e) {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (!action) return;
  const id = Number(target.dataset.id);
  if (!id) return;
  const cart = readCart();
  const index = cart.findIndex(i => i.id === id);
  if (index === -1) return;
  if (action === 'inc') cart[index].qty += 1;
  if (action === 'dec') cart[index].qty = Math.max(0, cart[index].qty - 1);
  if (action === 'del' || cart[index].qty === 0) cart.splice(index, 1);
  writeCart(cart);
  renderCart();
}

function checkout() {
  const cart = readCart();
  if (!cart.length) { alert('Votre panier est vide.'); return; }
  openModal();
}

function init() {
  document.getElementById('year').textContent = String(new Date().getFullYear());
  updateCartCount();
  renderCart();
  const list = document.getElementById('cartItems');
  if (list) list.addEventListener('click', handleCartClick);
  const btn = document.getElementById('checkoutBtn');
  if (btn) btn.addEventListener('click', checkout);
}

document.addEventListener('DOMContentLoaded', init);

// Checkout Modal Logic
function openModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.hidden = true;
}

function validateForm(form) {
  let valid = true;
  const fields = [
    { id: 'lastName', label: 'Nom' },
    { id: 'firstName', label: 'Prénom' },
    { id: 'address', label: 'Adresse' },
    { id: 'phone', label: 'Numéro' },
    { id: 'city', label: 'Ville' },
  ];

  fields.forEach(({ id, label }) => {
    const input = form.querySelector(`#${id}`);
    const error = form.querySelector(`[data-error-for="${id}"]`);
    if (!input || !error) return;
    const value = String(input.value || '').trim();
    let message = '';
    if (!value) message = `${label} est requis.`;
    if (id === 'phone' && value) {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 8) message = 'Numéro invalide (min 8 chiffres).';
    }
    error.textContent = message;
    if (message) valid = false;
  });

  return valid;
}

// Modal event wiring
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.matches('[data-close]')) {
    closeModal();
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id !== 'checkoutForm') return;
  e.preventDefault();
  if (!validateForm(form)) return;

  const data = Object.fromEntries(new FormData(form).entries());
  // Simulate order placement
  alert(`Merci ${data.firstName} ${data.lastName}! Votre commande est confirmée.\nVille: ${data.city}`);
  writeCart([]);
  renderCart();
  closeModal();
});


