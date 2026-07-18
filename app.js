/**
 * Core Application Engine for AURA Platform.
 * Coordinates view switching, city-level data reloading, Leaflet.js map updates,
 * Chart.js renders, Agentic scenario simulations, Enforcement ticket state, 
 * and the Citizen Advisor Chatbot.
 */

// Global Application State
let currentCity = "delhi";
let activeView = "monitoring";
let map = null;
let markersGroup = null;
let forecastChart = null;
let selectedTicketId = null;

// Seed Initial Enforcement Tickets from mock sources that are "Violating"
let enforcementTickets = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Bind Sidebar Navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const targetItem = e.currentTarget;
      navItems.forEach(i => i.classList.remove("active"));
      targetItem.classList.add("active");
      
      const targetView = targetItem.getAttribute("data-view");
      switchView(targetView);
    });
  });

  // Bind City Selector
  const citySelector = document.getElementById("city-selector");
  citySelector.addEventListener("change", (e) => {
    currentCity = e.target.value;
    handleCityChange();
  });

  // Initialize Leaflet Map
  initMap();

  // Load Initial City Data
  loadCityData();

  // Bind Simulation Scenario Buttons
  document.getElementById("btn-scen-crop").addEventListener("click", () => triggerScenario("scen_crop_burning"));
  document.getElementById("btn-scen-traffic").addEventListener("click", () => triggerScenario("scen_traffic_gridlock"));
  document.getElementById("btn-scen-dust").addEventListener("click", () => triggerScenario("scen_dust_violation"));
  document.getElementById("btn-clear-logs").addEventListener("click", clearConsoleLogs);

  // Bind Chatbot triggers
  document.getElementById("chat-send-trigger").addEventListener("click", handleUserChatMessage);
  document.getElementById("chat-input-field").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserChatMessage();
  });

  // Bind suggestion chips
  const chips = document.querySelectorAll(".suggest-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      const query = e.target.getAttribute("data-query");
      document.getElementById("chat-input-field").value = query;
      handleUserChatMessage();
    });
  });

  // Bind Enforcement Actions
  document.getElementById("btn-dispatch-team").addEventListener("click", handleInspectorDispatch);

  // Seed default tickets
  seedDefaultTickets();
  
  // Render Comparison tab once
  renderComparisonGrid();
}

/* =========================================================================
   MAP & MARKERS CONTROLLER
   ========================================================================= */
