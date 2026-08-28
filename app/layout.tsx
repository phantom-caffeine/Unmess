import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'Forma — Less chaos. More you.',
  description: 'Thoughtfully crafted Notion templates to find your rhythm and make room for what matters.',
  openGraph: { title: 'Forma — Less chaos. More you.', description: 'Thoughtfully crafted Notion templates to find your rhythm and make room for what matters.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Forma — Less chaos. More you.', description: 'Thoughtfully crafted Notion templates to find your rhythm and make room for what matters.', images: ['/og.png'] },
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
