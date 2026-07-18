import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Sliders, DollarSign, Activity, ActivityIcon, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminGuard } from '../components/ui/AdminGuard';

export const Simulation: React.FC = () => {
  const { simulationSettings, setSimulationSettings, executeSimulation, userRole } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSliderChange = (key: keyof typeof simulationSettings, value: number) => {
    setSimulationSettings({ ...simulationSettings, [key]: value });
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await executeSimulation(simulationSettings);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10 flex flex-col gap-8 max-w-[1200px] mx-auto select-none font-sans bg-[#0f172a] text-[#f8fafc]">
      
      {/* Intro Description */}
      <div className="border-b border-[#334155] pb-5">
        <h2 className="text-base font-bold text-[#f8fafc] tracking-tight flex items-center gap-2">
          <Cpu className="w-4.5 h-4.5 text-neutral-400 animate-pulse" />
          <span>AeroPath Policy Sandbox Twin</span>
        </h2>
        <p className="text-xs text-[#9ca3af] mt-1.5 leading-relaxed">Adjust logistics, building dust limits, and factory shutdowns to simulate the reduction in particulate load.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Parameters Slider Control Form */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-[#334155] pb-4">
            <Sliders className="w-4.5 h-4.5 text-neutral-400" />
            <h3 className="font-bold text-xs text-[#f8fafc] uppercase tracking-wider">Scenario Vectors</h3>
          </div>

          <form onSubmit={handleRunSimulation} className="flex flex-col gap-6">
            {/* Logistics slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#cbd5e1]">
                <span>Heavy Logistics Diversion</span>
                <span className="text-[#2563eb] font-bold font-mono">{simulationSettings.reduceTraffic}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={simulationSettings.reduceTraffic}
                onChange={(e) => handleSliderChange('reduceTraffic', parseInt(e.target.value))}
                className="w-full h-1 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <span className="text-xs text-[#9ca3af] mt-1">Reroute diesel heavy cargo trucks onto peripheral toll highways.</span>
            </div>

            {/* Construction slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#cbd5e1]">
                <span>Builder Dust Suppression Rules</span>
                <span className="text-[#2563eb] font-bold font-mono">{simulationSettings.pauseConstruction}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={simulationSettings.pauseConstruction}
                onChange={(e) => handleSliderChange('pauseConstruction', parseInt(e.target.value))}
                className="w-full h-1 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <span className="text-xs text-[#9ca3af] mt-1">Mandate on-site mist cannons and suspend loose sand excavations.</span>
            </div>

            {/* Industry slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#cbd5e1]">
                <span>Industrial Stack Caps</span>
                <span className="text-[#2563eb] font-bold font-mono">{simulationSettings.reduceIndustry}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={simulationSettings.reduceIndustry}
                onChange={(e) => handleSliderChange('reduceIndustry', parseInt(e.target.value))}
                className="w-full h-1 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <span className="text-xs text-[#9ca3af] mt-1">Instruct local smelting and casting blocks to limit operational furnaces.</span>
            </div>

            {/* Road Closure slider */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#cbd5e1]">
                <span>Emergency Corridor Closure</span>
                <span className="text-[#2563eb] font-bold font-mono">{simulationSettings.roadClosure}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={simulationSettings.roadClosure}
                onChange={(e) => handleSliderChange('roadClosure', parseInt(e.target.value))}
                className="w-full h-1 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <span className="text-xs text-[#9ca3af] mt-1">Enforce temporal private vehicle closures inside severe wind tunnels.</span>
            </div>

            <AdminGuard label="Admin only — run simulation" block>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold h-11 rounded-lg cursor-pointer shadow-sm text-xs transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Running Twin Simulations...' : 'Optimize Policy Parameters'}
              </button>
            </AdminGuard>
          </form>
        </div>

        {/* Right Side: Results Display Panel */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center gap-2 border-b border-[#334155] pb-4">
              <Activity className="w-4.5 h-4.5 text-neutral-400" />
              <h3 className="font-bold text-xs text-[#f8fafc] uppercase tracking-wider">Simulated Impact</h3>
            </div>

            <div className="flex-grow flex items-center justify-center py-6 mt-4">
              <AnimatePresence mode="wait">
                {!results && !loading ? (
                  <div className="text-[#9ca3af] text-xs text-center flex flex-col items-center gap-2.5 py-12">
                    <HelpCircle className="w-8 h-8 text-neutral-600" />
                    <span>Configure vectors and execute simulation to calculate SCM air-shed shifts.</span>
                  </div>
                ) : loading ? (
                  <div className="text-[#9ca3af] text-xs font-semibold animate-pulse py-12">Running boundary layer modeling...</div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full grid grid-cols-1 gap-5"
                  >
                    {/* PM Reduction */}
                    <div className="p-5 rounded border border-[#334155] bg-[#0f172a] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#9ca3af]">Simulated AQI Impact</span>
                        <h4 className="text-xl font-bold text-white mt-1">{results.aqiReduction}</h4>
                      </div>
                      <ActivityIcon className="w-6 h-6 text-neutral-600 opacity-20" />
                    </div>

                    {/* Economic cost */}
                    <div className="p-5 rounded border border-[#334155] bg-[#0f172a] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#9ca3af]">Municipal Budget Impact</span>
                        <h4 className="text-xl font-bold text-white mt-1">{results.cost}</h4>
                      </div>
                      <DollarSign className="w-6 h-6 text-neutral-600 opacity-20" />
                    </div>

                    {/* Health impact admissions saved */}
                    <div className="p-5 rounded border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#10b981]">ER Hospital Capacity Load</span>
                        <h4 className="text-xl font-bold text-[#10b981] mt-1">{results.healthImpact}</h4>
                      </div>
                      <Activity className="w-6 h-6 text-emerald-500 opacity-30" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-[#334155] pt-5 text-xs text-[#9ca3af] leading-relaxed">
            ⚙️ Causal twin logic coordinates simulated variables against mathematical regressions stored inside XGBoost models.
          </div>
        </div>

      </div>

    </div>
  );
};
export default Simulation;
