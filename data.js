// Space Mission Crew Health Monitoring System - Data Store
// Mission: AETHON-IV Deep Space Exploration (Mars Orbital Insertion Phase)

const CREW_DATA = [
  {
    id: "crew-1",
    name: "Sarah Vance",
    callsign: "Aegis-1",
    role: "Commander",
    rank: "Colonel / Astrodynamics Lead",
    age: 42,
    bloodType: "A+",
    evaSuit: "Mark-V DeepSpace Aegis",
    suitId: "SUIT-A01",
    location: "Command Bridge / Deck 1",
    currentTask: "Orbital Vector Verification & Flight Telemetry Sync",
    status: "nominal", // 'nominal', 'warning', 'critical', 'rest'
    avatar: "👩‍🚀",
    vitals: {
      heartRate: 72,
      baseHeartRate: 72,
      heartRateRange: "60 - 100",
      heartRateTrend: "stable",
      bloodPressureSys: 118,
      bloodPressureDia: 76,
      bloodPressureTrend: "stable",
      oxygenSat: 99.2,
      oxygenSatTrend: "optimal",
      coreTemp: 36.9,
      coreTempUnit: "C",
      respirationRate: 14,
      respirationTrend: "nominal",
      cognitiveLoad: 32, // percentage
      stressIndex: "Low (Nominal)",
      hydration: 94.5, // percentage
      metabolicRate: 1850 // kcal/day
    },
    suitTelemetry: {
      suitPressure: 4.3, // psi
      suitPressureNominal: "4.3 psi",
      o2Reserve: 96, // %
      co2Scrubber: 91, // %
      batteryLevel: 98, // %
      coolantTemp: 18.2, // °C
      suitLeakRate: 0.00 // psi/min
    },
    radiation: {
      cumulativeDose: 44.6, // mSv
      missionLimit: 250, // mSv
      hourlyDoseRate: 0.042, // mSv/hr
      shieldingEfficiency: 98.2 // %
    },
    sleepData: {
      lastSleepDuration: "7h 42m",
      sleepQualityScore: 92,
      remPercentage: 24,
      deepSleepPercentage: 28,
      sleepDebt: "-0.2 hrs",
      circadianPhase: "Wake Phase 03:40 / 16:00"
    },
    circadianRoster: [
      { start: 0, end: 6.5, type: "sleep", label: "Scheduled Sleep Cycle (Deep/REM)" },
      { start: 6.5, end: 7.5, type: "freetime", label: "Hygiene, Bio-Assay & Crew Breakfast" },
      { start: 7.5, end: 12.0, type: "duty", label: "Active Duty: Orbital Vector Sync & Bridge Ops" },
      { start: 12.0, end: 13.5, type: "exercise", label: "Mandatory CEVIS Cycle & Microgravity Countermeasures" },
      { start: 13.5, end: 18.0, type: "duty", label: "Active Duty: Propulsion Diagnostics & DSN Uplink" },
      { start: 18.0, end: 22.0, type: "freetime", label: "Evening Meal, Debrief & Family Earth Uplink" },
      { start: 22.0, end: 24.0, type: "sleep", label: "Scheduled Pre-Sleep & Rest Ingress" }
    ],
    circadianMetrics: {
      cognitiveReadiness: 94,
      fatigueWarning: false,
      missedSleepHours: 0.0,
      extendedDutyHours: 0.0,
      baselineHeartRate: 72,
      recommendedCaffeineMg: 0,
      guidanceText: "Circadian alignment optimal. Sleep architecture balanced. Neuro-cognitive readiness at peak operational threshold."
    },
    alerts: [
      {
        id: "alt-101",
        time: "10:14 UTC",
        level: "info",
        message: "Scheduled circadian transition completed without biometric drift."
      },
      {
        id: "alt-102",
        time: "07:30 UTC",
        level: "nominal",
        message: "Pre-docking vestibular adaptation score: 98% (Optimal)."
      }
    ],
    ecgParams: {
      baseBpm: 72,
      rPeakAmp: 1.0,
      irregularity: 0.02
    }
  },
  {
    id: "crew-2",
    name: "Marcus Chen",
    callsign: "Vanguard-2",
    role: "Pilot",
    rank: "Major / High-G Specialist",
    age: 38,
    bloodType: "O-",
    evaSuit: "Mark-V Heavy EVA Armor",
    suitId: "SUIT-A02",
    location: "Airlock Alpha / Exterior Hull (EVA-3)",
    currentTask: "Thermal Radiator Array Servicing & Thruster Inspection",
    status: "warning", // elevated exertion in EVA
    avatar: "👨‍🚀",
    vitals: {
      heartRate: 104,
      baseHeartRate: 85,
      heartRateRange: "60 - 100",
      heartRateTrend: "elevated",
      bloodPressureSys: 138,
      bloodPressureDia: 88,
      bloodPressureTrend: "elevated",
      oxygenSat: 96.8,
      oxygenSatTrend: "nominal",
      coreTemp: 37.6,
      coreTempUnit: "C",
      respirationRate: 21,
      respirationTrend: "accelerated",
      cognitiveLoad: 68,
      stressIndex: "Moderate (EVA Exertion)",
      hydration: 86.2,
      metabolicRate: 2740
    },
    suitTelemetry: {
      suitPressure: 4.28,
      suitPressureNominal: "4.3 psi",
      o2Reserve: 78,
      co2Scrubber: 82,
      batteryLevel: 84,
      coolantTemp: 21.8,
      suitLeakRate: 0.01
    },
    radiation: {
      cumulativeDose: 58.7,
      missionLimit: 250,
      hourlyDoseRate: 0.089, // Higher due to EVA
      shieldingEfficiency: 92.4
    },
    sleepData: {
      lastSleepDuration: "5h 15m",
      sleepQualityScore: 68,
      remPercentage: 16,
      deepSleepPercentage: 18,
      sleepDebt: "+2.5 hrs",
      circadianPhase: "Wake Phase 07:15 / 16:00"
    },
    circadianRoster: [
      { start: 0, end: 5.0, type: "sleep", label: "Truncated Sleep Cycle (Early Alert Ingress)" },
      { start: 5.0, end: 6.0, type: "freetime", label: "Pre-EVA Nutrition & Hydration Pouch" },
      { start: 6.0, end: 18.5, type: "duty", label: "Active Duty: Extended EVA-3 Hull Servicing (12.5h)" },
      { start: 18.5, end: 20.0, type: "exercise", label: "Post-EVA Muscle Recovery Protocol" },
      { start: 20.0, end: 22.0, type: "freetime", label: "Suit De-servicing & Debriefing" },
      { start: 22.0, end: 24.0, type: "sleep", label: "Scheduled Sleep Cycle" }
    ],
    circadianMetrics: {
      cognitiveReadiness: 66,
      fatigueWarning: true,
      missedSleepHours: 2.5,
      extendedDutyHours: 3.5,
      baselineHeartRate: 85,
      recommendedCaffeineMg: 150,
      guidanceText: "⚠️ MILD FATIGUE DETECTED: Compound sleep deficit (-2.5h) and extended active EVA duty (+3.5h). Recommend 150mg sustained-release caffeine micro-dose with 300ml electrolyte hydration. Enforce mandatory 90-min sleep cycle prior to next EVA ingress."
    },
    alerts: [
      {
        id: "alt-201",
        time: "10:48 UTC",
        level: "warning",
        message: "Sustained tachycardia (104 BPM) during torque wrench operation on Hull Truss 4."
      },
      {
        id: "alt-202",
        time: "10:22 UTC",
        level: "warning",
        message: "Metabolic heat output exceeded 450 kcal/hr. Coolant loop pumped to high flow."
      },
      {
        id: "alt-203",
        time: "08:15 UTC",
        level: "warning",
        message: "Shift Planner Warning: Extended active duty hours exceed standard 8h threshold."
      }
    ],
    ecgParams: {
      baseBpm: 104,
      rPeakAmp: 1.15,
      irregularity: 0.05
    }
  },
  {
    id: "crew-3",
    name: "Dr. Elena Rostova",
    callsign: "Nova-3",
    role: "Mission Specialist 1",
    rank: "Chief Medical Officer / Astrobiologist",
    age: 36,
    bloodType: "B+",
    evaSuit: "Mark-V Research Bio-Suite",
    suitId: "SUIT-A03",
    location: "Hydroponics & Medical Bio-Lab",
    currentTask: "Microgravity Bone Density Assay & Radiation DNA Repair Scan",
    status: "nominal",
    avatar: "👩‍🔬",
    vitals: {
      heartRate: 67,
      baseHeartRate: 67,
      heartRateRange: "60 - 100",
      heartRateTrend: "stable",
      bloodPressureSys: 114,
      bloodPressureDia: 72,
      bloodPressureTrend: "optimal",
      oxygenSat: 99.6,
      oxygenSatTrend: "optimal",
      coreTemp: 36.7,
      coreTempUnit: "C",
      respirationRate: 13,
      respirationTrend: "calm",
      cognitiveLoad: 44,
      stressIndex: "Low (Optimal Focus)",
      hydration: 96.0,
      metabolicRate: 1680
    },
    suitTelemetry: {
      suitPressure: 4.31,
      suitPressureNominal: "4.3 psi",
      o2Reserve: 99,
      co2Scrubber: 96,
      batteryLevel: 100,
      coolantTemp: 17.5,
      suitLeakRate: 0.00
    },
    radiation: {
      cumulativeDose: 39.5,
      missionLimit: 250,
      hourlyDoseRate: 0.038,
      shieldingEfficiency: 99.1
    },
    sleepData: {
      lastSleepDuration: "8h 05m",
      sleepQualityScore: 95,
      remPercentage: 27,
      deepSleepPercentage: 31,
      sleepDebt: "0.0 hrs",
      circadianPhase: "Wake Phase 04:12 / 16:00"
    },
    circadianRoster: [
      { start: 0, end: 7.5, type: "sleep", label: "Full 7.5h Circadian Deep Rest Cycle" },
      { start: 7.5, end: 8.5, type: "freetime", label: "Morning Nutrition & Hydroponic Inspection" },
      { start: 8.5, end: 12.5, type: "duty", label: "Active Duty: Astrobiology Assay & Cell Culture Scan" },
      { start: 12.5, end: 14.0, type: "exercise", label: "T2 Treadmill Countermeasure Run" },
      { start: 14.0, end: 18.5, type: "duty", label: "Active Duty: Crew Clinical Vitals Review" },
      { start: 18.5, end: 22.5, type: "freetime", label: "Personal Leisure & Earth Medical Uplink" },
      { start: 22.5, end: 24.0, type: "sleep", label: "Pre-Sleep Light Dimming Protocol" }
    ],
    circadianMetrics: {
      cognitiveReadiness: 96,
      fatigueWarning: false,
      missedSleepHours: 0.0,
      extendedDutyHours: 0.0,
      baselineHeartRate: 67,
      recommendedCaffeineMg: 0,
      guidanceText: "Melatonin rhythm and circadian synchronization optimal. High cognitive readiness. No medical intervention needed."
    },
    alerts: [
      {
        id: "alt-301",
        time: "09:05 UTC",
        level: "nominal",
        message: "Automated neuro-cognitive baseline assessment passed (Score 99.4/100)."
      },
      {
        id: "alt-302",
        time: "06:18 UTC",
        level: "nominal",
        message: "Circadian melatonin synchronization within target therapeutic window."
      }
    ],
    ecgParams: {
      baseBpm: 67,
      rPeakAmp: 0.95,
      irregularity: 0.015
    }
  },
  {
    id: "crew-4",
    name: "Takuya Sato",
    callsign: "Chronos-4",
    role: "Mission Specialist 2",
    rank: "Lead Flight Systems Engineer / Robotics",
    age: 34,
    bloodType: "AB+",
    evaSuit: "Mark-V Avionics Specialist Suit",
    suitId: "SUIT-A04",
    location: "Engineering Node 2 / Reactor Ring",
    currentTask: "Auxiliary Ion Thruster Harmonic Calibration",
    status: "nominal",
    avatar: "👨‍💻",
    vitals: {
      heartRate: 75,
      baseHeartRate: 75,
      heartRateRange: "60 - 100",
      heartRateTrend: "stable",
      bloodPressureSys: 121,
      bloodPressureDia: 79,
      bloodPressureTrend: "stable",
      oxygenSat: 98.7,
      oxygenSatTrend: "nominal",
      coreTemp: 37.0,
      coreTempUnit: "C",
      respirationRate: 15,
      respirationTrend: "nominal",
      cognitiveLoad: 58,
      stressIndex: "Mild / Concentrated",
      hydration: 91.8,
      metabolicRate: 2050
    },
    suitTelemetry: {
      suitPressure: 4.3,
      suitPressureNominal: "4.3 psi",
      o2Reserve: 94,
      co2Scrubber: 93,
      batteryLevel: 95,
      coolantTemp: 18.9,
      suitLeakRate: 0.00
    },
    radiation: {
      cumulativeDose: 51.3,
      missionLimit: 250,
      hourlyDoseRate: 0.052,
      shieldingEfficiency: 97.4
    },
    sleepData: {
      lastSleepDuration: "7h 10m",
      sleepQualityScore: 86,
      remPercentage: 22,
      deepSleepPercentage: 24,
      sleepDebt: "+0.5 hrs",
      circadianPhase: "Wake Phase 05:50 / 16:00"
    },
    circadianRoster: [
      { start: 0, end: 6.5, type: "sleep", label: "Scheduled Rest & Deep Sleep" },
      { start: 6.5, end: 8.0, type: "freetime", label: "Engineering Standup & Crew Breakfast" },
      { start: 8.0, end: 13.0, type: "duty", label: "Active Duty: Ion Thruster Harmonic Calibration" },
      { start: 13.0, end: 14.5, type: "exercise", label: "ARED Resistance Microgravity Conditioning" },
      { start: 14.5, end: 19.0, type: "duty", label: "Active Duty: Robotics Bus Diagnostic" },
      { start: 19.0, end: 22.0, type: "freetime", label: "Personal Leisure & Hab Maintenance" },
      { start: 22.0, end: 24.0, type: "sleep", label: "Pre-Sleep Rest Ingress" }
    ],
    circadianMetrics: {
      cognitiveReadiness: 89,
      fatigueWarning: false,
      missedSleepHours: 0.0,
      extendedDutyHours: 0.0,
      baselineHeartRate: 75,
      recommendedCaffeineMg: 0,
      guidanceText: "Circadian metrics stable. Cognitive focus within acceptable flight engineering parameters."
    },
    alerts: [
      {
        id: "alt-401",
        time: "08:44 UTC",
        level: "nominal",
        message: "Fine motor control telemetry during robotic manipulator tests: 100% precision."
      },
      {
        id: "alt-402",
        time: "04:12 UTC",
        level: "info",
        message: "Scheduled hydration reminder acknowledged."
      }
    ],
    ecgParams: {
      baseBpm: 75,
      rPeakAmp: 1.05,
      irregularity: 0.02
    }
  }
];

