import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test_webhook_secret';

const { verifyCheckoutSignature, verifyWebhookSignature } = await import('../src/razorpay.js');

test('accepts a valid checkout signature and rejects tampering', () => {
  const orderId = 'order_test123';
  const paymentId = 'pay_test456';
  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  assert.equal(verifyCheckoutSignature({ orderId, paymentId, signature }), true);
  assert.equal(verifyCheckoutSignature({ orderId, paymentId: 'pay_changed', signature }), false);
});

test('validates the untouched webhook body', () => {
  const body = Buffer.from('{"event":"payment.captured"}');
  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body, signature), true);
  assert.equal(verifyWebhookSignature(Buffer.from('{"event":"payment.failed"}'), signature), false);
});
