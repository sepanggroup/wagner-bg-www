import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const products = read('products.js');
const robots = read('robot-products.js');
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
assert.match(products, /priceType: 'market-reference'/);
assert.match(products, /priceKnown: true/);
assert.ok((products.match(/imageUrl:/g) || []).length >= 11, 'Every core catalog product must have product photography');
assert.match(robots, /ROBOT_CATEGORY/);
assert.match(robots, /ROBOT_PRODUCTS/);
assert.match(robots, /Kaifeng Yucheng/);
assert.match(robots, /95000/);
assert.match(robots, /165000/);
assert.match(robots, /Partner Robotics P900/);
assert.match(robots, /Legend Robotics/);
assert.ok((robots.match(/imageUrl:/g) || []).length >= 4, 'Robot catalog must contain product photography');
assert.match(payment, /PayPal/);
assert.match(payment, /payment-config\.js/);
assert.doesNotMatch(products, /sepang-tech-group/);
assert.doesNotMatch(robots, /sepang-tech-group/);
assert.doesNotMatch(payment, /ncp\/payment\/KBL65LTBNK568/);
assert.doesNotMatch(payment, /ncp\/payment\/FGNHSNGS24CNQ/);
assert.doesNotMatch(app, /kolmaneood@[a-z0-9.-]+/i, 'Business email belongs in product configuration, not application logic');
assert.match(app, /ROBOT_PRODUCTS/);
assert.match(app, /formatPrice/);
assert.match(app, /imageUrl/);

for (const [file, required] of [
  ['products.js', ['SuperFinish 21 Pro HEA', 'SuperFinish 23 Pro Cart HEA', 'ProSpray 3.25 Spraypack Cart', 'SuperFinish 33 Pro', 'FinishControl 4000 18V', 'VectorPro 4 Finger Professional']],
  ['app.js', ['specs', 'formatPrice', 'imageUrl']]
]) {
  const text = read(file);
  for (const token of required) assert.match(text, new RegExp(token.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')));
}

for (const file of ['privacy.html', 'terms.html', 'cookies.html', 'thanks.html']) {
  const html = read(file);
  assert.match(html, /kolmaneood@abv\.bg/);
  assert.match(html, /index\.html/);
}

console.log('WAGNER product catalog, photography and source integrity contract passed');
