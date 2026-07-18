import React from 'react';

const STREAM_COUNT = 14;

export const WindStreams: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
    {Array.from({ length: STREAM_COUNT }).map((_, i) => (
      <div
        key={i}
        className="wind-stream absolute h-px bg-gradient-to-r from-transparent via-wind/50 to-transparent"
        style={{
          top: `${8 + i * 6.5}%`,
          left: 0,
          width: `${120 + (i % 4) * 40}px`,
          animationDuration: `${8 + (i % 5) * 2}s`,
          animationDelay: `${-i * 1.2}s`,
          opacity: 0.15 + (i % 3) * 0.1,
        }}
      />
    ))}
  </div>
);
