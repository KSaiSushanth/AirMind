/**
 * High-fidelity Mock Database for the AI-Powered Urban Air Quality Intelligence Platform.
 * Contains realistic data structures representing real-world Indian CAAQMS stations,
 * industrial/construction sources, weather telemetry, forecasts, and agent scenarios.
 */

const AIR_QUALITY_DATA = {
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
      {
        id: "dl_anand_vihar",
        name: "Anand Vihar CAAQMS",
        coords: [28.6476, 77.3158],
        aqi: 412,
        status: "Severe",
        pm25: 412,
        pm10: 480,
        no2: 89,
        so2: 24,
        co: 1.8,
        o3: 45
      },
      {
        id: "dl_shadipur",
        name: "Shadipur CAAQMS",
        coords: [28.6515, 77.1581],
        aqi: 320,
        status: "Very Poor",
        pm25: 320,
        pm10: 380,
        no2: 65,
        so2: 18,
        co: 1.2,
        o3: 50
      },
      {
        id: "dl_rk_puram",
        name: "R.K. Puram CAAQMS",
        coords: [28.5653, 77.1866],
        aqi: 295,
        status: "Poor",
        pm25: 295,
        pm10: 310,
        no2: 52,
        so2: 12,
        co: 0.9,
        o3: 62
      },
      {
        id: "dl_igi_airport",
        name: "IGI Airport T3 CAAQMS",
        coords: [28.5562, 77.1000],
        aqi: 285,
        status: "Poor",
        pm25: 285,
        pm10: 300,
        no2: 48,
        so2: 15,
        co: 1.1,
        o3: 58
      },
      {
        id: "dl_dtu",
        name: "DTU CAAQMS",
        coords: [28.7501, 77.1176],
        aqi: 350,
        status: "Very Poor",
        pm25: 350,
        pm10: 395,
        no2: 74,
        so2: 20,
        co: 1.5,
        o3: 40
      }
    ],
    sources: [
      {
        id: "src_dl_badarpur",
        name: "Badarpur Eco-Park (Ex-Thermal Power Area)",
        coords: [28.5065, 77.3075],
        type: "industrial",
        emissionRate: "High (Dust & Coal Ash)",
        status: "Active Monitoring",
        desc: "High dust suspension from historical fly ash dump. Closed power plant site.",
        impact: 18
      },
      {
        id: "src_dl_mayapuri",
        name: "Mayapuri Industrial Area Phase II",
        coords: [28.6340, 77.1280],
        type: "industrial",
        emissionRate: "Moderate-High",
        status: "Under Audit",
        desc: "Metal casting units and automotive scrap recycling operations.",
        impact: 22
      },
      {
        id: "src_dl_const_noida",
        name: "Noida Sector 62 Expressway Metro Ext.",
        coords: [28.6275, 77.3725],
        type: "construction",
        emissionRate: "Violating (No Dust Screens)",
        status: "Warning Issued",
        desc: "Uncovered dry earth excavation and truck movement generating PM10.",
        impact: 25
      },
      {
        id: "src_dl_const_dwarka",
        name: "Dwarka Sector 22 Residential Complex",
        coords: [28.5600, 77.0500],
        type: "construction",
        emissionRate: "Compliant",
        status: "Active",
        desc: "Water sprinklers active. Dust curtains installed.",
        impact: 8
      },
      {
        id: "src_dl_traffic_ito",
        name: "ITO Intersection Congestion Node",
        coords: [28.6284, 77.2400],
        type: "traffic",
        emissionRate: "Very High (NOx & CO)",
        status: "Critical Gridlock",
        desc: "Peak vehicular emission. Average speed: 8 km/h.",
        impact: 35
      }
    ],
    historicalAqi: [310, 315, 322, 330, 345, 350, 342, 335, 320, 310, 318, 325, 338, 342],
    forecastAqi: [
      { time: "Wed 08:00", aqi: 320, temp: 31, wind: 6 },
      { time: "Wed 12:00", aqi: 310, temp: 39, wind: 8 },
      { time: "Wed 16:00", aqi: 325, temp: 41, wind: 7 },
      { time: "Wed 20:00", aqi: 350, temp: 36, wind: 4 },
      { time: "Thu 00:00", aqi: 375, temp: 33, wind: 3 },
      { time: "Thu 04:00", aqi: 390, temp: 30, wind: 2 },
      { time: "Thu 08:00", aqi: 380, temp: 32, wind: 4 },
      { time: "Thu 12:00", aqi: 340, temp: 40, wind: 9 },
      { time: "Thu 16:00", aqi: 330, temp: 42, wind: 10 },
      { time: "Thu 20:00", aqi: 360, temp: 37, wind: 5 }
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
      {
        id: "mb_bandra",
        name: "Bandra CAAQMS",
        coords: [19.0544, 72.8402],
        aqi: 142,
        status: "Moderate",
        pm25: 65,
        pm10: 142,
        no2: 34,
        so2: 12,
        co: 0.6,
        o3: 30
      },
      {
        id: "mb_kurla",
        name: "Kurla CAAQMS",
        coords: [19.0600, 72.8900],
        aqi: 165,
        status: "Unhealthy for Sensitive Groups",
        pm25: 84,
        pm10: 165,
        no2: 45,
        so2: 15,
        co: 0.8,
        o3: 25
      },
      {
        id: "mb_colaba",
        name: "Colaba CAAQMS",
        coords: [18.9067, 72.8147],
        aqi: 85,
        status: "Satisfactory",
        pm25: 38,
        pm10: 85,
        no2: 20,
        so2: 8,
        co: 0.4,
        o3: 42
      },
      {
        id: "mb_chembur",
        name: "Chembur CAAQMS",
        coords: [19.0182, 72.8930],
        aqi: 178,
        status: "Unhealthy for Sensitive Groups",
        pm25: 92,
        pm10: 178,
        no2: 52,
        so2: 28,
        co: 1.1,
        o3: 20
      }
    ],
    sources: [
      {
        id: "src_mb_refinery",
        name: "Chembur Refinery Cluster",
        coords: [19.0020, 72.9080],
        type: "industrial",
        emissionRate: "Moderate (SOx)",
        status: "Active Monitoring",
        desc: "Sulphur dioxide emissions from petroleum distillation process.",
        impact: 30
      },
      {
        id: "src_mb_const_coastal",
        name: "Coastal Road Project - Worli Segment",
        coords: [19.0200, 72.8150],
        type: "construction",
        emissionRate: "Moderate (Dust)",
        status: "Compliant",
        desc: "Land reclamation activity. High wet suppression methods in use.",
        impact: 12
      },
      {
        id: "src_mb_const_metro3",
        name: "Metro Line 3 Cuffe Parade Site",
        coords: [18.9150, 72.8120],
        type: "construction",
        emissionRate: "Violating (No Windbreaks)",
        status: "Show Cause Issued",
        desc: "Muck loading and transport generating heavy localized dust dispersion.",
        impact: 28
      },
      {
        id: "src_mb_port",
        name: "JNPT Dockyard Shipping Corridor",
        coords: [18.9500, 72.9500],
        type: "industrial",
        emissionRate: "High (Heavy Fuel Emissions)",
        status: "Active",
        desc: "Commercial marine vessels burning high-sulfur bunker fuel.",
        impact: 20
      }
    ],
    historicalAqi: [95, 102, 110, 115, 120, 125, 124, 118, 110, 98, 92, 105, 118, 124],
    forecastAqi: [
      { time: "Wed 08:00", aqi: 110, temp: 28, wind: 15 },
      { time: "Wed 12:00", aqi: 105, temp: 31, wind: 18 },
      { time: "Wed 16:00", aqi: 112, temp: 32, wind: 16 },
      { time: "Wed 20:00", aqi: 124, temp: 29, wind: 12 },
      { time: "Thu 00:00", aqi: 130, temp: 27, wind: 10 },
      { time: "Thu 04:00", aqi: 135, temp: 26, wind: 8 },
      { time: "Thu 08:00", aqi: 128, temp: 28, wind: 12 },
      { time: "Thu 12:00", aqi: 115, temp: 32, wind: 17 },
      { time: "Thu 16:00", aqi: 110, temp: 33, wind: 19 },
      { time: "Thu 20:00", aqi: 120, temp: 30, wind: 13 }
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
      {
        id: "bl_silk_board",
        name: "Silk Board CAAQMS",
        coords: [12.9176, 77.6244],
        aqi: 145,
        status: "Moderate",
        pm25: 68,
        pm10: 145,
        no2: 56,
        so2: 10,
        co: 1.4,
        o3: 35
      },
      {
        id: "bl_peenya",
        name: "Peenya Industrial CAAQMS",
        coords: [13.0285, 77.5198],
        aqi: 115,
        status: "Moderate",
        pm25: 50,
        pm10: 115,
        no2: 38,
        so2: 22,
        co: 0.9,
        o3: 28
      },
      {
        id: "bl_city_railway",
        name: "KSR Railway Station CAAQMS",
        coords: [12.9780, 77.5695],
        aqi: 92,
        status: "Satisfactory",
        pm25: 40,
        pm10: 92,
        no2: 29,
        so2: 8,
        co: 0.7,
        o3: 40
      },
      {
        id: "bl_hebbal",
        name: "Hebbal CAAQMS",
        coords: [13.0358, 77.5978],
        aqi: 68,
        status: "Satisfactory",
        pm25: 30,
        pm10: 68,
        no2: 18,
        so2: 5,
        co: 0.5,
        o3: 48
      }
    ],
    sources: [
      {
        id: "src_bl_peenya_ind",
        name: "Peenya Electroplaters & Smelters",
        coords: [13.0380, 77.5020],
        type: "industrial",
        emissionRate: "Moderate",
        status: "Active Monitoring",
        desc: "Metal treatment flue gases and localized chemical emissions.",
        impact: 15
      },
      {
        id: "src_bl_const_orrb",
        name: "Outer Ring Road Metro Phase 2A",
        coords: [12.9240, 77.6780],
        type: "construction",
        emissionRate: "High (Dust Pollution)",
        status: "Fined / Rectified",
        desc: "Dry casting yard dust. Remedial water spraying deployed after penalty.",
        impact: 18
      },
      {
        id: "src_bl_traffic_silk",
        name: "Silk Board Flyover Junction",
        coords: [12.9170, 77.6235],
        type: "traffic",
        emissionRate: "Very High (Diesel Exhaust)",
        status: "Congested",
        desc: "Major traffic bottleneck. Heavy transit buses and trucks.",
        impact: 42
      }
    ],
    historicalAqi: [62, 68, 74, 80, 85, 82, 82, 79, 72, 65, 60, 70, 78, 82],
    forecastAqi: [
      { time: "Wed 08:00", aqi: 75, temp: 24, wind: 17 },
      { time: "Wed 12:00", aqi: 70, temp: 28, wind: 19 },
      { time: "Wed 16:00", aqi: 78, temp: 29, wind: 18 },
      { time: "Wed 20:00", aqi: 82, temp: 26, wind: 15 },
      { time: "Thu 00:00", aqi: 88, temp: 23, wind: 12 },
      { time: "Thu 04:00", aqi: 92, temp: 22, wind: 11 },
      { time: "Thu 08:00", aqi: 85, temp: 24, wind: 14 },
      { time: "Thu 12:00", aqi: 75, temp: 28, wind: 20 },
      { time: "Thu 16:00", aqi: 70, temp: 30, wind: 21 },
      { time: "Thu 20:00", aqi: 80, temp: 27, wind: 16 }
    ]
  }
};

