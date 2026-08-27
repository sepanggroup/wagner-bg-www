import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const products = read('products.js');
const payment = read('payment.js');
const app = read('app.js');
const cname = read('CNAME').trim();

assert.match(index, /<html lang="bg">/);
assert.match(index, /<link rel="canonical" href="https:\/\/www\.wagner-bg\.shop\/">/);
assert.equal(cname, 'www.wagner-bg.shop');
assert.match(index, /privacy\.html/);
assert.match(index, /terms\.html/);
assert.match(index, /cookies\.html/);
assert.match(index, /application\/ld\+json/);
assert.match(products, /WAGNER/);
assert.match(products, /priceKnown: false/);
assert.match(payment, /PayPal/);
assert.match(payment, /payment-config\.js/);
assert.doesNotMatch(products, /sepang-tech-group/);
assert.doesNotMatch(payment, /ncp\/payment\/KBL65LTBNK568/);
assert.doesNotMatch(payment, /ncp\/payment\/FGNHSNGS24CNQ/);
assert.doesNotMatch(app, /kolmaneood@[a-z0-9.-]+/i, 'Business email belongs in product configuration, not application logic');

for (const [file, required] of [
  ['products.js', ['SuperFinish 21 Pro HEA', 'FinishControl 3500', 'ProSpray 3.39 Connect Filler', 'SuperFinish 23 Plus HEA']],
  ['app.js', ['specs', 'product-specs']],
]) {
  const text = read(file);
  for (const token of required) assert.match(text, new RegExp(token.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')));
}

for (const file of ['privacy.html', 'terms.html', 'cookies.html', 'thanks.html']) {
  const html = read(file);
  assert.match(html, /kolmaneood@abv\.bg/);
  assert.match(html, /index\.html/);
}

console.log('WAGNER source integrity contract passed');
