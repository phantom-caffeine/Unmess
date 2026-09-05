# Unmess backend

Node service for MongoDB click counters and post-payment email delivery.

## Data model

MongoDB uses one `unmess` database and one `store` collection with exactly four documents, one per template. Each document stores only the template name, protected Notion URL, and click total. A view performs one atomic `$inc` on that document; it never creates an event row. Payment data remains exclusively in Razorpay.

## Setup

1. Copy `.env.example` to `.env` and fill the secrets.
2. In MongoDB Atlas, allow the backend host's outbound IP. Prefer a fixed egress IP; do not leave `0.0.0.0/0` enabled permanently.
3. Run `npm install`, then `npm start`.
4. Set the storefront build variable `NEXT_PUBLIC_ANALYTICS_API_URL` to this backend's HTTPS origin.

## Deploy

The repository includes `render.yaml` for a Render Blueprint and a `Dockerfile` for any container host. Configure `MONGODB_URI` as a secret on the host; never expose it through a `NEXT_PUBLIC_` variable. After deployment, set the Site build variable `NEXT_PUBLIC_ANALYTICS_API_URL` to the API's public HTTPS origin and republish the storefront.

Run `npm run analytics:init` once after configuring `MONGODB_URI`. It upserts the four template documents, removes the obsolete payment document, and never resets existing click totals.

The delivery endpoint is intentionally private. Call it only after a Razorpay webhook signature and captured payment have been verified. Pass the purchased `templateId`; the server resolves its stored Notion duplication link so paid links are never accepted from the browser.

## Razorpay checkout

The storefront uses Standard Checkout through `POST /api/payment/create-order`, verifies the checkout signature through `POST /api/payment/verify`, and accepts signed `payment.captured` events at `POST /api/payment/webhook`. Amounts are calculated on the server. Payment state remains in Razorpay order notes and is never written to MongoDB.

Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and a separate `RAZORPAY_WEBHOOK_SECRET` on the backend host. The frontend receives only the safe Key ID. Configure `NEXT_PUBLIC_ANALYTICS_API_URL` with the public HTTPS backend origin.
