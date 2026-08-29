import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { incrementTemplateClicks, getAllClickCounts } from './mongo.js';
import { sendTemplateDelivery } from './email.js';
import { required, templates } from './config.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: required('FRONTEND_ORIGIN'), methods: ['GET', 'POST'] }));
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
    const { email, productName, downloadUrl, orderId } = req.body || {};
    if (!email || !productName || !downloadUrl || !orderId) return res.status(400).json({ error: 'Missing delivery fields' });
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
