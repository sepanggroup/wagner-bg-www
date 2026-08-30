import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const app = read('app-v2.js');
const packageJson = JSON.parse(read('package.json'));

assert.match(index, /data-lang-switcher/);
assert.match(index, /data-lang="bg"/);
assert.match(index, /data-lang="en"/);
assert.match(index, /i18n\.js/);
assert.match(index, /premium-visuals\.css/);

const i18n = read('i18n.js');
assert.match(i18n, /SUPPORTED_LANGUAGES/);
assert.match(i18n, /bg:/);
assert.match(i18n, /en:/);
assert.match(i18n, /localStorage/);
assert.match(i18n, /wagner-language-changed/);
assert.match(i18n, /document\.documentElement\.lang/);

assert.match(app, /applyLanguage/);
assert.match(app, /wagner-language-changed/);
assert.match(app, /data-i18n/);
assert.match(app, /data-i18n-placeholder/);

assert.match(read('premium-visuals.css'), /premium-product-card/);
assert.match(read('premium-visuals.css'), /product-art/);
assert.match(read('premium-visuals.css'), /@media/);

assert.equal(packageJson.scripts.test, 'node tests/source-integrity.test.mjs && node tests/catalog-quality.test.mjs && node tests/premium-language.test.mjs');

console.log('WAGNER premium visual and language contract passed');
