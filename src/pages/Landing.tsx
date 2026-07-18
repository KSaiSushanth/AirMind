import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, ShieldAlert, Cpu, MessageSquare, ArrowRight, Activity, Globe2, Zap, X, MapPin, Thermometer, Wind as WindIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { AmbientBackground } from '../components/AmbientBackground';
import { useApp } from '../context/AppContext';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: Cpu,
    title: 'AeroBudget Capacity Engine',
    description:
      'Computes daily air budget volume using planetary boundary layer height. Allocates capacity dynamically across transit and industry agents.',
    borderColor: '#48CAE4',
    iconColor: '#48CAE4',
    glowColor: 'rgba(72,202,228,0.08)',
  },
  {
    icon: MessageSquare,
    title: 'Explainable Causal AI',
    description:
      'Structural causal modeling traces sensor spikes through wind vector paths. Delivers policy actions with human-readable summaries.',
    borderColor: '#A8E06C',
    iconColor: '#A8E06C',
    glowColor: 'rgba(168,224,108,0.08)',
  },
  {
    icon: ShieldAlert,
    title: 'Preemptive Emergency Alerts',
    description:
      'Forecasts thermal boundary inversion events 48 hours ahead. Coordinates schools, traffic grids, and clinics before pollution peaks.',
    borderColor: '#FFB627',
    iconColor: '#FFB627',
    glowColor: 'rgba(255,182,39,0.08)',
  },
];

const stats = [
  { value: '48h',  label: 'Forecast horizon' },
  { value: '3D',   label: 'Digital twin depth' },
  { value: '14%',  label: 'Avg. PM2.5 reduction' },
  { value: '24/7', label: 'Sensor telemetry' },
];

const DEMO_CITIES = [
  {
    id: 'delhi',
    name: 'Delhi',
    region: 'NCR · North India',
    aqi: 287,
    status: 'Very Unhealthy',
    statusColor: '#E85D04',
    temp: '38°C',
    wind: '4.8 km/h',
    pollutant: 'PM2.5',
    description: 'Dense urban basin with high vehicular & industrial load. Active thermal inversion zone.',
    highlight: 'Critical stagnation events detected',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    region: 'Maharashtra · West India',
    aqi: 142,
    status: 'Unhealthy for Sensitive',
    statusColor: '#FFB627',
    temp: '31°C',
    wind: '12.3 km/h',
    pollutant: 'NO₂',
    description: 'Coastal megacity with sea-breeze dispersion. Port & construction dust primary contributors.',
    highlight: 'Sea breeze active — moderate dispersion',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Karnataka · South India',
    aqi: 78,
    status: 'Satisfactory',
    statusColor: '#A8E06C',
    temp: '26°C',
    wind: '9.1 km/h',
    pollutant: 'PM10',
    description: 'Elevated plateau with natural dispersion. Traffic growth straining current capacity.',
    highlight: 'Within safe carrying capacity',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    region: 'Telangana · South India',
    aqi: 154,
    status: 'Moderate',
    statusColor: '#FFB627',
    temp: '33°C',
    wind: '8.5 km/h',
    pollutant: 'PM2.5',
    description: 'Rapidly growing IT and pharma hub. Moderate particulate load with localized industrial hotspots.',
    highlight: 'Active tracking in industrial corridors',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    region: 'Tamil Nadu · South India',
    aqi: 94,
    status: 'Satisfactory',
    statusColor: '#A8E06C',
    temp: '34°C',
    wind: '15.0 km/h',
    pollutant: 'PM10',
    description: 'Coastal climate with active dispersion. High humidity helps suppress dry dust accumulation.',
    highlight: 'Sea breeze dispersion active',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    region: 'West Bengal · East India',
    aqi: 245,
    status: 'Poor',
    statusColor: '#E85D04',
    temp: '35°C',
    wind: '6.2 km/h',
    pollutant: 'PM2.5',
    description: 'Dense municipal basin. Heavy solid-fuel and brick kiln exhaust under low winter winds.',
    highlight: 'Brick kiln plumes trapped over Howrah',
  },
];

