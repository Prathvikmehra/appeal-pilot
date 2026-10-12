import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Appeal Pilot — Turn Insurance Denials Into Action',
  description: 'Upload a health insurance denial letter to get a plain-English explanation, appeal letter, phone script, and calendar reminder.',
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
