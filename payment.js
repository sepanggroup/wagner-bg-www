import { PAYPAL_CLIENT_ID, MERCHANT } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems } from './cart.js';

let paypalPromise = null;

function ensureCardContainer(container) {
  let card = document.querySelector('#paypal-card-button-container');
  if (!card) {
    card = document.createElement('div');
    card.id = 'paypal-card-button-container';
    card.setAttribute('aria-label', 'Debit or credit card payment');
    container.insertAdjacentElement('afterend', card);
  }
  return card;
}

export function initCartPayment(productById) {
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!container || !status) return;

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = 'PayPal checkout е подготвен, но липсва Client ID за KOLMAN EOOD.';
    return;
  }

  const cardContainer = ensureCardContainer(container);
  if (container.dataset.paypalReady === 'true' && container.children.length && (!window.paypal || cardContainer.children.length)) return;

  status.textContent = 'Плати сигурно с PayPal или с дебитна/кредитна карта.';

  loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    if (!window.paypal) throw new Error('PayPal SDK unavailable');
    container.innerHTML = '';
    cardContainer.innerHTML = '';
    container.dataset.paypalReady = 'false';

    const validateCart = () => {
      const cart = loadCart();
      const subtotal = cartSubtotal(productById);
      if (!cart.length) throw new Error('Cart is empty');
      if (cartHasNonPurchasableItems(productById)) throw new Error('Cart contains quote-only or non-EUR items');
      if (!Number.isFinite(subtotal) || subtotal <= 0) throw new Error('No payable EUR products in cart');
      return { cart, subtotal };
    };

    const createOrder = (_data, actions) => {
      const { cart, subtotal } = validateCart();
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
    };

    const onClick = (_data, actions) => {
      try { validateCart(); return actions.resolve(); }
      catch { status.textContent = 'Добави платим продукт с валидна EUR цена в кошницата, за да продължиш към плащане.'; return actions.reject(); }
    };

    const onApprove = (data, actions) => actions.order.capture().then((details) => {
      const payer = details?.payer?.name?.given_name || '';
      status.textContent = payer
        ? `Плащането е успешно потвърдено за ${payer}. PayPal Order ID: ${data.orderID}`
        : `Плащането е успешно потвърдено. PayPal Order ID: ${data.orderID}`;
    });

    const onError = () => {
      status.textContent = 'Плащането не беше обработено. Проверете кошницата и опитайте отново.';
      container.dataset.paypalReady = 'false';
    };

    const baseOptions = { style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay' }, createOrder, onClick, onApprove, onError };
    const renderers = [window.paypal.Buttons(baseOptions).render(container)];

    if (window.paypal.FUNDING?.CARD) {
      renderers.push(window.paypal.Buttons({
        fundingSource: window.paypal.FUNDING.CARD,
        style: { shape: 'rect', layout: 'vertical', label: 'pay' },
        createOrder,
        onClick,
        onApprove,
        onError
      }).render(cardContainer));
    }

    return Promise.all(renderers).then(() => {
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
      if (window.paypal) { resolve(); return; }
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons&enable-funding=card`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return paypalPromise;
}
