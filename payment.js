const PAYPAL_CLIENT_ID = window.WAGNER_PAYPAL_CLIENT_ID || '';

export function initAgreementPayment(){
  const amountInput = document.querySelector('#agreed-amount');
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!amountInput || !container || !status) return;

  const renderUnavailable = (message) => {
    container.innerHTML = '';
    const note = document.createElement('div');
    note.className = 'paypal-status';
    note.textContent = message;
    container.appendChild(note);
  };

  if (!PAYPAL_CLIENT_ID) {
    renderUnavailable('За live PayPal плащане е необходим Client ID от PayPal Business акаунта на КОЛМАН ЕООД.');
    return;
  }

  if (!/^A[A-Za-z0-9_-]{10,}$/.test(PAYPAL_CLIENT_ID)) {
    renderUnavailable('PayPal Client ID има невалиден формат. Провери merchant настройките преди активиране.');
    return;
  }

  loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    if (!window.paypal) throw new Error('PayPal SDK unavailable');
    window.paypal.Buttons({
      style: { shape:'rect', color:'gold', layout:'vertical', label:'pay' },
      createOrder: (_data, actions) => {
        const amount = Number(amountInput.value);
        if (!Number.isFinite(amount) || amount < 1) {
          amountInput.focus();
          throw new Error('Enter an agreed amount of at least €1.00');
        }
        return actions.order.create({
          purchase_units: [{ amount: { currency_code: 'EUR', value: amount.toFixed(2) }, description: 'Плащане по предварително договорена поръчка — КОЛМАН ЕООД' }]
        });
      },
      onApprove: (data) => {
        status.textContent = `Плащането е одобрено. PayPal Order ID: ${data.orderID}`;
      },
      onError: () => {
        status.textContent = 'PayPal не успя да обработи плащането. Проверете сумата и опитайте отново.';
      }
    }).render('#paypal-button-container');
  }).catch(() => renderUnavailable('PayPal временно не е наличен. Опитайте отново по-късно.'));
}

function loadPayPal(clientId){
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const existing = document.querySelector('script[data-wagner-paypal]');
    if (existing) { existing.addEventListener('load', resolve, { once:true }); existing.addEventListener('error', reject, { once:true }); return; }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
