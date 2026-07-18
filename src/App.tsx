import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import GovDashboard from './pages/GovDashboard';
import AirMap from './pages/AirMap';
import Forecast from './pages/Forecast';
import Simulation from './pages/Simulation';
import Copilot from './pages/Copilot';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Citizen from './pages/Citizen';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Login Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Government / Unified Portal Layout */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<GovDashboard />} />
          <Route path="map" element={<AirMap />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="analytics"   element={<Analytics />} />
          <Route path="alerts"      element={<Alerts />} />
          <Route path="health"      element={<Citizen />} />
          <Route path="settings"    element={<Settings />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Citizen Portal Layout */}
        <Route path="/citizen" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Citizen />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
