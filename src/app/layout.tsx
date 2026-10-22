import type { Metadata } from 'next';
import './globals.css';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://appeal-pilot-theta.vercel.app'
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Appeal Pilot — Turn Insurance Denials Into Action',
  description:
    'Turn confusing health insurance denial letters into a plan you can act on today. Upload a letter to get a plain-English breakdown, ready-to-send dispute letter, phone script, and deadline calendar reminder.',
  keywords: [
    'health insurance appeal',
    'insurance denial letter',
    'prior authorization',
    'medical necessity denial',
    'appeal deadline',
    'claim dispute',
  ],
  authors: [{ name: 'Appeal Pilot' }],
  openGraph: {
    title: 'Appeal Pilot — Turn Insurance Denials Into Action',
    description: 'Turn a confusing denial letter into a plan you can act on today.',
    url: SITE_URL,
    siteName: 'Appeal Pilot',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og`,
        width: 1200,
        height: 630,
        alt: 'Appeal Pilot — Turn Insurance Denials Into Action',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appeal Pilot — Turn Insurance Denials Into Action',
    description: 'Turn a confusing denial letter into a plan you can act on today.',
    images: [`${SITE_URL}/og`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
