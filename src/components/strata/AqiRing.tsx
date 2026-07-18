import React from 'react';
import { getAqiTheme } from '../../lib/aqiTheme';

interface AqiRingProps {
  aqi: number;
  status?: string;
  size?: number;
  className?: string;
}

export const AqiRing: React.FC<AqiRingProps> = ({
  aqi,
  status,
  size = 200,
  className = '',
}) => {
  const theme = getAqiTheme(aqi);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const maxAqi = 300;
  const progress = Math.min(aqi / maxAqi, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className={`relative inline-flex items-center justify-center aqi-ring-pulse ${className}`}
      style={{ ['--aqi-pulse' as string]: `${theme.pulseMs}ms`, width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 8px ${theme.glow})` }}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data text-[10px] uppercase tracking-widest text-text-muted mb-1">Basin AQI</span>
        <span
          className="font-display font-extrabold text-5xl leading-none tracking-tighter"
          style={{ color: theme.color }}
        >
          {aqi}
        </span>
        {status && (
          <span className="font-data text-[10px] mt-2 uppercase tracking-wider" style={{ color: theme.color }}>
            {status}
          </span>
        )}
      </div>
      <div
        className="absolute inset-2 rounded-full opacity-20 blur-xl pointer-events-none"
        style={{ background: theme.color }}
      />
    </div>
  );
};
