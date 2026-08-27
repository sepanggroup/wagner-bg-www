import { PAYPAL_CLIENT_ID } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems, clearCart } from './cart.js';

let paypalPromise = null;
let rendered = false;

export function initCartPayment(productById){
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!container || !status || rendered) return;

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = 'PayPal checkout не е конфигуриран.';
    return;
  }

  loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    if (!window.paypal) throw new Error('PayPal SDK unavailable');
    rendered = true;
    window.paypal.Buttons({
      style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay', height: 48 },
      createOrder: (_data, actions) => {
        const cart = loadCart();
        const subtotal = cartSubtotal(productById);
        if (!cart.length) throw new Error('Cart is empty');
        if (cartHasNonPurchasableItems(productById)) throw new Error('Cart contains quote-only or non-EUR items');
        if (!Number.isFinite(subtotal) || subtotal <= 0) throw new Error('No payable EUR products in cart');
        const items = cart.map((entry) => {
          const product = productById(entry.id);
          if (!product || !product.priceKnown || product.priceCurrency !== 'EUR' || !Number.isFinite(product.price) || product.price < 0) {
            throw new Error('Invalid product price');
          }
          return {
            name: product.name.slice(0, 127),
            sku: product.model || product.id,
            unit_amount: { currency_code: 'EUR', value: Number(product.price).toFixed(2) },
            quantity: String(entry.quantity)
          };
        });
        status.textContent = 'Подготвяме сигурното плащане…';
        return actions.order.create({
          purchase_units: [{
            description: 'WAGNER-BG order — SEPANG GROUP ЕООД',
            amount: { currency_code: 'EUR', value: subtotal.toFixed(2), breakdown: { item_total: { currency_code: 'EUR', value: subtotal.toFixed(2) } } },
            items
          }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          status.textContent = 'Потвърждаваме плащането…';
          const details = await actions.order.capture();
          const payer = details?.payer?.name?.given_name || '';
          status.textContent = `Плащането е успешно${payer ? `, ${payer}` : ''}. Номер на поръчката: ${data.orderID}`;
          clearCart();
          window.dispatchEvent(new CustomEvent('wagner-cart-updated'));
        } catch (error) {
          console.error(error);
          status.textContent = 'Плащането не можа да бъде потвърдено. Не опитвайте повторно, преди да проверите PayPal профила си.';
        }
      },
      onCancel: () => { status.textContent = 'Плащането е отменено. Кошницата ви е запазена.'; },
      onError: (error) => { console.error(error); status.textContent = 'PayPal временно не може да обработи плащането. Опитайте отново.'; }
    }).render('#paypal-button-container');
  }).catch((error) => {
    console.error(error);
    status.textContent = 'PayPal временно не е наличен.';
  });
}

function loadPayPal(clientId){
  if (window.paypal) return Promise.resolve();
  if (paypalPromise) return paypalPromise;
  paypalPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return paypalPromise;
}
