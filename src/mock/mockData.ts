export interface SensorData {
  id: string;
  name: string;
  coords: [number, number];
  aqi: number;
  status: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' | 'Hazardous';
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface PollutionSource {
  id: string;
  name: string;
  coords: [number, number];
  type: 'industrial' | 'construction' | 'traffic';
  emissionRate: string;
  status: string;
  desc: string;
  impact: number;
}

export interface CityData {
  name: string;
  center: [number, number];
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
  stations: SensorData[];
  sources: PollutionSource[];
  historicalAqi: number[];
  forecastAqi: { time: string; aqi: number; temp: number; wind: number; confidence: number }[];
}

export const CITIES_DATABASE: Record<string, CityData> = {
  delhi: {
    name: "Delhi (NCR)",
    center: [28.6139, 77.2090],
    overallAqi: 342,
    status: "Very Poor",
    primaryPollutant: "PM2.5",
    weather: {
      temp: "38°C",
      humidity: "24%",
      windSpeed: "4.8 km/h",
      windDir: "WNW",
      barometer: "1004 hPa"
    },
    stations: [
      { id: "dl_anand_vihar", name: "Anand Vihar CAAQMS", coords: [28.6476, 77.3158], aqi: 412, status: "Severe", pm25: 412, pm10: 480, no2: 89, so2: 24, co: 1.8, o3: 45 },
      { id: "dl_shadipur", name: "Shadipur CAAQMS", coords: [28.6515, 77.1581], aqi: 320, status: "Very Poor", pm25: 320, pm10: 380, no2: 65, so2: 18, co: 1.2, o3: 50 },
      { id: "dl_rk_puram", name: "R.K. Puram CAAQMS", coords: [28.5653, 77.1866], aqi: 295, status: "Poor", pm25: 295, pm10: 310, no2: 52, so2: 12, co: 0.9, o3: 62 },
      { id: "dl_igi_airport", name: "IGI Airport T3 CAAQMS", coords: [28.5562, 77.1000], aqi: 285, status: "Poor", pm25: 285, pm10: 300, no2: 48, so2: 15, co: 1.1, o3: 58 },
      { id: "dl_dtu", name: "DTU CAAQMS", coords: [28.7501, 77.1176], aqi: 350, status: "Very Poor", pm25: 350, pm10: 395, no2: 74, so2: 20, co: 1.5, o3: 40 }
    ],
    sources: [
      { id: "src_dl_badarpur", name: "Badarpur Eco-Park (Ex-Thermal)", coords: [28.5065, 77.3075], type: "industrial", emissionRate: "High (Dust & Coal Ash)", status: "Active Monitoring", desc: "High dust suspension from fly ash dump.", impact: 18 },
      { id: "src_dl_mayapuri", name: "Mayapuri Industrial Area", coords: [28.6340, 77.1280], type: "industrial", emissionRate: "Moderate-High", status: "Under Audit", desc: "Metal casting and scrap recycling.", impact: 22 },
      { id: "src_dl_const_noida", name: "Noida Sector 62 Metro Build", coords: [28.6275, 77.3725], type: "construction", emissionRate: "Violating", status: "Warning Issued", desc: "Uncovered earth excavation.", impact: 25 },
      { id: "src_dl_const_dwarka", name: "Dwarka Sec 22 Residential Site", coords: [28.5600, 77.0500], type: "construction", emissionRate: "Compliant", status: "Active", desc: "Water sprinklers & dust curtains active.", impact: 8 },
      { id: "src_dl_traffic_ito", name: "ITO Intersection Peak Congestion", coords: [28.6284, 77.2400], type: "traffic", emissionRate: "Very High", status: "Critical", desc: "Heavy exhaust. Avg speed: 8 km/h.", impact: 35 }
    ],
    historicalAqi: [280, 295, 310, 315, 322, 330, 345, 350, 342, 335, 320, 310, 318, 342],
    forecastAqi: [
      { time: "08:00 AM", aqi: 320, temp: 31, wind: 6, confidence: 95 },
      { time: "12:00 PM", aqi: 310, temp: 39, wind: 8, confidence: 92 },
      { time: "04:00 PM", aqi: 325, temp: 41, wind: 7, confidence: 89 },
      { time: "08:00 PM", aqi: 350, temp: 36, wind: 4, confidence: 94 },
      { time: "12:00 AM", aqi: 375, temp: 33, wind: 3, confidence: 96 },
      { time: "04:00 AM", aqi: 390, temp: 30, wind: 2, confidence: 97 }
    ]
  },
  mumbai: {
    name: "Mumbai",
    center: [19.0760, 72.8777],
    overallAqi: 124,
    status: "Moderate",
    primaryPollutant: "PM10",
    weather: {
      temp: "31°C",
      humidity: "78%",
      windSpeed: "14.2 km/h",
      windDir: "WSW",
      barometer: "1009 hPa"
    },
    stations: [
      { id: "mb_bandra", name: "Bandra CAAQMS", coords: [19.0544, 72.8402], aqi: 142, status: "Moderate", pm25: 65, pm10: 142, no2: 34, so2: 12, co: 0.6, o3: 30 },
      { id: "mb_kurla", name: "Kurla CAAQMS", coords: [19.0600, 72.8900], aqi: 165, status: "Poor", pm25: 84, pm10: 165, no2: 45, so2: 15, co: 0.8, o3: 25 },
      { id: "mb_colaba", name: "Colaba CAAQMS", coords: [18.9067, 72.8147], aqi: 85, status: "Moderate", pm25: 38, pm10: 85, no2: 20, so2: 8, co: 0.4, o3: 42 }
    ],
    sources: [
      { id: "src_mb_refinery", name: "Chembur Refinery Cluster", coords: [19.0020, 72.9080], type: "industrial", emissionRate: "Moderate (SOx)", status: "Monitoring", desc: "Petroleum distillation emissions.", impact: 30 },
      { id: "src_mb_const_coastal", name: "Coastal Road Project Worli", coords: [19.0200, 72.8150], type: "construction", emissionRate: "Moderate", status: "Compliant", desc: "Land reclamation activity.", impact: 12 },
      { id: "src_mb_const_metro3", name: "Metro Line 3 Cuffe Parade", coords: [18.9150, 72.8120], type: "construction", emissionRate: "Violating", status: "Warning Issued", desc: "Muck loading and dust dispersion.", impact: 28 }
    ],
    historicalAqi: [95, 102, 110, 115, 120, 125, 124, 118, 110, 98, 92, 105, 118, 124],
    forecastAqi: [
      { time: "08:00 AM", aqi: 110, temp: 28, wind: 15, confidence: 91 },
      { time: "12:00 PM", aqi: 105, temp: 31, wind: 18, confidence: 88 },
      { time: "04:00 PM", aqi: 112, temp: 32, wind: 16, confidence: 85 },
      { time: "08:00 PM", aqi: 124, temp: 29, wind: 12, confidence: 90 },
      { time: "12:00 AM", aqi: 130, temp: 27, wind: 10, confidence: 93 },
      { time: "04:00 AM", aqi: 135, temp: 26, wind: 8, confidence: 95 }
    ]
  },
  bengaluru: {
    name: "Bengaluru",
    center: [12.9716, 77.5946],
    overallAqi: 82,
    status: "Satisfactory",
    primaryPollutant: "PM2.5",
    weather: {
      temp: "27°C",
      humidity: "62%",
      windSpeed: "16.5 km/h",
      windDir: "E",
      barometer: "1012 hPa"
    },
    stations: [
      { id: "bl_silk_board", name: "Silk Board CAAQMS", coords: [12.9176, 77.6244], aqi: 145, status: "Moderate", pm25: 68, pm10: 145, no2: 56, so2: 10, co: 1.4, o3: 35 },
      { id: "bl_peenya", name: "Peenya Industrial CAAQMS", coords: [13.0285, 77.5198], aqi: 115, status: "Moderate", pm25: 50, pm10: 115, no2: 38, so2: 22, co: 0.9, o3: 28 },
      { id: "bl_city_railway", name: "KSR Railway Station CAAQMS", coords: [12.9780, 77.5695], aqi: 92, status: "Moderate", pm25: 40, pm10: 92, no2: 29, so2: 8, co: 0.7, o3: 40 }
    ],
    sources: [
      { id: "src_bl_peenya_ind", name: "Peenya Electroplating Block", coords: [13.0380, 77.5020], type: "industrial", emissionRate: "Moderate", status: "Active", desc: "Chemical flue gas emissions.", impact: 15 },
      { id: "src_bl_const_orrb", name: "Outer Ring Road Metro 2A", coords: [12.9240, 77.6780], type: "construction", emissionRate: "High", status: "Fined", desc: "Casting yard dust generation.", impact: 18 },
      { id: "src_bl_traffic_silk", name: "Silk Board Overpass Junction", coords: [12.9170, 77.6235], type: "traffic", emissionRate: "Very High", status: "Congested", desc: "Bumper-to-bumper diesel transit.", impact: 42 }
    ],
    historicalAqi: [62, 68, 74, 80, 85, 82, 82, 79, 72, 65, 60, 70, 78, 82],
    forecastAqi: [
      { time: "08:00 AM", aqi: 75, temp: 24, wind: 17, confidence: 93 },
      { time: "12:00 PM", aqi: 70, temp: 28, wind: 19, confidence: 90 },
      { time: "04:00 PM", aqi: 78, temp: 29, wind: 18, confidence: 87 },
      { time: "08:00 PM", aqi: 82, temp: 26, wind: 15, confidence: 91 },
      { time: "12:00 AM", aqi: 88, temp: 23, wind: 12, confidence: 94 },
      { time: "04:00 AM", aqi: 92, temp: 22, wind: 11, confidence: 96 }
    ]
  },
  hyderabad: {
    name: "Hyderabad",
    center: [17.3850, 78.4867],
    overallAqi: 154,
    status: "Moderate",
    primaryPollutant: "PM2.5",
    weather: {
      temp: "33°C",
      humidity: "48%",
      windSpeed: "8.5 km/h",
      windDir: "NW",
      barometer: "1010 hPa"
    },
    stations: [
      { id: "hyd_bollarum", name: "Bollarum CAAQMS", coords: [17.5186, 78.4312], aqi: 172, status: "Poor", pm25: 96, pm10: 172, no2: 38, so2: 14, co: 1.0, o3: 32 },
      { id: "hyd_sanathnagar", name: "Sanathnagar CAAQMS", coords: [17.4560, 78.4410], aqi: 135, status: "Moderate", pm25: 58, pm10: 135, no2: 30, so2: 12, co: 0.8, o3: 28 }
    ],
    sources: [
      { id: "src_hyd_jeedimetla", name: "Jeedimetla Industrial Zone", coords: [17.5100, 78.4500], type: "industrial", emissionRate: "Moderate-High", status: "Active", desc: "Chemical and pharma manufacturing emissions.", impact: 20 },
      { id: "src_hyd_const_gachibowli", name: "Gachibowli High-Rise Build", coords: [17.4400, 78.3500], type: "construction", emissionRate: "Moderate", status: "Compliant", desc: "Commercial tower excavation dust.", impact: 10 }
    ],
    historicalAqi: [110, 125, 130, 138, 145, 150, 154, 148, 140, 130, 122, 135, 142, 154],
    forecastAqi: [
      { time: "08:00 AM", aqi: 140, temp: 28, wind: 9, confidence: 90 },
      { time: "12:00 PM", aqi: 135, temp: 33, wind: 11, confidence: 87 },
      { time: "04:00 PM", aqi: 148, temp: 34, wind: 10, confidence: 85 },
      { time: "08:00 PM", aqi: 154, temp: 31, wind: 8, confidence: 89 },
      { time: "12:00 AM", aqi: 160, temp: 29, wind: 7, confidence: 92 },
      { time: "04:00 AM", aqi: 165, temp: 28, wind: 6, confidence: 94 }
    ]
  },
  chennai: {
    name: "Chennai",
    center: [13.0827, 80.2707],
    overallAqi: 94,
    status: "Satisfactory",
    primaryPollutant: "PM10",
    weather: {
      temp: "34°C",
      humidity: "72%",
      windSpeed: "15.0 km/h",
      windDir: "ENE",
      barometer: "1008 hPa"
    },
    stations: [
      { id: "ch_manali", name: "Manali CAAQMS", coords: [13.1670, 80.2580], aqi: 124, status: "Moderate", pm25: 55, pm10: 124, no2: 24, so2: 18, co: 0.7, o3: 35 },
      { id: "ch_alandur", name: "Alandur Bus Depot CAAQMS", coords: [13.0030, 80.2010], aqi: 82, status: "Satisfactory", pm25: 35, pm10: 82, no2: 15, so2: 8, co: 0.5, o3: 40 }
    ],
    sources: [
      { id: "src_ch_refinery", name: "Manali Petrochemical Complex", coords: [13.1750, 80.2700], type: "industrial", emissionRate: "Moderate-High", status: "Active Monitoring", desc: "Chemical processing and steam boiler exhaust.", impact: 22 },
      { id: "src_ch_traffic_kathipara", name: "Kathipara Cloverleaf Transit", coords: [13.0070, 80.2050], type: "traffic", emissionRate: "High", status: "Congested", desc: "Heavy intersection peak-hour flow.", impact: 26 }
    ],
    historicalAqi: [80, 85, 90, 95, 98, 96, 94, 91, 88, 82, 78, 85, 89, 94],
    forecastAqi: [
      { time: "08:00 AM", aqi: 88, temp: 30, wind: 16, confidence: 92 },
      { time: "12:00 PM", aqi: 82, temp: 34, wind: 18, confidence: 89 },
      { time: "04:00 PM", aqi: 90, temp: 35, wind: 17, confidence: 86 },
      { time: "08:00 PM", aqi: 94, temp: 32, wind: 14, confidence: 90 },
      { time: "12:00 AM", aqi: 98, temp: 30, wind: 12, confidence: 93 },
      { time: "04:00 AM", aqi: 102, temp: 29, wind: 10, confidence: 95 }
    ]
  },
  kolkata: {
    name: "Kolkata",
    center: [22.5726, 88.3639],
    overallAqi: 245,
    status: "Poor",
    primaryPollutant: "PM2.5",
    weather: {
      temp: "35°C",
      humidity: "65%",
      windSpeed: "6.2 km/h",
      windDir: "S",
      barometer: "1006 hPa"
    },
    stations: [
      { id: "kol_victoria", name: "Victoria Memorial CAAQMS", coords: [22.5448, 88.3426], aqi: 210, status: "Poor", pm25: 210, pm10: 230, no2: 45, so2: 12, co: 1.1, o3: 50 },
      { id: "kol_jadavpur", name: "Jadavpur CAAQMS", coords: [22.4990, 88.3710], aqi: 265, status: "Poor", pm25: 265, pm10: 295, no2: 52, so2: 15, co: 1.3, o3: 42 },
      { id: "kol_howrah", name: "Howrah CAAQMS", coords: [22.5850, 88.3380], aqi: 290, status: "Poor", pm25: 290, pm10: 310, no2: 58, so2: 18, co: 1.4, o3: 38 }
    ],
    sources: [
      { id: "src_kol_brickkiln", name: "Hooghly River Brick Kilns", coords: [22.6500, 88.3100], type: "industrial", emissionRate: "High", status: "Active", desc: "Coal combustion flue gas emissions.", impact: 25 },
      { id: "src_kol_traffic_howrah", name: "Howrah Bridge Logistics Hub", coords: [22.5830, 88.3480], type: "traffic", emissionRate: "Very High", status: "Critical", desc: "Constant heavy commercial vehicle idle emissions.", impact: 32 }
    ],
    historicalAqi: [180, 195, 210, 225, 238, 245, 245, 238, 220, 205, 190, 215, 230, 245],
    forecastAqi: [
      { time: "08:00 AM", aqi: 220, temp: 29, wind: 8, confidence: 91 },
      { time: "12:00 PM", aqi: 210, temp: 35, wind: 10, confidence: 88 },
      { time: "04:00 PM", aqi: 230, temp: 36, wind: 9, confidence: 86 },
      { time: "08:00 PM", aqi: 245, temp: 33, wind: 7, confidence: 90 },
      { time: "12:00 AM", aqi: 255, temp: 31, wind: 5, confidence: 93 },
      { time: "04:00 AM", aqi: 268, temp: 30, wind: 4, confidence: 95 }
    ]
  }
};

export interface AlertLog {
  id: string;
  city: string;
  title: string;
  desc: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  status: 'active' | 'resolved';
}

export const MOCK_ALERTS: AlertLog[] = [
  {
    id: "alert-1",
    city: "delhi",
    title: "Thermal Inversion Warning",
    desc: "Boundary layer height predicted to collapse to 200m in 12 hours. Dispersion capability will drop by 70%. High risk of particulate trapping.",
    severity: "critical",
    timestamp: "10:30 AM",
    status: "active"
  },
  {
    id: "alert-2",
    city: "delhi",
    title: "Construction Dust Violation",
    desc: "Noida Sector 62 site registers continuous PM10 spikes (>600 µg/m³). Water mist cannons inactive.",
    severity: "warning",
    timestamp: "11:15 AM",
    status: "active"
  },
  {
    id: "alert-3",
    city: "mumbai",
    title: "Refinery Stack Emissions Alert",
    desc: "Bandra sensor notes SO2 increase. Plume trace matches Chembur refinery stack upwind.",
    severity: "warning",
    timestamp: "09:45 AM",
    status: "active"
  },
  {
    id: "alert-4",
    city: "bengaluru",
    title: "Congestion Plume Spike",
    desc: "Traffic density peak at Silk Board causes localized NO2 spikes. Recommending signal offset cycles.",
    severity: "info",
    timestamp: "08:15 AM",
    status: "resolved"
  },
  {
    id: "alert-5",
    city: "hyderabad",
    title: "Jeedimetla Solvents Spike",
    desc: "Volatile organic compounds warning in Jeedimetla industrial pocket. Vent scrubber diagnostics required.",
    severity: "warning",
    timestamp: "02:30 PM",
    status: "active"
  },
  {
    id: "alert-6",
    city: "chennai",
    title: "Port Dust Suspension Warning",
    desc: "High winds (18 km/h) disperse fine particulate from open coal berths in North Chennai. Containment sprinklers activated.",
    severity: "warning",
    timestamp: "12:10 PM",
    status: "active"
  },
  {
    id: "alert-7",
    city: "kolkata",
    title: "Brick Kiln Soot Plume Trapping",
    desc: "Stagnant wind vector traps brick kiln soot over Howrah municipal boundaries. High PM2.5 threat.",
    severity: "critical",
    timestamp: "05:40 PM",
    status: "active"
  }
];

export interface PolicyCard {
  name: string;
  description: string;
  aqiImpact: string;
  cost: string;
  trafficDelay: string;
}

export const MOCK_POLICIES: PolicyCard[] = [
  { name: "Dynamic Logistics Diversion", description: "Re-routes heavy freight around critical wind canyons during low boundary-layer events.", aqiImpact: "-38 AQI", cost: "$45k/day", trafficDelay: "+12 min" },
  { name: "Water Spray Optimization", description: "Triggers on-site sprinkler protocols across builders when soil moisture falls below 15%.", aqiImpact: "-24 AQI", cost: "$15k/day", trafficDelay: "None" },
  { name: "Factory Peak Shaving", description: "Instructs Peenya smelters to reduce emissions by 40% between 6 PM and 10 PM.", aqiImpact: "-45 AQI", cost: "$120k/day", trafficDelay: "None" },
  { name: "Macro Traffic Signal Cycles", description: "Implements adaptive timing on Corridor A, prioritizing transit flow to clear idle exhaust.", aqiImpact: "-28 AQI", cost: "$5k/day", trafficDelay: "-8 min" }
];

export const MOCK_COPILOT_PROMPTS = [
  "How will the boundary layer drop tomorrow impact Anand Vihar?",
  "What is the most cost-effective policy to reduce Delhi's PM2.5 today?",
  "Which construction sites are currently violating dust suppression rules?",
  "Suggest a routing plan to divert logistics cargo around chemical corridors."
];

export interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  cardData?: any;
}

