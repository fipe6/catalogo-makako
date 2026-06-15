import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Makako Fit | Suplementos Deportivos Chile',
  description:
    'Catálogo oficial de suplementos Makako Fit. Pre-entrenos, creatinas, proteínas y más. Envíos a todo Chile.',
  keywords: 'suplementos deportivos, proteínas, creatina, pre-entreno, Chile, Makako Fit',
  openGraph: {
    title: 'Makako Fit | Suplementos Deportivos Chile',
    description:
      'Catálogo oficial de suplementos Makako Fit. Pre-entrenos, creatinas, proteínas y más. Envíos a todo Chile.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
