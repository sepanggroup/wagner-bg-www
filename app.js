import { STORE, getCategory, getProduct } from './products.js';
import { ROBOT_CATEGORY, ROBOT_PRODUCTS } from './robot-products.js';
import { PRODUCT_COPY } from './product-copy.js';
import { PRODUCT_IMAGE_OVERRIDES } from './image-overrides.js';
import { MERCHANT } from './merchant-config.js';
import { loadCart, addToCart, setQuantity, removeFromCart, clearCart, cartCount, cartSubtotal, cartHasNonPurchasableItems, cartMailtoSubject, cartMailtoBody } from './cart.js';
import { initCartPayment } from './payment.js';

const CATEGORIES = [...STORE.categories.filter((item) => item.id !== 'robots'), ROBOT_CATEGORY];
const PRODUCTS = [...STORE.products, ...ROBOT_PRODUCTS].map((product) => ({ ...product, ...(PRODUCT_COPY[product.id] || {}) }));
const qs = (selector) => document.querySelector(selector);
const productGrid = qs('#product-grid');
const categoryGrid = qs('#category-grid');
const cartCountEl = qs('#cart-count');
const cartDrawer = qs('#cart-drawer');
const cartOverlay = qs('#cart-overlay');
const cartItems = qs('#cart-items');
const cartEmpty = qs('#cart-empty');
const cartSubtotalEl = qs('#cart-subtotal');
const cartNote = qs('#cart-note');
const checkoutButton = qs('#checkout-cart');