const AGENT_SCENARIOS = [
  {
    id: "scen_crop_burning",
    name: "Illegal Waste/Crop Burning (Punjab-Haryana Border Winds)",
    targetCity: "delhi",
    triggerStation: "dl_anand_vihar",
    logSequence: [
      { agent: "Forecasting Agent", delay: 0, msg: "🛰️ Satellite Thermal Anomaly detected. Wind vector shifting West-North-West towards Delhi at 6 km/h. Plume dispersion predicted." },
      { agent: "Forecasting Agent", delay: 1000, msg: "⚠️ Alert! Atmospheric boundary layer height drop detected (450m). Dispersion rate reduced. AQI in Anand Vihar expected to exceed 480 in 4 hours." },
      { agent: "Attribution Agent", delay: 2500, msg: "🔍 Fusing data: Wind direction matches trajectory of active agricultural fires. Local PM2.5 levels at Anand Vihar are surging at 24µg/m³ per hour. Source attribution: Biomass Burning 54%, Urban Transport 26%." },
      { agent: "Enforcement Agent", delay: 4000, msg: "🚨 Smart Intervention Triggered. Generating enforcement warnings for biomass violations. Dispatching drones to check illegal garbage burning at Ghazipur Landfill." },
      { agent: "Citizen Alert Agent", delay: 5500, msg: "📢 Broadcasting Ward-Level Health Alert: 'Severe Air Quality Warning. Residents in East Delhi, especially sensitive populations, are advised to suspend all outdoor physical activities. Keep air purifiers active.'" }
    ]
  },
  {
    id: "scen_traffic_gridlock",
    name: "Festival Traffic Gridlock (ITO / Silk Board)",
    targetCity: "delhi",
    triggerStation: "dl_rk_puram",
    logSequence: [
      { agent: "Forecasting Agent", delay: 0, msg: "🚦 Mobility feed anomaly. Traffic congestion indices at ITO and central Delhi junctions have spiked by 140% above the seasonal baseline." },
      { agent: "Attribution Agent", delay: 1200, msg: "🔍 Chemical signature analysis: High ratio of $NO_2$ to $SO_2$ registered at ITO. Traffic emissions are contributing 68% of local pollutants. Particulate levels rising rapidly." },
      { agent: "Enforcement Agent", delay: 2800, msg: "🚨 Action Plan Generated. Recommending Traffic Control Room to alter signal timers to ease congestion. Alerting Delhi Metro to increase train frequencies along the Violet/Blue lines." },
      { agent: "Citizen Alert Agent", delay: 4200, msg: "📢 Citizen Advisory: 'High traffic congestion causing localized NO2 spikes in Central Delhi. Commuters advised to close car windows and use internal air recirculation.'" }
    ]
  },
  {
    id: "scen_dust_violation",
    name: "Dust Mitigation Failure (Metro Construction Site)",
    targetCity: "delhi",
    triggerStation: "dl_dtu",
    logSequence: [
      { agent: "Forecasting Agent", delay: 0, msg: "💨 Hyperlocal wind gusts (22 km/h) registered near Rohini Sector 16. Potential for localized dust suspension." },
      { agent: "Attribution Agent", delay: 1500, msg: "🔍 PM10/PM2.5 ratio at DTU Station exceeds 1.8. This indicates dry mineral crust/dust rather than combustion smoke. Geolocation points to excavation area upwind." },
      { agent: "Enforcement Agent", delay: 3000, msg: "🚨 Automated Field Ticket created. Sending automated violation notice to contractor at Rohini Metro Yard for failing to operate water mist cannons. Penalty warning sent." },
      { agent: "Enforcement Agent", delay: 4500, msg: "⚡ Contractor response received. Automated anti-smog gun activated at 01:03 AM. PM10 sensor values trending downward." }
    ]
  }
];

