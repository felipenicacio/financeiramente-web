import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** `reading`: coluna de leitura (lições). `wide`: listas e páginas de entrada. */
  width?: 'reading' | 'wide';
  className?: string;
};

/** Centraliza o conteúdo com margens laterais seguras e largura máxima de leitura. */
export function PageContainer({ children, width = 'wide', className = '' }: Props) {
  const max = width === 'reading' ? 'max-w-[40rem]' : 'max-w-[64rem]';
  return <div className={`mx-auto w-full ${max} px-4 sm:px-6 ${className}`}>{children}</div>;
}
