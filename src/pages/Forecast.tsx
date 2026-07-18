import React, { useState, useEffect } from 'react';
import { useApp, API_BASE_URL } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Clock, ShieldCheck, Thermometer, Wind, AlertCircle } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const Forecast: React.FC = () => {
  const { currentCity } = useApp();
  const fallbackCity = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;

  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any[]>(fallbackCity.forecastAqi);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/cities/${currentCity.toLowerCase()}/forecast`);
        if (response.ok) {
          const data = await response.json();
          setForecast(data.forecast);
        }
      } catch (err) {
        console.warn("Forecast API offline. Loading local predictive profiles.");
        setForecast(fallbackCity.forecastAqi);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [currentCity, fallbackCity]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const chartData = forecast.map(f => ({
    time: f.time,
    aqi: f.aqi,
    temp: f.temp
  }));

  const maxForecastObj = forecast.reduce((max, f) => f.aqi > max.aqi ? f : max, forecast[0] || { aqi: 150 });

  return (
    <div className="p-8 md:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto select-none font-sans bg-[#0f172a] text-[#f8fafc]">
      
      {/* Page Header */}
      <div className="border-b border-[#334155] pb-5">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <LineChart className="w-4.5 h-4.5 text-neutral-450" />
          <span>Atmospheric Carrying Capacity Projections</span>
        </h2>
        <p className="text-xs text-[#9ca3af] mt-1.5 leading-relaxed">XGBoost machine learning forecast showing multi-horizon particulate accumulation cycles.</p>
      </div>

      {/* Metric Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Peak Forecasted AQI */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af]">Peak Forecasted Load</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{maxForecastObj.aqi}</h2>
              <span className="text-xs text-[#9ca3af] font-semibold">AQI</span>
            </div>
          </div>
          <span className="text-xs text-[#9ca3af] mt-4 block font-semibold">
            Expected around: <b>{maxForecastObj.time}</b>
          </span>
        </div>

        {/* Confidence rating */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af]">Model Projection Variance</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">94.8%</h2>
              <span className="text-xs text-[#9ca3af] font-semibold">Accuracy</span>
            </div>
          </div>
          <span className="text-xs text-[#10b981] bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1 w-fit mt-4 block font-bold">
            ✓ Normal standard error bound
          </span>
        </div>

        {/* Advisory Window */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af]">Inversion Ingestion Risk</span>
            <h2 className="text-xs font-bold text-white tracking-tight mt-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>Low Boundary Dispersion tomorrow</span>
            </h2>
          </div>
          <p className="text-xs text-[#9ca3af] leading-relaxed mt-4">
            Close building vents during peak thermal compaction bounds.
          </p>
        </div>
      </div>

      {/* Main forecast graph card */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[460px]">
        <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-4">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9ca3af]">48-Hour Model Horizon</span>
        </div>
        <div className="w-full h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAqiForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', color: '#f8fafc' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="aqi" stroke="#2563eb" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAqiForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive parameters table */}
      <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-8 shadow-sm overflow-hidden">
        <h3 className="font-bold text-white text-sm tracking-tight mb-4 border-b border-[#334155] pb-4">Boundary Registry Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#334155] text-[#9ca3af] font-bold uppercase text-[10px] tracking-wider">
                <th className="py-4 px-4">Time Horizon</th>
                <th className="py-4 px-4">Estimated Load</th>
                <th className="py-4 px-4">Boundary Level</th>
                <th className="py-4 px-4">Simulated Dispersion</th>
                <th className="py-4 px-4">Intervention Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155] text-[#cbd5e1]">
              {forecast.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800 transition-colors">
                  <td className="py-4 px-4 font-bold text-white text-xs">{row.time}</td>
                  <td className="py-4 px-4 text-xs font-semibold">{row.aqi} AQI</td>
                  <td className="py-4 px-4 text-xs">{row.temp}°C</td>
                  <td className="py-4 px-4 text-xs">Moderate</td>
                  <td className="py-4 px-4 text-xs">
                    <span className="text-[10px] font-bold bg-[#0f172a] border border-[#334155] text-slate-300 px-2 py-0.5 rounded">
                      REGIST-{(idx + 1) * 10}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Forecast;
