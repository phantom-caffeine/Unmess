import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { incrementTemplateClicks, getAllClickCounts, getTemplate } from './mongo.js';
import { sendTemplateDelivery } from './email.js';
import { required, templates } from './config.js';
import { createOrder, fulfilCapturedOrder, verifyCheckoutSignature, verifyWebhookSignature } from './razorpay.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.post('/api/payment/webhook', express.raw({ type: 'application/json', limit: '128kb' }), async (req, res) => {
  try {
    if (!verifyWebhookSignature(req.body, req.get('x-razorpay-signature'))) return res.status(400).json({ error: 'Invalid webhook signature' });
    const event = JSON.parse(req.body.toString('utf8'));
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) await fulfilCapturedOrder(payment.order_id, payment.id);
    }
    res.json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
const frontendOrigin = required('FRONTEND_ORIGIN').replace(/\/+$/, '');
app.use(cors({ origin: frontendOrigin, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '32kb' }));

const buckets = new Map();
app.use('/api/', (req, res, next) => {
  const now = Date.now();
  const key = req.ip || 'unknown';
  const bucket = buckets.get(key) || { count: 0, reset: now + 60_000 };
  if (now > bucket.reset) Object.assign(bucket, { count: 0, reset: now + 60_000 });
  bucket.count += 1;
  buckets.set(key, bucket);
  if (bucket.count > 120) return res.status(429).json({ error: 'Too many requests' });
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/payment/create-order', async (req, res, next) => {
  try {
    const order = await createOrder(req.body || {});
    res.set('Cache-Control', 'no-store').json(order);
  } catch (error) {
    if (error instanceof Error && /bag|template|email/i.test(error.message)) return res.status(400).json({ error: error.message });
    next(error);
  }
});

app.post('/api/payment/verify', async (req, res, next) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
    if (!orderId || !paymentId || !signature || !verifyCheckoutSignature({ orderId, paymentId, signature })) return res.status(400).json({ error: 'Payment verification failed' });
    const result = await fulfilCapturedOrder(orderId, paymentId);
    if (result.pending) return res.status(202).json({ verified: true, pending: true });
    res.set('Cache-Control', 'no-store').json({ verified: true, links: result.links });
  } catch (error) { next(error); }
});

app.post('/api/clicks/:templateId', async (req, res, next) => {
  try {
    if (!templates[req.params.templateId]) return res.status(404).json({ error: 'Unknown template' });
    const result = await incrementTemplateClicks(req.params.templateId);
    res.set('Cache-Control', 'no-store').json({ templateId: req.params.templateId, clicks: result.count });
  } catch (error) { next(error); }
});

app.get('/api/admin/clicks', async (req, res, next) => {
  try {
    if (req.get('authorization') !== `Bearer ${required('ANALYTICS_ADMIN_TOKEN')}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.set('Cache-Control', 'no-store').json({ templates: await getAllClickCounts() });
  } catch (error) { next(error); }
});

app.post('/api/delivery/send', async (req, res, next) => {
  try {
    if (req.get('authorization') !== `Bearer ${required('DELIVERY_API_TOKEN')}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { email, templateId, orderId } = req.body || {};
    const template = await getTemplate(templateId);
    if (!email || !templateId || !template || !orderId) return res.status(400).json({ error: 'Missing or unknown delivery fields' });
    const productName = template.name;
    const downloadUrl = template.url;
    const parsedUrl = new URL(downloadUrl);
    if (parsedUrl.protocol !== 'https:') return res.status(400).json({ error: 'Download URL must use HTTPS' });
    await sendTemplateDelivery({ email, productName, downloadUrl, orderId });
    res.json({ sent: true });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(Number(process.env.PORT || 8080), () => console.log('Unmess backend is ready'));
