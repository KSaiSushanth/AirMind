import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { cn } from '../lib/utils';
import {
  LayoutDashboard, Map, LineChart, Cpu,
  MessageSquare, BarChart3, Bell, Settings, LogOut, Wind, Heart
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/admin/dashboard',  label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/admin/map',        label: 'Air Quality Map',     icon: Map },
  { to: '/admin/forecast',   label: 'Predictive Forecast', icon: LineChart },
  { to: '/admin/simulation', label: 'Digital Twin',        icon: Cpu },
  { to: '/admin/copilot',    label: 'AI Copilot',          icon: MessageSquare },
  { to: '/admin/health',     label: 'Health Advisory',     icon: Heart },
  { to: '/admin/analytics',  label: 'Impact Analytics',    icon: BarChart3 },
  { to: '/admin/alerts',     label: 'Alert Center',        icon: Bell },
  { to: '/admin/settings',   label: 'Settings',            icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { userRole, setUserRole, dashboardData, currentCity } = useApp();
  const navigate = useNavigate();

  const cityData = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;
  const displayAqi = dashboardData?.overallAqi ?? cityData.overallAqi;

  const aqiColor =
    displayAqi <= 100 ? '#A8E06C' :
    displayAqi <= 150 ? '#FFB627' :
    '#E85D04';

  const aqiLabel =
    displayAqi <= 100 ? 'Satisfactory' :
    displayAqi <= 150 ? 'Moderate' :
    'Hazardous';

  const handleLogout = () => {
    setUserRole('admin');
    navigate('/');
  };

  const roleInitial = userRole === 'admin' ? 'A' : 'U';
  const roleLabel   = userRole === 'admin' ? 'Admin'        : 'User';
  const roleEmail   = userRole === 'admin' ? 'admin@airmind.gov.in' : 'user@airmind.gov.in';

  return (
    <aside
      className="w-[240px] h-screen flex flex-col justify-between py-5 px-3 flex-shrink-0 z-40 select-none"
      style={{
        background: '#111827',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        '--aqi-color': aqiColor,
        '--aqi-muted': `${aqiColor}1A`,
      } as React.CSSProperties}
    >
      <div className="flex flex-col gap-5">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #48CAE4 0%, #A8E06C 100%)',
              boxShadow: '0 0 14px rgba(72,202,228,0.28)',
            }}
          >
            <Wind className="w-4 h-4 text-[#0A0E17]" />
          </div>
          <div>
            <span
              className="block text-[14px] font-bold text-white leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
            >
              AirMind
            </span>
            <span
              className="block text-[9px] uppercase tracking-widest"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.3)' }}
            >
              Control Console
            </span>
          </div>
        </div>

        {/* ── Live AQI strip ── */}
        <div
          className="mx-1 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: `${aqiColor}0D`,
            border: `1px solid ${aqiColor}25`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 aqi-ring-pulse"
            style={{ background: aqiColor, boxShadow: `0 0 5px ${aqiColor}` }}
          />
          <span
            className="text-[11px] font-medium leading-tight"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: aqiColor }}
          >
            AQI {displayAqi} · {aqiLabel}
          </span>
        </div>

        {/* ── Nav ── */}
        <nav className="flex flex-col gap-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium border transition-all duration-150',
                  isActive
                    ? 'strata-nav-active text-white border-transparent'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04] border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-[16px] h-[16px] flex-shrink-0"
                    style={{ color: isActive ? aqiColor : undefined }}
                  />
                  <span style={{ fontFamily: "'Syne', sans-serif" }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Footer — user + logout ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <div className="flex items-center gap-3 px-2 mb-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: `${aqiColor}16`,
              border: `1px solid ${aqiColor}28`,
              color: aqiColor,
            }}
          >
            {roleInitial}
          </div>
          <div className="min-w-0">
            <span
              className="block text-[12px] font-semibold text-white/80 truncate"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {roleLabel}
            </span>
            <span
              className="block text-[10px] truncate"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.28)' }}
            >
              {roleEmail}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium border border-transparent transition-all duration-150 cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Syne', sans-serif" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(232,93,4,0.08)';
            (e.currentTarget as HTMLElement).style.color = '#E85D04';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,93,4,0.18)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
        >
          <LogOut className="w-[15px] h-[15px]" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
