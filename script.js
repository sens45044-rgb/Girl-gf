/* =============================================================
   CONFIG — edit everything about the site's content right here.
   ============================================================= */
const CONFIG = {
  // ---- Names shown in the hero + letter signature ----
  yourName: "Him",
  herName: "Her",

  // ---- Love counter start date (YYYY-MM-DDTHH:MM:SS) ----
  // Can also be changed live from the "Change our start date" control.
  startDate: "2023-01-01T00:00:00",

  // ---- The love letter text. {{name}} is replaced with herName. ----
  letterText:
    "I don't know how to put an entire universe into a few sentences, " +
    "but here it is anyway: you are the best part of my every day. " +
    "Thank you for your laugh, your patience, your ridiculous puns, and " +
    "the quiet, steady way you make everything feel like home. " +
    "This little page is just a small attempt to show you what you mean to me, {{name}}.",

  // ---- Memories gallery. Replace `photo` with a real image path/URL, ----
  // ---- e.g. "photos/trip-to-goa.jpg", to swap in your actual pictures.
  memories: [
    { photo: null, caption: "The day it all started" },
    { photo: null, caption: "That trip we almost cancelled" },
    { photo: null, caption: "Your favorite silly face" },
    { photo: null, caption: "Rainy afternoon, warm coffee" },
    { photo: null, caption: "The night under the stars" },
    { photo: null, caption: "Just another Tuesday, made better by you" },
  ],

  // ---- 20 reasons — edit freely, keep exactly 20 or add/remove as you like ----
  reasons: [
    "The way your eyes smile before your mouth does.",
    "You remember the little things I forget about myself.",
    "Your laugh is my favorite sound in the world.",
    "You make ordinary days feel like an adventure.",
    "You're kind to people who can't do anything for you.",
    "The way you say my name.",
    "You believe in me even when I don't.",
    "Your terrible jokes that somehow always land.",
    "How safe I feel just talking to you.",
    "You never let me stay upset for long.",
    "Your hugs fix almost everything.",
    "You're curious about the world, and it's contagious.",
    "The way you dance when you think no one's watching.",
    "You choose me, again and again.",
    "Your patience with my nonsense.",
    "The way you care for the people you love.",
    "You make the future feel less scary.",
    "Your handwriting on little notes.",
    "How you say exactly what I need to hear.",
    "Simply put — you. All of you.",
  ],
};

/* =============================================================
   UTILITIES
   ============================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;

/* =============================================================
   LOADING SCREEN
   ============================================================= */
window.addEventListener("load", () => {
  const loader = $("#loading-screen");
  setTimeout(() => loader.classList.add("hidden"), 1400);
});

/* =============================================================
   NAMES + LETTER SIGNATURE FROM CONFIG
   ============================================================= */
$("#name-one").textContent = CONFIG.yourName;
$("#name-two").textContent = CONFIG.herName;
$("#letter-signature").textContent = CONFIG.yourName;

/* =============================================================
   BACKGROUND ATMOSPHERE — stars, floating hearts, falling petals
   Generated once on load, sized to the viewport, kept lightweight.
   ============================================================= */
function buildStars(count = 60) {
  const layer = $("#stars-layer");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = rand(0, 100) + "%";
    s.style.top = rand(0, 100) + "%";
    s.style.animationDelay = rand(0, 3) + "s";
    s.style.animationDuration = rand(2, 4.5) + "s";
    frag.appendChild(s);
  }
  layer.appendChild(frag);
}

function buildFloatingHearts(count = 16) {
  const layer = $("#hearts-layer");
  const frag = document.createDocumentFragment();
  const glyphs = ["❤", "💗", "💕"];
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "floating-heart";
    h.textContent = glyphs[Math.floor(rand(0, glyphs.length))];
    h.style.left = rand(0, 100) + "%";
    h.style.fontSize = rand(12, 26) + "px";
    h.style.setProperty("--drift", rand(-80, 80) + "px");
    h.style.animationDuration = rand(10, 22) + "s";
    h.style.animationDelay = rand(0, 18) + "s";
    frag.appendChild(h);
  }
  layer.appendChild(frag);
}

