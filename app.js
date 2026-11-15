// Space Mission Crew Health Monitoring System - Application Logic
// Architecture: Pure ES6+, Canvas Phosphor ECG Synthesis, Web Audio Synth, Reactive Telemetry Jitter

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentView: "crew-overview", // 'crew-overview' | 'mission-control'
    selectedCrewId: "crew-1",
    audioEnabled: true,
    tempUnit: "C", // 'C' | 'F'
    isEcgFrozen: false,
    ecgSpeed: 25, // mm/s
    selectedLead: "Lead II",
    eventsFilter: "all",
    missionEvents: [...INITIAL_MISSION_EVENTS],
    metSeconds: 142 * 86400 + 8 * 3600 + 34 * 60 + 12, // MET starting count
    latencyMode: "mars", // 'mars' (22m delay) | 'direct' (0.0s delay)
    owltSeconds: 1334, // 22 minutes 14 seconds
    inFlightPackets: JSON.parse(JSON.stringify(INITIAL_IN_FLIGHT_PACKETS))
  };

  // Web Audio Context for Authentic Sci-Fi Sound FX
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Play Futuristic Audio Blip
  function playBeep(type = "click") {
    if (!state.audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "alert") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(660, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "beep") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const dom = {
    // Nav
    navBtnOverview: document.getElementById("nav-btn-overview"),
    navBtnMissionControl: document.getElementById("nav-btn-mission-control"),
    viewCrewOverview: document.getElementById("view-crew-overview"),
    viewMissionControl: document.getElementById("view-mission-control"),
    sidebarCrewList: document.getElementById("sidebar-crew-list"),
    crewPillsBar: document.getElementById("crew-pills-bar"),
    menuToggle: document.getElementById("menu-toggle"),
    sidebar: document.getElementById("sidebar"),
    soundToggleBtn: document.getElementById("sound-toggle-btn"),
    soundIcon: document.getElementById("sound-icon"),
    navAlertCount: document.getElementById("nav-alert-count"),

    // Top Header Clocks
    metClock: document.getElementById("met-clock"),
    utcClock: document.getElementById("utc-clock"),
    commLatency: document.getElementById("comm-latency"),

    // Overview Dossier elements
    dossierAvatar: document.getElementById("dossier-avatar"),
    dossierName: document.getElementById("dossier-name"),
    dossierCallsign: document.getElementById("dossier-callsign"),
    dossierStatusPill: document.getElementById("dossier-status-pill"),
    dossierRole: document.getElementById("dossier-role"),
    dossierRank: document.getElementById("dossier-rank"),
    dossierLocation: document.getElementById("dossier-location"),
    dossierTask: document.getElementById("dossier-task"),
    dossierBlood: document.getElementById("dossier-blood"),
    dossierSuit: document.getElementById("dossier-suit"),

    // Vitals Tiles
    vitalHrVal: document.getElementById("vital-hr-val"),
    vitalHrTrend: document.getElementById("vital-hr-trend"),
    vitalBpVal: document.getElementById("vital-bp-val"),
    vitalTempVal: document.getElementById("vital-temp-val"),
    vitalTempUnit: document.getElementById("vital-temp-unit"),
    tempUnitToggle: document.getElementById("temp-unit-toggle"),
    vitalSpo2Val: document.getElementById("vital-spo2-val"),
    vitalRespVal: document.getElementById("vital-resp-val"),
    vitalStressVal: document.getElementById("vital-stress-val"),
    vitalStressLabel: document.getElementById("vital-stress-label"),

    // ECG Controls
    mainEcgCanvas: document.getElementById("main-ecg-canvas"),
    ecgLeadSelect: document.getElementById("ecg-lead-select"),
    ecgSpeedSelect: document.getElementById("ecg-speed-select"),
    ecgFreezeBtn: document.getElementById("ecg-freeze-btn"),
    rrIntervalLabel: document.getElementById("rr-interval-label"),

    // Suit & Tri-grid
    suitPressurePill: document.getElementById("suit-pressure-pill"),
    suitO2Label: document.getElementById("suit-o2-label"),
    suitO2Fill: document.getElementById("suit-o2-fill"),
    suitCo2Label: document.getElementById("suit-co2-label"),
    suitCo2Fill: document.getElementById("suit-co2-fill"),
    suitBattLabel: document.getElementById("suit-batt-label"),
    suitBattFill: document.getElementById("suit-batt-fill"),
    suitCoolLabel: document.getElementById("suit-cool-label"),
    suitCoolFill: document.getElementById("suit-cool-fill"),

    // Radiation
    radCumVal: document.getElementById("rad-cum-val"),
    radBarFill: document.getElementById("rad-bar-fill"),
    radPercent: document.getElementById("rad-percent"),
    radLimitText: document.getElementById("rad-limit-text"),
    radRate: document.getElementById("rad-rate"),
    radShield: document.getElementById("rad-shield"),

    // Sleep
    sleepScorePill: document.getElementById("sleep-score-pill"),
    sleepDuration: document.getElementById("sleep-duration"),
    sleepRem: document.getElementById("sleep-rem"),
    sleepRemBar: document.getElementById("sleep-rem-bar"),
    sleepDeep: document.getElementById("sleep-deep"),
    sleepDeepBar: document.getElementById("sleep-deep-bar"),
    circadianPhase: document.getElementById("circadian-phase"),
    sleepDebt: document.getElementById("sleep-debt"),

    // Clinical Alerts List
    crewAlertsCount: document.getElementById("crew-alerts-count"),
    crewIndividualAlerts: document.getElementById("crew-individual-alerts"),

    // Mission Control View elements
    fleetMatrixGrid: document.getElementById("fleet-matrix-grid"),
    mcFleetStatusText: document.getElementById("mc-fleet-status-text"),
    mcFleetDot: document.getElementById("mc-fleet-dot"),
    mcStatusBanner: document.getElementById("mc-status-banner"),
    mcActiveEva: document.getElementById("mc-active-eva"),
    missionEventsTbody: document.getElementById("mission-events-tbody"),

    // Action buttons & Modals
    openSimModalBtn: document.getElementById("open-sim-modal-btn"),
    simModal: document.getElementById("sim-modal"),
    closeSimModalBtn: document.getElementById("close-sim-modal-btn"),
    dismissSimModal: document.getElementById("dismiss-sim-modal"),
    simOptTachycardia: document.getElementById("sim-opt-tachycardia"),
    simOptHypoxia: document.getElementById("sim-opt-hypoxia"),
    simOptArrhythmia: document.getElementById("sim-opt-arrhythmia"),
    simOptNominal: document.getElementById("sim-opt-nominal"),

    // Circadian Rhythm & Shift Planner DOM elements
    circadianPlannerModule: document.getElementById("circadian-planner-module"),
    shiftRosterStatusBadge: document.getElementById("shift-roster-status-badge"),
    circadianReadinessBadge: document.getElementById("circadian-readiness-badge"),
    circadianReadinessVal: document.getElementById("circadian-readiness-val"),
    activeDutyDurationText: document.getElementById("active-duty-duration-text"),
    timelineBar: document.getElementById("timeline-bar"),
    timelineNowMarker: document.getElementById("timeline-now-marker"),
    markerHeadTime: document.getElementById("marker-head-time"),
    fatigueAlertBanner: document.getElementById("fatigue-alert-banner"),
    fatigueBeaconDot: document.getElementById("fatigue-beacon-dot"),
    fatigueBannerTitle: document.getElementById("fatigue-banner-title"),
    fatigueSleepDeficit: document.getElementById("fatigue-sleep-deficit"),
    fatigueDutyOverage: document.getElementById("fatigue-duty-overage"),
    fatigueHrImpact: document.getElementById("fatigue-hr-impact"),
    clinicalGuidanceText: document.getElementById("clinical-guidance-text"),
    caffeineRecommendationPill: document.getElementById("caffeine-recommendation-pill"),
    caffeineDosageLabel: document.getElementById("caffeine-dosage-label"),
    applyRestCountermeasureBtn: document.getElementById("apply-rest-countermeasure-btn"),
    shiftPresetNominal: document.getElementById("shift-preset-nominal"),
    shiftPresetOvertime: document.getElementById("shift-preset-overtime"),
    shiftPresetMissedSleep: document.getElementById("shift-preset-missed-sleep"),
    shiftPresetExhaustion: document.getElementById("shift-preset-exhaustion"),

    // Latency Simulation & Dual Viewport elements
    latencyModeMars: document.getElementById("latency-mode-mars"),
    latencyModeDirect: document.getElementById("latency-mode-direct"),
    dualViewportContainer: document.getElementById("dual-viewport-container"),
    spacecraftViewport: document.getElementById("spacecraft-viewport"),
    groundViewport: document.getElementById("ground-viewport"),
    transitConduitCard: document.getElementById("transit-conduit-card"),
    spacecraftTimestamp: document.getElementById("spacecraft-timestamp"),
    groundTimestamp: document.getElementById("ground-timestamp"),
    spacecraftCrewList: document.getElementById("spacecraft-crew-list"),
    groundCrewList: document.getElementById("ground-crew-list"),
    packetQueueList: document.getElementById("packet-queue-list"),
    deltaCountdownClock: document.getElementById("delta-countdown-clock"),
    deltaWarningText: document.getElementById("delta-warning-text"),
    transmitNewPacketBtn: document.getElementById("transmit-new-packet-btn"),
    transitPacketCanvas: document.getElementById("transit-packet-canvas"),
    latencyDistVal: document.getElementById("latency-dist-val"),
    latencyOwltVal: document.getElementById("latency-owlt-val"),
    groundLagLabel: document.getElementById("ground-lag-label"),
    groundBufferDelayText: document.getElementById("ground-buffer-delay-text"),
    groundFooterExplanation: document.getElementById("ground-footer-explanation"),

    runDiagnosticBtn: document.getElementById("run-diagnostic-btn"),
    diagnosticModal: document.getElementById("diagnostic-modal"),
    closeDiagModalBtn: document.getElementById("close-diag-modal-btn"),
    diagStatusText: document.getElementById("diag-status-text"),
    diagProgressFill: document.getElementById("diag-progress-fill"),
    diagLogText: document.getElementById("diag-log-text"),
    diagDoneBtn: document.getElementById("diag-done-btn"),
    exportLogBtn: document.getElementById("export-log-btn")
  };

  // =========================================================================
  // VIEW SWITCHING LOGIC
  // =========================================================================
  function switchView(viewName) {
    state.currentView = viewName;
    playBeep("click");

    if (viewName === "crew-overview") {
      dom.navBtnOverview.classList.add("active");
      dom.navBtnMissionControl.classList.remove("active");
      dom.viewCrewOverview.classList.add("active");
      dom.viewMissionControl.classList.remove("active");
      renderCrewOverview();
    } else {
      dom.navBtnOverview.classList.remove("active");
      dom.navBtnMissionControl.classList.add("active");
      dom.viewCrewOverview.classList.remove("active");
      dom.viewMissionControl.classList.add("active");
      renderMissionControl();
    }

    // Close mobile sidebar on navigation
    if (window.innerWidth <= 900) {
      dom.sidebar.classList.remove("open");
    }
  }

  dom.navBtnOverview.addEventListener("click", () => switchView("crew-overview"));
  dom.navBtnMissionControl.addEventListener("click", () => switchView("mission-control"));

  // Mobile menu drawer
  dom.menuToggle.addEventListener("click", () => {
    dom.sidebar.classList.toggle("open");
    playBeep("click");
  });

  // Sound FX toggle
  dom.soundToggleBtn.addEventListener("click", () => {
    state.audioEnabled = !state.audioEnabled;
    dom.soundIcon.textContent = state.audioEnabled ? "🔊" : "🔇";
    dom.soundToggleBtn.style.borderColor = state.audioEnabled ? "var(--cyan-core)" : "var(--border-dim)";
    if (state.audioEnabled) playBeep("beep");
  });

  // =========================================================================
  // ASTRONAUT SELECTION & RENDERING
  // =========================================================================
  function selectAstronaut(crewId) {
    state.selectedCrewId = crewId;
    playBeep("click");
    renderSidebarCrewList();
    renderCrewPillsBar();
    renderCrewOverview();
  }

  // Sidebar fast roster list
  function renderSidebarCrewList() {
    dom.sidebarCrewList.innerHTML = "";
    CREW_DATA.forEach(crew => {
      const card = document.createElement("div");
      const isSelected = crew.id === state.selectedCrewId;
      const isWarning = crew.status === "warning" || crew.status === "critical";
      card.className = `crew-quick-card ${isSelected ? "selected" : ""} ${isWarning ? "warning-state" : ""}`;
      card.innerHTML = `
        <div class="crew-avatar-mini">${crew.avatar}</div>
        <div class="crew-quick-info">
          <div class="crew-quick-name">${crew.name}</div>
          <div class="crew-quick-role">${crew.role}</div>
        </div>
        <div class="crew-quick-bpm ${isWarning ? "alert" : ""}">
          ${Math.round(crew.vitals.heartRate)} <span style="font-size: 8px;">BPM</span>
        </div>
      `;
      card.addEventListener("click", () => {
        selectAstronaut(crew.id);
        if (state.currentView !== "crew-overview") {
          switchView("crew-overview");
        }
      });
      dom.sidebarCrewList.appendChild(card);
    });
  }

  // Top astronaut pills in Overview
  function renderCrewPillsBar() {
    dom.crewPillsBar.innerHTML = "";
    CREW_DATA.forEach(crew => {
      const isSelected = crew.id === state.selectedCrewId;
      const isWarning = crew.status === "warning" || crew.status === "critical";
      const pill = document.createElement("button");
      pill.className = `crew-pill-btn ${isSelected ? "active" : ""} ${isWarning ? "warning-pill" : ""}`;
      pill.innerHTML = `
        <div class="pill-avatar">${crew.avatar}</div>
        <div class="pill-info">
          <div class="pill-name">${crew.name}</div>
          <div class="pill-role">${crew.role} // ${crew.callsign}</div>
        </div>
        <span class="pill-badge ${isWarning ? "warning" : "nominal"}">
          ${crew.status.toUpperCase()}
        </span>
      `;
      pill.addEventListener("click", () => selectAstronaut(crew.id));
      dom.crewPillsBar.appendChild(pill);
    });
  }

  // Render Full Crew Member Overview Dossier & Metrics
  function renderCrewOverview() {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];

    // Dossier Hero
    dom.dossierAvatar.textContent = crew.avatar;
    dom.dossierName.textContent = crew.name;
    dom.dossierCallsign.textContent = crew.callsign.toUpperCase();
    dom.dossierRole.textContent = crew.role;
    dom.dossierRank.textContent = crew.rank;
    dom.dossierLocation.textContent = crew.location;
    dom.dossierTask.textContent = crew.currentTask;
    dom.dossierBlood.textContent = crew.bloodType;
    dom.dossierSuit.textContent = `${crew.suitId} (${crew.evaSuit})`;

    const isWarning = crew.status === "warning" || crew.status === "critical";
    dom.dossierStatusPill.className = `pill-badge ${isWarning ? "warning" : "nominal"}`;
    dom.dossierStatusPill.textContent = crew.status.toUpperCase();

    // Vitals Numeric Row
    dom.vitalHrVal.textContent = Math.round(crew.vitals.heartRate);
    if (crew.vitals.heartRate > 100) {
      dom.vitalHrVal.className = "vital-value amber";
      dom.vitalHrTrend.className = "vital-trend alert";
      dom.vitalHrTrend.textContent = "▲ TACHYCARDIA";
    } else {
      dom.vitalHrVal.className = "vital-value cyan";
      dom.vitalHrTrend.className = "vital-trend";
      dom.vitalHrTrend.textContent = "▲ STABLE (NOMINAL)";
    }

    dom.vitalBpVal.textContent = `${crew.vitals.bloodPressureSys}/${crew.vitals.bloodPressureDia}`;
    
    // Core Temp
    updateTemperatureDisplay(crew.vitals.coreTemp);

    // SpO2
    dom.vitalSpo2Val.textContent = crew.vitals.oxygenSat.toFixed(1);
    if (crew.vitals.oxygenSat < 95) {
      dom.vitalSpo2Val.className = "vital-value amber";
    } else {
      dom.vitalSpo2Val.className = "vital-value cyan";
    }

    // Respiration
    dom.vitalRespVal.textContent = Math.round(crew.vitals.respirationRate);

    // Stress & Cognitive
    dom.vitalStressVal.textContent = crew.vitals.cognitiveLoad;
    dom.vitalStressLabel.textContent = crew.vitals.stressIndex.toUpperCase();

    // Suit Life Support
    dom.suitPressurePill.textContent = `${crew.suitTelemetry.suitPressure.toFixed(2)} PSI NOMINAL`;
    dom.suitO2Label.textContent = `${crew.suitTelemetry.o2Reserve}%`;
    dom.suitO2Fill.style.width = `${crew.suitTelemetry.o2Reserve}%`;
    dom.suitCo2Label.textContent = `${crew.suitTelemetry.co2Scrubber}%`;
    dom.suitCo2Fill.style.width = `${crew.suitTelemetry.co2Scrubber}%`;
    dom.suitBattLabel.textContent = `${crew.suitTelemetry.batteryLevel}%`;
    dom.suitBattFill.style.width = `${crew.suitTelemetry.batteryLevel}%`;
    dom.suitCoolLabel.textContent = `${crew.suitTelemetry.coolantTemp.toFixed(1)} °C`;
    dom.suitCoolFill.style.width = `${Math.min(100, (crew.suitTelemetry.coolantTemp / 30) * 100)}%`;

    // Radiation Dosimetry
    const radPercent = ((crew.radiation.cumulativeDose / crew.radiation.missionLimit) * 100).toFixed(1);
    dom.radCumVal.textContent = `${crew.radiation.cumulativeDose.toFixed(1)} mSv`;
    dom.radPercent.textContent = `${radPercent}% LIMIT`;
    dom.radLimitText.textContent = `${crew.radiation.cumulativeDose.toFixed(1)} / ${crew.radiation.missionLimit} mSv`;
    dom.radBarFill.style.width = `${radPercent}%`;
    dom.radRate.textContent = `${crew.radiation.hourlyDoseRate.toFixed(3)} mSv/h`;
    dom.radShield.textContent = `${crew.radiation.shieldingEfficiency.toFixed(1)}%`;

    // Sleep Metrics
    dom.sleepScorePill.textContent = `SCORE ${crew.sleepData.sleepQualityScore}/100`;
    dom.sleepDuration.textContent = crew.sleepData.lastSleepDuration;
    dom.sleepRem.textContent = `${crew.sleepData.remPercentage}%`;
    dom.sleepRemBar.style.width = `${crew.sleepData.remPercentage * 3}%`;
    dom.sleepDeep.textContent = `${crew.sleepData.deepSleepPercentage}%`;
    dom.sleepDeepBar.style.width = `${crew.sleepData.deepSleepPercentage * 3}%`;
    dom.circadianPhase.textContent = crew.sleepData.circadianPhase;
    dom.sleepDebt.textContent = crew.sleepData.sleepDebt;

    // R-R Interval Calculation for ECG
    const rrMs = Math.round((60 / crew.vitals.heartRate) * 1000);
    dom.rrIntervalLabel.textContent = `${rrMs} ms`;

    // Alerts Feed for this crew member
    dom.crewAlertsCount.textContent = `${crew.alerts.length} LOGGED ENTRIES`;
    dom.crewIndividualAlerts.innerHTML = "";
    crew.alerts.forEach(alt => {
      const item = document.createElement("div");
      item.className = `alert-feed-item ${alt.level}`;
      item.innerHTML = `
        <div class="alert-meta">
          <span>TIME: ${alt.time}</span>
          <span style="text-transform: uppercase;">LEVEL: ${alt.level}</span>
        </div>
        <div class="alert-body">${alt.message}</div>
      `;
      dom.crewIndividualAlerts.appendChild(item);
    });

    // Render Circadian Rhythm & Shift Planner module
    renderCircadianModule();
  }

  // =========================================================================
  // CIRCADIAN RHYTHM & SHIFT PLANNER MODULE
  // =========================================================================
  function formatHours(h) {
    const totalMinutes = Math.round(h * 60);
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  function renderCircadianModule() {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    if (!crew || !crew.circadianRoster) return;

    // 1. Calculate Total Durations
    let totalDuty = 0;
    let totalSleep = 0;
    crew.circadianRoster.forEach(seg => {
      const dur = seg.end - seg.start;
      if (seg.type === "duty") totalDuty += dur;
      if (seg.type === "sleep") totalSleep += dur;
    });
    if (dom.activeDutyDurationText) {
      dom.activeDutyDurationText.textContent = `ACTIVE DUTY: ${totalDuty.toFixed(1)}h | SLEEP: ${totalSleep.toFixed(1)}h`;
    }

    // 2. Render 24-Hour Timeline Bar Blocks
    dom.timelineBar.innerHTML = "";
    crew.circadianRoster.forEach(seg => {
      const dur = seg.end - seg.start;
      const widthPct = (dur / 24) * 100;
      const block = document.createElement("div");
      block.className = `timeline-block block-${seg.type}`;
      block.style.width = `${widthPct}%`;

      let icon = "🛠️";
      let shortName = "DUTY";
      if (seg.type === "sleep") { icon = "🛌"; shortName = "SLEEP"; }
      else if (seg.type === "exercise") { icon = "🏃"; shortName = "EXERCISE"; }
      else if (seg.type === "freetime") { icon = "☕"; shortName = "FREE"; }

      if (widthPct > 9) {
        block.innerHTML = `<span>${icon} ${shortName} (${dur.toFixed(1)}h)</span>`;
      } else {
        block.innerHTML = `<span>${icon}</span>`;
      }
      block.title = `${seg.label}\nRange: ${formatHours(seg.start)} - ${formatHours(seg.end)} UTC (${dur.toFixed(1)} hrs)`;
      
      block.addEventListener("click", () => {
        playBeep("click");
      });

      dom.timelineBar.appendChild(block);
    });

    // 3. Position the Current Mission Time Indicator
    const now = new Date();
    const curHourDecimal = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
    const markerPct = Math.max(0, Math.min(100, (curHourDecimal / 24) * 100));
    dom.timelineNowMarker.style.left = `${markerPct}%`;
    dom.markerHeadTime.textContent = `${formatHours(curHourDecimal)} UTC`;

    // 4. Update Fatigue HUD Readouts
    const m = crew.circadianMetrics;
    const isFatigued = m.fatigueWarning || m.missedSleepHours > 0 || m.extendedDutyHours > 0;
    const hrImpact = Math.round((m.missedSleepHours * 4) + (m.extendedDutyHours * 3.5));

    dom.fatigueSleepDeficit.textContent = `${m.missedSleepHours.toFixed(1)}h`;
    dom.fatigueDutyOverage.textContent = `+${m.extendedDutyHours.toFixed(1)}h`;
    dom.fatigueHrImpact.textContent = `+${hrImpact} BPM`;
    dom.circadianReadinessVal.textContent = `${Math.round(m.cognitiveReadiness)}%`;

    if (isFatigued) {
      dom.shiftRosterStatusBadge.className = "pill-badge warning";
      dom.shiftRosterStatusBadge.textContent = m.extendedDutyHours > 0 
        ? `EXTENDED DUTY (+${m.extendedDutyHours.toFixed(1)}H)` 
        : `SLEEP DEFICIT (-${m.missedSleepHours.toFixed(1)}H)`;
      dom.circadianReadinessBadge.className = "readiness-pill warning-pill";

      if (m.extendedDutyHours >= 4 && m.missedSleepHours >= 2.5) {
        dom.fatigueAlertBanner.className = "fatigue-alert-banner critical";
        dom.fatigueBeaconDot.className = "status-dot red";
        dom.fatigueBannerTitle.textContent = "🚨 CRITICAL FATIGUE WARNING: SEVERE CIRCADIAN DESYNCHRONIZATION";
      } else {
        dom.fatigueAlertBanner.className = "fatigue-alert-banner warning";
        dom.fatigueBeaconDot.className = "status-dot amber";
        dom.fatigueBannerTitle.textContent = `⚠️ MILD FATIGUE ADVISORY: ${m.extendedDutyHours > 0 ? "EXTENDED SHIFT" : "SLEEP DEFICIT"} ACTIVE`;
      }

      dom.clinicalGuidanceText.innerHTML = `<strong>CLINICAL INTERVENTION:</strong> ${m.guidanceText}`;
      dom.caffeineRecommendationPill.className = "caffeine-pill active-dosage";
      dom.caffeineDosageLabel.textContent = `CAFFEINE DOSAGE: ${m.recommendedCaffeineMg || 100} MG SLOW-RELEASE`;
      dom.applyRestCountermeasureBtn.style.display = "inline-flex";
    } else {
      dom.shiftRosterStatusBadge.className = "pill-badge nominal";
      dom.shiftRosterStatusBadge.textContent = "STANDARD 8H ROSTER";
      dom.circadianReadinessBadge.className = "readiness-pill";
      dom.fatigueAlertBanner.className = "fatigue-alert-banner nominal";
      dom.fatigueBeaconDot.className = "status-dot green";
      dom.fatigueBannerTitle.textContent = "FATIGUE STATUS: ALL SYSTEMS NOMINAL";
      dom.clinicalGuidanceText.textContent = m.guidanceText;
      dom.caffeineRecommendationPill.className = "caffeine-pill";
      dom.caffeineDosageLabel.textContent = "NO PHARMACOLOGICAL INTERVENTION NEEDED";
      dom.applyRestCountermeasureBtn.style.display = "none";
    }
  }

  // Shift Simulation Preset Event Listeners
  dom.shiftPresetNominal.addEventListener("click", () => {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    crew.circadianRoster = [
      { start: 0, end: 6.5, type: "sleep", label: "Scheduled Sleep Cycle (Deep/REM)" },
      { start: 6.5, end: 7.5, type: "freetime", label: "Hygiene, Bio-Assay & Crew Breakfast" },
      { start: 7.5, end: 12.0, type: "duty", label: "Active Duty: Scheduled Tasks" },
      { start: 12.0, end: 13.5, type: "exercise", label: "Mandatory CEVIS/ARED Conditioning" },
      { start: 13.5, end: 18.0, type: "duty", label: "Active Duty: Secondary Systems Sync" },
      { start: 18.0, end: 22.0, type: "freetime", label: "Evening Meal & Earth Uplink" },
      { start: 22.0, end: 24.0, type: "sleep", label: "Scheduled Pre-Sleep Rest Ingress" }
    ];
    crew.circadianMetrics.missedSleepHours = 0.0;
    crew.circadianMetrics.extendedDutyHours = 0.0;
    crew.circadianMetrics.fatigueWarning = false;
    crew.circadianMetrics.recommendedCaffeineMg = 0;
    crew.circadianMetrics.guidanceText = "Circadian alignment optimal. Sleep architecture balanced. Neuro-cognitive readiness nominal.";
    playBeep("success");
    renderCircadianModule();
    renderSidebarCrewList();
  });

  dom.shiftPresetOvertime.addEventListener("click", () => {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    crew.circadianRoster = [
      { start: 0, end: 6.5, type: "sleep", label: "Scheduled Sleep Cycle" },
      { start: 6.5, end: 7.5, type: "freetime", label: "Quick Nutrition Pouch" },
      { start: 7.5, end: 12.0, type: "duty", label: "Active Duty: Shift Flight Operations" },
      { start: 12.0, end: 13.5, type: "exercise", label: "Mandatory Conditioning Run" },
      { start: 13.5, end: 21.5, type: "duty", label: "Extended Duty: Emergency Overtime Telemetry (+3.5h)" },
      { start: 21.5, end: 22.5, type: "freetime", label: "Abbreviated De-briefing" },
      { start: 22.5, end: 24.0, type: "sleep", label: "Delayed Rest Cycle Ingress" }
    ];
    crew.circadianMetrics.extendedDutyHours = 3.5;
    crew.circadianMetrics.missedSleepHours = 0.5;
    crew.circadianMetrics.fatigueWarning = true;
    crew.circadianMetrics.recommendedCaffeineMg = 150;
    crew.circadianMetrics.guidanceText = "⚠️ MILD FATIGUE ADVISORY: Extended active duty hours (+3.5h). Recommend 150mg sustained-release caffeine micro-dose with 300ml electrolyte pouch. Enforce mandatory 90-min nap protocol prior to next EVA or docking maneuver.";
    playBeep("alert");
    renderCircadianModule();
    renderSidebarCrewList();
  });

  dom.shiftPresetMissedSleep.addEventListener("click", () => {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    crew.circadianRoster = [
      { start: 0, end: 3.5, type: "sleep", label: "Truncated Sleep (Critical Alarm Interruption)" },
      { start: 3.5, end: 7.5, type: "freetime", label: "Early Awakening & Systems Diagnostics" },
      { start: 7.5, end: 12.0, type: "duty", label: "Active Duty: Morning Shift" },
      { start: 12.0, end: 13.5, type: "exercise", label: "Exercise Countermeasures" },
      { start: 13.5, end: 18.0, type: "duty", label: "Active Duty: Deck Ops" },
      { start: 18.0, end: 21.5, type: "freetime", label: "Debrief & Free Time" },
      { start: 21.5, end: 24.0, type: "sleep", label: "Pre-Sleep Rest Ingress" }
    ];
    crew.circadianMetrics.missedSleepHours = 3.0;
    crew.circadianMetrics.extendedDutyHours = 0.0;
    crew.circadianMetrics.fatigueWarning = true;
    crew.circadianMetrics.recommendedCaffeineMg = 150;
    crew.circadianMetrics.guidanceText = "⚠️ SLEEP DEFICIT ADVISORY: Significant sleep deprivation (-3.0h rest deficit). Recommend 150mg sustained-release caffeine tab to sustain reaction vigilance. Schedule early sleep cycle ingress at 20:00 UTC.";
    playBeep("alert");
    renderCircadianModule();
    renderSidebarCrewList();
  });

  dom.shiftPresetExhaustion.addEventListener("click", () => {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    crew.circadianRoster = [
      { start: 0, end: 3.5, type: "sleep", label: "Severe Truncated Sleep (-3h)" },
      { start: 3.5, end: 5.5, type: "freetime", label: "Alarm Awakening" },
      { start: 5.5, end: 21.5, type: "duty", label: "Severe Extended Duty (16.0h Continuous Work)" },
      { start: 21.5, end: 22.5, type: "exercise", label: "Emergency Stress Relief" },
      { start: 22.5, end: 24.0, type: "sleep", label: "Delayed Sleep Ingress" }
    ];
    crew.circadianMetrics.extendedDutyHours = 4.0;
    crew.circadianMetrics.missedSleepHours = 3.0;
    crew.circadianMetrics.fatigueWarning = true;
    crew.circadianMetrics.recommendedCaffeineMg = 200;
    crew.circadianMetrics.guidanceText = "🚨 CRITICAL FATIGUE WARNING: Severe compound fatigue. Cognitive degradation exceeding 30%. Recommend immediate 200mg slow-release caffeine + schedule mandatory 90-min nap shift immediately. Reassign critical navigational duties.";
    playBeep("alert");
    renderCircadianModule();
    renderSidebarCrewList();
  });

  dom.applyRestCountermeasureBtn.addEventListener("click", () => {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    crew.circadianMetrics.missedSleepHours = 0.0;
    crew.circadianMetrics.extendedDutyHours = 0.0;
    crew.circadianMetrics.fatigueWarning = false;
    crew.circadianMetrics.recommendedCaffeineMg = 0;
    crew.circadianMetrics.guidanceText = "Caffeine countermeasure administered. 90-min restorative rest protocol logged. Vitals stabilizing to baseline.";
    state.missionEvents.unshift({
      id: "evt-" + Date.now(),
      timestamp: new Date().toISOString().substring(11, 19) + " UTC",
      category: "MEDICAL",
      severity: "nominal",
      source: `${crew.role} ${crew.name}`,
      description: `Clinical Fatigue Countermeasure Applied: Pharmacological caffeine micro-dose and scheduled rest cycle logged.`,
      acknowledged: true
    });
    playBeep("success");
    renderCircadianModule();
    renderSidebarCrewList();
    renderMissionEvents();
  });

  // Core temperature unit converter
  function updateTemperatureDisplay(tempC) {
    if (state.tempUnit === "C") {
      dom.vitalTempVal.textContent = tempC.toFixed(1);
      dom.vitalTempUnit.textContent = "°C";
    } else {
      const tempF = (tempC * 9/5) + 32;
      dom.vitalTempVal.textContent = tempF.toFixed(1);
      dom.vitalTempUnit.textContent = "°F";
    }
  }

  dom.tempUnitToggle.addEventListener("click", () => {
    state.tempUnit = state.tempUnit === "C" ? "F" : "C";
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    updateTemperatureDisplay(crew.vitals.coreTemp);
    playBeep("click");
  });

  // =========================================================================
  // VIEW 2: MISSION CONTROL CENTER CONSOLE
  // =========================================================================
  function renderMissionControl() {
    renderSplitViewports();
    renderMissionEvents();

    // Check if any crew is in warning/critical
    const warningCrew = CREW_DATA.filter(c => c.status === "warning" || c.status === "critical");
    if (warningCrew.length > 0) {
      dom.mcFleetDot.className = "status-dot amber";
      dom.mcFleetStatusText.textContent = `FLEET STATUS: ADVISORY ACTIVE (${warningCrew.length} CREW ELEVATED)`;
      dom.mcStatusBanner.classList.add("amber-alert");
      dom.navAlertCount.textContent = `${warningCrew.length} ADVISORY`;
      dom.navAlertCount.style.background = "var(--amber-dim)";
      dom.navAlertCount.style.color = "var(--amber-core)";
    } else {
      dom.mcFleetDot.className = "status-dot green";
      dom.mcFleetStatusText.textContent = "FLEET STATUS: ALL CREW NOMINAL";
      dom.mcStatusBanner.classList.remove("amber-alert");
      dom.navAlertCount.textContent = "NOMINAL";
      dom.navAlertCount.style.background = "var(--green-dim)";
      dom.navAlertCount.style.color = "var(--green-nominal)";
    }
  }

  // =========================================================================
  // LATENCY SIMULATION & DUAL VIEWPORT RENDERING
  // =========================================================================
  function renderSplitViewports() {
    if (!dom.spacecraftCrewList || !dom.groundCrewList) return;

    const isMars = state.latencyMode === "mars";
    const now = new Date();
    
    // Spacecraft Time (Live)
    const liveTimeStr = now.toISOString().replace("T", " ").substring(11, 19) + " UTC";
    if (dom.spacecraftTimestamp) {
      dom.spacecraftTimestamp.textContent = liveTimeStr;
    }

    // Earth Ground Station Time (-22m 14s in Mars mode, or Live in Direct mode)
    if (dom.groundTimestamp) {
      if (isMars) {
        const laggedDate = new Date(now.getTime() - state.owltSeconds * 1000);
        dom.groundTimestamp.textContent = laggedDate.toISOString().replace("T", " ").substring(11, 19) + " UTC";
      } else {
        dom.groundTimestamp.textContent = liveTimeStr;
      }
    }

    // Update Mode Text & Indicators
    if (isMars) {
      if (dom.groundLagLabel) dom.groundLagLabel.textContent = "DELAYED (-22m)";
      if (dom.groundBufferDelayText) dom.groundBufferDelayText.innerHTML = "⚠️ -22m 14s DELAYED";
      if (dom.deltaCountdownClock) dom.deltaCountdownClock.textContent = "22m 14s";
      if (dom.deltaWarningText) {
        dom.deltaWarningText.innerHTML = "⚠️ <strong>Obsolete Data:</strong> Earth flight controllers are observing telemetry from <strong>22 minutes ago</strong>. Live emergencies occurring right now aboard the spacecraft will take 22m 14s to reach Earth.";
      }
      if (dom.latencyDistVal) dom.latencyDistVal.textContent = "225,482,900 KM (1.507 AU)";
      if (dom.latencyOwltVal) dom.latencyOwltVal.textContent = "22m 14s";
      if (dom.groundFooterExplanation) {
        dom.groundFooterExplanation.innerHTML = "⚠️ <strong>OBSERVER NOTICE:</strong> Earth flight controllers believe Marcus Chen is resting at 74 BPM because his EVA-3 exertion packet is still in flight across deep space!";
      }
    } else {
      if (dom.groundLagLabel) dom.groundLagLabel.textContent = "SYNCED (0.0s)";
      if (dom.groundBufferDelayText) dom.groundBufferDelayText.innerHTML = "● 0.0s DIRECT LINK";
      if (dom.deltaCountdownClock) dom.deltaCountdownClock.textContent = "00m 00s";
      if (dom.deltaWarningText) {
        dom.deltaWarningText.innerHTML = "● <strong>Direct Orbit Link Active:</strong> Telemetry synchronized in real time with zero interplanetary delay.";
      }
      if (dom.latencyDistVal) dom.latencyDistVal.textContent = "412 KM (LEO CORRIDOR)";
      if (dom.latencyOwltVal) dom.latencyOwltVal.textContent = "0.001s";
      if (dom.groundFooterExplanation) {
        dom.groundFooterExplanation.innerHTML = "● <strong>SYNCHRONIZED:</strong> Earth flight controllers and spacecraft telemetry nodes are in real-time parity.";
      }
    }

    // 1. Render Left Spacecraft Viewport (Live Instantaneous)
    dom.spacecraftCrewList.innerHTML = "";
    CREW_DATA.forEach(crew => {
      const isElevated = crew.status === "warning" || crew.status === "critical";
      const card = document.createElement("div");
      card.className = `viewport-crew-card ${isElevated ? "warning-item" : ""}`;
      card.innerHTML = `
        <div class="vp-crew-avatar">${crew.avatar}</div>
        <div class="vp-crew-info">
          <div class="vp-crew-name">${crew.name} <span class="pill-badge ${isElevated ? "warning" : "nominal"}" style="font-size: 8px;">${crew.status.toUpperCase()}</span></div>
          <div class="vp-crew-sub">${crew.role} // ${crew.location}</div>
          <div style="font-size: 9px; color: var(--text-muted); margin-top: 2px;">TASK: ${crew.currentTask}</div>
        </div>
        <div class="vp-crew-vitals">
          <div class="vp-vital-item">
            <div class="v-lbl">HEART RATE</div>
            <div class="v-val ${isElevated ? "amber" : ""}">${Math.round(crew.vitals.heartRate)} <span style="font-size: 8px;">BPM</span></div>
          </div>
          <div class="vp-vital-item">
            <div class="v-lbl">SPO2</div>
            <div class="v-val">${crew.vitals.oxygenSat.toFixed(1)}%</div>
          </div>
          <button class="hud-btn primary inspect-crew-btn" data-id="${crew.id}" style="padding: 3px 8px; font-size: 9px;">
            INSPECT →
          </button>
        </div>
      `;
      dom.spacecraftCrewList.appendChild(card);
    });

    // 2. Render Right Earth Ground Station Viewport (Delayed / Outdated)
    dom.groundCrewList.innerHTML = "";
    DELAYED_EARTH_CREW_DATA.forEach(groundCrew => {
      const liveCrew = CREW_DATA.find(c => c.id === groundCrew.id);
      const card = document.createElement("div");
      card.className = `viewport-crew-card ${isMars ? "outdated-item" : ""}`;

      const displayHr = isMars ? groundCrew.heartRate : Math.round(liveCrew.vitals.heartRate);
      const displaySpo2 = isMars ? groundCrew.oxygenSat : liveCrew.vitals.oxygenSat;
      const displayStatus = isMars ? groundCrew.status : liveCrew.status;
      const displayTask = isMars ? groundCrew.lastReportedTask : liveCrew.currentTask;
      const isElevated = !isMars && (liveCrew.status === "warning" || liveCrew.status === "critical");

      card.innerHTML = `
        <div class="vp-crew-avatar">${liveCrew ? liveCrew.avatar : "👨‍🚀"}</div>
        <div class="vp-crew-info">
          <div class="vp-crew-name">
            ${groundCrew.name} 
            <span class="pill-badge ${isElevated ? "warning" : "nominal"}" style="font-size: 8px;">
              ${displayStatus.toUpperCase()} ${isMars ? "(-22m)" : ""}
            </span>
          </div>
          <div class="vp-crew-sub">${groundCrew.role} // ${isMars ? "Earth Ingestion Buffer" : "Direct Link"}</div>
          <div style="font-size: 9px; color: ${isMars ? "var(--amber-dim)" : "var(--text-muted)"}; margin-top: 2px;">
            ${isMars ? "BUFFERED: " + displayTask : "TASK: " + displayTask}
          </div>
        </div>
        <div class="vp-crew-vitals">
          <div class="vp-vital-item">
            <div class="v-lbl">${isMars ? "BUFFERED HR" : "HEART RATE"}</div>
            <div class="v-val ${isElevated ? "amber" : ""}" style="color: ${isMars ? "var(--text-secondary)" : ""};">${displayHr} <span style="font-size: 8px;">BPM</span></div>
          </div>
          <div class="vp-vital-item">
            <div class="v-lbl">${isMars ? "BUFFERED O2" : "SPO2"}</div>
            <div class="v-val" style="color: ${isMars ? "var(--text-secondary)" : ""};">${displaySpo2.toFixed(1)}%</div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 9px; font-weight: 700; color: ${isMars ? "var(--amber-core)" : "var(--green-nominal)"};">
            ${isMars ? "⏱️ -22m STALE" : "● SYNCED"}
          </span>
        </div>
      `;
      dom.groundCrewList.appendChild(card);
    });

    // 3. Render Center Transit Packet Queue
    renderPacketQueue();

    // Attach inspect telemetry buttons
    document.querySelectorAll(".inspect-crew-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        selectAstronaut(id);
        switchView("crew-overview");
      });
    });
  }

  // Render Packets Queue in Deep Space Transit
  function renderPacketQueue() {
    if (!dom.packetQueueList) return;
    dom.packetQueueList.innerHTML = "";

    const isMars = state.latencyMode === "mars";
    state.inFlightPackets.forEach(pkt => {
      const card = document.createElement("div");
      card.className = "packet-item-card";
      
      const mins = Math.floor(pkt.remainingSeconds / 60);
      const secs = pkt.remainingSeconds % 60;
      const etaStr = isMars ? `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s` : "00m 00s (ARRIVED)";
      const progress = isMars ? pkt.progressPct : 100;

      card.innerHTML = `
        <div class="packet-header">
          <span>${pkt.id} [${pkt.type}]</span>
          <span style="color: var(--amber-core);">${progress.toFixed(1)}% IN TRANSIT</span>
        </div>
        <div class="packet-name">${pkt.name} (${pkt.payloadKb} KB)</div>
        <div class="packet-progress-bar">
          <div class="packet-progress-fill" style="width: ${progress}%;"></div>
        </div>
        <div class="packet-eta-row">
          <span>ETA TO EARTH: <strong style="color: var(--cyan-core);">${etaStr}</strong></span>
          <span>${pkt.destination}</span>
        </div>
      `;
      dom.packetQueueList.appendChild(card);
    });
  }

  // Latency Switcher Event Listeners
  if (dom.latencyModeMars) {
    dom.latencyModeMars.addEventListener("click", () => {
      state.latencyMode = "mars";
      dom.latencyModeMars.classList.add("active-latency");
      dom.latencyModeDirect.classList.remove("active-latency");
      playBeep("alert");
      renderSplitViewports();
    });
  }

  if (dom.latencyModeDirect) {
    dom.latencyModeDirect.addEventListener("click", () => {
      state.latencyMode = "direct";
      dom.latencyModeDirect.classList.add("active-latency");
      dom.latencyModeMars.classList.remove("active-latency");
      playBeep("success");
      renderSplitViewports();
    });
  }

  // Dispatch Telemetry Burst Button
  if (dom.transmitNewPacketBtn) {
    dom.transmitNewPacketBtn.addEventListener("click", () => {
      playBeep("click");
      const newPkt = {
        id: "PKT-" + Math.floor(1000 + Math.random() * 9000),
        name: `TELEMETRY_BURST_${Date.now().toString().slice(-4)}.DAT`,
        type: "BURST_SYNC",
        payloadKb: Math.floor(200 + Math.random() * 1200),
        totalSeconds: 1320,
        remainingSeconds: 1320,
        progressPct: 0.1,
        source: "Spacecraft Aethon-IV",
        destination: "DSN Madrid 70m",
        status: "IN_TRANSIT"
      };
      state.inFlightPackets.unshift(newPkt);
      if (state.inFlightPackets.length > 5) {
        state.inFlightPackets.pop();
      }
      renderPacketQueue();
      triggerPacketParticleBurst();
    });
  }

  // =========================================================================
  // DEEP SPACE TRANSIT PACKET PARTICLE CANVAS ANIMATION
  // =========================================================================
  const transitCanvas = dom.transitPacketCanvas;
  let tCtx = transitCanvas ? transitCanvas.getContext("2d") : null;
  const transitParticles = [];
  const stars = [];

  function initTransitStars(w, h) {
    stars.length = 0;
    for (let i = 0; i < 35; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  function initTransitPackets() {
    transitParticles.length = 0;
    for (let i = 0; i < 12; i++) {
      transitParticles.push({
        x: Math.random() * 300,
        y: 20 + Math.random() * 54,
        speed: 0.8 + Math.random() * 1.6,
        size: 2.5 + Math.random() * 2,
        tail: [],
        color: Math.random() > 0.3 ? "#00f0ff" : "#ffaa00",
        label: Math.random() > 0.5 ? "PKT" : "DATA"
      });
    }
  }

  function triggerPacketParticleBurst() {
    if (!transitCanvas) return;
    for (let i = 0; i < 8; i++) {
      transitParticles.push({
        x: 0,
        y: 25 + Math.random() * 45,
        speed: 2.8 + Math.random() * 2.2,
        size: 3.5,
        tail: [],
        color: "#00f0ff",
        label: "BURST"
      });
    }
  }

  function animateTransitCanvas() {
    if (!transitCanvas || !tCtx) return;
    const rect = transitCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (transitCanvas.width !== w || transitCanvas.height !== h) {
      transitCanvas.width = w;
      transitCanvas.height = h;
      initTransitStars(w, h);
      initTransitPackets();
    }

    // Clear background
    tCtx.fillStyle = "#020409";
    tCtx.fillRect(0, 0, w, h);

    // Draw Background Stars
    stars.forEach(st => {
      st.alpha += Math.sin(Date.now() * st.twinkleSpeed) * 0.01;
      tCtx.fillStyle = `rgba(165, 180, 252, ${Math.max(0.1, Math.min(1, st.alpha))})`;
      tCtx.fillRect(st.x, st.y, st.size, st.size);
    });

    // Draw Quantum Carrier Beam Ray lines
    tCtx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    tCtx.lineWidth = 1;
    [32, 47, 62].forEach(yPos => {
      tCtx.beginPath();
      tCtx.moveTo(0, yPos);
      tCtx.lineTo(w, yPos);
      tCtx.stroke();
    });

    // Draw In-Transit Data Packets
    transitParticles.forEach(p => {
      p.x += p.speed;
      if (p.x > w) {
        p.x = 0;
        p.y = 20 + Math.random() * 54;
        p.tail = [];
      }

      // Record tail
      p.tail.unshift({ x: p.x, y: p.y });
      if (p.tail.length > 8) p.tail.pop();

      // Draw tail trail
      tCtx.beginPath();
      for (let i = 0; i < p.tail.length; i++) {
        const pt = p.tail[i];
        const alpha = (1 - (i / p.tail.length)) * 0.45;
        tCtx.fillStyle = p.color === "#00f0ff" ? `rgba(0, 240, 255, ${alpha})` : `rgba(255, 170, 0, ${alpha})`;
        tCtx.fillRect(pt.x, pt.y, p.size * (1 - i / 10), p.size * (1 - i / 10));
      }

      // Draw Head Packet
      tCtx.save();
      tCtx.fillStyle = p.color;
      tCtx.shadowColor = p.color;
      tCtx.shadowBlur = 8;
      tCtx.beginPath();
      tCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      tCtx.fill();

      // Tiny packet label text
      tCtx.font = "7px JetBrains Mono";
      tCtx.fillStyle = "rgba(255, 255, 255, 0.75)";
      tCtx.fillText(p.label, p.x - 6, p.y - 5);
      tCtx.restore();
    });

    requestAnimationFrame(animateTransitCanvas);
  }

  if (transitCanvas) {
    requestAnimationFrame(animateTransitCanvas);
  }

  // Filter and render mission events
  function renderMissionEvents() {
    dom.missionEventsTbody.innerHTML = "";
    const filtered = state.missionEvents.filter(evt => {
      if (state.eventsFilter === "all") return true;
      return evt.severity === state.eventsFilter;
    });

    filtered.forEach(evt => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="time-col">${evt.timestamp}</td>
        <td>
          <span class="sev-pill ${evt.severity}">${evt.severity}</span>
        </td>
        <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-main);">${evt.source}</td>
        <td>${evt.description}</td>
        <td>
          ${evt.acknowledged 
            ? `<span style="font-family: var(--font-mono); font-size: 10px; color: var(--green-nominal);">✓ ACKNOWLEDGED</span>`
            : `<button class="filter-btn ack-btn" data-id="${evt.id}" style="color: var(--amber-core); border-color: var(--amber-border);">ACKNOWLEDGE</button>`
          }
        </td>
      `;
      dom.missionEventsTbody.appendChild(tr);
    });

    // Attach acknowledge handlers
    document.querySelectorAll(".ack-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const ev = state.missionEvents.find(item => item.id === id);
        if (ev) {
          ev.acknowledged = true;
          playBeep("click");
          renderMissionEvents();
        }
      });
    });
  }

  // Mission event filter buttons
  document.querySelectorAll(".filter-btn-group .filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn-group .filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      state.eventsFilter = e.target.getAttribute("data-filter");
      playBeep("click");
      renderMissionEvents();
    });
  });

  // =========================================================================
  // REAL-TIME PHOSPHOR ECG OSCILLOSCOPE GENERATOR (HTML5 CANVAS)
  // =========================================================================
  const canvas = dom.mainEcgCanvas;
  const ctx = canvas.getContext("2d");

  // High DPI Canvas Scaling
  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // ECG Mathematical Waveform Generator (P-Q-R-S-T curve)
  let ecgX = 0;
  let lastY = 90;
  let ecgPhase = 0; // 0 to 1 cycle progress

  function getEcgY(phase, bpm, lead) {
    const baseHeight = 90; // Midline in 180px height
    let deflection = 0;

    // Normal cardiac cycle phase map:
    // 0.00 - 0.12 : Isoelectric baseline
    // 0.12 - 0.20 : P wave (Atrial Depolarization)
    // 0.20 - 0.28 : PR segment (AV nodal delay)
    // 0.28 - 0.31 : Q wave (Septal depolarization, negative)
    // 0.31 - 0.36 : R wave (Ventricular depolarization, sharp positive spike)
    // 0.36 - 0.40 : S wave (Terminal depolarization, sharp negative)
    // 0.40 - 0.52 : ST segment
    // 0.52 - 0.68 : T wave (Ventricular repolarization)
    // 0.68 - 1.00 : Diastole baseline

    let rMultiplier = 1.0;
    if (lead === "Lead V1") rMultiplier = 0.6;
    if (lead === "Lead V5") rMultiplier = 1.25;

    if (phase >= 0.12 && phase < 0.20) {
      // P wave
      const pProgress = (phase - 0.12) / 0.08;
      deflection = -Math.sin(pProgress * Math.PI) * 12;
    } else if (phase >= 0.28 && phase < 0.31) {
      // Q wave
      const qProgress = (phase - 0.28) / 0.03;
      deflection = Math.sin(qProgress * Math.PI) * 8;
    } else if (phase >= 0.31 && phase < 0.36) {
      // R wave (Tall Spike)
      const rProgress = (phase - 0.31) / 0.05;
      deflection = -Math.sin(rProgress * Math.PI) * (58 * rMultiplier);
    } else if (phase >= 0.36 && phase < 0.40) {
      // S wave (Deep notch)
      const sProgress = (phase - 0.36) / 0.04;
      deflection = Math.sin(sProgress * Math.PI) * 18;
    } else if (phase >= 0.52 && phase < 0.68) {
      // T wave
      const tProgress = (phase - 0.52) / 0.16;
      deflection = -Math.sin(tProgress * Math.PI) * 18;
    }

    // Slight bio-electrical noise jitter
    const noise = (Math.random() - 0.5) * 1.5;
    return baseHeight + deflection + noise;
  }

  // Draw Grid Lines on ECG Canvas
  function drawEcgGrid(context, w, h) {
    context.save();
    context.strokeStyle = "rgba(0, 240, 255, 0.05)";
    context.lineWidth = 1;

    // Small 10px grid
    for (let x = 0; x < w; x += 15) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, h);
      context.stroke();
    }
    for (let y = 0; y < h; y += 15) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(w, y);
      context.stroke();
    }

    // Larger 60px major grid
    context.strokeStyle = "rgba(0, 240, 255, 0.12)";
    for (let x = 0; x < w; x += 60) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, h);
      context.stroke();
    }
    for (let y = 0; y < h; y += 60) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(w, y);
      context.stroke();
    }
    context.restore();
  }

  // Main ECG Render Loop
  let lastTimestamp = 0;
  function animateMainEcg(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (!state.isEcgFrozen && canvas) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
      const bpm = crew.vitals.heartRate;
      const beatsPerSecond = bpm / 60;

      // Update Phase
      ecgPhase += beatsPerSecond * dt;
      if (ecgPhase >= 1) {
        ecgPhase -= 1;
        // Subtle audio heartbeat blip at R-peak
        if (state.audioEnabled && Math.random() > 0.4) {
          playBeep("beep");
        }
      }

      // Sweep velocity across canvas
      const sweepPixelsPerSecond = (state.ecgSpeed / 25) * 120;
      const step = sweepPixelsPerSecond * dt;
      const nextX = ecgX + step;
      const nextY = getEcgY(ecgPhase, bpm, state.selectedLead);

      // Erase ahead sweep cursor band (Radar sweep effect)
      ctx.save();
      ctx.fillStyle = "#04070f";
      const sweepGap = 24;
      ctx.fillRect(ecgX, 0, sweepGap, h);
      ctx.restore();

      // Redraw subtle grid in erased region
      ctx.save();
      ctx.beginPath();
      ctx.rect(ecgX, 0, sweepGap, h);
      ctx.clip();
      drawEcgGrid(ctx, w, h);
      ctx.restore();

      // Draw Phosphor Beam Line
      ctx.save();
      const isElevated = crew.status === "warning" || crew.status === "critical";
      const strokeColor = isElevated ? "#ffaa00" : "#00f0ff";
      const glowColor = isElevated ? "rgba(255, 170, 0, 0.8)" : "rgba(0, 240, 255, 0.8)";

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(ecgX, lastY);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      // Draw Glow Cursor Lead Point
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(nextX, nextY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ecgX = nextX;
      lastY = nextY;

      // Wrap around canvas width
      if (ecgX >= w) {
        ecgX = 0;
        lastY = getEcgY(ecgPhase, bpm, state.selectedLead);
      }
    }

    // Mini ECGs for Mission Control if active
    if (state.currentView === "mission-control") {
      updateMiniEcgs();
    }

    requestAnimationFrame(animateMainEcg);
  }

  // Mini ECGs rendered for the 4 astronauts in Mission Control
  const miniPhases = { "crew-1": 0, "crew-2": 0.25, "crew-3": 0.5, "crew-4": 0.75 };
  const miniX = { "crew-1": 0, "crew-2": 0, "crew-3": 0, "crew-4": 0 };
  const miniLastY = { "crew-1": 26, "crew-2": 26, "crew-3": 26, "crew-4": 26 };

  function updateMiniEcgs() {
    CREW_DATA.forEach(crew => {
      const c = document.getElementById(`mini-ecg-${crew.id}`);
      if (!c) return;
      const mCtx = c.getContext("2d");
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }

      const bpm = crew.vitals.heartRate;
      miniPhases[crew.id] = (miniPhases[crew.id] + (bpm / 60) * 0.02) % 1;

      // Calculate mini Y (scaled down to 52px height)
      let normY = (getEcgY(miniPhases[crew.id], bpm, "Lead II") - 90) * 0.35 + 26;
      let curX = miniX[crew.id];
      let nX = curX + 2;

      // Clear slice
      mCtx.fillStyle = "#050811";
      mCtx.fillRect(curX, 0, 10, h);

      // Line
      const isWarn = crew.status === "warning";
      mCtx.strokeStyle = isWarn ? "#ffaa00" : "#00f0ff";
      mCtx.lineWidth = 1.5;
      mCtx.beginPath();
      mCtx.moveTo(curX, miniLastY[crew.id]);
      mCtx.lineTo(nX, normY);
      mCtx.stroke();

      miniLastY[crew.id] = normY;
      miniX[crew.id] = nX >= w ? 0 : nX;
    });
  }

  // ECG Control Buttons
  dom.ecgSpeedSelect.addEventListener("change", (e) => {
    state.ecgSpeed = parseInt(e.target.value, 10);
    playBeep("click");
  });

  dom.ecgLeadSelect.addEventListener("change", (e) => {
    state.selectedLead = e.target.value;
    playBeep("click");
  });

  dom.ecgFreezeBtn.addEventListener("click", () => {
    state.isEcgFrozen = !state.isEcgFrozen;
    dom.ecgFreezeBtn.textContent = state.isEcgFrozen ? "RESUME TRACE" : "FREEZE TRACE";
    dom.ecgFreezeBtn.style.borderColor = state.isEcgFrozen ? "var(--amber-core)" : "var(--cyan-border)";
    playBeep("click");
  });

  // Start ECG Animation
  requestAnimationFrame(animateMainEcg);

  // =========================================================================
  // REAL-TIME CLOCK & BIOMETRIC JITTER TELEMETRY ENGINE
  // =========================================================================
  setInterval(() => {
    // 1. Advance Mission Elapsed Time
    state.metSeconds += 1;
    const days = Math.floor(state.metSeconds / 86400);
    const hrs = Math.floor((state.metSeconds % 86400) / 3600);
    const mins = Math.floor((state.metSeconds % 3600) / 60);
    const secs = state.metSeconds % 60;
    dom.metClock.textContent = `MET T+${days}:${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // 2. Real-time UTC Clock
    const now = new Date();
    dom.utcClock.textContent = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";

    // 3. Simulated Uplink Latency Drift (14m 21s - 14m 25s)
    const latSec = 20 + Math.floor(Math.sin(state.metSeconds * 0.1) * 4);
    dom.commLatency.textContent = `14m ${latSec}s`;

    // 4. Subtle Natural Telemetry Jitter for Crew (simulates live bio-sensors)
    CREW_DATA.forEach(crew => {
      // Jitter HR ±0.5 bpm
      const hrJitter = (Math.random() - 0.48) * 0.8;
      crew.vitals.heartRate = Math.max(50, Math.min(160, crew.vitals.heartRate + hrJitter));

      // Jitter SpO2 slightly
      const o2Jitter = (Math.random() - 0.5) * 0.05;
      crew.vitals.oxygenSat = Math.max(90, Math.min(100, crew.vitals.oxygenSat + o2Jitter));

      // Respiration
      const respJitter = (Math.random() - 0.5) * 0.15;
      crew.vitals.respirationRate = Math.max(10, Math.min(32, crew.vitals.respirationRate + respJitter));

      // 5. Connect Circadian Schedule to Telemetry Drift (Resting HR & Cognitive Readiness)
      const m = crew.circadianMetrics;
      if (m) {
        const hasFatigue = m.fatigueWarning || m.missedSleepHours > 0 || m.extendedDutyHours > 0;
        
        // Target resting heart rate elevated by fatigue
        const baseHr = crew.vitals.baseHeartRate || (crew.id === "crew-2" ? 85 : 72);
        const targetBaseHr = baseHr + (m.missedSleepHours * 4.0) + (m.extendedDutyHours * 3.5);
        
        // Target cognitive readiness reduced by fatigue
        const targetReadiness = Math.max(45, Math.min(100, 96 - (m.missedSleepHours * 9.5) - (m.extendedDutyHours * 6.5)));

        // Gradually drift resting heart rate towards targetBaseHr
        if (crew.vitals.heartRate < targetBaseHr - 0.5) {
          crew.vitals.heartRate += 0.35;
        } else if (crew.vitals.heartRate > targetBaseHr + 1.2 && !hasFatigue) {
          crew.vitals.heartRate -= 0.3;
        }

        // Gradually drift cognitive readiness towards targetReadiness
        if (m.cognitiveReadiness > targetReadiness + 0.5) {
          m.cognitiveReadiness -= 0.4;
        } else if (m.cognitiveReadiness < targetReadiness - 0.5) {
          m.cognitiveReadiness += 0.5;
        }

        // Synchronize cognitive workload index in vitals
        crew.vitals.cognitiveLoad = Math.round(100 - m.cognitiveReadiness);
        if (hasFatigue) {
          crew.vitals.stressIndex = m.cognitiveReadiness < 70 ? "High (Fatigue Strain)" : "Moderate (Shift Exertion)";
        } else {
          crew.vitals.stressIndex = "Low (Nominal)";
        }
      }
    });

    // Re-render numeric tiles and circadian needle if in Overview
    if (state.currentView === "crew-overview") {
      const activeCrew = CREW_DATA.find(c => c.id === state.selectedCrewId);
      if (activeCrew) {
        dom.vitalHrVal.textContent = Math.round(activeCrew.vitals.heartRate);
        dom.vitalSpo2Val.textContent = activeCrew.vitals.oxygenSat.toFixed(1);
        dom.vitalRespVal.textContent = Math.round(activeCrew.vitals.respirationRate);
        dom.vitalStressVal.textContent = activeCrew.vitals.cognitiveLoad;
        dom.vitalStressLabel.textContent = activeCrew.vitals.stressIndex.toUpperCase();

        if (activeCrew.circadianMetrics && dom.circadianReadinessVal) {
          dom.circadianReadinessVal.textContent = `${Math.round(activeCrew.circadianMetrics.cognitiveReadiness)}%`;
        }

        // Real-time timeline now marker position update
        if (dom.timelineNowMarker && dom.markerHeadTime) {
          const nowUtc = new Date();
          const curH = nowUtc.getUTCHours() + nowUtc.getUTCMinutes() / 60 + nowUtc.getUTCSeconds() / 3600;
          dom.timelineNowMarker.style.left = `${(curH / 24) * 100}%`;
          dom.markerHeadTime.textContent = `${formatHours(curH)} UTC`;
        }
      }
    }

    // 6. Deep Space In-Transit Packets & Dual Viewport Ticker
    if (state.latencyMode === "mars") {
      state.inFlightPackets.forEach(pkt => {
        pkt.remainingSeconds -= 1;
        if (pkt.remainingSeconds <= 0) {
          pkt.remainingSeconds = pkt.totalSeconds;
          pkt.id = "PKT-" + Math.floor(1000 + Math.random() * 9000);
        }
        pkt.progressPct = Math.min(100, Math.max(0, ((pkt.totalSeconds - pkt.remainingSeconds) / pkt.totalSeconds) * 100));
      });

      // OWLT countdown clock update
      const owltMins = Math.floor(state.owltSeconds / 60);
      const owltSecs = state.owltSeconds % 60;
      const owltStr = `${owltMins}m ${String(owltSecs).padStart(2, '0')}s`;
      if (dom.deltaCountdownClock) dom.deltaCountdownClock.textContent = owltStr;
      if (dom.latencyOwltVal) dom.latencyOwltVal.textContent = owltStr;
    }

    if (state.currentView === "mission-control") {
      renderSplitViewports();
    }
  }, 1000);

  // =========================================================================
  // ANOMALY SIMULATOR MODAL & INJECTION SCENARIOS
  // =========================================================================
  dom.openSimModalBtn.addEventListener("click", () => {
    dom.simModal.classList.add("open");
    playBeep("click");
  });

  const closeSimModal = () => {
    dom.simModal.classList.remove("open");
    playBeep("click");
  };
  dom.closeSimModalBtn.addEventListener("click", closeSimModal);
  dom.dismissSimModal.addEventListener("click", closeSimModal);

  // Scenario A: Tachycardia on Marcus Chen
  dom.simOptTachycardia.addEventListener("click", () => {
    const marcus = CREW_DATA.find(c => c.id === "crew-2");
    if (marcus) {
      marcus.status = "warning";
      marcus.vitals.heartRate = 134;
      marcus.vitals.bloodPressureSys = 152;
      marcus.vitals.bloodPressureDia = 94;
      marcus.vitals.coreTemp = 38.2;
      marcus.vitals.respirationRate = 28;
      marcus.vitals.cognitiveLoad = 82;
      marcus.suitTelemetry.coolantTemp = 26.4;
      marcus.alerts.unshift({
        id: "alt-" + Date.now(),
        time: new Date().toISOString().substring(11, 19) + " UTC",
        level: "warning",
        message: "SIMULATED: Acute exertion tachycardia (134 BPM) during Hull EVA. Coolant thermal margin narrow."
      });

      state.missionEvents.unshift({
        id: "evt-" + Date.now(),
        timestamp: new Date().toISOString().substring(11, 19) + " UTC",
        category: "ALARM",
        severity: "warning",
        source: "Pilot Marcus Chen (EVA-3)",
        description: "SIMULATION INJECTED: Tachycardia advisory (134 BPM). High metabolic burn. Standby for airlock recall.",
        acknowledged: false
      });
    }

    playBeep("alert");
    selectAstronaut("crew-2");
    renderSidebarCrewList();
    renderMissionControl();
    closeSimModal();
  });

  // Scenario B: Hypoxia on Sarah Vance
  dom.simOptHypoxia.addEventListener("click", () => {
    const sarah = CREW_DATA.find(c => c.id === "crew-1");
    if (sarah) {
      sarah.status = "critical";
      sarah.vitals.oxygenSat = 91.8;
      sarah.vitals.heartRate = 112;
      sarah.vitals.respirationRate = 27;
      sarah.vitals.cognitiveLoad = 88;
      sarah.alerts.unshift({
        id: "alt-" + Date.now(),
        time: new Date().toISOString().substring(11, 19) + " UTC",
        level: "danger",
        message: "SIMULATED: Acute desaturation (SpO2 91.8%). Localized suit O2 pressure drop detected."
      });

      state.missionEvents.unshift({
        id: "evt-" + Date.now(),
        timestamp: new Date().toISOString().substring(11, 19) + " UTC",
        category: "CRITICAL",
        severity: "critical",
        source: "Commander Sarah Vance",
        description: "SIMULATION INJECTED: Hypoxia advisory (SpO2 91.8%). Auxiliary O2 bypass purge initiated.",
        acknowledged: false
      });
    }

    playBeep("alert");
    selectAstronaut("crew-1");
    renderSidebarCrewList();
    renderMissionControl();
    closeSimModal();
  });

  // Scenario C: Arrhythmia on Takuya Sato
  dom.simOptArrhythmia.addEventListener("click", () => {
    const takuya = CREW_DATA.find(c => c.id === "crew-4");
    if (takuya) {
      takuya.status = "warning";
      takuya.vitals.heartRate = 96;
      takuya.alerts.unshift({
        id: "alt-" + Date.now(),
        time: new Date().toISOString().substring(11, 19) + " UTC",
        level: "warning",
        message: "SIMULATED: Telemetry ECG detecting frequent premature ventricular contractions (PVCs)."
      });

      state.missionEvents.unshift({
        id: "evt-" + Date.now(),
        timestamp: new Date().toISOString().substring(11, 19) + " UTC",
        category: "CARDIOLOGY",
        severity: "warning",
        source: "Specialist 2 Takuya Sato",
        description: "SIMULATION INJECTED: Ventricular ectopic beats detected during reactor calibration run.",
        acknowledged: false
      });
    }

    playBeep("alert");
    selectAstronaut("crew-4");
    renderSidebarCrewList();
    renderMissionControl();
    closeSimModal();
  });

  // Reset to Nominal
  dom.simOptNominal.addEventListener("click", () => {
    CREW_DATA.forEach(c => {
      c.status = "nominal";
      if (c.id === "crew-1") {
        c.vitals.heartRate = 72;
        c.vitals.oxygenSat = 99.2;
        c.vitals.respirationRate = 14;
        c.vitals.cognitiveLoad = 32;
      } else if (c.id === "crew-2") {
        c.vitals.heartRate = 78;
        c.vitals.bloodPressureSys = 120;
        c.vitals.bloodPressureDia = 80;
        c.vitals.coreTemp = 37.0;
        c.vitals.respirationRate = 16;
        c.vitals.cognitiveLoad = 40;
        c.suitTelemetry.coolantTemp = 18.5;
      } else if (c.id === "crew-3") {
        c.vitals.heartRate = 67;
        c.vitals.oxygenSat = 99.6;
      } else if (c.id === "crew-4") {
        c.vitals.heartRate = 75;
      }
    });

    state.missionEvents.unshift({
      id: "evt-" + Date.now(),
      timestamp: new Date().toISOString().substring(11, 19) + " UTC",
      category: "SYSTEM",
      severity: "nominal",
      source: "Mission Control Bio-Triage",
      description: "All crew telemetry parameters re-stabilized to nominal resting baseline.",
      acknowledged: true
    });

    playBeep("success");
    renderSidebarCrewList();
    renderCrewPillsBar();
    renderCrewOverview();
    renderMissionControl();
    closeSimModal();
  });

  // =========================================================================
  // DIAGNOSTIC SWEEP ANIMATED MODAL
  // =========================================================================
  dom.runDiagnosticBtn.addEventListener("click", () => {
    dom.diagnosticModal.classList.add("open");
    dom.diagProgressFill.style.width = "0%";
    dom.diagDoneBtn.style.display = "none";
    dom.diagStatusText.textContent = "SYNCHRONIZING 12-LEAD TELEMETRY BIO-CHIPS...";
    dom.diagLogText.innerHTML = "> Connecting to subdermal biometric array...<br>> Calibrating impedance spectra...";
    playBeep("click");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      dom.diagProgressFill.style.width = progress + "%";
      if (progress === 25) {
        dom.diagStatusText.textContent = "SCANNING NEURAL EEG ALPHA/BETA RATIOS...";
        dom.diagLogText.innerHTML += "<br>> Frontal lobe cognitive coherence: 98.2% (Nominal)";
        playBeep("click");
      } else if (progress === 50) {
        dom.diagStatusText.textContent = "SPECTRAL ASSAY: ELECTROLYTES & HYDRATION...";
        dom.diagLogText.innerHTML += "<br>> Serum sodium: 140 mEq/L, Potassium: 4.1 mEq/L (Normal)";
        playBeep("click");
      } else if (progress === 75) {
        dom.diagStatusText.textContent = "CARDIAC ELECTRICAL CONDUCTION ANALYSIS...";
        dom.diagLogText.innerHTML += "<br>> QTc Interval: 412 ms, ST-segment isoelectric. Conduction: Normal.";
        playBeep("click");
      } else if (progress >= 100) {
        clearInterval(interval);
        dom.diagStatusText.textContent = "DIAGNOSTIC SWEEP COMPLETE // ALL VITAL SYSTEMS NOMINAL";
        dom.diagLogText.innerHTML += "<br><span style='color: var(--green-nominal); font-weight: 700;'>> DIAGNOSTIC CERTIFICATE RECORDED TO LOCAL LOG</span>";
        dom.diagDoneBtn.style.display = "inline-flex";
        playBeep("success");
      }
    }, 500);
  });

  const closeDiagModal = () => {
    dom.diagnosticModal.classList.remove("open");
    playBeep("click");
  };
  dom.closeDiagModalBtn.addEventListener("click", closeDiagModal);
  dom.diagDoneBtn.addEventListener("click", closeDiagModal);

  // Export Log Button
  dom.exportLogBtn.addEventListener("click", () => {
    const crew = CREW_DATA.find(c => c.id === state.selectedCrewId) || CREW_DATA[0];
    const logData = {
      mission: "AETHON-IV Mars Exploration",
      timestamp: new Date().toISOString(),
      astronaut: crew.name,
      callsign: crew.callsign,
      role: crew.role,
      vitals: crew.vitals,
      suit: crew.suitTelemetry,
      radiation: crew.radiation,
      alerts: crew.alerts
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AETHON4_BIO_${crew.callsign}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playBeep("success");
  });

  // =========================================================================
  // INITIAL RENDER
  // =========================================================================
  renderSidebarCrewList();
  renderCrewPillsBar();
  renderCrewOverview();
  renderMissionControl();
});
