export type AqiBand = 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'hazardous';

export interface AqiTheme {
  band: AqiBand;
  label: string;
  color: string;
  glow: string;
  muted: string;
  pulseMs: number;
}

export function getAqiBand(aqi: number): AqiBand {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  return 'hazardous';
}

export function getAqiTheme(aqi: number): AqiTheme {
  const band = getAqiBand(aqi);
  const themes: Record<AqiBand, AqiTheme> = {
    good: {
      band,
      label: 'Good',
      color: '#A8E06C',
      glow: 'rgba(168, 224, 108, 0.35)',
      muted: 'rgba(168, 224, 108, 0.12)',
      pulseMs: 3200,
    },
    moderate: {
      band,
      label: 'Moderate',
      color: '#FFB627',
      glow: 'rgba(255, 182, 39, 0.35)',
      muted: 'rgba(255, 182, 39, 0.12)',
      pulseMs: 2800,
    },
    'unhealthy-sensitive': {
      band,
      label: 'Unhealthy (Sensitive)',
      color: '#E85D04',
      glow: 'rgba(232, 93, 4, 0.4)',
      muted: 'rgba(232, 93, 4, 0.14)',
      pulseMs: 2400,
    },
    unhealthy: {
      band,
      label: 'Unhealthy',
      color: '#DC2F02',
      glow: 'rgba(220, 47, 2, 0.45)',
      muted: 'rgba(220, 47, 2, 0.16)',
      pulseMs: 2000,
    },
    hazardous: {
      band,
      label: 'Hazardous',
      color: '#9B5DE5',
      glow: 'rgba(45, 27, 78, 0.6)',
      muted: 'rgba(155, 93, 229, 0.18)',
      pulseMs: 1600,
    },
  };
  return themes[band];
}

export function aqiThemeToCssVars(theme: AqiTheme): Record<string, string> {
  return {
    ['--aqi-color' as string]: theme.color,
    ['--aqi-glow' as string]: theme.glow,
    ['--aqi-muted' as string]: theme.muted,
    ['--aqi-pulse' as string]: `${theme.pulseMs}ms`,
  };
}

/** Inversion / stagnation risk — show amber curtain when budget heavily used or AQI high */
export function showInversionCurtain(aqi: number, budgetPercentUsed: number): boolean {
  return aqi > 100 || budgetPercentUsed > 65;
}

export function getBadgeVariant(aqi: number): 'success' | 'warning' | 'danger' | 'hazard' {
  if (aqi <= 50) return 'success';
  if (aqi <= 100) return 'warning';
  if (aqi <= 150) return 'danger';
  return 'hazard';
}