// Mission Environment & Habitat Telemetry (ECLSS)
const MISSION_ECLSS_DATA = {
  habitatStatus: "OPTIMAL",
  cabinPressure: 101.32, // kPa (1 atm)
  o2Concentration: 20.95, // %
  co2PartialPressure: 0.31, // mmHg (safe < 3.0)
  cabinTemperature: 21.4, // °C
  cabinHumidity: 44.8, // %
  potableWaterReserve: 96.4, // %
  urineRecyclingEfficiency: 98.7, // %
  ambientRadiation: 0.038, // mSv/h
  solarParticleIndex: "QUIET (Class A0)",
  solarFlareProbability: "1.2%",
  activeEvaCrewCount: 1, // Marcus Chen currently in airlock/EVA
  radiationStormForecast: "CLEAR - 72h WINDOW SAFE"
};

// Mission Control System Event Feed
const INITIAL_MISSION_EVENTS = [
  {
    id: "evt-901",
    timestamp: "10:52:14 UTC",
    category: "BIO-TELEMETRY",
    severity: "warning",
    source: "Pilot Marcus Chen (EVA-3)",
    description: "Heart rate sustained at 104 BPM. Extended duty threshold exceeded (+3.5h). Fatigue advisory active.",
    acknowledged: false
  },
  {
    id: "evt-902",
    timestamp: "10:45:00 UTC",
    category: "ECLSS",
    severity: "nominal",
    source: "Life Support Node 1",
    description: "Atmospheric CO2 scrub cycle completed. Partial pressure restored to 0.31 mmHg.",
    acknowledged: true
  },
  {
    id: "evt-903",
    timestamp: "10:30:19 UTC",
    category: "SPACE WEATHER",
    severity: "nominal",
    source: "Heliospheric Sensor Array",
    description: "Solar wind velocity nominal at 382 km/s. Cosmic flux within safe corridor for EVA-3 operations.",
    acknowledged: true
  },
  {
    id: "evt-904",
    timestamp: "10:14:22 UTC",
    category: "COMMUNICATIONS",
    severity: "nominal",
    source: "DSN Madrid Relay",
    description: "Biometric quantum uplink telemetry stream synchronized. Latency: 14m 22s. Packet loss: 0.001%.",
    acknowledged: true
  },
  {
    id: "evt-905",
    timestamp: "09:48:50 UTC",
    category: "MEDICAL",
    severity: "nominal",
    source: "Chief Medical Officer",
    description: "Daily crew electrolyte assays logged. All indices within microgravity reference norms.",
    acknowledged: true
  }
];

