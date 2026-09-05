export const templates = {
  'editors-desk': { name: 'The Editor’s Desk', url: 'https://sky-rhythm-395.notion.site/The-Editor-s-Desk-3c7b16643a138094b87dd575235c2924?source=copy_link' },
  'engineers-command-center': { name: 'The Engineer’s Command Center', url: 'https://sky-rhythm-395.notion.site/The-Engineer-s-Command-Center-3d2b16643a13816d8fb0e2d33b1f12be?source=copy_link' },
  'second-brain-that-doesnt-suck': { name: 'Second Brain That Doesn’t Suck', url: 'https://sky-rhythm-395.notion.site/Second-Brain-That-Doesn-t-Suck-3d0b16643a138164a086d57328bdd160?source=copy_link' },
  'where-the-fck-is-my-money': { name: 'Where The F*ck Is My Money?', url: 'https://sky-rhythm-395.notion.site/Where-The-F-ck-Is-My-Money-3d2b16643a1381af9b38cc431572dd50?source=copy_link' },
};

export const payment = { provider: 'Razorpay', paymentUrl: 'https://razorpay.me/@unmess', currency: 'INR', templatePrice: 499 };

export function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
