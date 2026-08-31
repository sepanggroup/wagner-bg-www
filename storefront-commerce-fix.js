import { STORE, getProduct } from './products.js';
import { ROBOT_PRODUCTS } from './robot-products.js';
import { EXTRA_PRODUCTS } from './extra-products.js';
import { PRODUCT_COPY } from './product-copy.js';
import { ROBOT_COPY } from './robot-copy.js';
import { loadCart, addToCart } from './cart.js';
import { initCartPayment, renderPaymentSummary } from './payment.js';

const PRODUCTS = [
  ...[...STORE.products, ...ROBOT_PRODUCTS].map((p) => ({ ...p, ...(PRODUCT_COPY[p.id] || {}), ...(ROBOT_COPY[p.id] || {}) })),
  ...EXTRA_PRODUCTS.filter((p) => !STORE.products.some((x) => x.id === p.id) && !ROBOT_PRODUCTS.some((x) => x.id === p.id))
];
const productById = (id) => PRODUCTS.find((p) => p.id === id) || getProduct(id);
const isPayable = (product) => Boolean(product && product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price) && product.price > 0);

function syncPayment() {
  renderPaymentSummary(productById);
  initCartPayment(productById);
}

function syncProductButtons() {
  document.querySelectorAll('#product-grid .buy-product').forEach((button) => {
    const product = productById(button.dataset.product);
    if (!product) return;
    const payable = isPayable(product);
    button.disabled = false;
    button.dataset.commerceAction = payable ? 'buy' : 'quote';
    button.textContent = payable
      ? `КУПИ${(loadCart().find((item) => item.id === product.id)?.quantity || 0) ? ` · ${loadCart().find((item) => item.id === product.id).quantity}` : ''}`
      : 'ЗАПИТВАНЕ';
    button.setAttribute('aria-label', payable ? `Купи ${product.name}` : `Добави ${product.name} за запитване`);
    button.title = payable ? 'Добави продукта в кошницата' : 'Добави продукта в кошницата за оферта';
  });
}

function interceptProductClicks() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('#product-grid .buy-product');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const product = productById(button.dataset.product);
    if (!product) return;
    addToCart(product.id);
    document.querySelector('#open-cart')?.click();
    syncPayment();
  }, true);
}

function boot() {
  interceptProductClicks();
  const grid = document.querySelector('#product-grid');
  if (grid) new MutationObserver(() => syncProductButtons()).observe(grid, { childList: true });
  window.addEventListener('wagner-cart-updated', syncPayment);
  syncProductButtons();
  syncPayment();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
