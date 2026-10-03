import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import { SkipLink } from '@/components/layout/SkipLink';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { publicAsset } from '@/lib/asset';
import { t } from '@/lib/content/ui';
import { SessionProvider } from '@/lib/session/SessionProvider';
import { siteUrl } from '@/lib/site';
import { brand } from '@/theme/tokens';

import '@/styles/globals.css';

/** Lexend (SIL OFL 1.1), servida pelo próprio site. Nenhuma fonte é carregada de terceiros. */
const lexend = localFont({
  src: './fonts/Lexend-Latin-Variable.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-lexend',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${t('appName')} — ${t('appTagline')}`,
    template: `%s | ${t('appName')}`,
  },
  description: t('siteDescription'),
  applicationName: t('appName'),
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: t('appName'), statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: publicAsset('/favicon.ico'), sizes: '32x32' },
      { url: publicAsset('/icons/icon.svg'), type: 'image/svg+xml' },
    ],
    apple: publicAsset('/icons/apple-touch-icon.png'),
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: t('appName'),
    title: t('appName'),
    description: t('siteDescription'),
    // Relativo a metadataBase (siteUrl), que já inclui o subcaminho no GitHub Pages.
    images: [{ url: '/og.png', width: 1200, height: 630, alt: t('appName') }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={lexend.variable}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <SessionProvider>{children}</SessionProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