function initMap() {
  const cityInfo = AIR_QUALITY_DATA[currentCity];
  
  // Create Leaflet map centered at selected city
  map = L.map("map-container", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView(cityInfo.center, 12);

  // Load OpenStreetMap tiles (Inverted to Dark mode by styles.css filter)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Marker layer group
  markersGroup = L.layerGroup().addTo(map);
}

function updateMap() {
  if (!map) return;
  const cityInfo = AIR_QUALITY_DATA[currentCity];
  
  // Pan map to new city coordinates
  map.setView(cityInfo.center, 12);
  
  // Clear existing markers
  markersGroup.clearLayers();

  // Add Station Markers (CPCB Air quality monitors)
  cityInfo.stations.forEach(station => {
    const aqiColor = getAqiColor(station.aqi);
    
    // Custom DivIcon with glowing colored circles
    const stationIcon = L.divIcon({
      className: 'custom-station-marker',
      html: `<div class="marker-inner" style="background-color: ${aqiColor}; color: ${aqiColor};"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const popupContent = `
      <div style="font-family: 'Outfit', sans-serif; color: #111827; padding: 4px;">
        <h4 style="margin-bottom: 6px; font-weight: 600; font-size: 0.95rem;">${station.name}</h4>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${aqiColor};"></span>
          <span style="font-weight: 700; font-size: 1rem;">AQI: ${station.aqi}</span>
          <span style="font-size: 0.8rem; color: #666;">(${station.status})</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 4px;">
          <tr><td style="padding: 2px 0; color: #555;">PM2.5:</td><td style="font-weight: 600; text-align: right;">${station.pm25} µg/m³</td></tr>
          <tr><td style="padding: 2px 0; color: #555;">PM10:</td><td style="font-weight: 600; text-align: right;">${station.pm10} µg/m³</td></tr>
          <tr><td style="padding: 2px 0; color: #555;">NO₂:</td><td style="font-weight: 600; text-align: right;">${station.no2} ppb</td></tr>
          <tr><td style="padding: 2px 0; color: #555;">SO₂:</td><td style="font-weight: 600; text-align: right;">${station.so2} ppb</td></tr>
        </table>
      </div>
    `;

    L.marker(station.coords, { icon: stationIcon })
      .addTo(markersGroup)
      .bindPopup(popupContent);
  });

  // Add Source Markers (Factories, Construction, Traffic corridors)
  cityInfo.sources.forEach(source => {
    let sourceSymbol = "🏭";
    let accentColor = "#ef4444";
    if (source.type === "construction") {
      sourceSymbol = "🏗️";
      accentColor = "#f59e0b";
    } else if (source.type === "traffic") {
      sourceSymbol = "🚦";
      accentColor = "#3b82f6";
    }

    const sourceIcon = L.divIcon({
      className: 'custom-source-marker',
      html: `<div style="font-size: 20px; text-shadow: 0 0 10px ${accentColor}; cursor: pointer;">${sourceSymbol}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const popupContent = `
      <div style="font-family: 'Outfit', sans-serif; color: #111827; padding: 4px; max-width: 200px;">
        <h4 style="margin-bottom: 4px; font-weight: 600; font-size: 0.9rem;">${source.name}</h4>
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 600; color: #666;">Type: ${source.type}</span>
        <p style="font-size: 0.8rem; margin-top: 6px; line-height: 1.4; color: #333;">${source.desc}</p>
        <div style="margin-top: 8px; border-top: 1px solid #ddd; padding-top: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; color: #555;">Emission Rate:</span>
          <span style="font-weight: 700; color: #ef4444; font-size: 0.8rem;">${source.emissionRate}</span>
        </div>
      </div>
    `;

    L.marker(source.coords, { icon: sourceIcon })
      .addTo(markersGroup)
      .bindPopup(popupContent);
  });
}

function getAqiColor(aqi) {
  if (aqi <= 50) return "var(--aqi-good)";
  if (aqi <= 100) return "var(--aqi-moderate)";
  if (aqi <= 150) return "var(--aqi-poor)";
  if (aqi <= 200) return "var(--aqi-poor)";
  if (aqi <= 300) return "var(--aqi-very-poor)";
  if (aqi <= 400) return "var(--aqi-severe)";
  return "var(--aqi-hazardous)";
}

/* =========================================================================
   UI VIEW MANAGER
   ========================================================================= */
function switchView(viewName) {
  activeView = viewName;
  
  // Toggle Views
  const views = document.querySelectorAll(".dashboard-view");
  views.forEach(view => {
    view.classList.remove("active");
  });
  
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) targetView.classList.add("active");

  // Load view-specific components
  if (viewName === "monitoring" && map) {
    // Invalidate size to ensure Leaflet renders correctly after display block
    setTimeout(() => map.invalidateSize(), 50);
  } else if (viewName === "forecasting") {
    renderForecastChart();
  }
}

function loadCityData() {
  const cityInfo = AIR_QUALITY_DATA[currentCity];
  if (!cityInfo) return;

  // Header Title & Weather Telemetry Update
  document.getElementById("active-city-name").innerText = `${cityInfo.name} Control Center`;
  document.getElementById("weather-temp").innerText = cityInfo.weather.temp;
  document.getElementById("weather-wind").innerText = `${cityInfo.weather.windSpeed} ${cityInfo.weather.windDir}`;

  const aqiLabel = `${cityInfo.overallAqi} (${cityInfo.status})`;
  document.getElementById("header-aqi-value").innerText = aqiLabel;
  
  // Set glow indicator
  const dot = document.getElementById("aqi-indicator-dot");
  dot.style.backgroundColor = getAqiColor(cityInfo.overallAqi);
  dot.style.boxShadow = `0 0 10px ${getAqiColor(cityInfo.overallAqi)}`;

  // Update Geospatial Map elements
  updateMap();

  // Render Pollutant values
  const pollutantGrid = document.getElementById("pollutant-grid");
  pollutantGrid.innerHTML = "";

  // Average values across city stations for display
  const primaryStation = cityInfo.stations[0];
  const pollutants = [
    { name: "PM2.5", val: primaryStation.pm25, unit: "µg/m³" },
    { name: "PM10", val: primaryStation.pm10, unit: "µg/m³" },
    { name: "NO₂", val: primaryStation.no2, unit: "ppb" },
    { name: "SO₂", val: primaryStation.so2, unit: "ppb" },
    { name: "CO", val: primaryStation.co, unit: "ppm" },
    { name: "O₃", val: primaryStation.o3, unit: "ppb" }
  ];

  pollutants.forEach(p => {
    const card = document.createElement("div");
    card.className = "pollutant-card";
    card.innerHTML = `
      <div class="pollutant-name">${p.name}</div>
      <div class="pollutant-value">${p.val}</div>
      <div class="pollutant-unit">${p.unit}</div>
    `;
    pollutantGrid.appendChild(card);
  });

  // Render Source Contribution List
  const sourceListContainer = document.getElementById("source-attribution-list");
  sourceListContainer.innerHTML = "";
  
  cityInfo.sources.forEach(src => {
    const item = document.createElement("div");
    item.className = "source-item";
    
    let label = "Industrial Stack";
    if (src.type === "construction") label = "Construction Site";
    if (src.type === "traffic") label = "Traffic Node";

    item.innerHTML = `
      <div class="source-details">
        <span class="source-title">${src.name}</span>
        <span class="source-meta">${label} • Impact Coefficient: ${src.impact}%</span>
      </div>
      <div class="source-value">${src.impact}%</div>
    `;
    sourceListContainer.appendChild(item);
  });

  // Render Forecasting Timeline in panel
  const forecastTimelineContainer = document.getElementById("forecast-timeline-list");
  forecastTimelineContainer.innerHTML = "";
  
  cityInfo.forecastAqi.slice(0, 5).forEach(fc => {
    const item = document.createElement("div");
    item.className = "weather-day-item";
    const bgCol = getAqiColor(fc.aqi);
    item.innerHTML = `
      <span class="weather-day-time">${fc.time}</span>
      <span class="weather-day-temp">🌡️ ${fc.temp}°C • 💨 ${fc.wind} km/h</span>
      <div class="weather-day-aqi-pill" style="background-color: ${bgCol}; color: ${fc.aqi > 300 ? '#ffffff' : '#000000'}">
        ${fc.aqi}
      </div>
    `;
    forecastTimelineContainer.appendChild(item);
  });

  // Re-render forecasting chart if visible
  if (activeView === "forecasting") {
    renderForecastChart();
  }

  // Refresh Tickets Board
  renderTicketsBoard();
}

function handleCityChange() {
  loadCityData();
  // Clear chatbot history on city shift to prevent context mismatch
  const chatList = document.getElementById("chat-history-list");
  chatList.innerHTML = `
    <div class="chat-bubble bot">
      Workspace switched to ${AIR_QUALITY_DATA[currentCity].name}. 
      I have synchronized AURA to local micro-station telemetries. How can I help you protect yourself in this region?
    </div>
  `;
}

/* =========================================================================
   CHART CONTROLLER (CHART.JS)
   ========================================================================= */
function renderForecastChart() {
  const ctx = document.getElementById("forecast-chart");
  if (!ctx) return;

  const cityInfo = AIR_QUALITY_DATA[currentCity];
  const labels = cityInfo.forecastAqi.map(item => item.time);
  const dataPoints = cityInfo.forecastAqi.map(item => item.aqi);

  // Reset chart canvas context
  if (forecastChart) {
    forecastChart.destroy();
  }

  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Predicted AQI Score",
        data: dataPoints,
        borderColor: "rgba(6, 182, 212, 1)",
        backgroundColor: "rgba(6, 182, 212, 0.05)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(6, 182, 212, 1)",
        pointHoverRadius: 8,
        shadowColor: "rgba(6, 182, 212, 0.4)",
        shadowBlur: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: "rgba(255, 255, 255, 0.03)" },
          ticks: { color: "rgba(255, 255, 255, 0.6)", font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: "rgba(255, 255, 255, 0.03)" },
          ticks: { color: "rgba(255, 255, 255, 0.6)", font: { family: 'Outfit' } },
          min: 0
        }
      }
    }
  });
}

