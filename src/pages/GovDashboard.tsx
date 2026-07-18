import React from 'react';
import { useApp } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  Wind, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, BarChart3, Activity
} from 'lucide-react';
import { AirMap as LeafletMap } from '../components/MapContainer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// AQI breathing ring SVG overlay
const AqiRing: React.FC<{ aqi: number; color: string }> = ({ aqi, color }) => (
  <div className="relative flex items-center justify-start gap-4">
    {/* Pulsing glow behind the number */}
    <div className="relative flex-shrink-0">
      <svg
        className="aqi-ring-pulse absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
        viewBox="0 0 64 64"
        style={{ overflow: 'visible' }}
      >
        <circle
          cx="32" cy="32" r="28"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.25"
        />
        <circle
          cx="32" cy="32" r="20"
          fill="none"
          stroke={color}
          strokeWidth="0.75"
          opacity="0.12"
        />
      </svg>
      <span
        className="relative z-10 text-4xl font-display font-bold tracking-tight"
        style={{ color }}
      >
        {aqi}
      </span>
    </div>
    <span className="text-sm text-text-muted font-mono">AQI</span>
  </div>
);

export const GovDashboard: React.FC = () => {
  const { currentCity, activeAlerts, dashboardData, isLoading } = useApp();
  const fallbackCity = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;

  const displayAqi      = dashboardData?.overallAqi ?? fallbackCity.overallAqi;
  const displayStatus   = dashboardData?.status ?? fallbackCity.status;
  const displayPollutant = dashboardData?.primaryPollutant ?? fallbackCity.primaryPollutant;
  const displayPercent  = dashboardData?.budget?.availablePercent ?? 68;
  const displayUsed     = dashboardData?.budget?.usedTons ?? 285;
  const displayCapacity = dashboardData?.budget?.capacityTons ?? 420;
  const riskTitle       = dashboardData?.budget?.riskLevel ?? 'Stagnation Risk Alert';

  const logs = dashboardData?.recentLogs || [
    '[System] CAAQMS registry online. Telemetry polling active.',
    '[Twin] SCM prediction grid calibrated to current weather index.',
    '[Enforcement] Smart signal adaptive timing loops loaded.',
  ];

  // Strata palette AQI color
  const getAqiColor = (aqi: number) =>
    aqi <= 100 ? '#A8E06C' : aqi <= 150 ? '#FFB627' : '#E85D04';

  const aqiColor = getAqiColor(displayAqi);

  const getStatusBadge = (aqi: number) => {
    if (aqi <= 50)  return 'success' as const;
    if (aqi <= 100) return 'warning' as const;
    return 'danger' as const;
  };

  const chartData = fallbackCity.historicalAqi.map((aqi: number, index: number) => ({
    hour: `H-${14 - index}`,
    aqi,
    threshold: 100,
  }));

  if (isLoading) return <LoadingSkeleton />;

  const localAlerts = activeAlerts.filter(
    (a) => a.city === currentCity && a.status === 'active'
  );

  return (
    <div
      className="p-6 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto"
      style={{ '--aqi-color': aqiColor } as React.CSSProperties}
    >
      {/* ── Banner ── */}
      <Card variant="glass" padding="lg" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-semibold text-lg text-text-primary tracking-tight">
            Active Environmental Registry
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Spatiotemporal sensors, carrying capacities, and emission inventories — live.
          </p>
        </div>
        <Badge variant="live">Command Active</Badge>
      </Card>

      {/* ── Map + Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="lg" className="lg:col-span-2 flex flex-col h-[500px]">
          <CardHeader>
            <div>
              <CardTitle>AeroPath Command Map</CardTitle>
              <CardDescription>CAAQMS monitoring and spatiotemporal plumes</CardDescription>
            </div>
            <Badge variant="live">Live Feed</Badge>
          </CardHeader>
          <div className="flex-grow overflow-hidden rounded-xl border border-border-subtle relative">
            <LeafletMap />
            {/* Radar sweep overlay — one time on mount */}
            <div
              className="radar-sweep absolute inset-0 pointer-events-none rounded-xl"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(72,202,228,0.08) 30deg, transparent 60deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </div>
        </Card>

        <Card padding="lg" className="flex flex-col h-[500px]">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#48CAE4]" />
              <CardTitle>Registry Feed</CardTitle>
            </div>
          </CardHeader>

          <div className="flex-grow overflow-y-auto -mx-2 px-2">
            {logs.map((log: string, index: number) => {
              const parts = log.split(']');
              const agent = parts[0] ? parts[0].replace('[', '') : 'Agent';
              const message = parts[1] || log;
              return (
                <div key={index} className="py-3 border-b border-border-subtle last:border-0">
                  <span className="font-mono text-[10px] font-semibold text-[#48CAE4]/80 uppercase tracking-wider">
                    {agent}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1">{message.trim()}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border-subtle pt-5 mt-4">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-medium text-text-muted">Carrying quota</span>
              <span className="font-display font-bold text-sm" style={{ color: aqiColor }}>
                {displayPercent}%
              </span>
            </div>
            <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${displayPercent}%`,
                  background: `linear-gradient(90deg, ${aqiColor} 0%, ${aqiColor}99 100%)`,
                }}
              />
            </div>
            <p className="font-mono text-[11px] text-text-muted mt-2">
              {displayUsed} / {displayCapacity} tons used
            </p>
          </div>
        </Card>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* AQI with breathing ring */}
        <Card hover className="flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          {/* Background ambient tint */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top left, ${aqiColor} 0%, transparent 70%)` }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider font-medium text-text-muted">
                Basin AQI Index
              </span>
            </div>
            <AqiRing aqi={displayAqi} color={aqiColor} />
          </div>
          <div className="mt-4 pt-3.5 border-t border-border-subtle relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Status</span>
              <Badge variant={getStatusBadge(displayAqi)} className="capitalize">{displayStatus}</Badge>
            </div>
          </div>
        </Card>

        {/* AeroBudget */}
        <Card hover className="flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider font-medium text-text-muted">
                AeroBudget Limit
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-[#48CAE4] tracking-tight">
                {displayPercent}%
              </span>
              <span className="text-sm text-text-muted font-medium">used</span>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Inventory</span>
              <span className="font-mono text-xs font-semibold text-text-primary">
                {displayUsed}/{displayCapacity} T
              </span>
            </div>
          </div>
        </Card>

        {/* Primary Pollutant */}
        <Card hover className="flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider font-medium text-text-muted">
                Target Pollutant
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-text-primary tracking-tight">
                {displayPollutant}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-border-subtle">
            <p className="text-xs text-text-muted">Dominant fine particulates in inversion bounds</p>
          </div>
        </Card>

        {/* Stagnation Risk */}
        <Card hover className="flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top left, #FFB627 0%, transparent 70%)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider font-medium text-text-muted">
                Stagnation Risk
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-muted border border-border-subtle flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#FFB627]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-[#FFB627] tracking-tight">Elevated</span>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-border-subtle relative z-10">
            <p className="text-xs text-text-muted leading-relaxed">
              {riskTitle} — PBL contracting, limiting dispersion.
            </p>
          </div>
        </Card>
      </div>

      {/* ── 72-Hour Chart ── */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#48CAE4]" />
            <CardTitle>72-Hour Causal Projections</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded-full bg-[#48CAE4]" />
              <span className="font-mono text-[10px] text-text-muted">AQI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded-full bg-[#FFB627] opacity-60" style={{ borderTop: '1px dashed #FFB627' }} />
              <span className="font-mono text-[10px] text-text-muted">Threshold</span>
            </div>
          </div>
        </CardHeader>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#48CAE4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#48CAE4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#5A6A82" fontSize={11} tickLine={false} axisLine={false} fontFamily="IBM Plex Mono" />
              <YAxis stroke="#5A6A82" fontSize={11} tickLine={false} axisLine={false} fontFamily="IBM Plex Mono" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,14,23,0.96)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono',
                  color: '#E8EDF5',
                }}
              />
              <ReferenceLine y={100} stroke="#FFB627" strokeDasharray="4 4" strokeOpacity={0.5} />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#48CAE4"
                strokeWidth={2}
                fill="url(#aqiGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#48CAE4', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── AI Recommendations ── */}
      <Card padding="lg">
        <CardHeader className="mb-5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#48CAE4]" />
            <CardTitle>Preemptive AI Recommendations</CardTitle>
          </div>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-surface-muted border border-border-subtle flex gap-4 hover:border-[#A8E06C]/30 hover:bg-[#A8E06C]/5 transition-all duration-200 group">
            <ShieldCheck className="w-5 h-5 text-[#A8E06C] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-display font-semibold text-text-primary mb-1">
                Dynamic Logistics Corridor Adjustment
              </h5>
              <p className="text-sm text-text-secondary leading-relaxed">
                Reroute container fleet to Eastern Peripheral Expressway. Expected PM2.5 reduction: 14% within 6 hours.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface-muted border border-border-subtle flex gap-4 hover:border-[#48CAE4]/30 hover:bg-[#48CAE4]/5 transition-all duration-200 group">
            <Wind className="w-5 h-5 text-[#48CAE4] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-display font-semibold text-text-primary mb-1">
                Boundary Layer Compaction Warning
              </h5>
              <p className="text-sm text-text-secondary leading-relaxed">
                PBL expected to contract to 280m by 18:00. Restrict heavy industrial combustion stacks immediately.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Intervention Efficiency Table ── */}
      <Card padding="lg" className="overflow-hidden">
        <CardHeader className="mb-4">
          <CardTitle>Intervention Efficiency</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Policy Initiative</th>
                <th className="py-3 px-4">Pollutant</th>
                <th className="py-3 px-4">Daily Reduction</th>
                <th className="py-3 px-4">Compliance</th>
                <th className="py-3 px-4">Health Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              <tr className="hover:bg-surface-muted/50 transition-colors">
                <td className="py-4 px-4 font-medium text-text-primary">Logistics Diversion</td>
                <td className="py-4 px-4 font-mono">PM2.5</td>
                <td className="py-4 px-4 font-mono font-semibold text-[#A8E06C]">-14.2 t</td>
                <td className="py-4 px-4 font-mono">94.8%</td>
                <td className="py-4 px-4 font-mono">-5.68 kg/capita</td>
              </tr>
              <tr className="hover:bg-surface-muted/50 transition-colors">
                <td className="py-4 px-4 font-medium text-text-primary">Wet Spray Program</td>
                <td className="py-4 px-4 font-mono">PM10</td>
                <td className="py-4 px-4 font-mono font-semibold text-[#A8E06C]">-28.5 t</td>
                <td className="py-4 px-4 font-mono">94.8%</td>
                <td className="py-4 px-4 font-mono">-11.4 kg/capita</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Active Alerts ── */}
      <Card padding="lg">
        <CardHeader className="mb-4">
          <CardTitle>Active Environmental Alerts</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localAlerts.length === 0 ? (
            <p className="text-text-muted text-sm py-4 text-center col-span-2">
              No active warnings in this air-shed.
            </p>
          ) : (
            localAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-xl bg-surface-muted border border-border-subtle flex gap-4 hover:border-[#E85D04]/30 transition-colors"
              >
                <ShieldAlert className="w-5 h-5 text-[#E85D04] mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-display font-semibold text-text-primary">{alert.title}</h5>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1">{alert.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* ── Activity Timeline ── */}
      <Card padding="lg">
        <CardHeader className="mb-6">
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-6 pl-5 relative border-l border-border-subtle">
          {[
            { time: '09:14 AM', tag: 'Telemetry Sync',      color: '#A8E06C', dot: '#A8E06C', text: 'CAAQMS sensor arrays synchronized with regional boundary registries.' },
            { time: '08:30 AM', tag: 'Logistics Diverted',  color: '#48CAE4', dot: '#48CAE4', text: 'Peripheral routing rules pushed to automated highway toll gates.' },
            { time: '07:15 AM', tag: 'Preemptive Advisory', color: '#FFB627', dot: '#FFB627', text: 'Smart signal loops timing set to priority dispersion override bounds.' },
          ].map((item) => (
            <div key={item.time} className="relative">
              <span
                className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-surface-card"
                style={{ background: item.dot }}
              />
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <span>{item.time}</span>
                <span>·</span>
                <span style={{ color: item.color }}>{item.tag}</span>
              </div>
              <p className="text-sm text-text-secondary mt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default GovDashboard;
