import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'quiet';

const base =
  'inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-label font-semibold ' +
  'transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out ' +
  'active:scale-[0.98] select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-white shadow-raised hover:bg-ink-soft ' +
    'disabled:bg-slate-200 disabled:text-ink-muted disabled:shadow-none disabled:active:scale-100',
  secondary:
    'bg-surface text-ink ring-2 ring-inset ring-line-strong hover:ring-ink-muted ' +
    'disabled:opacity-50',
  quiet: 'min-h-12 px-3 text-ink-soft hover:bg-slate-100',
};

type CommonProps = {
  variant?: Variant;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  block?: boolean;
  children: ReactNode;
  className?: string;
};

function classes({
  variant = 'primary',
  block,
  className,
}: Pick<CommonProps, 'variant' | 'block' | 'className'>) {
  return [base, variants[variant], block ? 'w-full' : '', className ?? ''].join(' ');
}

function Content({
  icon,
  iconPosition = 'end',
  children,
}: Pick<CommonProps, 'icon' | 'iconPosition' | 'children'>) {
  return (
    <>
      {icon && iconPosition === 'start' ? <Icon name={icon} /> : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? <Icon name={icon} /> : null}
    </>
  );
}

/** Botão de ação. Área de toque mínima de 56px (C1). */
export function Button(props: CommonProps & Omit<ComponentProps<'button'>, 'children'>) {
  const {
    variant,
    icon,
    iconPosition,
    block,
    children,
    className,
    type = 'button',
    ...rest
  } = props;
  return (
    <button type={type} className={classes({ variant, block, className })} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  );
}

/** Mesmo visual do botão, para navegação entre páginas. */
export function ButtonLink(props: CommonProps & { href: string }) {
  const { variant, icon, iconPosition, block, children, className, href } = props;
  return (
    <Link href={href} className={classes({ variant, block, className })}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </Link>
  );
}

export const PrimaryButton = (props: Parameters<typeof Button>[0]) => (
  <Button {...props} variant="primary" />
);
export const SecondaryButton = (props: Parameters<typeof Button>[0]) => (
  <Button {...props} variant="secondary" />
);
