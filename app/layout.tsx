import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['500', '600'] });

const SITE = process.env.VERCEL ? 'https://getvaultly.vercel.app/' : 'https://thekirankumarv.github.io/Vaultly-website/';
const title = 'Vaultly: cards and documents wallet for Android';
const description = 'Payment cards, ID cards and documents for you and your family, read and encrypted on your phone. Fingerprint to reveal, encrypted backups, Ask Vaultly. Free, no ads, no sign-up.';

export const metadata: Metadata = {
  title,
  description,
  applicationName: 'Vaultly',
  keywords: ['card wallet', 'document wallet', 'ID card', 'driving licence', 'Aadhaar', 'PAN', 'credit card', 'encrypted', 'Android', 'offline', 'family'],
  openGraph: { title, description, url: SITE, siteName: 'Vaultly', type: 'website', images: [{ url: `${SITE}og.png`, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE}og.png`] },
};

export const viewport: Viewport = { themeColor: '#07070C', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
