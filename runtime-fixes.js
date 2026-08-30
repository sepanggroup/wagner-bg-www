import { addToCart } from './cart.js';
import { PRODUCT_DESCRIPTIONS_EN } from './product-descriptions-en.js?v=20260830-1900';

const PRODUCT_GRID = '#product-grid';
const CART_BUTTON = '#open-cart';

function syncEnglishCopy() {
  if (document.documentElement.lang !== 'en') return;
  document.querySelectorAll(`${PRODUCT_GRID} .product-card`).forEach((card) => {
    const button = card.querySelector('.buy-product');
    const id = button?.dataset.product;
    if (!id) return;
    const copy = PRODUCT_DESCRIPTIONS_EN[id];
    if (!copy) return;
    const blurb = card.querySelector('.product-body > p');
    const description = card.querySelector('.product-description');
    if (blurb && copy.blurbEn) blurb.textContent = copy.blurbEn;
    if (description && copy.longDescriptionEn) description.textContent = copy.longDescriptionEn;
  });
}

function handleReliableBuy(event) {
  const button = event.target.closest(`${PRODUCT_GRID} .buy-product`);
  if (!button || button.disabled) return;
  const id = button.dataset.product;
  if (!id) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  addToCart(id);
  document.querySelector(CART_BUTTON)?.click();
}

function initRuntimeFixes() {
  const grid = document.querySelector(PRODUCT_GRID);
  if (!grid) return;
  grid.addEventListener('click', handleReliableBuy, true);
  const observer = new MutationObserver(syncEnglishCopy);
  observer.observe(grid, { childList: true, subtree: true });
  document.addEventListener('wagner-language-changed', syncEnglishCopy);
  document.addEventListener('wagner-language-applied', syncEnglishCopy);
  syncEnglishCopy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRuntimeFixes, { once: true });
} else {
  initRuntimeFixes();
}
