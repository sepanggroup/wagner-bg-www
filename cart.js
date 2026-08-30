import { MERCHANT } from './merchant-config.js';

export const CART_KEY = 'wagnerCart';

export function loadCart(){
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(item => item && item.id && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('wagner-cart-updated', { detail: cart }));
}

export function addToCart(id){
  const cart = loadCart();
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(cart);
}

export function setQuantity(id, quantity){
  const cart = loadCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity = Math.max(0, Number(quantity) || 0);
  saveCart(cart.filter(entry => entry.quantity > 0));
}

export function removeFromCart(id){
  saveCart(loadCart().filter(item => item.id !== id));
}

export function clearCart(){ saveCart([]); }

export function cartCount(){ return loadCart().reduce((sum, item) => sum + item.quantity, 0); }

export function cartSubtotal(productsById){
  return loadCart().reduce((sum, item) => {
    const product = productsById(item.id);
    if (!product || !product.priceKnown || product.priceCurrency !== 'EUR' || !Number.isFinite(product.price)) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}

export function cartHasNonPurchasableItems(productsById){
  return loadCart().some(item => {
    const product = productsById(item.id);
    return !product || !product.priceKnown || product.priceCurrency !== 'EUR' || !Number.isFinite(product.price);
  });
}

export function cartMailtoSubject(){ return encodeURIComponent(`Поръчка WAGNER-BG — ${MERCHANT.legalName}`); }

export function cartMailtoBody(productsById){
  const lines = loadCart().map(item => {
    const product = productsById(item.id);
    if (!product) return null;
    const unit = product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price) ? `€${product.price.toFixed(2)}` : 'Цена по оферта';
    return `${item.quantity} × ${product.name}${product.model ? ` (${product.model})` : ''} — ${unit}`;
  }).filter(Boolean);
  return encodeURIComponent([
    'Здравейте,',
    '',
    'Желая да направя поръчка за:',
    ...lines,
    '',
    'Моля потвърдете наличност, крайна цена и условия за доставка.',
    '',
    MERCHANT.legalName,
    MERCHANT.website
  ].join('\n'));
}