// 24-Hour Trend History
const HISTORICAL_TRENDS = {
  hours: ["-24h", "-20h", "-16h", "-12h", "-8h", "-4h", "-2h", "-1h", "NOW"],
  crew1_hr: [68, 65, 60, 58, 64, 70, 71, 73, 72],
  crew2_hr: [72, 70, 64, 62, 76, 85, 96, 102, 104],
  crew3_hr: [66, 62, 59, 58, 63, 68, 67, 68, 67],
  crew4_hr: [74, 71, 65, 63, 69, 74, 76, 75, 75]
};

// Earth Ground Station Delayed Telemetry (T - 22m delay snapshot)
const DELAYED_EARTH_CREW_DATA = [
  {
    id: "crew-1",
    name: "Sarah Vance",
    callsign: "Aegis-1",
    role: "Commander",
    status: "nominal",
    heartRate: 70,
    bloodPressure: "116/74",
    oxygenSat: 99.4,
    cognitiveLoad: 28,
    suitPressure: "4.30 PSI",
    lastReportedTask: "Routine Bridge Comm Check (22m ago)",
    staleMinutes: 22
  },
  {
    id: "crew-2",
    name: "Marcus Chen",
    callsign: "Vanguard-2",
    role: "Pilot",
    status: "nominal", // Earth ground controllers still see calm resting state!
    heartRate: 74,     // While live on Spacecraft he is at 104 BPM in tachycardia!
    bloodPressure: "122/78",
    oxygenSat: 98.8,
    cognitiveLoad: 35,
    suitPressure: "4.30 PSI",
    lastReportedTask: "Pre-EVA Suit Prebreathe in Airlock (22m ago)",
    staleMinutes: 22
  },
  {
    id: "crew-3",
    name: "Dr. Elena Rostova",
    callsign: "Nova-3",
    role: "Mission Specialist 1",
    status: "nominal",
    heartRate: 66,
    bloodPressure: "112/70",
    oxygenSat: 99.8,
    cognitiveLoad: 38,
    suitPressure: "4.31 PSI",
    lastReportedTask: "Hydroponic Specimen Cataloging (22m ago)",
    staleMinutes: 22
  },
  {
    id: "crew-4",
    name: "Takuya Sato",
    callsign: "Chronos-4",
    role: "Mission Specialist 2",
    status: "nominal",
    heartRate: 73,
    bloodPressure: "119/76",
    oxygenSat: 99.0,
    cognitiveLoad: 50,
    suitPressure: "4.30 PSI",
    lastReportedTask: "Engineering Bus Diagnostic Pass (22m ago)",
    staleMinutes: 22
  }
];