function buildPetals(count = 14) {
  const layer = $("#petals-layer");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    const size = rand(8, 16);
    p.style.width = size + "px";
    p.style.height = size * 0.8 + "px";
    p.style.left = rand(0, 100) + "%";
    p.style.setProperty("--drift", rand(-100, 100) + "px");
    p.style.animationDuration = rand(9, 18) + "s";
    p.style.animationDelay = rand(0, 16) + "s";
    frag.appendChild(p);
  }
  layer.appendChild(frag);
}

buildStars();
buildFloatingHearts();
buildPetals();

/* =============================================================
   CURSOR GLOW + CURSOR TRAIL
   Skipped gracefully on touch devices via CSS (display:none),
   but we still guard the JS for safety/performance.
   ============================================================= */
const isTouch = window.matchMedia("(hover: none)").matches;

if (!isTouch) {
  const glow = $("#cursor-glow");
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  const canvas = $("#cursor-trail-canvas");
  const ctx = canvas.getContext("2d");
  let trail = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("mousemove", (e) => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > 24) trail.shift();
  });

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((pt, i) => {
      pt.life -= 0.035;
      const r = 4 * (i / trail.length);
      if (pt.life > 0) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,165,160,${pt.life * 0.5})`;
        ctx.fill();
      }
    });
    trail = trail.filter((p) => p.life > 0);
    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

/* =============================================================
   DOT NAVIGATION — active state on scroll
   ============================================================= */
const sections = $$("main section[id]");
const dots = $$("#dot-nav .dot");

function updateActiveDot() {
  let current = sections[0]?.id;
  const scrollPos = window.scrollY + window.innerHeight / 2;
  sections.forEach((sec) => {
    if (scrollPos >= sec.offsetTop) current = sec.id;
  });
  dots.forEach((d) => d.classList.toggle("active", d.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", updateActiveDot, { passive: true });
updateActiveDot();

/* =============================================================
   LOVE LETTER — envelope open + typewriter
   ============================================================= */
const envelope = $("#envelope");
const seal = $("#wax-seal");
const typeTarget = $("#letter-typewriter");
const envelopeHint = $("#envelope-hint");
let letterOpened = false;

function typeWriter(text, el, speed = 22) {
  let i = 0;
  el.textContent = "";
  (function tick() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(tick, speed);
    }
  })();
}

function openLetter() {
  if (letterOpened) return;
  letterOpened = true;
  envelope.classList.add("open");
  envelopeHint.textContent = "read slowly, this one's for you";
  const fullText = CONFIG.letterText.replace("{{name}}", CONFIG.herName);
  setTimeout(() => typeWriter(fullText, typeTarget), 700);
}

envelope.addEventListener("click", openLetter);
seal.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openLetter();
});

/* =============================================================
   MEMORIES GALLERY — build cards from CONFIG + lightbox
   ============================================================= */
const memoriesGrid = $("#memories-grid");
const gradients = [
  "linear-gradient(135deg,#ffc9df,#cbb2f0)",
  "linear-gradient(135deg,#d9a5a0,#ffe3ee)",
  "linear-gradient(135deg,#cbb2f0,#e8c27d)",
  "linear-gradient(135deg,#ffe3ee,#d9a5a0)",
];

CONFIG.memories.forEach((mem, i) => {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.tabIndex = 0;

  const photo = document.createElement("div");
  photo.className = "memory-photo";
  photo.style.background = mem.photo ? `url('${mem.photo}') center/cover` : gradients[i % gradients.length];

  const overlay = document.createElement("div");
  overlay.className = "memory-overlay";
  const cap = document.createElement("p");
  cap.textContent = mem.caption || "";
  overlay.appendChild(cap);

  card.appendChild(photo);
  card.appendChild(overlay);
  card.addEventListener("click", () => openLightbox(mem, i));
  memoriesGrid.appendChild(card);
});

const lightbox = $("#lightbox");
const lightboxMedia = $("#lightbox-media");
const lightboxCaption = $("#lightbox-caption");

function openLightbox(mem, i) {
  lightboxMedia.style.background = mem.photo
    ? `url('${mem.photo}') center/cover`
    : gradients[i % gradients.length];
  lightboxCaption.textContent = mem.caption || "";
  lightbox.classList.add("visible");
}
$("#lightbox-close").addEventListener("click", () => lightbox.classList.remove("visible"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("visible"); });

/* =============================================================
   LOVE COUNTER
   ============================================================= */
const STORAGE_KEY = "love-site-start-date";

function getStartDate() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return new Date(saved || CONFIG.startDate);
}

function pad(n) { return String(n).padStart(2, "0"); }

function updateCounter() {
  const start = getStartDate();
  const now = new Date();
  let diff = Math.max(0, now - start);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  $("#count-days").textContent = String(days).padStart(4, "0");
  $("#count-hours").textContent = pad(hours);
  $("#count-minutes").textContent = pad(minutes);
  $("#count-seconds").textContent = pad(seconds);
}
updateCounter();
setInterval(updateCounter, 1000);

// Start-date editor
const dateInput = $("#start-date-input");
dateInput.value = getStartDate().toISOString().slice(0, 10);
$("#save-date-btn").addEventListener("click", () => {
  if (!dateInput.value) return;
  localStorage.setItem(STORAGE_KEY, dateInput.value + "T00:00:00");
  updateCounter();
});

/* =============================================================
   REASONS — build 20 flip cards from CONFIG
   ============================================================= */
const reasonsGrid = $("#reasons-grid");
CONFIG.reasons.forEach((reason, i) => {
  const card = document.createElement("div");
  card.className = "reason-card";
  card.tabIndex = 0;

  card.innerHTML = `
    <div class="reason-card-inner">
      <div class="reason-face reason-front">
        <svg viewBox="0 0 32 29" width="26" height="23"><path d="M16 29 C 6 21, 0 13, 0 7 C 0 2, 5 -1, 9.5 1.8 C 12.5 3.6, 15 6.5, 16 9 C 17 6.5, 19.5 3.6, 22.5 1.8 C 27 -1, 32 2, 32 7 C 32 13, 26 21, 16 29 Z"/></svg>
        <span class="reason-num">Reason ${i + 1}</span>
      </div>
      <div class="reason-face reason-back">${reason}</div>
    </div>
  `;

  // tap-to-flip on touch devices
  card.addEventListener("click", () => {
    if (isTouch) card.classList.toggle("flipped");
  });

  reasonsGrid.appendChild(card);
});

/* =============================================================
   MUSIC PLAYER
   ============================================================= */
const audio = $("#audio-player");
const playPauseBtn = $("#play-pause-btn");
const iconPlay = $("#icon-play");
const iconPause = $("#icon-pause");
const vinyl = $("#vinyl");
const progressBar = $("#progress-bar");
const progressFill = $("#progress-fill");
const progressThumb = $("#progress-thumb");
const timeElapsed = $("#time-elapsed");
const timeTotal = $("#time-total");
const volumeSlider = $("#volume-slider");
const trackTitle = $("#track-title");
const trackSub = $("#track-sub");

audio.volume = parseFloat(volumeSlider.value);

function hasTrack() {
  return !!(audio.currentSrc || audio.querySelector("source[src]"));
}

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${pad(s)}`;
}

