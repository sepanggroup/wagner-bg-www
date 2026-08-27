import { PAYPAL_CLIENT_ID } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems } from './cart.js';

let paypalRendered = false;

export function initCartPayment(productById){
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!container || !status || paypalRendered) return;

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = 'PayPal checkout е подготвен, но липсва Client ID за SEPANG GROUP ЕООД.';
    return;
  }

  loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    if (!window.paypal) throw new Error('PayPal SDK unavailable');
    paypalRendered = true;
    window.paypal.Buttons({
      style: { shape:'rect', color:'gold', layout:'vertical', label:'pay' },
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
            description: 'WAGNER-BG order — SEPANG GROUP ЕООД',
            amount: { currency_code: 'EUR', value: subtotal.toFixed(2), breakdown: { item_total: { currency_code: 'EUR', value: subtotal.toFixed(2) } } },
            items
          }]
        });
      },
      onApprove: (data) => { status.textContent = `Плащането е одобрено. PayPal Order ID: ${data.orderID}`; },
      onError: () => { status.textContent = 'PayPal не успя да обработи плащането. Проверете кошницата и опитайте отново.'; }
    }).render('#paypal-button-container');
  }).catch(() => {
    status.textContent = 'PayPal временно не е наличен. Опитайте отново по-късно.';
  });
}

function loadPayPal(clientId){
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const existing = document.querySelector('script[data-wagner-paypal]');
    if (existing){ existing.addEventListener('load', resolve, { once:true }); existing.addEventListener('error', reject, { once:true }); return; }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
