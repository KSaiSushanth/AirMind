import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CITIES_DATABASE, MOCK_ALERTS, AlertLog, ChatMessage } from '../mock/mockData';

export const API_BASE_URL = 'http://localhost:8000/api';

export interface DashboardData {
  cityName: string;
  overallAqi: number;
  status: string;
  primaryPollutant: string;
  weather: {
    temp: string;
    humidity: string;
    windSpeed: string;
    windDir: string;
    barometer: string;
  };
  budget: {
    capacityTons: number;
    usedTons: number;
    availablePercent: number;
    riskLevel: string;
  };
  sources: Record<string, number>;
  alerts: AlertLog[];
  recentLogs: string[];
}

interface SimulationSettings {
  roadClosure: number;
  reduceTraffic: number;
  pauseConstruction: number;
  reduceIndustry: number;
}

interface AppContextType {
  currentCity: string;
  setCurrentCity: (city: string) => void;
  userRole: 'admin' | 'user';
  setUserRole: (role: 'admin' | 'user') => void;
  simulationSettings: SimulationSettings;
  setSimulationSettings: (settings: SimulationSettings) => void;
  activeAlerts: AlertLog[];
  setActiveAlerts: React.Dispatch<React.SetStateAction<AlertLog[]>>;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  
  // Real API integration states
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  
  // Real API methods
  fetchDashboard: (city: string) => Promise<void>;
  loginUser: (role: 'admin' | 'user') => Promise<boolean>;
  logoutUser: () => void;
  executeSimulation: (settings: SimulationSettings) => Promise<any>;
  sendCopilotQuery: (query: string) => Promise<void>;
  resolveAlertBackend: (alertId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<string>('delhi');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('admin');
  const [token, setToken] = useState<string | null>(localStorage.getItem('airmind_token'));
  
  const [simulationSettings, setSimulationSettings] = useState<SimulationSettings>({
    roadClosure: 0,
    reduceTraffic: 10,
    pauseConstruction: 20,
    reduceIndustry: 10,
  });

  const [activeAlerts, setActiveAlerts] = useState<AlertLog[]>(MOCK_ALERTS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'bot', text: "🤖 **AURA Copilot:** I can analyze causal networks, check sensor trends, or simulate interventions. Type a query or select a suggested prompt to begin." }
  ]);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync token with auth role on boot
  useEffect(() => {
    const savedRole = localStorage.getItem('airmind_role') as any;
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  const getHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const activeToken = localStorage.getItem('airmind_token');
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return headers;
  };

  const fetchDashboard = async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary?city=${city.toLowerCase()}`);
      if (!response.ok) throw new Error('Failed to retrieve summary logs.');
      const data = await response.json();
      
      // Map API alerts format
      const formattedAlerts: AlertLog[] = data.alerts.map((a: any) => ({
        id: a.id,
        city: a.city,
        title: a.title,
        desc: a.desc,
        severity: a.severity as 'critical' | 'warning',
        timestamp: a.timestamp,
        status: a.status as 'active' | 'resolved'
      }));

      setDashboardData({
        cityName: data.cityName,
        overallAqi: data.overallAqi,
        status: data.status,
        primaryPollutant: data.primaryPollutant,
        weather: data.weather,
        budget: data.budget,
        sources: data.sources || {
          "Traffic": 42,
          "Industry": 21,
          "Construction": 17,
          "Weather / Dispersion": 14,
          "Others (Soil/Natural)": 6
        },
        alerts: formattedAlerts,
        recentLogs: data.recentLogs
      });
      setActiveAlerts(formattedAlerts);
    } catch (err: any) {
      console.warn('Backend offline or error. Falling back to high-fidelity mock data:', err.message);
      setError(err.message);
      
      // Offline fallback behavior
      const mockCity = CITIES_DATABASE[city] || CITIES_DATABASE['delhi'];
      const filteredMockAlerts = MOCK_ALERTS.filter(a => a.city === city);
      
      setDashboardData({
        cityName: city,
        overallAqi: mockCity.overallAqi,
        status: mockCity.status,
        primaryPollutant: mockCity.primaryPollutant,
        weather: mockCity.weather,
        budget: {
          capacityTons: 420,
          usedTons: 285,
          availablePercent: 68,
          riskLevel: city === 'delhi' ? 'Stagnation Risk Alert' : 'Stable'
        },
        sources: {
          "Traffic": 42,
          "Industry": 21,
          "Construction": 17,
          "Weather / Dispersion": 14,
          "Others (Soil/Natural)": 6
        },
        alerts: filteredMockAlerts,
        recentLogs: [
          `[Offline Fallback] Ingestion stable. Displaying cached profiles for ${city}.`,
          `[Causal Agent] SCM pathways locked to standard baseline values.`,
          `[Enforcement] Broadcast warning queues synchronized.`
        ]
      });
      setActiveAlerts(filteredMockAlerts);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (role: 'admin' | 'user'): Promise<boolean> => {
    const email = role === 'admin' ? 'admin@airmind.gov.in' : 'user@airmind.gov.in';
    const password = role === 'admin' ? 'admin123' : 'user123';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      localStorage.setItem('airmind_token', data.access_token);
      localStorage.setItem('airmind_role', role);
      setToken(data.access_token);
      setUserRole(role);
      return true;
    } catch (err: any) {
      console.warn('Backend offline — using local bypass.');
      localStorage.setItem('airmind_role', role);
      setUserRole(role);
      return true;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('airmind_token');
    localStorage.removeItem('airmind_role');
    setToken(null);
  };

  const executeSimulation = async (settings: SimulationSettings): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/simulation`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Simulation failed.');
      return await response.json();
    } catch (err: any) {
      console.warn('Simulation API error. Running local calculation fallbacks:', err.message);
      // Inline mathematical logic matching predictor.py fallback
      const total_aqi_red = roundMath(
        settings.reduceTraffic * 0.8 + 
        settings.pauseConstruction * 0.6 + 
        settings.reduceIndustry * 1.2 + 
        settings.roadClosure * 0.4
      );
      const total_cost = roundMath(settings.reduceTraffic * 2.5 + settings.pauseConstruction * 4.2 + settings.reduceIndustry * 8.5 + settings.roadClosure * 1.8);
      
      return {
        aqiReduction: `-${total_aqi_red} AQI`,
        cost: `$${total_cost}k / Day`,
        healthImpact: `-${roundMath(total_aqi_red * 0.25)}% ER Admissions`
      };
    }
  };

  const sendCopilotQuery = async (query: string) => {
    const userMsg: ChatMessage = { sender: 'user', text: query };
    setChatHistory(prev => [...prev, userMsg]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!response.ok) throw new Error('Copilot query failed.');
      const data = await response.json();
      
      setChatHistory(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err: any) {
      console.warn('Copilot connection issue. Falling back to local offline handler.');
      const reply = "🤖 **AURA Copilot (Offline Mode):** I am operating in sandbox offline mode. Causal weather vector is stable. Connect database server to trigger live Gemini reasoning.";
      setChatHistory(prev => [...prev, { sender: 'bot', text: reply }]);
    }
  };

  const resolveAlertBackend = async (alertId: string) => {
    try {
      await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'resolved' })
      });
    } catch (err: any) {
      console.warn('Could not connect to resolve alert on backend:', err.message);
    }
  };

  const roundMath = (val: number) => Math.round(val);

  // Auto load dashboard data on mount and on currentCity change
  useEffect(() => {
    fetchDashboard(currentCity);
  }, [currentCity]);

  return (
    <AppContext.Provider value={{
      currentCity,
      setCurrentCity,
      userRole,
      setUserRole,
      simulationSettings,
      setSimulationSettings,
      activeAlerts,
      setActiveAlerts,
      chatHistory,
      setChatHistory,
      
      dashboardData,
      isLoading,
      error,
      token,
      
      fetchDashboard,
      loginUser,
      logoutUser,
      executeSimulation,
      sendCopilotQuery,
      resolveAlertBackend
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
