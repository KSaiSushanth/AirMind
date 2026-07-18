import React, { useState, useEffect } from 'react';
import { useApp, API_BASE_URL } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { 
  Clock, Compass, Shield, MapPin, Navigation, Bell, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Citizen: React.FC = () => {
  const { currentCity, activeAlerts } = useApp();
  const cityData = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;

  // Citizen Health profile selectors
  const [age, setAge] = useState<number>(35);
  const [profile, setProfile] = useState<string>('normal');
  const [advisory, setAdvisory] = useState<any>({
    healthRisk: "Moderate Health Strain",
    outdoorRecommendation: "Limit prolonged outdoor times.",
    maskRecommendation: "N95 respirator recommended",
    exerciseRecommendation: "Indoor workouts recommended.",
    medicalWarning: "No immediate medical precautions required."
  });

  const [routeCalc, setRouteCalc] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  
  const [routeResults, setRouteResults] = useState({
    stdAqi: 320,
    stdTime: "24 mins",
    cleanAqi: 185,
    cleanTime: "28 mins",
    exposureSaved: "42%"
  });

  // Query health advisories dynamically
  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/cities/${currentCity.toLowerCase()}/health-advisory?age=${age}&health_profile=${profile}`
        );
        if (response.ok) {
          const data = await response.json();
          setAdvisory(data.advisory);
        }
      } catch (err) {
        console.warn("Health advisory API offline. Falling back to local rules.");
      }
    };
    fetchAdvisory();
  }, [currentCity, age, profile]);

  const calculateCleanestRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setCalcLoading(true);
    setTimeout(() => {
      setCalcLoading(false);
      setRouteCalc(true);

      const isDelhi = currentCity === 'delhi';
      setRouteResults({
        stdAqi: isDelhi ? 380 : 155,
        stdTime: "22 mins",
        cleanAqi: isDelhi ? 220 : 92,
        cleanTime: "27 mins",
        exposureSaved: isDelhi ? "45%" : "38%"
      });
    }, 1000);
  };

  const getStatusColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes('critical') || r.includes('hazard') || r.includes('high')) return 'text-[#ef4444]';
    if (r.includes('moderate') || r.includes('strain')) return 'text-[#f59e0b]';
    return 'text-[#10b981]';
  };

  const getStatusBg = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes('critical') || r.includes('hazard') || r.includes('high')) return 'bg-red-500/10 border-red-500/20';
    if (r.includes('moderate') || r.includes('strain')) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  const localAlerts = activeAlerts.filter(a => a.city === currentCity && a.status === 'active');

  return (
    <div className="p-8 md:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto select-none font-sans bg-[#0f172a] text-[#f8fafc]">
      
      {/* Patient Profile Controller */}
      <div className="border border-[#334155] bg-[#1e293b] rounded-xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-neutral-400" /> Personalized Advisory Profile
          </h3>
          <p className="text-xs text-[#9ca3af] mt-1.5 leading-relaxed">Configure age and chronic conditions to tailor environmental alerts.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#9ca3af]">Age:</span>
            <input 
              type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value) || 25)}
              className="w-16 bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#9ca3af]">Profile:</span>
            <select 
              value={profile} onChange={(e) => setProfile(e.target.value)}
              className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="normal">Normal Health</option>
              <option value="asthma">Asthma / COPD</option>
              <option value="heart">Heart / Cardio strain</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Exposure Status Card */}
        <div className={`border rounded-lg p-8 bg-[#1e293b] shadow-sm flex flex-col justify-between min-h-[160px] ${getStatusBg(advisory.healthRisk)}`}>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af] block mb-1">Lung Health Exposure Risk</span>
            <h2 className={`text-xl font-bold mt-2 ${getStatusColor(advisory.healthRisk)}`}>{advisory.healthRisk}</h2>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed mt-4">
            {advisory.outdoorRecommendation}
          </p>
        </div>

        {/* Best Outdoor Times Card */}
        <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af] block mb-1">Recommended Exercise Window</span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-2 flex items-center gap-1.5">
              <Clock className="w-4.5 h-4.5 text-neutral-400" />
              <span>02:00 PM - 04:50 PM</span>
            </h2>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed mt-4">
            {advisory.exerciseRecommendation}
          </p>
        </div>

        {/* Mask Advisory Card */}
        <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af] block mb-1">Respiratory Protection Requirement</span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-2 flex items-center gap-1.5">
              <Shield className="w-4.5 h-4.5 text-[#f59e0b]" />
              <span className="truncate">{advisory.maskRecommendation}</span>
            </h2>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed mt-4">
            {advisory.medicalWarning}
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Cleanest Route Planner */}
        <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-[#334155] pb-4">
              <Compass className="w-4.5 h-4.5 text-neutral-400" />
              <span>AeroPath Navigation Router</span>
            </h3>
            <p className="text-xs text-[#9ca3af] mt-2">Calculates pedestrian routes based on wind vectors and particle levels</p>

            <form onSubmit={calculateCleanestRoute} className="flex flex-col gap-4 mt-6">
              <div className="flex items-center gap-3 bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <input 
                  type="text" required placeholder="Starting Location"
                  className="bg-transparent text-xs text-white placeholder-slate-500 outline-none flex-grow"
                />
              </div>
              <div className="flex items-center gap-3 bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5">
                <MapPin className="w-4 h-4 text-red-500" />
                <input 
                  type="text" required placeholder="Destination Location"
                  className="bg-transparent text-xs text-white placeholder-slate-500 outline-none flex-grow"
                />
              </div>
              <button
                type="submit"
                disabled={calcLoading}
                className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold h-11 rounded-lg cursor-pointer shadow-sm text-xs transition-all disabled:opacity-50"
              >
                {calcLoading ? "Calculating Exposure-Minimizing Routes..." : "Optimize Cleanest Travel Path"}
              </button>
            </form>
          </div>

          {/* Results Block */}
          <div className="mt-8 pt-6 border-t border-[#334155] min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!routeCalc && !calcLoading ? (
                <div className="text-[#9ca3af] text-xs text-center flex flex-col items-center gap-2">
                  <Navigation className="w-4 h-4 text-neutral-400" />
                  <span>Enter addresses above to compare route inhalation exposures.</span>
                </div>
              ) : calcLoading ? (
                <div className="text-blue-500 text-xs font-semibold animate-pulse">Mapping spatiotemporal grids...</div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full grid grid-cols-2 gap-6"
                >
                  {/* Standard Route */}
                  <div className="p-5 bg-[#0f172a] border border-[#334155] rounded">
                    <span className="text-[10px] uppercase font-semibold text-[#9ca3af] tracking-wide block">Standard Path (Fastest)</span>
                    <h4 className="text-base font-bold text-white mt-1">{routeResults.stdTime}</h4>
                    <span className="text-xs text-[#ef4444] font-semibold block mt-1">Avg Exposure: {routeResults.stdAqi} AQI</span>
                  </div>

                  {/* Clean Route */}
                  <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-semibold text-[#10b981] tracking-wide">AeroPath (Cleanest)</span>
                      <span className="text-[9px] text-[#10b981] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {routeResults.exposureSaved} Safe
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#10b981] mt-1">{routeResults.cleanTime}</h4>
                    <span className="text-xs text-[#10b981] font-semibold block mt-1">Avg Exposure: {routeResults.cleanAqi} AQI</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Health Advisories & Active Alerts */}
        <div className="flex flex-col gap-6">
          {/* Active alerts panel */}
          <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-8 shadow-sm">
            <h3 className="font-bold text-white text-sm mb-4 border-b border-[#334155] pb-4 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-red-500 animate-pulse" />
              <span>Emergency Neighborhood Alerts</span>
            </h3>
            
            <div className="flex flex-col gap-3">
              {localAlerts.length === 0 ? (
                <div className="text-[#9ca3af] text-xs py-4 text-center">No emergency notifications in your area.</div>
              ) : (
                localAlerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded bg-red-500/5 border border-red-500/20 flex gap-4">
                    <Shield className="w-4.5 h-4.5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <h5 className="text-xs font-bold text-white">{alert.title}</h5>
                      <p className="text-xs text-[#cbd5e1] leading-relaxed mt-1">{alert.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-8 shadow-sm">
            <h3 className="font-bold text-white text-sm mb-4 border-b border-[#334155] pb-4">Household Air Management</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">Ensure all windows remain closed during high-stagnation periods (early morning/evening peak hours).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">Run indoor HEPA air filters on high setting. Ideal indoor PM2.5 levels should remain below 25 µg/m³.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">Limit intense cooking operations or candle burning inside the house to avoid fine particle generation.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Citizen;
