import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const MOCK_REDUCTIONS = [
  { policy: "Logistics Diversion", target: "PM2.5", tons: 14.2, baseline: 25 },
  { policy: "Wet Spray Program", target: "PM10", tons: 28.5, baseline: 40 },
  { policy: "Industrial Curtailment", target: "SOx", tons: 8.4, baseline: 15 },
  { policy: "Signal Auto-Cycles", target: "NOx", tons: 12.1, baseline: 20 }
];

const FORECAST_ACCURACY_DATA = [
  { day: "Mon", predicted: 310, actual: 318 },
  { day: "Tue", predicted: 280, actual: 275 },
  { day: "Wed", predicted: 350, actual: 342 },
  { day: "Thu", predicted: 380, actual: 390 },
  { day: "Fri", predicted: 320, actual: 318 }
];

export const Analytics: React.FC = () => {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1600px] mx-auto select-none font-sans bg-[#0f172a] text-[#f8fafc]">
      
      {/* Introduction */}
      <div className="border-b border-[#334155] pb-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-neutral-400" />
          <span>Environmental & Economic Ledger</span>
        </h2>
        <p className="text-xs text-[#9ca3af] mt-0.5">Measuring actual policy effectiveness against predictive baselines.</p>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Policy Impact bar chart */}
        <div className="border border-[#334155] rounded-lg p-6 bg-[#1e293b] shadow-sm h-[380px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Particulate Reductions</h3>
            <span className="text-[9px] text-[#cbd5e1] font-bold bg-[#0f172a] border border-[#334155] px-2.5 py-1 rounded-full flex items-center gap-1.5">
              Emission Ledger
            </span>
          </div>
          <div className="flex-grow w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REDUCTIONS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="policy" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '6px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '9px', pt: 10 }} />
                <Bar dataKey="tons" name="Tons Prevented" fill="#2563eb" radius={[2, 2, 0, 0]} />
                <Bar dataKey="baseline" name="Expected Output" fill="#475569" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Accuracy line chart */}
        <div className="border border-[#334155] rounded-lg p-6 bg-[#1e293b] shadow-sm h-[380px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Model Forecast Accuracy</h3>
            <span className="text-[9px] text-[#cbd5e1] font-bold bg-[#0f172a] border border-[#334155] px-2.5 py-1 rounded-full flex items-center gap-1.5">
              Validation Loops
            </span>
          </div>
          <div className="flex-grow w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST_ACCURACY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[250, 420]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '6px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '9px', pt: 10 }} />
                <Line type="monotone" dataKey="predicted" name="Predicted AQI" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actual" name="Ground Truth" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detail Table */}
      <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-6 shadow-sm overflow-hidden">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Intervention Efficiency Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#334155] text-[#9ca3af] font-bold uppercase text-[9px] tracking-wider">
                <th className="py-3 px-4">Policy Initiative</th>
                <th className="py-3 px-4">Target Pollutant</th>
                <th className="py-3 px-4">Daily Reduction (Tons)</th>
                <th className="py-3 px-4">Average Compliance</th>
                <th className="py-3 px-4">Health Inhalation Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155] text-[#cbd5e1]">
              {MOCK_REDUCTIONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{row.policy}</td>
                  <td className="py-3.5 px-4">{row.target}</td>
                  <td className="py-3.5 px-4 text-[#10b981] font-bold">-{row.tons} t</td>
                  <td className="py-3.5 px-4 font-semibold">94.8%</td>
                  <td className="py-3.5 px-4 font-semibold">-{Math.round(row.tons * 40) / 100} kg/capita</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Analytics;
