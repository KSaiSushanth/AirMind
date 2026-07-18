import React, { useState } from 'react';
import { AirMap as LeafletMap } from '../components/MapContainer';
import { useApp } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { Wind, Sliders, ToggleLeft, ToggleRight, MapPin, Building, Eye } from 'lucide-react';

export const AirMap: React.FC = () => {
  const { currentCity } = useApp();
  const cityData = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;

  const [layers, setLayers] = useState({
    sensors: true,
    traffic: true,
    factories: true,
    construction: true
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] flex overflow-hidden font-sans bg-[#0f172a] text-[#cbd5e1]">
      
      {/* Map Control Settings Panel */}
      <aside className="w-80 h-full border-r border-[#334155] bg-[#111827] p-6 flex flex-col justify-between flex-shrink-0 z-20 select-none">
        <div>
          <div className="flex items-center gap-2 mb-6 text-white">
            <Sliders className="w-4.5 h-4.5 text-neutral-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider font-['Inter']">Map Controllers</h3>
          </div>

          {/* Layer toggles */}
          <div className="flex flex-col gap-3 mb-8">
            <h4 className="text-[9px] uppercase font-bold text-[#9ca3af] tracking-wider">Spatial Map Layers</h4>
            
            <button 
              onClick={() => toggleLayer('sensors')} 
              className="flex items-center justify-between py-2.5 border-b border-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>CAAQMS Sensors</span>
              </div>
              {layers.sensors ? <ToggleRight className="w-5.5 h-5.5 text-blue-500" /> : <ToggleLeft className="w-5.5 h-5.5 text-[#334155]" />}
            </button>

            <button 
              onClick={() => toggleLayer('factories')} 
              className="flex items-center justify-between py-2.5 border-b border-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-red-500" />
                <span>Industrial Stacks</span>
              </div>
              {layers.factories ? <ToggleRight className="w-5.5 h-5.5 text-blue-500" /> : <ToggleLeft className="w-5.5 h-5.5 text-[#334155]" />}
            </button>

            <button 
              onClick={() => toggleLayer('construction')} 
              className="flex items-center justify-between py-2.5 border-b border-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-amber-500" />
                <span>Construction Sites</span>
              </div>
              {layers.construction ? <ToggleRight className="w-5.5 h-5.5 text-blue-500" /> : <ToggleLeft className="w-5.5 h-5.5 text-[#334155]" />}
            </button>

            <button 
              onClick={() => toggleLayer('traffic')} 
              className="flex items-center justify-between py-2.5 border-b border-[#334155] text-xs font-medium text-[#cbd5e1] hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-blue-500" />
                <span>Traffic Congestions</span>
              </div>
              {layers.traffic ? <ToggleRight className="w-5.5 h-5.5 text-blue-500" /> : <ToggleLeft className="w-5.5 h-5.5 text-[#334155]" />}
            </button>
          </div>

          {/* Meteorological summary */}
          <div className="flex flex-col gap-2.5 p-4 bg-[#0f172a] border border-[#334155] rounded-lg">
            <h4 className="text-[9px] uppercase font-bold text-[#9ca3af]">Wind Canyon Vector</h4>
            <div className="flex items-center justify-between mt-1 text-[10px] font-semibold">
              <span className="text-[#6b7280]">Direction:</span>
              <span className="text-white">{cityData.weather.windDir}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-semibold">
              <span className="text-[#6b7280]">Velocity:</span>
              <span className="text-white">{cityData.weather.windSpeed}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-semibold">
              <span className="text-[#6b7280]">Relative Humidity:</span>
              <span className="text-white">{cityData.weather.humidity}</span>
            </div>
          </div>
        </div>

        {/* Informational details */}
        <div className="text-[10px] text-[#6b7280] leading-relaxed">
          🔒 Enterprise Plume Mapping Node is validated by satellite telemetry data inputs.
        </div>
      </aside>

      {/* Map Content Center */}
      <div className="flex-grow h-full relative">
        <LeafletMap />
      </div>

    </div>
  );
};
export default AirMap;
