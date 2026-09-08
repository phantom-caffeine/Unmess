import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  metadataBase: new URL('https://unmess-eta.vercel.app'),
  title: 'Unmess',
  description: 'Thoughtfully crafted Notion templates to find your rhythm and make room for what matters.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: { title: 'Unmess — Less chaos. More you.', description: 'Thoughtfully crafted Notion templates to find your rhythm and make room for what matters.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Unmess — Less chaos. More you.', description: 'Thoughtfully crafted Notion templates to find your rhythm and make room for what matters.', images: ['/og.png'] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
