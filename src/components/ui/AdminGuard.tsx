import React from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminGuardProps {
  /** The actual action button/element — shown to admin, replaced by lock for user */
  children: React.ReactNode;
  /** Optional tooltip label */
  label?: string;
  /** Render as inline (default) or block */
  block?: boolean;
}

/**
 * Wraps any admin-only action.
 * Admin sees children normally.
 * User sees a disabled lock button in its place.
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  label = 'Admin only',
  block = false,
}) => {
  const { userRole } = useApp();

  if (userRole === 'admin') return <>{children}</>;

  return (
    <div
      className={block ? 'w-full' : 'inline-flex'}
      title={label}
    >
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          text-[11px] font-semibold cursor-not-allowed select-none
          ${block ? 'w-full justify-center' : ''}
        `}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{label}</span>
      </div>
    </div>
  );
};
