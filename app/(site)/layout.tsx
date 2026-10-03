import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';

/** Páginas de navegação (início, idades, jornadas, módulos). As lições têm layout próprio. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