/* =========================================================================
   MULTI-AGENT SIMULATION CENTER
   ========================================================================= */
let logTimer = null;

function triggerScenario(scenarioId) {
  const scenario = AGENT_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return;

  // Clear existing simulation timeouts
  clearTimeout(logTimer);
  clearConsoleLogs();

  // Auto-switch to scenario's target city
  if (currentCity !== scenario.targetCity) {
    currentCity = scenario.targetCity;
    document.getElementById("city-selector").value = currentCity;
    handleCityChange();
  }

  const consoleBox = document.getElementById("console-logs");
  consoleBox.innerHTML = ""; // Clear placeholder

  // Trigger Sequential Log printing
  scenario.logSequence.forEach(log => {
    setTimeout(() => {
      appendConsoleLog(log.agent, log.msg);
      
      // If last log, execute side-effects like adding enforcement action ticket
      if (log === scenario.logSequence[scenario.logSequence.length - 1]) {
        handleScenarioCompletion(scenarioId);
      }
    }, log.delay);
  });
}

function appendConsoleLog(agentName, message) {
  const consoleBox = document.getElementById("console-logs");
  const timeString = new Date().toLocaleTimeString();
  
  const logDiv = document.createElement("div");
  logDiv.className = "console-log-entry";
  logDiv.innerHTML = `
    <span class="log-time">[${timeString}]</span>
    <span class="log-agent">${agentName}:</span>
    <span class="log-msg">${message}</span>
  `;
  
  consoleBox.appendChild(logDiv);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function clearConsoleLogs() {
  const consoleBox = document.getElementById("console-logs");
  consoleBox.innerHTML = '<div class="console-placeholder">Select a scenario above to simulate multi-agent observation, reasoning, and containment action loops.</div>';
}

function handleScenarioCompletion(scenarioId) {
  let ticketId = "TCK-" + Math.floor(1000 + Math.random() * 9000);
  let title = "";
  let desc = "";
  let law = "";

  if (scenarioId === "scen_crop_burning") {
    title = "Ghazipur Open Burning Violation";
    desc = "Autonomous Sentinel Drone has registered illegal smoke plume at Ghazipur landfill periphery. Thermal camera shows localized ground temperature at 124°C. PM2.5 levels climbing locally.";
    law = "National Green Tribunal (NGT) Waste Burning ban / Section 144 Air Pollution act.";
  } else if (scenarioId === "scen_traffic_gridlock") {
    title = "Traffic Dispersion Override (ITO)";
    desc = "Traffic sensor API reports congestion bottleneck. NOx readings are 4x normal. Recommendation: Adjust signal timers at ITO intersection and deploy traffic coordinators to route transit vehicles.";
    law = "CPCB Traffic Dispersion Guidelines / Smart City Congestion Protocol.";
  } else if (scenarioId === "scen_dust_violation") {
    title = "Mist Cannon Compliance Action - Rohini Site";
    desc = "Dust sensor at Site Rohini Phase 2 shows PM10 over 650. Wind speed is 22km/h causing heavy drift towards residential wards. Mist cannons must be engaged immediately.";
    law = "EPCA Graded Response Action Plan (GRAP) Stage III dust suppression mandates.";
  }

  // Check if ticket already exists
  if (!enforcementTickets.some(t => t.title === title && t.city === currentCity)) {
    const newTicket = {
      id: ticketId,
      city: currentCity,
      title: title,
      desc: desc,
      law: law,
      status: "OPEN",
      timestamp: new Date().toLocaleTimeString()
    };
    
    enforcementTickets.unshift(newTicket);
    renderTicketsBoard();

    // Alert user that a ticket has been generated in the Enforcement panel
    appendConsoleLog("Enforcement Agent", `📢 **Enforcement Task Created:** ${title} added to active queue. Switched to high priority.`);
  }
}

/* =========================================================================
   ENFORCEMENT MANAGEMENT PORTAL
   ========================================================================= */
function seedDefaultTickets() {
  // Pre-seed some violating items based on the mock data
  enforcementTickets = [
    {
      id: "TCK-5510",
      city: "delhi",
      title: "Dust Shield Breach (Noida Sector 62)",
      desc: "Excavation area uncovered. Large dust plumes detected by PM10 sensor at Anand Vihar CAAQMS. Recommend dispatching inspector to enforce dust screens.",
      law: "GRAP Stage III / National Clean Air Programme Compliance Act",
      status: "OPEN",
      timestamp: "02:40 PM"
    },
    {
      id: "TCK-9442",
      city: "mumbai",
      title: "Bunker Fuel Audit - Chembur Port Segment",
      desc: "Vessel 'Maritime Star' docked in Chembur segment found burning non-compliant high-sulfur fuel while idle, leading to immediate SO2 spike at chembur sensor node.",
      law: "Merchant Shipping Act / CPCB Port Emission Standards",
      status: "OPEN",
      timestamp: "04:12 PM"
    }
  ];
}

function renderTicketsBoard() {
  const queue = document.getElementById("enforcement-ticket-queue");
  if (!queue) return;

  queue.innerHTML = "";

  // Filter tickets by current city
  const filtered = enforcementTickets.filter(t => t.city === currentCity);

  if (filtered.length === 0) {
    queue.innerHTML = '<div style="color: var(--text-dim); text-align: center; padding: 40px 0;">No active enforcement tasks for this city. Trigger scenarios to spawn alerts.</div>';
    resetTicketDetailPanel();
    return;
  }

  filtered.forEach(ticket => {
    const card = document.createElement("div");
    card.className = `ticket-card ${selectedTicketId === ticket.id ? 'active' : ''}`;
    
    // Status color badge
    let statusClass = "open";
    if (ticket.status === "DISPATCHED") statusClass = "dispatched";
    if (ticket.status === "RESOLVED") statusClass = "resolved";

    card.innerHTML = `
      <div class="ticket-header">
        <span class="ticket-id">${ticket.id}</span>
        <span class="ticket-status-badge ${statusClass}">${ticket.status}</span>
      </div>
      <div class="ticket-description">${ticket.title}</div>
      <div class="ticket-meta">
        <span>🕒 ${ticket.timestamp}</span>
        <span>📍 Zone Coordinate</span>
      </div>
    `;

    card.addEventListener("click", () => selectTicket(ticket.id));
    queue.appendChild(card);
  });

  // Keep selected ticket loaded
  if (selectedTicketId) {
    const activeTicket = enforcementTickets.find(t => t.id === selectedTicketId);
    if (activeTicket && activeTicket.city === currentCity) {
      loadTicketDetails(activeTicket);
    } else {
      resetTicketDetailPanel();
    }
  }
}

function selectTicket(ticketId) {
  selectedTicketId = ticketId;
  const activeTicket = enforcementTickets.find(t => t.id === ticketId);
  if (activeTicket) {
    loadTicketDetails(activeTicket);
  }
  // Refresh highlights
  const cards = document.querySelectorAll(".ticket-card");
  cards.forEach(c => {
    const id = c.querySelector(".ticket-id").innerText;
    if (id === ticketId) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

function loadTicketDetails(ticket) {
  document.getElementById("no-ticket-selected").style.display = "none";
  const detailPanel = document.getElementById("ticket-active-content");
  detailPanel.style.display = "flex";

  document.getElementById("det-ticket-id").innerText = ticket.id;
  
  const statusBadge = document.getElementById("det-ticket-status");
  statusBadge.innerText = ticket.status;
  statusBadge.className = `ticket-status-badge ${ticket.status.toLowerCase()}`;

  document.getElementById("det-ticket-title").innerText = ticket.title;
  document.getElementById("det-ticket-desc").innerText = ticket.desc;
  document.getElementById("det-ticket-law").innerText = ticket.law;

  const dispatchBtn = document.getElementById("btn-dispatch-team");
  dispatchBtn.style.display = "block";
  
  if (ticket.status === "OPEN") {
    dispatchBtn.innerText = "Approve & Dispatch Enforcement Team";
    dispatchBtn.disabled = false;
    dispatchBtn.style.opacity = 1;
  } else if (ticket.status === "DISPATCHED") {
    dispatchBtn.innerText = "Inspector Dispatched (Monitoring Site)";
    dispatchBtn.disabled = true;
    dispatchBtn.style.opacity = 0.5;
  } else {
    dispatchBtn.innerText = "Action Resolved";
    dispatchBtn.disabled = true;
    dispatchBtn.style.opacity = 0.5;
  }
}

function resetTicketDetailPanel() {
  document.getElementById("no-ticket-selected").style.display = "block";
  document.getElementById("ticket-active-content").style.display = "none";
  document.getElementById("btn-dispatch-team").style.display = "none";
}

function handleInspectorDispatch() {
  if (!selectedTicketId) return;

  const ticket = enforcementTickets.find(t => t.id === selectedTicketId);
  if (ticket && ticket.status === "OPEN") {
    ticket.status = "DISPATCHED";
    
    // UI Feedback
    loadTicketDetails(ticket);
    renderTicketsBoard();

    // Log to Multi-agent console
    appendConsoleLog("Enforcement Agent", `⚡ **Inspector Rahul Dev dispatched** to target location to enforce compliance on: "${ticket.title}".`);
    
    // Simulate resolution after 8 seconds
    setTimeout(() => {
      ticket.status = "RESOLVED";
      if (selectedTicketId === ticket.id) {
        loadTicketDetails(ticket);
      }
      renderTicketsBoard();
      appendConsoleLog("Enforcement Agent", `✅ **Resolution Complete:** Inspector reports dust control cannons engaged/burning extinguished. Telemetries verified.`);
    }, 8000);
  }
}

/* =========================================================================
   CITIZEN SAFETY ADVISOR CHATBOT
   ========================================================================= */
function handleUserChatMessage() {
  const inputElement = document.getElementById("chat-input-field");
  const query = inputElement.value.trim();
  if (!query) return;

  // Render User Bubble
  renderChatBubble(query, "user");
  inputElement.value = "";

  // Thinking Delay
  setTimeout(() => {
    const botResponse = generateBotResponse(query);
    renderChatBubble(botResponse, "bot");
  }, 600);
}

function renderChatBubble(text, sender) {
  const history = document.getElementById("chat-history-list");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  
  // Use markdown parser or simple formatting for text bubbles
  bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

function generateBotResponse(userInput) {
  const queryLower = userInput.toLowerCase();
  
  // Find matching canned response keyword
  for (let match of CHATBOT_RESPONSES) {
    const matchedKeyword = match.keywords.find(key => queryLower.includes(key));
    if (matchedKeyword) {
      return match.response;
    }
  }

  // Default intelligent-sounding response
  return `🤖 **AURA Intelligent response:** 
  I processed your query about *"${userInput}"* relative to current PM2.5 levels of **${AIR_QUALITY_DATA[currentCity].overallAqi}** in ${AIR_QUALITY_DATA[currentCity].name}. 
  
  For general protection today:
  1. Keep respiratory cycles short if outdoors.
  2. The primary particulate is PM2.5 which enters deep lung air sacs.
  3. Ensure your local air purifier indicators remain under 30 ug/m3. 
  
  *Could you please specify if you have any respiratory ailments or need outdoor walking window suggestions?*`;
}

/* =========================================================================
   MULTI-CITY COMPARATIVE GRID
   ========================================================================= */
function renderComparisonGrid() {
  const grid = document.getElementById("comparative-grid-container");
  if (!grid) return;

  grid.innerHTML = "";

  const cities = ["delhi", "mumbai", "bengaluru"];

  cities.forEach(cityKey => {
    const city = AIR_QUALITY_DATA[cityKey];
    
    // Status color selection
    let statusBg = "rgba(16, 185, 129, 0.2)";
    let statusText = "var(--aqi-good)";
    
    if (city.overallAqi > 100 && city.overallAqi <= 200) {
      statusBg = "rgba(245, 158, 11, 0.2)";
      statusText = "var(--aqi-moderate)";
    } else if (city.overallAqi > 200) {
      statusBg = "rgba(239, 68, 68, 0.2)";
      statusText = "var(--aqi-very-poor)";
    }

    const card = document.createElement("div");
    card.className = "card-glass city-card";
    
    // Custom dynamic visual details
    card.innerHTML = `
      <div class="city-card-header">
        <div class="city-card-name">${city.name}</div>
        <div class="city-badge" style="background-color: ${statusBg}; color: ${statusText};">${city.status}</div>
      </div>
      
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px;">
        <div class="city-aqi-indicator" style="color: ${getAqiColor(city.overallAqi)};">${city.overallAqi}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">Overall AQI Index</div>
      </div>

      <div class="city-metric-row">
        <span class="city-metric-label">Primary Pollutant:</span>
        <span style="font-weight: 600;">${city.primaryPollutant}</span>
      </div>
      <div class="city-metric-row">
        <span class="city-metric-label">Temperature / Humidity:</span>
        <span>${city.weather.temp} / ${city.weather.humidity}</span>
      </div>
      <div class="city-metric-row">
        <span class="city-metric-label">Wind Velocity:</span>
        <span>${city.weather.windSpeed} (${city.weather.windDir})</span>
      </div>
      <div class="city-metric-row">
        <span class="city-metric-label">Monitoring Stations:</span>
        <span>${city.stations.length} Active Nodes</span>
      </div>
    `;

    grid.appendChild(card);
  });
}
