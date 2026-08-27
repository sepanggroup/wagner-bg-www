import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const products = read('products.js');
const robots = read('robot-products.js');
const app = read('app.js');
const index = read('index.html');

assert.match(index, /\+359 88 503 9931/);
assert.doesNotMatch(index, /\+359 88 579 66 13/);
assert.match(index, /Техника, която <em>работи за вас\.<\/em>/);
assert.match(app, /КУПИ/);
assert.match(app, /addToCart/);
assert.match(app, /cart-drawer/);
assert.match(app, /imageUrl/);
assert.match(app, /longDescription/);
assert.match(products, /longDescription:/);
assert.match(robots, /longDescription:/);

const allImageUrls = [...products.matchAll(/imageUrl:\s*'([^']+)'/g)].map((m) => m[1]);
const robotImageUrls = [...robots.matchAll(/imageUrl:\s*'([^']+)'/g)].map((m) => m[1]);
const allDescriptions = [...products.matchAll(/longDescription:\s*'([^']+)'/g)].map((m) => m[1]);
const robotDescriptions = [...robots.matchAll(/longDescription:\s*'([^']+)'/g)].map((m) => m[1]);

assert.equal(new Set(allImageUrls).size, allImageUrls.length, 'Core product photography must be unique');
assert.equal(new Set(robotImageUrls).size, robotImageUrls.length, 'Robot photography must be unique');
assert.ok(allDescriptions.every((value) => value.length >= 180), 'Core product descriptions must be detailed in Bulgarian');
assert.ok(robotDescriptions.every((value) => value.length >= 220), 'Robot product descriptions must be detailed in Bulgarian');
assert.ok(robotImageUrls.length >= 10, 'Curated robot catalog must contain at least 10 photographed models');
console.log('WAGNER catalog quality contract passed');
