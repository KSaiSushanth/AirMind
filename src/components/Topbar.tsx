import React from 'react';
import { useApp } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { Sun, Wind, Bell, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { currentCity, setCurrentCity, activeAlerts, userRole, dashboardData } = useApp();
  const cityData = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;
  const { pathname } = useLocation();

  const getPageMeta = (): { title: string; subtitle: string } => {
    if (pathname.includes('health'))     return { title: 'Health Advisory',          subtitle: 'Personalized exposure guidance · Risk profiling' };
    if (pathname.includes('map'))        return { title: 'Air Quality Map',           subtitle: 'Live sensor network · Pollution hotspots' };
    if (pathname.includes('forecast'))   return { title: 'Predictive Forecast',       subtitle: 'AI-driven 48h AQI model · Confidence scoring' };
    if (pathname.includes('simulation')) return { title: 'Digital Twin Simulation',   subtitle: 'What-if policy sandbox · Causal modeling' };
    if (pathname.includes('copilot'))    return { title: 'AI Decision Copilot',       subtitle: 'Explainable AI · Policy recommendations' };
    if (pathname.includes('analytics'))  return { title: 'Impact & Policy Analytics', subtitle: 'Intervention outcomes · Environmental ledger' };
    if (pathname.includes('alerts'))     return { title: 'Alert Center',              subtitle: 'Active warnings · Sensor boundary breaches' };
    if (pathname.includes('settings'))   return { title: 'Settings',                  subtitle: 'Profile · Notification channels · Workspace' };
    // default — dashboard
    return userRole === 'admin'
      ? { title: 'Operations Control Room', subtitle: 'Spatial sensing · AeroBudget active' }
      : { title: 'User Dashboard',          subtitle: 'Air quality · Exposure index' };
  };

  const { title, subtitle } = getPageMeta();


  const activeAlertsCount = activeAlerts.filter(
    (a) => a.status === 'active' && (a.city === currentCity || a.city === 'all')
  ).length;

  const displayAqi = dashboardData?.overallAqi ?? cityData.overallAqi;
  const aqiColor =
    displayAqi <= 100 ? '#A8E06C' :
    displayAqi <= 150 ? '#FFB627' :
    '#E85D04';

  return (
    <header
      className="h-14 px-6 flex items-center justify-between flex-shrink-0 select-none relative"
      style={{
        background: '#131f35',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* AQI accent line — bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${aqiColor}88 40%, ${aqiColor}88 60%, transparent)`,
        }}
      />

      {/* Left: title */}
      <div className="flex flex-col gap-0.5">
        <h1
          className="text-[14px] font-semibold leading-tight text-white whitespace-nowrap"
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
        <span
          className="text-[10px] leading-tight whitespace-nowrap"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.35)' }}
        >
          {subtitle}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">

        {/* Weather */}
        <div
          className="hidden sm:flex items-center gap-2.5 h-8 px-3 rounded-md text-[11px]"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: "'IBM Plex Mono', monospace",
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <Sun className="w-3 h-3 shrink-0" style={{ color: '#FFB627' }} />
          <span>{cityData.weather.temp}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <Wind className="w-3 h-3 shrink-0" style={{ color: '#48CAE4' }} />
          <span>{cityData.weather.windSpeed}</span>
        </div>

        {/* City selector — custom styled to avoid OS white bg */}
        <div className="relative">
          <select
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            className="appearance-none h-8 pl-3 pr-7 rounded-md text-[11px] outline-none cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            <option value="delhi"     style={{ background: '#1a2540' }}>Delhi (NCR)</option>
            <option value="mumbai"    style={{ background: '#1a2540' }}>Mumbai</option>
            <option value="bengaluru" style={{ background: '#1a2540' }}>Bengaluru</option>
            <option value="hyderabad" style={{ background: '#1a2540' }}>Hyderabad</option>
            <option value="chennai"   style={{ background: '#1a2540' }}>Chennai</option>
            <option value="kolkata"   style={{ background: '#1a2540' }}>Kolkata</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          />
        </div>

        {/* Bell */}
        <Link
          to="/admin/alerts"
          className="relative flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.5)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <Bell className="w-3.5 h-3.5" />
          {activeAlertsCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5"
              style={{ background: '#E85D04' }}
            >
              {activeAlertsCount}
            </span>
          )}
        </Link>

        {/* Live indicator */}
        <div
          className="hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[10px] font-semibold"
          style={{
            background: `${aqiColor}12`,
            border: `1px solid ${aqiColor}30`,
            color: aqiColor,
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: aqiColor }}
          />
          LIVE
        </div>
      </div>
    </header>
  );
};
export default Topbar;