playPauseBtn.addEventListener("click", async () => {
  if (!hasTrack()) {
    trackTitle.textContent = "Add an mp3 to hear our song";
    trackSub.textContent = "Uncomment the <source> tag in index.html and link your file";
    return;
  }
  try {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  } catch (err) {
    trackTitle.textContent = "Couldn't play the track";
    trackSub.textContent = "Check the audio file path in index.html";
  }
});

audio.addEventListener("play", () => {
  iconPlay.style.display = "none";
  iconPause.style.display = "inline";
  vinyl.classList.add("playing");
  playPauseBtn.setAttribute("aria-label", "Pause");
});
audio.addEventListener("pause", () => {
  iconPlay.style.display = "inline";
  iconPause.style.display = "none";
  vinyl.classList.remove("playing");
  playPauseBtn.setAttribute("aria-label", "Play");
});
audio.addEventListener("loadedmetadata", () => {
  timeTotal.textContent = formatTime(audio.duration);
  if (hasTrack() && audio.title) trackTitle.textContent = audio.title;
});
audio.addEventListener("timeupdate", () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width = pct + "%";
  progressThumb.style.left = pct + "%";
  timeElapsed.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
});

/* =============================================================
   SURPRISE BUTTON — hearts explode + confetti + fireworks + popup
   ============================================================= */
