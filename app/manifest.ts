import type { MetadataRoute } from 'next';

import { t } from '@/lib/content/ui';
import { brand } from '@/theme/tokens';

export const dynamic = 'force-static';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const publicAsset = (path: string) => `${basePath}${path}`;
const scopedPath = (path = '/') => `${basePath}${path}` || '/';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: scopedPath('/'),
    name: `${t('appName')} — ${t('appTagline')}`,
    short_name: t('appName'),
    description: t('siteDescription'),
    lang: 'pt-BR',
    dir: 'ltr',
    start_url: scopedPath('/'),
    scope: scopedPath('/'),
    display: 'standalone',
    orientation: 'portrait',
    theme_color: brand.themeColor,
    background_color: brand.backgroundColor,
    categories: ['education', 'kids'],
    icons: [
      {
        src: publicAsset('/icons/icon-192.png'),
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: publicAsset('/icons/icon-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: publicAsset('/icons/icon-maskable-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
