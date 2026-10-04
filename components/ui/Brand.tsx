import { publicAsset } from '@/lib/asset';
import { t } from '@/lib/content/ui';

/**
 * Logotipo Econominho: wordmark individual aprovado (v2), que já contém o "E"
 * estilizado. Versão reduzida do mesmo arquivo para o cabeçalho
 * (public/econominho/logo/wordmark-v2-header.png).
 */
export function Brand({ className = 'h-9' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- exportação estática, arquivo local
    <img
      src={publicAsset('/econominho/logo/wordmark-v2-header.png')}
      alt={t('appName')}
      width={640}
      height={166}
      className={`${className} w-auto`}
      decoding="async"
    />
  );
}
