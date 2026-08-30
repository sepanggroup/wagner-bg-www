import { PAYPAL_CLIENT_ID, MERCHANT } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems } from './cart.js';

let paypalPromise = null;

export function initCartPayment(productById) {
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!container || !status) return;

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = 'PayPal checkout е подготвен, но липсва Client ID за KOLMAN EOOD.';
    return;
  }

  // Keep the existing payment panel intact, but re-render the PayPal control
  // whenever the cart/payment state is refreshed. This prevents the button
  // from disappearing after the storefront re-renders or the language changes.
  if (container.dataset.paypalReady === 'true') return;
  status.textContent = 'Плати сигурно с PayPal.';

  loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    if (!window.paypal) throw new Error('PayPal SDK unavailable');
    container.innerHTML = '';
    window.paypal.Buttons({
      style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay' },
      createOrder: (_data, actions) => {
        const cart = loadCart();
        const subtotal = cartSubtotal(productById);
        if (!cart.length) throw new Error('Cart is empty');
        if (cartHasNonPurchasableItems(productById)) throw new Error('Cart contains quote-only or non-EUR items');
        if (!Number.isFinite(subtotal) || subtotal <= 0) throw new Error('No payable EUR products in cart');
        const items = cart.map((entry) => {
          const product = productById(entry.id);
          return {
            name: product.name.slice(0, 127),
            sku: product.model || product.id,
            unit_amount: { currency_code: 'EUR', value: product.price.toFixed(2) },
            quantity: String(entry.quantity)
          };
        });
        return actions.order.create({
          purchase_units: [{
            description: `WAGNER-BG order — ${MERCHANT.legalName}`,
            amount: {
              currency_code: 'EUR',
              value: subtotal.toFixed(2),
              breakdown: { item_total: { currency_code: 'EUR', value: subtotal.toFixed(2) } }
            },
            items
          }]
        });
      },
      onApprove: (data) => {
        status.textContent = `Плащането е одобрено. PayPal Order ID: ${data.orderID}`;
      },
      onError: () => {
        status.textContent = 'PayPal не успя да обработи плащането. Проверете кошницата и опитайте отново.';
        container.dataset.paypalReady = 'false';
      }
    }).render(container).then(() => {
      container.dataset.paypalReady = 'true';
    });
  }).catch(() => {
    container.dataset.paypalReady = 'false';
    status.textContent = 'PayPal временно не е наличен. Опитайте отново по-късно.';
  });
}

function loadPayPal(clientId) {
  if (window.paypal) return Promise.resolve();
  if (paypalPromise) return paypalPromise;
  paypalPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-wagner-paypal]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return paypalPromise;
}