const fxCanvas = $("#fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
const surpriseBtn = $("#surprise-btn");
const surpriseModal = $("#surprise-modal");
let fxParticles = [];
let fxRunning = false;

function resizeFxCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
resizeFxCanvas();
window.addEventListener("resize", resizeFxCanvas);

const palette = ["#d9a5a0", "#cbb2f0", "#ffc9df", "#e8c27d", "#ffffff"];

function spawnBurst(cx, cy) {
  const count = 36;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + rand(-0.2, 0.2);
    const speed = rand(3, 9);
    fxParticles.push({
      type: Math.random() < 0.4 ? "heart" : "confetti",
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.16,
      life: 1,
      decay: rand(0.008, 0.016),
      size: rand(6, 14),
      color: palette[Math.floor(rand(0, palette.length))],
      rotation: rand(0, Math.PI * 2),
      spin: rand(-0.2, 0.2),
    });
  }
}

function spawnFirework() {
  const cx = rand(fxCanvas.width * 0.2, fxCanvas.width * 0.8);
  const cy = rand(fxCanvas.height * 0.15, fxCanvas.height * 0.55);
  spawnBurst(cx, cy);
}

function drawHeartShape(ctx, size) {
  ctx.beginPath();
  const s = size / 16;
  ctx.moveTo(0, 4 * s);
  ctx.bezierCurveTo(-8 * s, -4 * s, -16 * s, 2 * s, 0, 12 * s);
  ctx.bezierCurveTo(16 * s, 2 * s, 8 * s, -4 * s, 0, 4 * s);
  ctx.closePath();
}

function runFx() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  fxParticles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.life -= p.decay;
    p.rotation += p.spin;

    fxCtx.save();
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rotation);
    fxCtx.globalAlpha = Math.max(p.life, 0);
    fxCtx.fillStyle = p.color;

    if (p.type === "heart") {
      drawHeartShape(fxCtx, p.size);
      fxCtx.fill();
    } else {
      fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
    }
    fxCtx.restore();
  });

  fxParticles = fxParticles.filter((p) => p.life > 0 && p.y < fxCanvas.height + 40);

  if (fxParticles.length > 0) {
    requestAnimationFrame(runFx);
  } else {
    fxRunning = false;
    fxCanvas.style.display = "none";
  }
}

function launchSurprise() {
  fxCanvas.style.display = "block";
  resizeFxCanvas();

  // initial burst from the button
  const rect = surpriseBtn.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top);

  // a few staggered fireworks across the sky
  let fired = 0;
  const fireworksInterval = setInterval(() => {
    spawnFirework();
    fired++;
    if (fired >= 5) clearInterval(fireworksInterval);
  }, 260);

  if (!fxRunning) {
    fxRunning = true;
    runFx();
  }

  setTimeout(() => surpriseModal.classList.add("visible"), 500);
}

surpriseBtn.addEventListener("click", launchSurprise);
$("#modal-close-btn").addEventListener("click", () => surpriseModal.classList.remove("visible"));
surpriseModal.addEventListener("click", (e) => { if (e.target === surpriseModal) surpriseModal.classList.remove("visible"); });

/* =============================================================
   HERO HEART BUTTON — a little extra affection on tap
   ============================================================= */
$("#hero-heart-btn").addEventListener("click", () => {
  const rect = $("#hero-heart-btn").getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  if (!fxRunning) {
    fxCanvas.style.display = "block";
    fxRunning = true;
    runFx();
  }
});
