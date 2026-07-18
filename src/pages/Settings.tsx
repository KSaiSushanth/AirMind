import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, User, Bell, Map, Shield } from 'lucide-react';
import { AdminGuard } from '../components/ui/AdminGuard';

export const Settings: React.FC = () => {
  const { userRole } = useApp();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    system: true
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1000px] mx-auto select-none font-sans bg-[#0f172a] text-[#f8fafc]">
      
      {/* Introduction */}
      <div className="border-b border-[#334155] pb-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-4.5 h-4.5 text-neutral-455" />
          <span>System Configurations</span>
        </h2>
        <p className="text-xs text-[#9ca3af] mt-0.5">Adjust user profiles, notification channels, and active workspace nodes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Options Navigator */}
        <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-4 shadow-sm h-fit flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0f172a] text-white text-xs font-bold border border-[#334155] text-left cursor-pointer">
            <User className="w-4 h-4" />
            <span>Profile Configuration</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#9ca3af] hover:bg-[#0f172a] hover:text-white text-xs font-bold text-left cursor-pointer">
            <Bell className="w-4 h-4" />
            <span>Notification Channels</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#9ca3af] hover:bg-[#0f172a] hover:text-white text-xs font-bold text-left cursor-pointer">
            <Map className="w-4 h-4" />
            <span>Active Air-shed Node</span>
          </button>
        </div>

        {/* Right Settings Forms */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Profile Card */}
          <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider pb-3 border-b border-[#334155] flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-neutral-400" />
              <span>Authority Profile Identifier</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-[#9ca3af] mb-2">Display Name</label>
                <AdminGuard label="Admin only — edit profile" block>
                  <input
                    type="text" defaultValue={userRole === 'admin' ? 'Smart City Planner A' : 'User Node 1'}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded px-4 py-2 text-xs text-white outline-none focus:border-blue-500 font-semibold"
                  />
                </AdminGuard>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-[#9ca3af] mb-2">Account Node Role</label>
                <input 
                  type="text" disabled value={userRole?.toUpperCase() || ''}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded px-4 py-2 text-xs text-[#cbd5e1] font-bold outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="border border-[#334155] bg-[#1e293b] rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider pb-3 border-b border-[#334155] flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-neutral-400" />
              <span>Notification Dispatches</span>
            </h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2.5 border-b border-[#334155]">
                <div>
                  <span className="text-xs font-bold text-white block">Critical System Alerts</span>
                  <span className="text-[10px] text-[#9ca3af]">Push immediate warnings to dashboards.</span>
                </div>
                <AdminGuard label="Admin only — toggle">
                  <button
                    onClick={() => handleToggle('system')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 cursor-pointer ${notifications.system ? 'bg-blue-600' : 'bg-[#0f172a] border border-[#334155]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${notifications.system ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </AdminGuard>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-[#334155]">
                <div>
                  <span className="text-xs font-bold text-white block">Email Reports Dispatch</span>
                  <span className="text-[10px] text-[#9ca3af]">Send summary logs every 24 hours.</span>
                </div>
                <AdminGuard label="Admin only — toggle">
                  <button
                    onClick={() => handleToggle('email')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 cursor-pointer ${notifications.email ? 'bg-blue-600' : 'bg-[#0f172a] border border-[#334155]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${notifications.email ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </AdminGuard>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div>
                  <span className="text-xs font-bold text-white block">Emergency SMS Broadcast</span>
                  <span className="text-[10px] text-[#9ca3af]">Send warnings directly to citizen phone numbers.</span>
                </div>
                <AdminGuard label="Admin only — toggle">
                  <button
                    onClick={() => handleToggle('sms')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 cursor-pointer ${notifications.sms ? 'bg-blue-600' : 'bg-[#0f172a] border border-[#334155]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${notifications.sms ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </AdminGuard>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default Settings;
