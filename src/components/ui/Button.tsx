import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-glow hover:shadow-glow-strong hover:brightness-110 border-0',
  secondary: 'bg-surface-muted text-text-primary border border-border-subtle hover:border-border-hover hover:bg-surface-elevated',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-muted border border-transparent',
  outline: 'bg-transparent text-text-primary border border-border-subtle hover:border-cyan-500/40 hover:bg-cyan-500/5',
};

const sizes = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);
