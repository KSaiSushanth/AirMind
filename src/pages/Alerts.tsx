import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, AlertCircle, BellRing, CheckCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminGuard } from '../components/ui/AdminGuard';

export const Alerts: React.FC = () => {
  const { activeAlerts, setActiveAlerts, currentCity } = useApp();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const handleResolveAlert = (id: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, status: 'resolved' as const } : alert
      )
    );
  };

  const filteredAlerts = activeAlerts.filter(a => {
    const matchesCity = a.city === currentCity;
    const matchesFilter = filter === 'all' || a.severity === filter;
    return matchesCity && matchesFilter;
  });

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1200px] mx-auto select-none font-sans bg-[#0f172a] text-[#f8fafc]">
      
      {/* Introduction */}
      <div className="flex justify-between items-center border-b border-[#334155] pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-4.5 h-4.5 text-neutral-450 animate-pulse" />
            <span>Alert Operations Center</span>
          </h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">Direct warnings from sensors and boundary level models</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[#0f172a] p-1 border border-[#334155] rounded-lg">
          {(['all', 'critical', 'warning'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === f 
                  ? 'bg-[#1e293b] text-white border border-[#334155] shadow-sm' 
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts lists */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-12 text-center text-[#9ca3af] text-xs">
              No alerts match the selected criteria for this city.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isActive = alert.status === 'active';
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className={`border rounded-lg p-6 bg-[#1e293b] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-150 ${
                    !isActive 
                      ? 'opacity-55 bg-[#0f172a] border-[#334155]' 
                      : alert.severity === 'critical' 
                        ? 'border-red-900 bg-red-950/20' 
                        : 'border-amber-900 bg-amber-950/20'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className="mt-0.5 flex-shrink-0">
                      {alert.severity === 'critical' ? (
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs">{alert.title}</h4>
                        <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          alert.severity === 'critical' 
                            ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-[#cbd5e1] mt-1.5 leading-relaxed max-w-2xl">{alert.desc}</p>
                      <div className="flex items-center gap-3 mt-3 text-[9px] text-[#9ca3af] font-bold">
                        <span>🕒 Logged: {alert.timestamp}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Zone Coordinate
                        </span>
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <AdminGuard label="Admin only — acknowledge">
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="bg-[#0f172a] hover:bg-slate-800 border border-[#334155] px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer shadow-sm transition-all"
                      >
                        Acknowledge & Mitigate
                      </button>
                    </AdminGuard>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mitigated</span>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
export default Alerts;
