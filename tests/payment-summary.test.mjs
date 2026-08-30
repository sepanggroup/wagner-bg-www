import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const app = read('app-v2.js');
const payment = read('payment.js');

assert.match(index, /id="paypal-payment-summary"/);
assert.match(index, /id="paypal-payment-items"/);
assert.match(index, /id="paypal-payment-total"/);
assert.match(app, /paypal-payment-items/);
assert.match(app, /paypal-payment-total/);
assert.match(app, /renderPaymentSummary/);
assert.match(payment, /paypal-payment-summary/);
assert.match(payment, /paypal-payment-total/);

console.log('WAGNER payment summary contract passed');
