# Unmess backend

Node service for MongoDB click counters and post-payment email delivery.

## Data model

Each template uses its own database. Every database contains a single `analytics` document with `_id: "clicks"`. A click performs one atomic `$inc`; it does not create an event row.

## Setup

1. Copy `.env.example` to `.env` and fill the secrets.
2. In MongoDB Atlas, allow the backend host's outbound IP. Prefer a fixed egress IP; do not leave `0.0.0.0/0` enabled permanently.
3. Run `npm install`, then `npm start`.
4. Set the storefront build variable `NEXT_PUBLIC_ANALYTICS_API_URL` to this backend's HTTPS origin.

## Deploy

The repository includes `render.yaml` for a Render Blueprint and a `Dockerfile` for any container host. Configure `MONGODB_URI` as a secret on the host; never expose it through a `NEXT_PUBLIC_` variable. After deployment, set the Site build variable `NEXT_PUBLIC_ANALYTICS_API_URL` to the API's public HTTPS origin and republish the storefront.

Run `npm run analytics:init` once after configuring `MONGODB_URI`. It creates one `analytics` document per template database and never resets an existing count.

The delivery endpoint is intentionally private. Call it only after a Razorpay webhook signature and captured payment have been verified.
