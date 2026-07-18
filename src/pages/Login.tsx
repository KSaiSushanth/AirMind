import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wind, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { AmbientBackground } from '../components/AmbientBackground';

const roles: {
  id: 'admin' | 'user';
  label: string;
  icon: React.ElementType;
  desc: string;
  badge: string;
}[] = [
  {
    id: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    desc: 'Full platform access — dashboard, simulations, analytics, alerts & settings.',
    badge: 'Full Access',
  },
  {
    id: 'user',
    label: 'User',
    icon: User,
    desc: 'Standard access — air quality data, AI copilot, forecasts & alerts.',
    badge: 'Standard',
  },
];

export const Login: React.FC = () => {
  const { userRole, setUserRole, loginUser } = useApp();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(userRole);
    if (success) navigate('/admin/dashboard');
  };

  const selected = userRole === 'admin' || userRole === 'user' ? userRole : 'admin';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#0A0E17' }}
    >
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: '#131f35',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, #48CAE4 0%, #A8E06C 100%)',
                boxShadow: '0 0 20px rgba(72,202,228,0.3)',
              }}
            >
              <Wind className="w-5 h-5 text-[#0A0E17]" />
            </div>
            <h1
              className="text-[18px] font-bold text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              AirMind
            </h1>
            <p
              className="text-[11px] mt-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.35)' }}
            >
              Select your access level to continue
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">

            {/* Role selector — 2 cards */}
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ id, label, icon: Icon, desc, badge }) => {
                const isActive = selected === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUserRole(id)}
                    className="p-4 rounded-xl flex flex-col items-start gap-3 text-left transition-all duration-200 cursor-pointer"
                    style={{
                      background: isActive ? 'rgba(72,202,228,0.08)' : 'rgba(255,255,255,0.03)',
                      border: isActive
                        ? '1px solid rgba(72,202,228,0.35)'
                        : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: isActive ? '0 0 0 1px rgba(72,202,228,0.1)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: isActive ? 'rgba(72,202,228,0.15)' : 'rgba(255,255,255,0.06)',
                          border: isActive ? '1px solid rgba(72,202,228,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: isActive ? '#48CAE4' : 'rgba(255,255,255,0.4)' }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          background: isActive ? 'rgba(72,202,228,0.15)' : 'rgba(255,255,255,0.06)',
                          color: isActive ? '#48CAE4' : 'rgba(255,255,255,0.3)',
                          border: isActive ? '1px solid rgba(72,202,228,0.2)' : '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        {badge}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-[13px] font-semibold mb-1"
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          color: isActive ? '#E8EDF5' : 'rgba(255,255,255,0.65)',
                        }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-[10px] leading-relaxed"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: 'rgba(255,255,255,0.3)',
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Workspace ID (decorative) */}
            <div>
              <label
                className="block text-[10px] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.3)' }}
              >
                Workspace ID
              </label>
              <input
                type="text"
                disabled
                value={selected === 'admin' ? 'admin@airmind.gov.in' : 'user@airmind.gov.in'}
                className="w-full rounded-xl px-4 py-3 text-[12px] outline-none cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: 'rgba(255,255,255,0.35)',
                }}
              />
            </div>

            {/* Access PIN (decorative) */}
            <div>
              <label
                className="block text-[10px] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.3)' }}
              >
                Access PIN
              </label>
              <input
                type="password"
                disabled
                value="••••••••••••"
                className="w-full rounded-xl px-4 py-3 text-[12px] outline-none cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: 'rgba(255,255,255,0.25)',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl text-[13px] font-semibold transition-all duration-200 mt-1"
              style={{
                background: 'linear-gradient(135deg, #48CAE4 0%, #38b4d4 100%)',
                color: '#0A0E17',
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 20px rgba(72,202,228,0.25)',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 28px rgba(72,202,228,0.4)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(72,202,228,0.25)')}
            >
              Connect to Node
            </button>
          </form>
        </div>

        <p
          className="text-center mt-4 text-[10px]"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.2)' }}
        >
          AirMind © {new Date().getFullYear()} · Urban Air Intelligence Platform
        </p>
      </motion.div>
    </div>
  );
};
export default Login;
