import { PAYPAL_CLIENT_ID, MERCHANT } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems } from './cart.js';

const PAYPAL_ME_URL = 'https://www.paypal.com/paypalme/my/grab';
const PAYPAL_PAYMENT_LINK = 'https://www.paypal.com/ncp/payment/653GFDV8Z76G2';
let paypalPromise = null;

function ensureStaticPaymentFallback(status) {
  let fallback = document.querySelector('#paypal-static-fallback');
  if (!fallback) {
    fallback = document.createElement('div');
    fallback.id = 'paypal-static-fallback';
    fallback.className = 'paypal-static-fallback';
    fallback.innerHTML = `
      <a class="paypal-static-button paypal-static-paypal" href="${PAYPAL_PAYMENT_LINK}" target="_blank" rel="noopener noreferrer" aria-label="PayPal payment for KOLMAN EOOD">PayPal</a>
      <a class="paypal-static-button paypal-static-card" href="${PAYPAL_PAYMENT_LINK}" target="_blank" rel="noopener noreferrer" aria-label="Debit or credit card payment for KOLMAN EOOD">💳 <span>Дебитна / кредитна карта</span></a>
      <small>Сигурно плащане чрез PayPal</small>`;
    status.insertAdjacentElement('afterend', fallback);
  }
  fallback.hidden = false;
  return fallback;
}

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

function ensurePayPalMeFallback(status) {
  let fallback = document.querySelector('#paypal-me-fallback');
  if (!fallback) {
    fallback = document.createElement('a');
    fallback.id = 'paypal-me-fallback';
    fallback.className = 'btn btn-dark full';
    fallback.href = PAYPAL_ME_URL;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'PayPal директно';
    fallback.setAttribute('aria-label', 'PayPal direct payment for KOLMAN EOOD');
    status.insertAdjacentElement('afterend', fallback);
  }
  return fallback;
}

export function renderPaymentSummary(productById) {
  const summary = document.querySelector('#paypal-payment-summary');
  const itemsEl = document.querySelector('#paypal-payment-items');
  const totalEl = document.querySelector('#paypal-payment-total');
  const titleEl = document.querySelector('#paypal-payment-summary-title');
  const totalLabelEl = document.querySelector('#paypal-payment-total-label');
  if (!summary || !itemsEl || !totalEl) return;

  const isEnglish = document.documentElement.lang === 'en';
  if (titleEl) titleEl.textContent = isEnglish ? 'Payment order' : 'Поръчка за плащане';
  if (totalLabelEl) totalLabelEl.textContent = isEnglish ? 'Total' : 'Общо';

  const items = loadCart().map((entry) => ({ entry, product: productById(entry.id) })).filter(({ product }) => product);
  if (!items.length) {
    itemsEl.replaceChildren();
    totalEl.textContent = '€0.00';
    summary.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const { entry, product } of items) {
    const row = document.createElement('div');
    row.className = 'selected-row';
    const name = document.createElement('strong');
    name.textContent = `${product.name}${product.model ? ` · ${product.model}` : ''} × ${entry.quantity}`;
    const amount = document.createElement('strong');
    const payable = product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price);
    amount.textContent = payable
      ? `€${(product.price * entry.quantity).toLocaleString(isEnglish ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : (isEnglish ? 'Price on request' : 'Цена при запитване');
    row.append(name, amount);
    fragment.appendChild(row);
  }
  itemsEl.replaceChildren(fragment);

  const subtotal = cartSubtotal(productById);
  totalEl.textContent = `€${subtotal.toLocaleString(isEnglish ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  summary.hidden = false;
}

export function initCartPayment(productById) {
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!container || !status) return;

  const staticFallback = ensureStaticPaymentFallback(status);
  if (!document.querySelector('#paypal-static-fallback')) ensurePayPalMeFallback(status);
  renderPaymentSummary(productById);

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = 'PayPal checkout е подготвен, но липсва Client ID за KOLMAN EOOD.';
    staticFallback.hidden = false;
    return;
  }

  const cardContainer = ensureCardContainer(container);
  if (container.dataset.paypalReady === 'true' && container.children.length && (!window.paypal || cardContainer.children.length)) {
    staticFallback.hidden = false;
    return;
  }

  status.textContent = 'Плати сигурно с PayPal или с дебитна/кредитна карта.';
  staticFallback.hidden = false;

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
      staticFallback.hidden = false;
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
      staticFallback.hidden = false;
    });
  }).catch(() => {
    container.dataset.paypalReady = 'false';
    staticFallback.hidden = false;
    status.textContent = 'PayPal временно не е наличен. Можеш да използваш PayPal или карта чрез защитената платежна страница.';
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
