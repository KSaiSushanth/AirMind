import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { AmbientBackground } from '../components/AmbientBackground';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex w-screen h-screen bg-surface-base overflow-hidden text-text-primary relative">
      <AmbientBackground />
      <Sidebar />
      <div className="flex-grow flex flex-col h-full overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