// Telemetry Data Packets in Flight across Deep Space
const INITIAL_IN_FLIGHT_PACKETS = [
  {
    id: "PKT-9481",
    name: "CREW_VITALS_STREAM_REV42.BIN",
    type: "BIOMETRIC",
    payloadKb: 412,
    totalSeconds: 1320, // 22 minutes = 1320 seconds
    remainingSeconds: 284, // 04m 44s remaining to Earth arrival
    progressPct: 78.5,
    source: "Spacecraft Aethon-IV",
    destination: "DSN Madrid 70m",
    status: "IN_TRANSIT"
  },
  {
    id: "PKT-9482",
    name: "MARCUS_CHEN_ECG_LEAD2_HIRES.DAT",
    type: "ECG_HIRES",
    payloadKb: 1840,
    totalSeconds: 1320,
    remainingSeconds: 692, // 11m 32s remaining to Earth arrival
    progressPct: 47.6,
    source: "Spacecraft Aethon-IV",
    destination: "DSN Goldstone 70m",
    status: "IN_TRANSIT"
  },
  {
    id: "PKT-9483",
    name: "EVA3_METABOLIC_THERMAL_ALERT.LOG",
    type: "ALERT_DISPATCH",
    payloadKb: 96,
    totalSeconds: 1320,
    remainingSeconds: 1140, // 19m 00s remaining to Earth arrival
    progressPct: 13.6,
    source: "Spacecraft Aethon-IV",
    destination: "DSN Canberra 70m",
    status: "IN_TRANSIT"
  }
];
