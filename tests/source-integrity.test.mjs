import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const products = read('products.js');
const robots = read('robot-products.js');
const images = read('image-overrides.js');
const payment = read('payment.js');
const merchant = read('merchant-config.js');
const cart = read('cart.js');
const app = read('app.js');
const cname = read('CNAME').trim();

assert.match(index, /<html lang="bg">/);
assert.match(index, /<link rel="canonical" href="https:\/\/www\.wagner-bg\.shop\/">/);
assert.equal(cname, 'www.wagner-bg.shop');
assert.match(index, /styles\.css\?v=/);
assert.match(index, /cart\.css\?v=/);
assert.match(index, /privacy\.html/);
assert.match(index, /terms\.html/);
assert.match(index, /cookies\.html/);
assert.match(index, /application\/ld\+json/);
assert.match(index, /SEPANG GROUP ЕООД/);
assert.match(index, /Техниката, която <em>работи за вас\.<\/em>/);
assert.match(index, /\+359 88 503 9931/);
assert.match(index, /КУПИ/);
assert.match(index, /cart-drawer/);
assert.doesNotMatch(index, /КОЛМАН ЕООД/);
assert.doesNotMatch(index, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(index, /\+359 88 579 66 13/);

assert.match(products, /SEPANG GROUP ЕООД/);
assert.match(products, /WAGNER/);
assert.match(products, /priceType: 'market-reference'/);
assert.match(products, /priceKnown: true/);
assert.ok((products.match(/imageUrl:/g) || []).length >= 11, 'Core catalog products must contain product photography');
assert.doesNotMatch(products, /КОЛМАН ЕООД/);
assert.doesNotMatch(products, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(products, /\+359 88 579 66 13/);

assert.match(robots, /ROBOT_CATEGORY/);
assert.match(robots, /ROBOT_PRODUCTS/);
assert.match(robots, /Kaifeng Yucheng/);
assert.match(robots, /Smart Build Robotics/);
assert.match(robots, /Partner Robotics P900/);
assert.match(robots, /Fangshi Ceramic Floor Tile Laying Robot/);
assert.match(robots, /Fangshi Stone Tile Laying Robot/);
assert.match(robots, /Zhuling TLR/);
assert.match(robots, /Bright Dream Robotics R-19/);
assert.match(robots, /description:/);
assert.match(robots, /лепило/);

const robotImageUrls = [...images.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((m) => m[2]);
assert.ok(robotImageUrls.length >= 11, 'Robot catalog image map must cover every robot listing');
assert.equal(new Set(robotImageUrls).size, robotImageUrls.length, 'Each mapped robot listing must use a distinct photo URL');
assert.match(images, /partner-p900/);
assert.match(images, /fangshi-ceramic-tile-robot/);
assert.match(images, /fangshi-stone-tile-robot/);
assert.match(images, /zhuling-tlr/);
assert.match(images, /bright-dream-r19/);
assert.match(images, /smartbuild-thinset-robot/);
assert.match(images, /derutu-tile-laying-robot/);
assert.match(images, /yanling-tile-robot/);
assert.match(images, /kaifeng-yucheng-automatic-tile-robot/);
assert.match(images, /bossgoo-intelligent-tile-robot/);
assert.match(images, /bossgoo-palletizer-tile-robot/);
assert.doesNotMatch(robots, /КОЛМАН ЕООД/);
assert.doesNotMatch(robots, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(robots, /\+359 88 579 66 13/);

assert.match(merchant, /SEPANG GROUP ЕООД/);
assert.match(merchant, /sepanggroupltd@gmail\.com/);
assert.match(merchant, /\+359 88 503 9931/);
assert.match(merchant, /PAYPAL_CLIENT_ID/);
assert.doesNotMatch(merchant, /КОЛМАН ЕООД/);
assert.doesNotMatch(merchant, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(merchant, /\+359 88 579 66 13/);

assert.match(payment, /PayPal/);
assert.match(payment, /createOrder/);
assert.match(payment, /merchant-config\.js/);
assert.doesNotMatch(payment, /КОЛМАН ЕООД/);
assert.doesNotMatch(payment, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(payment, /\+359 88 579 66 13/);
assert.doesNotMatch(payment, /ncp\/payment\/FGNHSNGS24CNQ/);

assert.match(cart, /addToCart/);
assert.match(cart, /localStorage/);
assert.match(cart, /SEPANG GROUP ЕООД/);
assert.doesNotMatch(cart, /КОЛМАН ЕООД/);
assert.doesNotMatch(cart, /\+359 88 579 66 13/);

assert.match(app, /addToCart/);
assert.match(app, /updateCartUI/);
assert.match(app, /cart-drawer/);
assert.match(app, /КУПИ/);
assert.match(app, /imageSrc/);
assert.match(app, /imageUrlFor/);
assert.match(app, /formatPrice/);
assert.match(app, /ROBOT_PRODUCTS/);
assert.match(app, /product\.description/);
assert.doesNotMatch(app, /КОЛМАН ЕООД/);
assert.doesNotMatch(app, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(app, /\+359 88 579 66 13/);

for (const [file, required] of [
  ['products.js', ['SuperFinish 21 Pro HEA', 'SuperFinish 23 Pro Cart HEA', 'ProSpray 3.25 Spraypack Cart', 'SuperFinish 33 Pro', 'FinishControl 4000 18V', 'VectorPro 4 Finger Professional']],
  ['app.js', ['specs', 'formatPrice', 'imageSrc', 'imageUrlFor', 'addToCart', 'updateCartUI', 'КУПИ']],
  ['cart.js', ['loadCart', 'saveCart', 'cartSubtotal']]
]) {
  const text = read(file);
  for (const token of required) assert.match(text, new RegExp(token.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')));
}

for (const file of ['privacy.html', 'terms.html', 'cookies.html', 'thanks.html']) {
  const html = read(file);
  assert.match(html, /sepanggroupltd@gmail\.com/);
  assert.match(html, /index\.html/);
  assert.doesNotMatch(html, /КОЛМАН ЕООД/);
  assert.doesNotMatch(html, /kolmaneood@abv\.bg/i);
  assert.doesNotMatch(html, /\+359 88 579 66 13/);
}

console.log('WAGNER SEPANG storefront integrity contract passed');
