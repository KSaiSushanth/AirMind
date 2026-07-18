import React from 'react';
import { cn } from '../../lib/utils';
import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  footer?: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'red' | 'violet';
  className?: string;
}

const accentColors = {
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  violet: 'text-violet-400',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  footer,
  accent = 'cyan',
  className,
}) => (
  <Card hover className={cn('flex flex-col justify-between min-h-[148px]', className)}>
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-wider font-medium text-text-muted">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-muted border border-border-subtle flex items-center justify-center">
            <Icon className={cn('w-4 h-4', accentColors[accent])} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-text-primary tracking-tight">{value}</span>
        {unit && <span className="text-sm text-text-muted font-medium">{unit}</span>}
      </div>
    </div>
    {footer && (
      <div className="mt-4 pt-3.5 border-t border-border-subtle">{footer}</div>
    )}
  </Card>
);
