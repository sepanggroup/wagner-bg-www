# PayPal production setup

The GitHub Pages frontend must never contain a PayPal Client Secret or account password.

## Required architecture

Frontend: GitHub Pages (`wagner-bg-www`)
Payment API: Vercel/Netlify serverless function
PayPal credentials: platform environment variables

## Environment variables

PAYPAL_CLIENT_ID=<public client id>
PAYPAL_CLIENT_SECRET=<regenerated secret>
PAYPAL_ENVIRONMENT=sandbox

Use `live` only after a real production merchant account is verified and tested.

## Checkout flow

1. Frontend sends cart line items to the payment API.
2. API validates product IDs and server-side prices.
3. API creates a PayPal Order in EUR.
4. PayPal approval happens in the browser.
5. API captures the approved Order server-side.
6. API returns the final transaction result.

Never trust a browser-supplied total and never commit secrets to GitHub.
