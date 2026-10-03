import Link from 'next/link';

import { Brand } from '@/components/ui/Brand';
import { Icon } from '@/components/ui/Icon';
import { t } from '@/lib/content/ui';

import { PageContainer } from './PageContainer';

type Props = {
  /** Link de volta para a tela anterior do fluxo. */
  back?: { href: string; label: string };
};

export function AppHeader({ back }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-background/90 backdrop-blur-md">
      <PageContainer className="flex h-16 items-center justify-between gap-3">
        <Link href="/" className="rounded-xl" aria-label={`${t('appName')}: início`}>
          <Brand />
        </Link>
        {back ? (
          <Link
            href={back.href}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-label font-medium text-ink-soft hover:bg-slate-100"
          >
            <Icon name="arrow-left" className="size-4" />
            {back.label}
          </Link>
        ) : null}
      </PageContainer>
    </header>
  );
}