export const Landing: React.FC = () => {
  const [showCityModal, setShowCityModal] = useState(false);
  const { setCurrentCity, setUserRole, loginUser } = useApp();
  const navigate = useNavigate();

  const handleDemoCity = async (cityId: string) => {
    setCurrentCity(cityId);
    setUserRole('user');
    await loginUser('user');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-base text-text-primary overflow-x-hidden relative">
      <AmbientBackground />

      {/* ── Nav ── */}
      <header className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #48CAE4 0%, #A8E06C 100%)',
              boxShadow: '0 0 16px rgba(72,202,228,0.35)',
            }}
          >
            <Wind className="w-4 h-4 text-[#0A0E17]" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">AirMind</span>
        </div>
        <Link to="/login">
          <Button variant="outline" size="sm">Access Portal</Button>
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center relative z-10">

        {/* Badge pill */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono mb-8 border"
          style={{
            background: 'rgba(72,202,228,0.08)',
            borderColor: 'rgba(72,202,228,0.25)',
            color: '#48CAE4',
          }}
        >
          <Activity className="w-3.5 h-3.5" />
          Next-Gen Urban Air Decision Intelligence
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.08] mb-6"
        >
          <span className="text-gradient">Don't just monitor</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #48CAE4 0%, #A8E06C 60%, #FFB627 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            pollution. Prevent it.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          AirMind uses causal AI and 3D digital twins to predict atmospheric carrying capacity,
          recommending targeted urban interventions before pollution accumulates.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/login">
            <Button size="lg" className="group">
              Enter Control Room
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <button
            onClick={() => setShowCityModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: "'Syne', sans-serif",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(72,202,228,0.08)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(72,202,228,0.3)';
              (e.currentTarget as HTMLElement).style.color = '#48CAE4';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <Globe2 className="w-4 h-4" />
            View Demo Cities
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5 text-center border strata-panel">
              <div
                className="text-2xl font-display font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #48CAE4 0%, #A8E06C 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold tracking-tight mb-3">Core Framework Modules</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            A cyber-physical control loop combining meteorological physics with automated decision intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="strata-panel rounded-2xl p-7 transition-all duration-300 group cursor-default"
                style={{ borderColor: `${feature.borderColor}22` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${feature.borderColor}55`;
                  (e.currentTarget as HTMLElement).style.background = feature.glowColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${feature.borderColor}22`;
                  (e.currentTarget as HTMLElement).style.background = '';
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform"
                  style={{
                    background: `${feature.iconColor}14`,
                    border: `1px solid ${feature.iconColor}30`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.iconColor }} />
                </div>
                <h3 className="font-display font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div
          className="strata-panel rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          style={{ borderColor: 'rgba(72,202,228,0.15)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(72,202,228,0.04) 0%, transparent 70%)' }}
          />
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(72,202,228,0.12)', border: '1px solid rgba(72,202,228,0.25)' }}
            >
              <Zap className="w-6 h-6 text-[#48CAE4]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
              Scale AirMind to Your Smart City
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
              Deploy sensor calibration edge nodes and connect spatial databases to unlock
              proactive environmental scheduling.
            </p>
            <Link to="/login">
              <Button size="md">Register Authority Node</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="h-16 border-t border-border-subtle flex items-center justify-center font-mono text-xs text-text-muted relative z-10">
        © {new Date().getFullYear()} AirMind Inc. — Urban Decision Intelligence
      </footer>

      {/* ── Demo City Modal ── */}
      <AnimatePresence>
        {showCityModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCityModal(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(10,14,23,0.8)', backdropFilter: 'blur(8px)' }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl z-50 rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.09)', maxHeight: '90vh' }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <h3
                    className="text-[15px] font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Live Demo Cities
                  </h3>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.4)' }}
                  >
                    Select a city to explore the dashboard as a User
                  </p>
                </div>
                <button
                  onClick={() => setShowCityModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* City cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 overflow-y-auto max-h-[65vh]">
                {DEMO_CITIES.map((city, i) => (
                  <motion.button
                    key={city.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => handleDemoCity(city.id)}
                    className="text-left rounded-xl p-5 cursor-pointer transition-all duration-200 group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${city.statusColor}22`,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = `${city.statusColor}0A`;
                      (e.currentTarget as HTMLElement).style.borderColor = `${city.statusColor}44`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.borderColor = `${city.statusColor}22`;
                    }}
                  >
                    {/* City name + region */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4
                          className="text-[15px] font-bold text-white"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {city.name}
                        </h4>
                        <div
                          className="flex items-center gap-1 text-[10px] mt-0.5"
                          style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.35)' }}
                        >
                          <MapPin className="w-2.5 h-2.5" />
                          {city.region}
                        </div>
                      </div>
                      {/* AQI bubble */}
                      <div
                        className="rounded-lg px-2.5 py-1.5 text-center flex-shrink-0"
                        style={{
                          background: `${city.statusColor}14`,
                          border: `1px solid ${city.statusColor}30`,
                        }}
                      >
                        <div
                          className="text-[18px] font-bold leading-none"
                          style={{ fontFamily: "'IBM Plex Mono', monospace", color: city.statusColor }}
                        >
                          {city.aqi}
                        </div>
                        <div
                          className="text-[8px] font-semibold mt-0.5"
                          style={{ color: city.statusColor, opacity: 0.8 }}
                        >
                          AQI
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className="text-[10px] font-semibold mb-3 px-2 py-1 rounded-md inline-block"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        background: `${city.statusColor}12`,
                        color: city.statusColor,
                      }}
                    >
                      {city.status}
                    </div>

                    {/* Description */}
                    <p
                      className="text-[11px] leading-relaxed mb-4"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.4)' }}
                    >
                      {city.description}
                    </p>

                    {/* Weather row */}
                    <div
                      className="flex items-center gap-3 text-[10px] mb-4"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(255,255,255,0.35)' }}
                    >
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-[#FFB627]" />
                        {city.temp}
                      </span>
                      <span className="flex items-center gap-1">
                        <WindIcon className="w-3 h-3 text-[#48CAE4]" />
                        {city.wind}
                      </span>
                      <span style={{ color: city.statusColor }}>
                        ↑ {city.pollutant}
                      </span>
                    </div>

                    {/* CTA */}
                    <div
                      className="flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-150"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        color: city.statusColor,
                      }}
                    >
                      Explore {city.name}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer note */}
              <div
                className="px-6 py-3 text-center text-[10px]"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                Demo access · Read-only mode · No login required
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Landing;
