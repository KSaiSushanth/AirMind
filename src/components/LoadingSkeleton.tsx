import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse p-8 max-w-[1600px] mx-auto">
      <div className="h-24 skeleton-shimmer rounded-2xl border border-border-subtle" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 skeleton-shimmer rounded-2xl border border-border-subtle" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[480px] skeleton-shimmer rounded-2xl border border-border-subtle" />
        <div className="h-[480px] skeleton-shimmer rounded-2xl border border-border-subtle" />
      </div>

      <div className="h-72 skeleton-shimmer rounded-2xl border border-border-subtle" />
    </div>
  );
};
export default LoadingSkeleton;
