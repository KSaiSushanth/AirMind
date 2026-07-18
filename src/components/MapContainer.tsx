import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { useApp, API_BASE_URL } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';

const getAqiColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981'; // Green
  if (aqi <= 100) return '#f59e0b'; // Yellow/Amber
  if (aqi <= 150) return '#f97316'; // Orange
  if (aqi <= 200) return '#ef4444'; // Red
  if (aqi <= 300) return '#ec4899'; // Purple
  return '#7f1d1d'; // Maroon
};

const createStationIcon = (aqi: number) => {
  const color = getAqiColor(aqi);
  return L.divIcon({
    className: 'custom-station-icon',
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-5 h-5 rounded-full animate-ping opacity-35" style="background-color: ${color};"></div>
             <div class="relative w-4.5 h-4.5 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}; box-shadow: 0 0 12px ${color};"></div>
           </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const createSourceIcon = (type: string) => {
  let emoji = "🏭";
  let color = "#ef4444";
  if (type === "construction") {
    emoji = "🏗️";
    color = "#f59e0b";
  } else if (type === "traffic") {
    emoji = "🚦";
    color = "#3b82f6";
  }
  return L.divIcon({
    className: 'custom-source-icon',
    html: `<div class="text-xl flex items-center justify-center cursor-pointer select-none" style="filter: drop-shadow(0 0 6px ${color});">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const AirMap: React.FC = () => {
  const { currentCity } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  
  const [cityData, setCityData] = useState<any>(CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi);

  // Fetch live city data
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cities/${currentCity.toLowerCase()}`);
        if (response.ok) {
          const data = await response.json();
          setCityData(data);
        }
      } catch (err) {
        console.warn("Map API offline. Loading local coordinate fallbacks.");
        setCityData(CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi);
      }
    };
    fetchCityData();
  }, [currentCity]);

  // Handle map instance initialization and marker rendering
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const centerCoords = cityData.center || [28.6139, 77.2090];

    // 1. Initialize Map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Create a layer group to hold dynamic markers
      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    } else {
      // Re-center map if active city changes
      mapInstanceRef.current.setView(centerCoords, 12);
    }

    const mapInstance = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (layerGroup) {
      // Clear old layers/markers before rendering new ones
      layerGroup.clearLayers();

      // 2. Plot stations markers
      if (cityData.stations) {
        cityData.stations.forEach((station: any) => {
          const marker = L.marker(station.coords, {
            icon: createStationIcon(station.aqi)
          });
          
          const popupContent = `
            <div class="p-2 text-slate-900 font-sans min-w-[150px]">
              <h4 class="font-bold text-xs mb-1" style="color: #0f172a;">${station.name}</h4>
              <div class="flex items-center gap-1.5 mb-1 text-xs">
                <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${getAqiColor(station.aqi)};"></span>
                <span class="font-bold">AQI: ${station.aqi}</span>
                <span class="text-[10px] text-gray-500">(${station.status})</span>
              </div>
              <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] mt-2 border-t pt-2" style="border-color: #e2e8f0;">
                <div>PM2.5: <b>${station.pm25}</b></div>
                <div>PM10: <b>${station.pm10}</b></div>
                <div>NO₂: <b>${station.no2}</b></div>
                <div>SO₂: <b>${station.so2}</b></div>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          layerGroup.addLayer(marker);
        });
      }

      // 3. Plot emission source markers
      if (cityData.sources) {
        cityData.sources.forEach((source: any) => {
          const marker = L.marker(source.coords, {
            icon: createSourceIcon(source.type)
          });
          
          const popupContent = `
            <div class="p-2 text-slate-900 font-sans max-w-[200px]">
              <h4 class="font-bold text-xs mb-0.5" style="color: #0f172a;">${source.name}</h4>
              <span class="text-[9px] uppercase font-bold text-gray-400 block mb-1">Type: ${source.type}</span>
              <p class="text-[10px] text-gray-600 leading-normal mb-1">${source.desc}</p>
              <div class="border-t pt-1.5 flex justify-between items-center text-[10px]" style="border-color: #e2e8f0;">
                <span class="text-gray-400">Emission:</span>
                <span class="font-bold text-red-500">${source.emissionRate}</span>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          layerGroup.addLayer(marker);
        });
      }

      // 4. Render Delhi specific weather boundary circles
      if (currentCity.toLowerCase() === 'delhi') {
        const c1 = L.circle([28.6476, 77.3158], {
          radius: 2000,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.12,
          weight: 1
        });
        const c2 = L.circle([28.6275, 77.3725], {
          radius: 1500,
          color: '#f59e0b',
          fillColor: '#f59e0b',
          fillOpacity: 0.1,
          weight: 1
        });
        layerGroup.addLayer(c1);
        layerGroup.addLayer(c2);
      }
    }
  }, [cityData, currentCity]);

  // Cleanup map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl border border-slate-200">
      <div 
        ref={mapContainerRef} 
        style={{ height: '100%', width: '100%' }} 
        className="w-full h-full z-10"
      />

      {/* Map Legend overlay */}
      <div className="absolute bottom-4 left-4 bg-white border border-slate-200 rounded-xl p-4 z-20 text-xs shadow-sm pointer-events-auto select-none">
        <h5 className="font-semibold text-slate-800 mb-2">Air Quality Category</h5>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
            <span>Good (0 - 50)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
            <span>Moderate (51 - 100)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#f97316]"></span>
            <span>Poor (101 - 200)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
            <span>Very Poor (201 - 300)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#ec4899]"></span>
            <span>Severe (301 - 400)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#7f1d1d]"></span>
            <span>Hazardous (400+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AirMap;
