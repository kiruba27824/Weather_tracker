// ===== WEATHER VIBES DATA =====
const WEATHER_VIBES = {
  Sunny: {
    vibe: "MAX ENERGY",
    emoji: "⚡",
    icon: "☀️",
    gradient: ["#ff00ff", "#ff6600"],
    primaryColor: "#ff00ff",
    secondaryColor: "#00ffff",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(255,0,255,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(255,100,0,0.2) 0%, transparent 60%)",
  },
  Rainy: {
    vibe: "NEON DRIFT",
    emoji: "💧",
    icon: "🌧️",
    gradient: ["#00ffff", "#0033ff"],
    primaryColor: "#00ffff",
    secondaryColor: "#ff00ff",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(0,255,255,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,50,255,0.2) 0%, transparent 60%)",
  },
  Cloudy: {
    vibe: "SYSTEM IDLE",
    emoji: "☁️",
    icon: "☁️",
    gradient: ["#9945ff", "#3a0090"],
    primaryColor: "#9945ff",
    secondaryColor: "#00ffff",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(153,69,255,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(60,0,150,0.2) 0%, transparent 60%)",
  },
  Clear: {
    vibe: "CORE READY",
    emoji: "💎",
    icon: "🌤️",
    gradient: ["#14f195", "#00ccff"],
    primaryColor: "#14f195",
    secondaryColor: "#00ccff",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(20,241,149,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,200,255,0.2) 0%, transparent 60%)",
  },
  Stormy: {
    vibe: "OVERLOAD",
    emoji: "☢️",
    icon: "⛈️",
    gradient: ["#ff0000", "#660000"],
    primaryColor: "#ff2222",
    secondaryColor: "#ff9900",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(255,0,0,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(100,0,0,0.3) 0%, transparent 60%)",
  },
  Windy: {
    vibe: "FAST DATA",
    emoji: "🌪️",
    icon: "💨",
    gradient: ["#00ffaa", "#009966"],
    primaryColor: "#00ffaa",
    secondaryColor: "#00ccff",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(0,255,170,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,150,100,0.2) 0%, transparent 60%)",
  },
};

const WEATHER_TYPES = Object.keys(WEATHER_VIBES);

// ===== STATE =====
let currentType = "Sunny";
let loading = false;

// ===== DOM REFS =====
const cityInput    = document.getElementById("cityInput");
const searchForm   = document.getElementById("searchForm");
const syncBtn      = document.getElementById("syncBtn");
const nodeLabel    = document.getElementById("nodeLabel");
const weatherIcon  = document.getElementById("weatherIcon");
const tempValue    = document.getElementById("tempValue");
const weatherType  = document.getElementById("weatherType");
const vibeValue    = document.getElementById("vibeValue");
const vibeEmoji    = document.getElementById("vibeEmoji");
const pinsEl       = document.getElementById("pins");
const toast        = document.getElementById("toast");
const blobA        = document.querySelector(".blob-a");
const blobB        = document.querySelector(".blob-b");
const cyberBox     = document.querySelector(".cyber-box");
const statusLabel  = document.querySelector(".status-label");
const tempUnit     = document.querySelector(".temp-unit");
const typeLine     = document.querySelector(".type-line");

// ===== MOCK WEATHER LOGIC =====
function getMockWeather(city) {
  const idx = city.trim().length % WEATHER_TYPES.length;
  const type = WEATHER_TYPES[idx];
  const temp = Math.floor(Math.random() * 20) + 15;
  return { city, temp, type };
}

// ===== APPLY THEME =====
function applyTheme(type) {
  const vibe = WEATHER_VIBES[type];
  const primary = vibe.primaryColor;
  const secondary = vibe.secondaryColor;

  // CSS variable overrides
  document.documentElement.style.setProperty("--pink",  primary);
  document.documentElement.style.setProperty("--cyan",  secondary);

  // Background blobs
  blobA.style.background = primary;
  blobB.style.background = secondary;

  // Body background
  document.body.style.background = `#08060f`;
  document.body.style.backgroundImage = vibe.bgGradient;

  // Icon glow
  weatherIcon.style.filter = `drop-shadow(0 0 15px ${primary})`;
}

// ===== UPDATE UI =====
function updateUI(city, temp, type) {
  const vibe = WEATHER_VIBES[type];
  currentType = type;

  // Text content
  nodeLabel.textContent  = `Node: ${city.toUpperCase()}`;
  weatherIcon.textContent = vibe.icon;
  tempValue.textContent  = temp;
  weatherType.textContent = type.toUpperCase();
  vibeValue.textContent  = vibe.vibe;
  vibeEmoji.textContent  = vibe.emoji;

  // Animate icon
  weatherIcon.style.animation = "none";
  requestAnimationFrame(() => {
    weatherIcon.style.animation = "float 3s ease-in-out infinite";
  });

  // Theme colors
  applyTheme(type);

  // Override pins highlight
  document.querySelectorAll(".pin-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });
}

// ===== SEARCH / SYNC =====
function doSync(city) {
  if (!city.trim() || loading) return;
  loading = true;
  syncBtn.disabled = true;
  syncBtn.textContent = "...";

  setTimeout(() => {
    const { temp, type } = getMockWeather(city);
    updateUI(city, temp, type);
    loading = false;
    syncBtn.disabled = false;
    syncBtn.textContent = "SYNC";
    showToast(`DATA SYNC COMPLETE — ${city.toUpperCase()}: ${type.toUpperCase()}`);
  }, 800);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  doSync(cityInput.value);
});

cityInput.addEventListener("input", () => {
  cityInput.value = cityInput.value.toUpperCase();
});

// ===== OVERRIDE PINS =====
WEATHER_TYPES.forEach(type => {
  const btn = document.createElement("button");
  btn.className = "pin-btn";
  btn.dataset.type = type;
  btn.innerHTML = `<div class="pin-dot"></div><span class="pin-label">${type}</span>`;
  btn.addEventListener("click", () => {
    const temp = Math.floor(Math.random() * 20) + 15;
    updateUI(cityInput.value || "NEO-TOKYO", temp, type);
  });
  pinsEl.appendChild(btn);
});

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== INIT =====
updateUI("NEO-TOKYO", 28, "Sunny");
