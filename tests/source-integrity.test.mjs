import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const products = read('products.js');
const robots = read('robot-products.js');
const images = read('image-overrides.js');
const additions = read('catalog-additions.js');
const extras = read('extra-products.js');
const payment = read('payment.js');
const merchant = read('merchant-config.js');
const cart = read('cart.js');
const app = read('app-v2.js');
const premium = read('premium-visuals.css');

assert.match(index, /<html lang="bg">/);
assert.match(index, /<link rel="canonical" href="https:\/\/sepanggroup\.github\.io\/wagner-bg-www\/">/);
assert.match(index, /premium-visuals\.css\?v=/);
assert.match(index, /cart\.css\?v=/);
assert.match(index, /application\/ld\+json/);
assert.match(index, /SEPANG GROUP ЕООД/);
assert.match(index, /data-i18n="hero\.title">Техниката, която<\/span>/);
assert.match(index, /data-i18n="hero\.titleAccent">работи за вас\.<\/em>/);
assert.match(index, /\+359 88 503 9931/);
assert.match(index, /kolmaneood@abv\.bg/i);
assert.match(index, /КУПИ/);
assert.match(index, /cart-drawer/);
assert.match(index, /paypal-button-container/);
assert.match(index, /contact-form/);
assert.match(index, /app-v2\.js/);
assert.match(index, /<small>by КОЛМАН ЕООД<\/small>/);
assert.doesNotMatch(index, /www\.wagner-bg\.shop/);
assert.doesNotMatch(index, /sepanggroupltd@gmail\.com/i);
assert.doesNotMatch(index, /\+359 88 579 66 13/);

assert.match(premium, /\.visual-stamp::before/);
assert.match(premium, /kolman-logo\.svg/);
assert.match(premium, /WAGNER/);

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
assert.doesNotMatch(robots, /КОЛМАН ЕООД/);
assert.doesNotMatch(robots, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(robots, /\+359 88 579 66 13/);

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

assert.match(additions, /WAGNER HeavyCoat 750G Spraypack/);
assert.match(additions, /Bisonte PAZ-7000\/2/);
assert.match(extras, /videoUrl:/);
assert.match(extras, /imageUrl:/);
assert.match(extras, /longDescription:/);
assert.match(extras, /specs:/);

assert.match(merchant, /KOLMAN EOOD/);
assert.match(merchant, /kolmaneood@abv\.bg/i);
assert.match(merchant, /\+359 88 503 9931/);
assert.match(merchant, /PAYPAL_CLIENT_ID/);
assert.doesNotMatch(merchant, /SEPANG GROUP ЕООД/);
assert.doesNotMatch(merchant, /sepanggroupltd@gmail\.com/);
assert.doesNotMatch(merchant, /\+359 88 579 66 13/);

assert.match(payment, /PayPal/);
assert.match(payment, /createOrder/);
assert.match(payment, /merchant-config\.js/);
assert.match(payment, /currency=EUR/);
assert.doesNotMatch(payment, /КОЛМАН ЕООД/);
assert.doesNotMatch(payment, /kolmaneood@abv\.bg/i);
assert.doesNotMatch(payment, /\+359 88 579 66 13/);

assert.match(cart, /addToCart/);
assert.match(cart, /localStorage/);
assert.match(cart, /SEPANG GROUP ЕООД/);
assert.doesNotMatch(cart, /КОЛМАН ЕООД/);
assert.doesNotMatch(cart, /\+359 88 579 66 13/);

assert.match(app, /CATALOG_ADDITIONS/);
assert.match(app, /EXTRA_PRODUCTS/);
assert.match(app, /ROBOT_PRODUCTS/);
assert.match(app, /addToCart/);
assert.match(app, /updateCartUI/);
assert.match(app, /cart-drawer/);
assert.match(app, /product\.buy/);
assert.match(app, /product\.inquiry/);
assert.match(app, /imageSrc/);
assert.match(app, /videoEmbed/);
assert.match(app, /formatPrice/);
assert.match(app, /product\.description/);
assert.match(app, /product\.specs/);
assert.match(app, /contact-form/);

for (const file of ['privacy.html', 'terms.html', 'cookies.html', 'thanks.html']) {
  const html = read(file);
  assert.match(html, /sepanggroupltd@gmail\.com/);
  assert.match(html, /index\.html/);
  assert.doesNotMatch(html, /КОЛМАН ЕООД/);
  assert.doesNotMatch(html, /kolmaneood@abv\.bg/i);
  assert.doesNotMatch(html, /\+359 88 579 66 13/);
}

console.log('WAGNER Bulgarian premium storefront integrity contract passed');
