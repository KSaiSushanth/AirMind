import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'rounded-2xl border transition-all duration-300',
      variant === 'default' && 'bg-surface-card border-border-subtle',
      variant === 'glass' && 'glass-panel',
      variant === 'elevated' && 'bg-surface-elevated border-border-subtle shadow-card',
      hover && 'hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5',
      paddingMap[padding],
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('flex items-center justify-between border-b border-border-subtle pb-4 mb-5', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('font-display font-semibold text-text-primary text-sm tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-text-muted text-xs mt-1', className)} {...props}>
    {children}
  </p>
);
