import crypto from 'node:crypto';
import { required, templates } from './config.js';
import { getTemplate } from './mongo.js';
import { sendTemplateDelivery } from './email.js';

const apiBase = 'https://api.razorpay.com/v1';
const deliveryLocks = new Set();

function safeEqual(left, right) {
  const a = Buffer.from(left || '', 'utf8');
  const b = Buffer.from(right || '', 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function razorpayRequest(path, options = {}) {
  const auth = Buffer.from(`${required('RAZORPAY_KEY_ID')}:${required('RAZORPAY_KEY_SECRET')}`).toString('base64');
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.description || `Razorpay request failed (${response.status})`);
  return data;
}

function normalizeItems(items) {
  if (!Array.isArray(items) || !items.length) throw new Error('Your bag is empty');
  const ids = [...new Set(items.map(String))];
  if (ids.some(id => !templates[id])) throw new Error('Unknown template in bag');
  return { checkoutIds: ids, deliveryIds: ids, amount: ids.reduce((sum, id) => sum + templates[id].price, 0) };
}

export async function createOrder({ items, email }) {
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw new Error('Enter a valid delivery email');
  const selection = normalizeItems(items);
  const order = await razorpayRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount: selection.amount * 100,
      currency: 'INR',
      receipt: `unmess_${Date.now()}`,
      notes: { email: String(email).trim().toLowerCase(), items: selection.checkoutIds.join(','), delivery_status: 'pending' },
    }),
  });
  return { keyId: required('RAZORPAY_KEY_ID'), orderId: order.id, amount: order.amount, currency: order.currency, name: 'Unmess', description: `${selection.checkoutIds.length} Unmess template${selection.checkoutIds.length > 1 ? 's' : ''}` };
}

export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  const expected = crypto.createHmac('sha256', required('RAZORPAY_KEY_SECRET')).update(`${orderId}|${paymentId}`).digest('hex');
  return safeEqual(expected, signature);
}

export function verifyWebhookSignature(rawBody, signature) {
  const expected = crypto.createHmac('sha256', required('RAZORPAY_WEBHOOK_SECRET')).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
}

async function resolveDelivery(order) {
  const checkoutIds = String(order.notes?.items || '').split(',').filter(Boolean);
  const deliveryIds = checkoutIds;
  if (!deliveryIds.length || deliveryIds.some(id => !templates[id])) throw new Error('Order has invalid delivery items');
  const records = await Promise.all(deliveryIds.map(getTemplate));
  if (records.some(record => !record?.url)) throw new Error('A purchased template is unavailable');
  return records.map(record => ({ templateId: record.templateId, name: record.name, url: record.url }));
}

export async function fulfilCapturedOrder(orderId, paymentId) {
  if (deliveryLocks.has(orderId)) return { pending: true, links: [] };
  deliveryLocks.add(orderId);
  try {
    const [order, payment] = await Promise.all([razorpayRequest(`/orders/${orderId}`), razorpayRequest(`/payments/${paymentId}`)]);
    if (payment.order_id !== order.id || payment.status !== 'captured' || order.status !== 'paid' || payment.amount !== order.amount || payment.currency !== order.currency) throw new Error('Payment is not fully captured');
    const links = await resolveDelivery(order);
    if (order.notes?.delivery_status !== 'sent') {
      const email = order.notes?.email;
      if (!email) throw new Error('Order has no delivery email');
      await Promise.all(links.map(item => sendTemplateDelivery({ email, productName: item.name, downloadUrl: item.url, orderId })));
      await razorpayRequest(`/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ notes: { ...order.notes, delivery_status: 'sent', payment_id: paymentId } }) });
    }
    return { pending: false, links };
  } finally {
    deliveryLocks.delete(orderId);
  }
}
