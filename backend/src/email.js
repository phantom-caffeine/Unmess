import nodemailer from 'nodemailer';
import { required } from './config.js';

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      pool: true,
      host: required('SMTP_HOST'),
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: required('SMTP_USER'), pass: required('SMTP_PASS') },
    });
  }
  return transporter;
}

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export async function sendTemplateDelivery({ email, productName, downloadUrl, orderId }) {
  const safeName = escapeHtml(productName);
  const safeUrl = escapeHtml(downloadUrl);
  const safeOrder = escapeHtml(orderId);
  return getTransporter().sendMail({
    from: required('MAIL_FROM'),
    to: email,
    subject: `Your ${productName} is ready ✦`,
    text: `Your ${productName} is ready. Open it here: ${downloadUrl} Order: ${orderId}`,
    html: `<!doctype html><html><body style="margin:0;background:#faf6f0;color:#2b2b2b;font-family:Arial,sans-serif">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf6f0;padding:32px 16px"><tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffdf9;border:1px solid #e8dfd5;border-radius:22px;overflow:hidden">
        <tr><td style="padding:34px 42px 18px;font-family:Georgia,serif;font-size:36px;color:#6b4e71">forma ✳</td></tr>
        <tr><td style="padding:10px 42px 38px"><div style="font-size:11px;letter-spacing:2px;color:#8d7f76">A LITTLE MORE POSSIBILITY</div>
          <h1 style="font-family:Georgia,serif;font-size:38px;line-height:1.12;font-weight:400;margin:18px 0;color:#2b2b2b">Your fresh start<br>is ready.</h1>
          <p style="font-size:15px;line-height:1.75;color:#726962;margin:0 0 26px">Thank you for choosing <strong>${safeName}</strong>. Duplicate it into your Notion workspace and make it completely yours.</p>
          <a href="${safeUrl}" style="display:inline-block;background:#6b4e71;color:#fff;text-decoration:none;padding:16px 24px;border-radius:10px;font-size:14px">Open your template →</a>
          <p style="font-size:12px;line-height:1.7;color:#9a8e85;margin-top:28px">Order ${safeOrder}<br>If the button does not work, copy this link:<br><a href="${safeUrl}" style="color:#6b4e71">${safeUrl}</a></p>
        </td></tr>
        <tr><td style="background:#eee9e1;padding:20px 42px;font-size:11px;color:#81766e">Made with a little intention. © Forma</td></tr>
      </table></td></tr></table></body></html>`,
  });
}
