import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'live';
}

const variants = {
  default: 'bg-surface-muted text-text-secondary border-border-subtle',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border',
      variants[variant],
      className
    )}
    {...props}
  >
    {variant === 'live' && (
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    )}
    {children}
  </span>
);
