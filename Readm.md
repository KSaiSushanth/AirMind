# 🌍 AirMind — Proactive Urban Air Quality Digital Twin & Decision Console

> **"Don't Just Monitor Pollution. Prevent It."**

AirMind is a cyber-physical smart city digital twin designed to shift air quality management from reactive warning to proactive prevention. By integrating meteorological forecasts, planetary boundary layer dynamics, causal machine learning (XGBoost), and a Retrieval-Augmented Gemini Copilot, AirMind enables municipal authorities to simulate policy interventions and calculate carrying capacity in real time.

---

## ⚡ Key Core Features

### 1. 📊 AeroBudget Carrying Capacity Engine
*   **The Science:** Every city basin acts as an atmospheric container. Its size shrinks when wind velocity drops or thermal boundary layers collapse (inversion traps). 
*   **Calculation:** Computes dynamic daily carrying capacity using boundary layer height ($PBLH$) and wind speed ($V$) forecasts:
    $$\text{AeroCapacity} \propto PBLH \times V$$
*   **The Meter:** Allocates daily particulate tonnage allowances to municipal builders, operators, and logistics lines.

### 2. 🧪 Digital Twin Policy Sandbox (What-If Simulator)
*   **The Interface:** Interactive sliders allow operators to adjust traffic load, construction schedules, and industrial stack outputs.
*   **The Model:** Passes variables to a pre-trained **XGBoost regression model** to calculate simulated AQI drops and daily municipal compliance costs.
*   **Comparison:** Renders a vertical Recharts comparative bar chart showing **Baseline vs. Simulated AQI** mapped to regional health warning thresholds.

### 3. 🤖 Explainable Causal AI Decision Copilot
*   **RAG Engine:** Connects to a Retrieval-Augmented Generation (RAG) backend. Injects active MongoDB station telemetry and simulation outputs directly into the context payload.
*   **Gemini API:** Generates explanation-driven recommendations (e.g. *"Divert traffic near ITO by 30% to avoid a 450+ severe spike tomorrow"*).
*   **Dynamic Offline Fallback:** If the backend is disconnected, a local heuristic engine parses user keywords and returns dynamic responses referencing the active city's real-time telemetry.

### 4. 🧭 Citizen Health Portal & Exposure Routing
*   **Advisory:** Citizens adjust age and chronic respiratory conditions (e.g., Asthma/COPD) to receive tailored alerts and exercise windows.
*   **AeroPath Router:** Computes standard walking routes vs. cleanest paths, showing comparative inhalation exposure rates using spatial wind vectors.

---

## 📂 Project Directory Structure

```text
airmind/
├── backend/                 # FastAPI Python Server
│   ├── app/
│   │   ├── main.py          # FastAPI application startup & endpoints
│   │   ├── models/          # XGBoost models & schema definitions
│   │   └── data/            # Local data loading & cache
│   └── requirements.txt     # Python backend dependencies
└── src/                     # React 19 / Vite Frontend
    ├── components/          # Sidebar, Topbar, MapContainer, AmbientBackground
    ├── context/             # AppContext (global state, offline query engine)
    ├── mock/                # Mock databases (Delhi, Mumbai, Bengaluru, Hyderabad, etc.)
    ├── pages/               # Dashboard, AirMap, Simulation, Forecast, Analytics, Copilot, Citizen
    ├── index.css            # Tailwind v4 configuration and global typography (Inter/Jakarta)
    └── main.tsx             # Application entry point