function productById(id){ return PRODUCTS.find((item) => item.id === id) || getProduct(id); }
function categoryById(id){ return getCategory(id) || CATEGORIES.find((item) => item.id === id); }
function imageUrlFor(product){ return PRODUCT_IMAGE_OVERRIDES[product.id] || product.imageUrl || ''; }
function detailedDescription(product){ return product.longDescription || product.description || product.blurb || ''; }
function formatPrice(product){
  if (!product.priceKnown || !Number.isFinite(product.price)) {
    if (Number.isFinite(product.priceMin) && Number.isFinite(product.priceMax)) return `$${Number(product.priceMin).toLocaleString('en-US')}–$${Number(product.priceMax).toLocaleString('en-US')}`;
    return 'По оферта';
  }
  const symbol = product.priceCurrency === 'USD' ? '$' : '€';
  return `${symbol}${Number(product.price).toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function imageSrc(product){
  const original = imageUrlFor(product);
  if (!original) return '';
  return `https://images.weserv.nl/?url=${encodeURIComponent(original)}`;
}
function escapeHtml(value){ return String(value).replace(/[&<>'\"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '\"':'&quot;' }[c])); }

function injectMerchantContact(){
  const contact = document.querySelector('.contact-details');
  if (!contact) return;
  const existing = contact.querySelector('[data-merchant-phone]');
  if (!existing && MERCHANT.phone) {
    const p = document.createElement('p');
    p.dataset.merchantPhone = 'true';
    const a = document.createElement('a');
    a.href = `tel:${MERCHANT.phone.replace(/\s+/g, '')}`;
    a.textContent = MERCHANT.phone;
    p.appendChild(a);
    contact.appendChild(p);
  }
}
function openCart(){ cartDrawer?.classList.add('open'); cartDrawer?.setAttribute('aria-hidden','false'); if (cartOverlay) cartOverlay.hidden=false; document.body.classList.add('cart-open'); renderCart(); }
function closeCart(){ cartDrawer?.classList.remove('open'); cartDrawer?.setAttribute('aria-hidden','true'); if (cartOverlay) cartOverlay.hidden=true; document.body.classList.remove('cart-open'); }
function renderCategories(){
  if (categoryGrid) categoryGrid.innerHTML = CATEGORIES.map((cat, i) => `<article class="category-card"><small>${String(i+1).padStart(2,'0')} / WAGNER</small><h3>${escapeHtml(cat.name)}</h3><p>${escapeHtml(cat.desc)}</p></article>`).join('');
  const filter = qs('#category-filter');
  if (filter) filter.innerHTML = '<option value="all">Всички категории</option>' + CATEGORIES.map((cat) => `<option value="${escapeHtml(cat.id)}">${escapeHtml(cat.name)}</option>`).join('');
}
function renderProducts(){
  const query = qs('#search')?.value.trim().toLowerCase() || '';
  const category = qs('#category-filter')?.value || 'all';
  const filtered = PRODUCTS.filter((product) => {
    const haystack = `${product.name} ${product.model || ''} ${product.eyebrow || ''} ${product.blurb || ''} ${detailedDescription(product)} ${(product.specs || []).join(' ')} ${categoryById(product.category)?.name || ''}`.toLowerCase();
    return (!query || haystack.includes(query)) && (category === 'all' || product.category === category);
  });
  const cart = loadCart();
  productGrid.innerHTML = filtered.length ? filtered.map((product) => {
    const inCart = cart.find((item) => item.id === product.id)?.quantity || 0;
    const src = imageSrc(product);
    return `<article class="product-card">
      <div class="product-art" aria-label="${escapeHtml(product.name)}">${src ? `<img src="${escapeHtml(src)}" data-original-image="${escapeHtml(imageUrlFor(product))}" alt="${escapeHtml(product.name)}" loading="lazy" referrerpolicy="no-referrer">` : `<div class="shape"><span>${escapeHtml((product.model || 'WAGNER').slice(0,18))}</span></div>`}</div>
      <div class="product-body">
        <small>${escapeHtml(product.eyebrow || '')}</small><h3>${escapeHtml(product.name)}</h3>
        ${product.model ? `<div class="model">Модел: ${escapeHtml(product.model)}</div>` : ''}
        <p>${escapeHtml(product.blurb || '')}</p>
        <details class="product-details"><summary>Пълно описание</summary><div class="product-description">${escapeHtml(detailedDescription(product))}</div></details>
        ${product.specs?.length ? `<div class="specs">${product.specs.map((spec) => `<span>${escapeHtml(spec)}</span>`).join('')}</div>` : ''}
        <div class="product-footer"><div class="price-block"><span class="price-label">Цена</span><strong class="price-inquiry">${escapeHtml(formatPrice(product))}</strong></div><button class="btn btn-dark buy-product" type="button" data-product="${escapeHtml(product.id)}" aria-label="Купи ${escapeHtml(product.name)}">КУПИ${inCart ? ` · ${inCart}` : ''}</button></div>
        ${product.priceNote ? `<div class="price-note">${escapeHtml(product.priceNote)}</div>` : ''}
        ${product.priceSource ? `<div class="price-source">Източник: ${escapeHtml(product.priceSource)}</div>` : ''}
        ${product.referenceUrl ? `<a class="product-link" href="${escapeHtml(product.referenceUrl)}" target="_blank" rel="noopener noreferrer">Източна обява →</a>` : ''}
        ${product.officialUrl ? `<a class="product-link" href="${escapeHtml(product.officialUrl)}" target="_blank" rel="noopener noreferrer">Официални данни →</a>` : ''}
      </div></article>`;
  }).join('') : '<p>Няма намерени продукти.</p>';
  productGrid.querySelectorAll('.product-art img').forEach((img) => img.addEventListener('error', () => {
    const original = img.dataset.originalImage;
    if (original && img.src !== original) { img.src = original; return; }
    const holder = img.closest('.product-art'); if (holder) holder.innerHTML = '<div class="shape"><span>WAGNER</span></div>';
  }, { once:true }));
  productGrid.querySelectorAll('.buy-product').forEach((button) => button.addEventListener('click', () => { addToCart(button.dataset.product); updateCartUI(); openCart(); renderProducts(); }));
}
function renderCart(){
  const items = loadCart().map((entry) => ({ entry, product: productById(entry.id) })).filter(({ product }) => product);
  cartCountEl.textContent = String(cartCount());
  if (!items.length){ cartEmpty.hidden=false; cartItems.innerHTML=''; } else {
    cartEmpty.hidden=true;
    cartItems.innerHTML = items.map(({entry,product}) => `<div class="cart-item"><div class="cart-item-image">${imageUrlFor(product) ? `<img src="${escapeHtml(imageSrc(product))}" alt="${escapeHtml(product.name)}" loading="lazy">` : ''}</div><div class="cart-item-main"><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(formatPrice(product))}</span><div class="cart-qty"><button type="button" data-minus="${escapeHtml(product.id)}">−</button><span>${entry.quantity}</span><button type="button" data-plus="${escapeHtml(product.id)}">+</button></div></div><button type="button" class="cart-remove" data-remove="${escapeHtml(product.id)}" aria-label="Премахни ${escapeHtml(product.name)}">×</button></div>`).join('');
    cartItems.querySelectorAll('[data-minus]').forEach((button)=>button.addEventListener('click',()=>{const item=loadCart().find(x=>x.id===button.dataset.minus);setQuantity(button.dataset.minus,(item?.quantity||1)-1);updateCartUI();renderProducts();}));
    cartItems.querySelectorAll('[data-plus]').forEach((button)=>button.addEventListener('click',()=>{const item=loadCart().find(x=>x.id===button.dataset.plus);setQuantity(button.dataset.plus,(item?.quantity||0)+1);updateCartUI();renderProducts();}));
    cartItems.querySelectorAll('[data-remove]').forEach((button)=>button.addEventListener('click',()=>{removeFromCart(button.dataset.remove);updateCartUI();renderProducts();}));
  }
  const subtotal=cartSubtotal(productById); cartSubtotalEl.textContent=`€${subtotal.toLocaleString('bg-BG',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const hasQuotes=cartHasNonPurchasableItems(productById); checkoutButton.disabled=!items.length||hasQuotes||subtotal<=0;
  cartNote.textContent=hasQuotes?'Кошницата съдържа продукт по оферта или в USD. За него първо е нужна потвърдена търговска оферта.':'Всички платими продукти са в EUR и са подготвени за PayPal checkout.';
}
function updateCartUI(){ renderCart(); initCartPayment(productById); }
function setupMenu(){ const menu=qs('.menu');const nav=qs('#main-nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav?.querySelectorAll('a').forEach((a)=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');})); }
function setupContact(){ qs('#contact-form')?.addEventListener('submit',(event)=>{event.preventDefault();const data=new FormData(event.currentTarget);const subject=encodeURIComponent(`Поръчка WAGNER-BG — ${data.get('name')||''}`);const body=encodeURIComponent(`${data.get('message')||''}\n\nКошница:\n${decodeURIComponent(cartMailtoBody(productById))}`);window.location.href=`mailto:${MERCHANT.email}?subject=${subject}&body=${body}`;}); }

qs('#open-cart')?.addEventListener('click',openCart); qs('#hero-cart')?.addEventListener('click',openCart); qs('#close-cart')?.addEventListener('click',closeCart); cartOverlay?.addEventListener('click',closeCart);
qs('#checkout-cart')?.addEventListener('click',()=>{ if(!checkoutButton.disabled) qs('#payment')?.scrollIntoView({behavior:'smooth'}); closeCart(); });
qs('#search')?.addEventListener('input',renderProducts); qs('#category-filter')?.addEventListener('change',renderProducts); qs('#cart-clear')?.addEventListener('click',()=>{clearCart();updateCartUI();renderProducts();});
window.addEventListener('wagner-cart-updated',()=>{updateCartUI();renderProducts();}); document.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeCart();});

injectMerchantContact(); renderCategories(); renderProducts(); updateCartUI(); setupMenu(); setupContact();
