import { STORE, getCategory, getProduct } from './products.js';
import { ROBOT_CATEGORY, ROBOT_PRODUCTS } from './robot-products.js';
import { initAgreementPayment } from './payment.js';

const CATEGORIES = [...STORE.categories, ROBOT_CATEGORY];
const PRODUCTS = [...STORE.products, ...ROBOT_PRODUCTS];
const state = { selected: new Set(JSON.parse(localStorage.getItem('wagnerSelected') || '[]')) };

const qs = (s) => document.querySelector(s);
const categoryGrid = qs('#category-grid');
const productGrid = qs('#product-grid');
const selectedList = qs('#selected-list');
const selectedEmpty = qs('#selected-empty');
const cartCount = qs('#cart-count');

function saveSelection(){ localStorage.setItem('wagnerSelected', JSON.stringify([...state.selected])); }
function categoryById(id){ return getCategory(id) || CATEGORIES.find((item) => item.id === id); }
function productById(id){ return getProduct(id) || PRODUCTS.find((item) => item.id === id); }

function formatPrice(product){
  if (!product.priceKnown) return 'По запитване';
  const currency = product.priceCurrency || 'EUR';
  const symbol = currency === 'USD' ? '$' : '€';
  const fmt = (value) => Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (Number.isFinite(product.priceMin) && Number.isFinite(product.priceMax)) return `${symbol}${fmt(product.priceMin)}–${fmt(product.priceMax)}`;
  return `${symbol}${fmt(product.price)}`;
}

function renderCategories(){
  categoryGrid.innerHTML = CATEGORIES.map((cat, i) => `
    <article class="category-card">
      <small>${String(i+1).padStart(2,'0')} / WAGNER</small>
      <h3>${escapeHtml(cat.name)}</h3>
      <p>${escapeHtml(cat.desc)}</p>
    </article>`).join('');
  const filter = qs('#category-filter');
  filter.innerHTML = '<option value="all">Всички категории</option>' + CATEGORIES.map((cat)=>`<option value="${escapeHtml(cat.id)}">${escapeHtml(cat.name)}</option>`).join('');
}

function renderProducts(){
  const query = qs('#search').value.trim().toLowerCase();
  const category = qs('#category-filter').value;
  const filtered = PRODUCTS.filter((product) => {
    const haystack = `${product.name} ${product.model || ''} ${product.eyebrow} ${product.blurb} ${(product.specs || []).join(' ')} ${categoryById(product.category)?.name || ''}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesQuery && matchesCategory;
  });
  productGrid.innerHTML = filtered.length ? filtered.map((product) => `
    <article class="product-card">
      <div class="product-art" aria-label="WAGNER ${escapeHtml(product.model || product.name)}">${product.imageUrl ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:230px;object-fit:contain;display:block;background:#fff">` : `<div class="shape"><span>${escapeHtml((product.model || 'WAGNER').slice(0,18))}</span></div>`}</div>
      <div class="product-body">
        <small>${escapeHtml(product.eyebrow)}</small>
        <h3>${escapeHtml(product.name)}</h3>
        ${product.model ? `<div class="model">Модел: ${escapeHtml(product.model)}</div>` : ''}
        <p>${escapeHtml(product.blurb)}</p>
        ${product.specs?.length ? `<div class="specs">${product.specs.map((spec)=>`<span>${escapeHtml(spec)}</span>`).join('')}</div>` : ''}
        <div class="product-footer">
          <div class="price-block">
            <span class="price-label">${product.priceKnown ? 'Публикувана референтна цена' : 'Цена'}</span>
            <strong class="price-inquiry">${escapeHtml(formatPrice(product))}</strong>
          </div>
          <button class="btn btn-dark select-product" type="button" data-product="${escapeHtml(product.id)}">${state.selected.has(product.id) ? 'Добавен ✓' : 'Запитване'}</button>
        </div>
        ${product.priceNote ? `<div class="price-note">${escapeHtml(product.priceNote)}</div>` : ''}
        ${product.priceSource ? `<div class="price-source">Източник: ${escapeHtml(product.priceSource)}</div>` : ''}
        ${product.referenceUrl ? `<a class="product-link" href="${escapeHtml(product.referenceUrl)}" target="_blank" rel="noopener noreferrer">Изходна обява →</a>` : ''}
        ${product.officialUrl ? `<a class="product-link" href="${escapeHtml(product.officialUrl)}" target="_blank" rel="noopener noreferrer">Официални технически данни →</a>` : ''}
        ${product.imageSource ? `<div class="price-source">Снимка: ${escapeHtml(product.imageSource)}</div>` : ''}
      </div>
    </article>`).join('') : '<p>Няма намерени продукти по този критерий.</p>';

  productGrid.querySelectorAll('.select-product').forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.product;
    state.selected.has(id) ? state.selected.delete(id) : state.selected.add(id);
    saveSelection();
    renderProducts();
    renderSelected();
  }));
}

function renderSelected(){
  cartCount.textContent = String(state.selected.size);
  const items = [...state.selected].map(productById).filter(Boolean);
  selectedEmpty.style.display = items.length ? 'none' : 'block';
  selectedList.innerHTML = items.map((p) => `<div class="selected-row"><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(formatPrice(p))}</span><button type="button" class="remove-product" data-product="${escapeHtml(p.id)}">Премахни</button></div>`).join('');
  selectedList.querySelectorAll('.remove-product').forEach((button) => button.addEventListener('click', () => {
    state.selected.delete(button.dataset.product);
    saveSelection(); renderSelected(); renderProducts();
  }));
  const names = items.map((p) => `• ${p.name}${p.model ? ` (${p.model})` : ''}`).join('\n');
  qs('#message').value = items.length ? `Интересувам се от:\n${names}\n\nМоля за потвърдена цена, наличност и подходяща конфигурация.` : '';
}

function setupMenu(){
  const menu = qs('.menu'); const nav = qs('#main-nav');
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach((a)=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
}

function setupContact(){
  qs('#contact-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Запитване за WAGNER техника — ${data.get('name') || ''}`);
    const body = encodeURIComponent([
      `Име: ${data.get('name') || ''}`,
      `Имейл: ${data.get('email') || ''}`,
      `Телефон: ${data.get('phone') || ''}`,
      `Фирма: ${data.get('company') || ''}`,
      '', String(data.get('message') || '')
    ].join('\n'));
    window.location.href = `mailto:${STORE.company.email}?subject=${subject}&body=${body}`;
  });
}

function escapeHtml(value){ return String(value).replace(/[&<>'"]/g,(c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c])); }

renderCategories();
renderProducts();
renderSelected();
setupMenu();
setupContact();
qs('#search').addEventListener('input', renderProducts);
qs('#category-filter').addEventListener('change', renderProducts);
initAgreementPayment();