export const MOCK_CHAT_FLOW: Record<string, string | PolicyCard[]> = {
  "default": "🤖 **AirMind Copilot:** I can analyze causal networks, check sensor trends, or simulate interventions. Type a query or select a suggested prompt to begin.",
  "how will the boundary layer drop tomorrow impact anand vihar?": "⚠️ **Causal Projection:** The predicted boundary layer drop to 200m at 04:00 AM tomorrow creates a strong thermal inversion. Since Anand Vihar is downwind of regional crop fires, PM2.5 is causally projected to spike by **+85 µg/m³**, reaching a dangerous index of **497 (Severe)**. Preemptive road spraying is recommended at T-6 hours.",
  "what is the most cost-effective policy to reduce delhi's pm2.5 today?": "💡 **Optimization Matrix:** Based on current meteorological profiles, the most cost-effective strategy is a combination of **Dynamic Logistics Diversion** and **Water Spray Optimization**. This delivers a predicted **-62 AQI** reduction for a total municipal cost of **$60k/day**, avoiding a broad construction shutdown.",
  "which construction sites are currently violating dust suppression rules?": "🏗️ **Active Violations:** \n1. **Noida Sector 62 Metro Build:** Continuous PM10 threshold violations. Water mist cannons are inactive.\n2. **Metro Line 3 Cuffe Parade (Mumbai):** Dry excavation pile left uncovered under 18 km/h wind gusts.",
  "suggest a routing plan to divert logistics cargo around chemical corridors.": "🚚 **Traffic Action Card:** Diversion protocol generated. Rerouting cargo trucks from ITO towards the Eastern Peripheral Expressway. This bypasses the stagnant wind canyon at Central Delhi, reducing localized NO2 buildup by **32%** for a travel time increase of **+14 minutes**."
};
