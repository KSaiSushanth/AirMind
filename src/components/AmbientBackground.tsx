import React from 'react';

// Each stream: top position, animation duration, delay, opacity, width
const WIND_STREAMS = [
  { top: '8%',  dur: '18s', delay: '0s',    opacity: 0.18, width: '55%' },
  { top: '19%', dur: '24s', delay: '3.5s',  opacity: 0.12, width: '70%' },
  { top: '33%', dur: '15s', delay: '1.2s',  opacity: 0.20, width: '45%' },
  { top: '47%', dur: '28s', delay: '6s',    opacity: 0.09, width: '80%' },
  { top: '58%', dur: '20s', delay: '2s',    opacity: 0.15, width: '60%' },
  { top: '71%', dur: '13s', delay: '4.8s',  opacity: 0.22, width: '40%' },
  { top: '82%', dur: '22s', delay: '0.8s',  opacity: 0.10, width: '65%' },
  { top: '91%', dur: '17s', delay: '7s',    opacity: 0.14, width: '50%' },
];

export const AmbientBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>

    {/* Deep boundary-layer purple glow — bottom left */}
    <div
      className="absolute bottom-0 left-0 w-[50%] h-[55%] opacity-30"
      style={{
        background: 'radial-gradient(ellipse at bottom left, #2D1B4E 0%, transparent 70%)',
      }}
    />

    {/* Night basin fade — top right */}
    <div
      className="absolute top-0 right-0 w-[45%] h-[50%] opacity-20"
      style={{
        background: 'radial-gradient(ellipse at top right, #48CAE4 0%, transparent 70%)',
      }}
    />

    {/* Subtle grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(72,202,228,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(72,202,228,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />

    {/* Wind stream lines */}
    {WIND_STREAMS.map((s, i) => (
      <div
        key={i}
        className="wind-stream absolute left-0 h-px"
        style={{
          top: s.top,
          width: s.width,
          opacity: s.opacity,
          animationDuration: s.dur,
          animationDelay: s.delay,
          background: `linear-gradient(90deg, transparent 0%, #48CAE4 30%, #A8E06C 70%, transparent 100%)`,
        }}
      />
    ))}

    {/* Clean-air accent — very subtle center bloom */}
    <div
      className="absolute top-[35%] left-[40%] w-[30%] h-[30%] opacity-[0.06]"
      style={{
        background: 'radial-gradient(ellipse, #A8E06C 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />
  </div>
);