const CHATBOT_RESPONSES = [
  {
    keywords: ["asthma", "asthmatic", "breathing", "inhaler"],
    response: "🚨 **High-Risk Health Warning (Asthma/Respiratory Profile):** Current PM2.5 levels are highly taxing on lung tissues. If you are in Delhi, please avoid outdoor walks entirely today. Keep your rescue inhaler handy. Ensure you stay indoors with doors/windows closed and run your HEPA air filter on high speed. If symptoms persist, contact your physician immediately."
  },
  {
    keywords: ["run", "jog", "exercise", "outdoor", "walk", "sports"],
    response: "🏃 **Outdoor Activity Advisory:** Outdoor aerobic exercises are **NOT recommended** when the AQI exceeds 150. In Delhi, doing high-intensity cardio outdoors right now is equivalent to smoking multiple cigarettes. Move your workout indoors, use a treadmill, or perform static yoga in a clean air space. If you must go out, wear a certified N95 or N99 mask."
  },
  {
    keywords: ["children", "child", "kids", "baby", "school"],
    response: "👶 **Pediatric Safety Alert:** Children breathe faster than adults, inhaling more air relative to their body weight. Keep children indoors. Limit outdoor play today. If school transport is not air-purified, make sure they wear a fitted N95 mask during their commute. Watch for coughing, wheezing, or eye irritation."
  },
  {
    keywords: ["clean", "purifier", "filter", "indoors"],
    response: "🏠 **Indoor Air Management:** To optimize indoor air: 1. Keep windows closed during early morning/evening peaks. 2. Use a HEPA air purifier. 3. Avoid vacuuming, burning candles, or cooking on high heat, which releases indoor fine particles. 4. Introduce air-purifying indoor plants like Snake Plant or Areca Palm (though they do not replace mechanical filters)."
  },
  {
    keywords: ["general", "hello", "hi", "how is", "advice"],
    response: "👋 **Urban Air Quality Copilot:** I am your Smart City AI Safety assistant. You can ask me about health risks, activity planning, or report local air violations (like trash burning). Please specify your city (Delhi, Mumbai, Bengaluru) or your health profile so I can provide highly relevant guidance!"
  }
];
