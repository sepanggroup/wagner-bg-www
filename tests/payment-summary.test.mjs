import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const payment = read('payment.js');

assert.match(index, /id="paypal-payment-summary"/);
assert.match(index, /id="paypal-payment-items"/);
assert.match(index, /id="paypal-payment-total"/);
assert.match(payment, /paypal-payment-summary/);
assert.match(payment, /paypal-payment-items/);
assert.match(payment, /paypal-payment-total/);
assert.match(payment, /renderPaymentSummary/);
assert.match(payment, /cartSubtotal\(productById\)/);
assert.match(payment, /cartHasNonPurchasableItems\(productById\)/);

console.log('WAGNER payment summary contract passed');
