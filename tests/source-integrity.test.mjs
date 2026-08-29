import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const products = read('products.js');
const robots = read('robot-products.js');
const additions = read('catalog-additions.js');
const extraProducts = read('extra-products.js');
const images = read('image-overrides.js');
const payment = read('payment.js');
const merchant = read('merchant-config.js');
const cart = read('cart.js');
const app = read('app-v2.js');

assert.match(index, /<html lang="bg">/);
assert.match(index, /<link rel="canonical" href="https:\/\/sepanggroup\.github\.io\/wagner-bg-www\/">/);
assert.match(index, /app-v2\.js\?v=20260829-premium-restore/);
assert.match(index, /styles\.css\?v=20260829-premium-restore/);
assert.match(index, /cart\.css\?v=20260829-premium-restore/);
assert.match(index, /premium-visuals\.css\?v=20260829-premium-restore/);
assert.match(index, /application\/ld\+json/);
assert.match(index, /SEPANG GROUP ЕООД/);
assert.match(index, /Техниката, която <em>работи за вас\.<\/em>/);
assert.match(index, /\+359 88 503 9931/);
assert.match(index, /КУПИ/);
assert.match(index, /cart-drawer/);
assert.match(index, /paypal-button-container/);
assert.match(index, /contact-form/);
assert.doesNotMatch(index, /wagner-bg\.shop/);
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

assert.match(extraProducts, /videoUrl:/);
assert.match(extraProducts, /ProSpray 3\.25 Spraypack Cart/);
assert.match(extraProducts, /SuperFinish 23 Pro Cart HEA/);
assert.match(extraProducts, /SuperFinish 33 Pro/);
assert.ok((extraProducts.match(/imageUrl:/g) || []).length >= 10, 'Expanded premium catalog must contain product photography');

assert.match(additions, /CATALOG_ADDITIONS/);
assert.ok((additions.match(/id:/g) || []).length >= 10, 'Catalog additions must be present');

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
for (const token of ['partner-p900', 'fangshi-ceramic-tile-robot', 'fangshi-stone-tile-robot', 'zhuling-tlr', 'bright-dream-r19', 'smartbuild-thinset-robot', 'derutu-tile-laying-robot', 'yanling-tile-robot', 'kaifeng-yucheng-automatic-tile-robot', 'bossgoo-intelligent-tile-robot', 'bossgoo-palletizer-tile-robot']) assert.match(images, new RegExp(token));
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

assert.match(app, /CATALOG_ADDITIONS/);
assert.match(app, /EXTRA_PRODUCTS/);
assert.match(app, /premium-product-card/);
assert.match(app, /addToCart/);
assert.match(app, /updateCartUI/);
assert.match(app, /cart-drawer/);
assert.match(app, /КУПИ/);
assert.match(app, /imageSrc/);
assert.match(app, /imageUrlFor/);
assert.match(app, /formatPrice/);
assert.match(app, /ROBOT_PRODUCTS/);
assert.match(app, /product\.description/);
assert.match(app, /videoEmbed/);
assert.match(app, /referenceUrl/);
assert.match(app, /officialUrl/);
assert.match(app, /contact-form/);
assert.doesNotMatch(app, /КОЛМАН ЕООД/);
assert.doesNotMatch(app, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(app, /\+359 88 579 66 13/);

for (const [file, required] of [
  ['products.js', ['SuperFinish 21 Pro HEA', 'SuperFinish 23 Pro Cart HEA', 'ProSpray 3.25 Spraypack Cart', 'SuperFinish 33 Pro', 'FinishControl 4000 18V', 'VectorPro 4 Finger Professional']],
  ['app-v2.js', ['specs', 'formatPrice', 'imageSrc', 'imageUrlFor', 'addToCart', 'updateCartUI', 'КУПИ', 'premium-product-card']],
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

console.log('WAGNER premium storefront runtime contract passed');
