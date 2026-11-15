# 🚀 AETHON-IV // Space Mission Crew Health Monitoring System

A responsive, high-fidelity web application dashboard designed for real-time astronaut biometric telemetry and fleet life support monitoring during deep space exploration missions.

---

## 🛰️ Key Features

### 1. Two Main Specialized Consoles
- **👤 Crew Member Overview**:
  - Detailed astronaut dossier (Role, Rank, Mission Day, Blood Type, EVA Suit Model, Current Task).
  - 6-metric biometrics HUD: Heart Rate (BPM), Blood Pressure (mmHg), Core Temperature (with °C / °F toggle), Blood Oxygenation (SpO2 %), Respiration Rate (BrPM), and Neural Cognitive Stress (%).
  - **Live Phosphor ECG Oscilloscope**: Real-time canvas cardiac waveform generator simulating P-Q-R-S-T waves with adjustable sweep speed (25 mm/s, 50 mm/s), lead vector selection (Lead II, V1, V5), and freeze-frame analysis.
  - **⏱️ Circadian Rhythm & Shift Planner**:
    - **Visual 24-Hour Horizontal Timeline Bar**: Color-coded segments for Sleep (`#4361ee`), Active Duty (`#00f0ff`), Exercise (`#ffaa00`), and Free Time (`#00ff9d`) with interactive tooltips and live needle marker.
    - **Dynamic Biometric Feedback**: Extended shifts and sleep deficits drift resting heart rate upwards, degrade cognitive readiness, and activate mild fatigue alerts.
    - **Countermeasure Guidance**: Pharmacological caffeine micro-dosing (100–200 mg) and operational shift adjustment protocols.
  - **EVA Suit Biometrics**: Suit internal pressure, O2 consumable reserves, CO2 scrubber saturation, battery capacity, and coolant loop temperature.
  - **Radiation Dosimetry**: Cumulative mSv exposure tracked against the 250 mSv mission limit, hourly cosmic flux, and magnetic shielding integrity.
  - **Biomedical Clinical Notes Feed**: Historical and active biometric alerts.
  - **Action Tools**: Autonomic Diagnostic Sweep modal with simulated 12-lead bio-chip synchronization, and one-click JSON Bio-Log export.

- **🛰️ Mission Control Center Console with Latency Split-Screen**:
  - **Dual Split-Screen Viewports (Mars Transit 22m Delay)**:
    - **Left Viewport (🛸 Local Spacecraft Node)**: Live, instantaneous shipboard telemetry (0.0s lag). Displays current physical astronaut state, e.g. Marcus Chen undergoing EVA exertion tachycardia (104 BPM).
    - **Center Conduit (📡 Data Packets in Transit)**:
      - **Canvas Particle Stream**: Visual simulation of telemetry data packets traveling across 225,000,000 km of deep space along interplanetary ray beams.
      - **Earth Data Obsoletion Delta**: Prominent countdown timer (`22m 14s BEHIND REALITY`) and file transit queue (`.BIN`, `.DAT`, `.LOG`) showing precisely how outdated Earth's data is compared to the spacecraft.
      - **Burst Dispatcher**: Interactive button to inject and track fresh telemetry bursts across the conduit.
    - **Right Viewport (🌍 Earth Ground Station Node)**: Time-lagged DSN buffer displaying outdated telemetry from 22 minutes ago (e.g. Earth flight controllers still believe Marcus Chen is resting at 74 BPM).
  - **Relay Configuration Switcher**: Toggle between **Mars Transit (22m delay)** and **Low Earth Orbit (0.0s direct sync)**.
  - **Habitat Life Support (ECLSS)**: Cabin atmospheric pressure (101.3 kPa), O2 partial concentration, CO2 scrub efficiency, habitat ambient temp, humidity, and closed-loop water recovery.
  - **Heliospheric Radiation & EVA Window**: Solar Particle Event (SPE) index, cosmic ray deflection, and safe spacewalk timer.
  - **Filterable Event Stream**: Filterable log (All, Warnings, Nominal) with instant telemetry acknowledgment.

### 2. Crew Roster (4 Astronauts)
1. **Commander Sarah Vance** (`Aegis-1`): Astrodynamics Lead — Bridge Deck 1 *(Status: Nominal, HR: 72 BPM, Cognitive Readiness: 94%)*
2. **Pilot Marcus Chen** (`Vanguard-2`): High-G Specialist — Airlock Alpha / Exterior Hull *(Status: Warning / High Exertion on EVA-3, Extended Duty +3.5h, Truncated Sleep, Cognitive Readiness: 66%, 150mg Caffeine Recommended)*
3. **Mission Specialist 1 Dr. Elena Rostova** (`Nova-3`): Chief Medical Officer & Astrobiologist — Bio-Lab *(Status: Nominal, HR: 67 BPM, Cognitive Readiness: 96%)*
4. **Mission Specialist 2 Takuya Sato** (`Chronos-4`): Lead Systems Engineer — Engineering Node 2 *(Status: Nominal, HR: 75 BPM, Cognitive Readiness: 89%)*

### 3. Modern Sci-Fi Minimalist Aesthetics
- **Color Palette**: Deep midnight void (`#050811`), Neon Cyan (`#00f0ff`), Neon Amber (`#ffaa00`), Alert Crimson (`#ff2a55`), and Nominal Emerald (`#00ff9d`).
- **Typography**: Google Fonts `Orbitron` (HUD headers), `JetBrains Mono` (telemetry readouts), and `Rajdhani` (labels).
- **HUD Accents**: Tactical corner brackets, glowing borders, animated status pulse beacons, and CRT scanlines.
- **Audio Synthesizer**: Built-in Web Audio API generator synthesizing telemetry blips, cardiac pings, and emergency klaxon chimes (with toggleable mute/unmute).
- **Interactive Anomaly Simulator**: Test live responses to EVA exertion tachycardia, hypoxia drop, or cardiac arrhythmia.

---

## 🖥️ How to Run

1. Open `index.html` directly in any modern web browser:
   ```text
   file:///C:/Users/NewAdmin/.gemini\antigravity\scratch\space-crew-health-dashboard\index.html
   ```
2. Or start a local lightweight web server:
   ```bash
   cd C:\Users\NewAdmin\.gemini\antigravity\scratch\space-crew-health-dashboard
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080` in your browser.
