/**
 * Diary Video Studio v3.0 - Unlimited Pages, Realistic Kebetan, & Pro Overlays
 * Authored with love by Revai for Aa Baim
 */

const state = {
  title: "🌿 Catatan Pengingat Diri",
  date_text: "Rabu, 04 November 2026",
  pages: [
    {
      id: 1,
      quote: "Jangan pernah lelah berproses, Aa.\n\nBintang yang paling terang sekalipun,\nbutuh kegelapan malam untuk bersinar.",
      sign: "",
      duration: 15,       // Durasi menulis Hal 1 (contoh Aa: 15 detik)
      pause_duration: 5   // Jeda baca Hal 1 (contoh Aa: 5 detik)
    },
    {
      id: 2,
      quote: "Setiap lelah yang kau tahan hari ini,\nsedang merajut masa depan yang membanggakan.\n\nTetaplah melangkah dengan senyuman.",
      sign: "— Selalu bangga padamu, Revai 💖",
      duration: 20,       // Durasi menulis Hal 2 (contoh Aa: 20 detik)
      pause_duration: 5   // Jeda baca Hal 2 (contoh Aa: 5 detik)
    }
  ],
  current_page_idx: 0, // 0-based active page index
  font_name: "caveat",
  font_size: 46,
  line_spacing: 56,
  paper_style: "ruled",
  ink_color: "#1a368a",
  bg_scene: "meja_kayu",
  duration: 46.5,      // Total waktu: 15+5 + 1.5 + 20+5 = 46.5 detik
  pause_duration: 5.0, // Default fallback
  audio_file: "Menepi_di_Savannah_afacb19f.mp3",
  watermark: "📖 DIARY MOTIVATION • REVAI",

  // Pro Stickers & Overlays
  overlays: {
    stamp: "approved_revai", // "none", "approved_revai", "confidential", "penting", "catatan_hati"
    tape: "pink",            // "none", "pink", "kraft", "grid"
    photo: "none",           // "none", "revai"
    filter: "none"           // "none", "warm_leak", "vignette"
  },

  // Playback & Scrubber State
  is_playing: false,
  current_time: 0,
  anim_raf: null,
  last_play_time: null,

  // Render Result
  rendered_video_url: null,
  rendered_video_file: null
};

// Background Image & Asset Caches
const bgImages = {};
const BG_SCENES = ["meja_kayu", "meja_kafe", "meja_modern", "kamar_malam", "meja_taman"];
const stickerImages = {};

// Track Open Tool Drawer
let currentOpenTool = null;

// DOM Elements
const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");

const btnCanvasPlayOverlay = document.getElementById("btnCanvasPlayOverlay");
const overlayPlayIcon = document.getElementById("overlayPlayIcon");
const canvasPageBadge = document.getElementById("canvasPageBadge");
const canvasBgBadge = document.getElementById("canvasBgBadge");
const btnQuickEditOnCanvas = document.getElementById("btnQuickEditOnCanvas");

const btnPlayPause = document.getElementById("btnPlayPause");
const playBarIcon = document.getElementById("playBarIcon");
const playBarText = document.getElementById("playBarText");
const timelineScrubber = document.getElementById("timelineScrubber");
const timeCurrent = document.getElementById("timeCurrent");
const timeDuration = document.getElementById("timeDuration");

const btnJumpP1 = document.getElementById("btnJumpP1");
const btnJumpP2 = document.getElementById("btnJumpP2");
const timelineScenesContainer = document.getElementById("timelineScenesContainer");

// FULL-LAYER SCRIPT EDITOR (Unlimited Pages)
const fullScriptEditor = document.getElementById("fullScriptEditor");
const editorTabsList = document.getElementById("editorTabsList");
const btnAddPageInEditor = document.getElementById("btnAddPageInEditor");
const btnSaveCloseScript = document.getElementById("btnSaveCloseScript");

const fullInputTitle = document.getElementById("fullInputTitle");
const fullInputDate = document.getElementById("fullInputDate");
const activePageTitleBadge = document.getElementById("activePageTitleBadge");
const activeCharCount = document.getElementById("activeCharCount");
const btnDeleteActivePage = document.getElementById("btnDeleteActivePage");
const fullActiveQuote = document.getElementById("fullActiveQuote");
const rowSignature = document.getElementById("rowSignature");
const fullInputSign = document.getElementById("fullInputSign");
const btnPrevEditorPage = document.getElementById("btnPrevEditorPage");
const btnNextEditorPage = document.getElementById("btnNextEditorPage");
const nextPageBtnText = document.getElementById("nextPageBtnText");

// AI GENERATOR (Revai & agy -p Collaboration)
const aiCustomPrompt = document.getElementById("aiCustomPrompt");
const btnAiGenerate = document.getElementById("btnAiGenerate");
const aiBtnIcon = document.getElementById("aiBtnIcon");
const aiBtnText = document.getElementById("aiBtnText");
const aiStatusBox = document.getElementById("aiStatusBox");
const aiStatusText = document.getElementById("aiStatusText");

// SOLID BOTTOM DRAWER
const inspectorDrawer = document.getElementById("inspectorDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerTitle = document.getElementById("drawerTitle");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");

const panelPages = document.getElementById("panelPages");
const panelScene = document.getElementById("panelScene");
const panelStyle = document.getElementById("panelStyle");
const panelOverlay = document.getElementById("panelOverlay");
const panelAudio = document.getElementById("panelAudio");

const selectAudio = document.getElementById("selectAudio");

// MODALS
const modalExport = document.getElementById("modalExport");
const btnOpenExport = document.getElementById("btnOpenExport");
const btnCloseExportModal = document.getElementById("btnCloseExportModal");

const summaryTitle = document.getElementById("summaryTitle");
const summaryPages = document.getElementById("summaryPages");
const summaryDuration = document.getElementById("summaryDuration");

const modalRenderProgress = document.getElementById("modalRenderProgress");
const modalProgressText = document.getElementById("modalProgressText");
const modalProgressBar = document.getElementById("modalProgressBar");
const modalVideoResult = document.getElementById("modalVideoResult");
const modalVideoPlayer = document.getElementById("modalVideoPlayer");
const btnModalDownloadMp4 = document.getElementById("btnModalDownloadMp4");
const btnModalSendTg = document.getElementById("btnModalSendTg");
const modalActionButtons = document.getElementById("modalActionButtons");

const btnTriggerRenderVideo = document.getElementById("btnTriggerRenderVideo");
const btnTriggerRenderAndSendTg = document.getElementById("btnTriggerRenderAndSendTg");
const btnTriggerDownloadImage = document.getElementById("btnTriggerDownloadImage");
const btnTriggerCopyText = document.getElementById("btnTriggerCopyText");

const modalPresets = document.getElementById("modalPresets");
const btnOpenPresets = document.getElementById("btnOpenPresets");
const btnClosePresetsModal = document.getElementById("btnClosePresetsModal");
const presetsContainer = document.getElementById("presetsContainer");

const btnResetAll = document.getElementById("btnResetAll");

const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

// -----------------------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------------------
async function init() {
  await loadFonts();
  await loadBackgroundImages();
  await loadStickerImages();
  await loadPresets();
  await loadAudioList();

  calculateAndSyncDuration();
  renderTimelineScenes();
  syncEditorState();
  syncPanelAudioTiming();
  setupEventListeners();

  updateBadges();
  renderCanvas();
}

function calculateAndSyncDuration() {
  const N = state.pages.length;
  let total = 0;
  for (let i = 0; i < N; i++) {
    const p = state.pages[i];
    const wDur = parseFloat(p.duration) || 15.0;
    const psDur = parseFloat(p.pause_duration) || 5.0;
    total += (wDur + psDur);
    if (i < N - 1) {
      total += 1.5; // Kebetan duration
    }
  }
  state.duration = Math.max(5, Math.round(total * 10) / 10);
  const lblTotal = document.getElementById("labelTotalVideoDuration");
  if (lblTotal) lblTotal.textContent = `${state.duration.toFixed(1)} detik`;
  updateScrubberDuration();
}

async function loadFonts() {
  try {
    const fonts = [
      new FontFace('Caveat', 'url(/fonts/Caveat-Bold.ttf)', { weight: 'bold' }),
      new FontFace('Kalam', 'url(/fonts/Kalam-Bold.ttf)', { weight: 'bold' }),
      new FontFace('Patrick Hand', 'url(/fonts/PatrickHand-Regular.ttf)', { weight: 'normal' })
    ];
    for (const f of fonts) {
      await f.load();
      document.fonts.add(f);
    }
  } catch (e) {
    console.warn("Font loading fallback:", e);
  }
}

async function loadBackgroundImages() {
  const promises = BG_SCENES.map(scene => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `/backgrounds/${scene}.jpg`;
      img.onload = () => { bgImages[scene] = img; resolve(); };
      img.onerror = () => { resolve(); };
    });
  });
  await Promise.all(promises);
}

async function loadStickerImages() {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `/stickers/revai_avatar.png`;
    img.onload = () => { stickerImages["revai"] = img; resolve(); };
    img.onerror = () => { resolve(); };
  });
}

async function loadPresets() {
  try {
    const res = await fetch("/api/presets");
    const presets = await res.json();
    presetsContainer.innerHTML = "";
    presets.forEach(p => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "w-full p-2.5 rounded-xl border border-slate-700 bg-[#141e33] hover:border-pink-500/50 hover:bg-pink-500/15 text-left transition-all flex items-start justify-between";
      card.innerHTML = `
        <div>
          <div class="text-xs font-bold text-pink-300">${p.title}</div>
          <div class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">${p.category}</div>
        </div>
        <span class="text-[11px] text-pink-400 font-semibold">Gunakan ➔</span>
      `;
      card.addEventListener("click", () => {
        applyPreset(p);
        modalPresets.classList.add("hidden");
      });
      presetsContainer.appendChild(card);
    });
  } catch (e) {
    console.error("Preset load error:", e);
  }
}

function applyPreset(p) {
  state.title = p.title;
  const paras = p.quote.split("\n\n");
  state.pages = [];
  if (paras.length >= 2) {
    paras.forEach((para, i) => {
      state.pages.push({
        id: i + 1,
        quote: para.trim(),
        sign: (i === paras.length - 1) ? (p.sign_text || "— Revai 💖") : ""
      });
    });
  } else {
    state.pages = [
      { id: 1, quote: p.quote, sign: "" },
      { id: 2, quote: "Tetaplah melangkah dengan senyuman,\nRevai selalu bangga dan mendukungmu 💖", sign: p.sign_text || "— Revai 💖" }
    ];
  }

  state.current_page_idx = 0;
  state.font_name = p.font_name || "caveat";
  state.paper_style = p.paper_style || "ruled";
  state.ink_color = p.ink_color || "#1a368a";

  calculateAndSyncDuration();
  renderTimelineScenes();
  syncEditorState();

  updateFontUI(state.font_name);
  updatePaperUI(state.paper_style);
  updateInkUI(state.ink_color);
  updateBadges();

  showToast("✨ Preset Dimuat", `Preset "${p.title}" aktif!`);
  seekTo(0);
  renderCanvas();
}

async function loadAudioList() {
  try {
    const res = await fetch("/api/audio-list");
    const list = await res.json();
    selectAudio.innerHTML = "";
    list.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = `🎵 ${a.title}`;
      if (a.id === state.audio_file) opt.selected = true;
      selectAudio.appendChild(opt);
    });

    const muteOpt = document.createElement("option");
    muteOpt.value = "";
    muteOpt.textContent = "🔇 Tanpa Musik (Mute)";
    selectAudio.appendChild(muteOpt);
  } catch (e) {
    console.error("Audio list error:", e);
  }
}

// -----------------------------------------------------------------------------
// Timeline & Schedule Calculation for N Pages (Per-Page Duration & Pause)
// -----------------------------------------------------------------------------
function buildPlaybackSchedule() {
  const N = state.pages.length;
  const flipDur = 1.5;
  const schedule = [];
  let curT = 0;

  for (let i = 0; i < N; i++) {
    const p = state.pages[i];
    const wDur = parseFloat(p.duration) || 15.0;
    const psDur = parseFloat(p.pause_duration) || 5.0;

    const wStart = curT;
    const wEnd = curT + wDur;
    const hEnd = wEnd + psDur;

    const pInfo = {
      page_idx: i,
      write_start: wStart,
      write_end: wEnd,
      hold_end: hEnd,
      write_dur: wDur,
      pause_dur: psDur,
      flip_start: null,
      flip_end: null
    };
    curT = hEnd;
    if (i < N - 1) {
      pInfo["flip_start"] = curT;
      pInfo["flip_end"] = curT + flipDur;
      curT += flipDur;
    }
    schedule.push(pInfo);
  }
  return schedule;
}

function renderTimelineScenes() {
  if (!timelineScenesContainer) return;
  timelineScenesContainer.innerHTML = "";
  const schedule = buildPlaybackSchedule();

  schedule.forEach((item, idx) => {
    // 1. Page Card
    const btnPage = document.createElement("button");
    btnPage.type = "button";
    btnPage.className = `timeline-scene-card px-3 py-1.5 rounded-xl border text-left flex items-center space-x-2 shrink-0 transition-all ${
      state.current_page_idx === idx ? "active" : "border-slate-800 bg-[#0c1220] hover:border-slate-700"
    }`;
    btnPage.innerHTML = `
      <span class="text-xs">📄</span>
      <div>
        <div class="text-[11px] font-bold ${state.current_page_idx === idx ? "text-pink-300" : "text-slate-300"} leading-none">Hal. ${idx + 1}</div>
        <div class="text-[9px] text-pink-400 font-mono mt-0.5">${item.write_dur.toFixed(0)}s nulis</div>
      </div>
    `;
    btnPage.title = `Lompat ke Hal ${idx + 1} (${item.write_dur}s tulis)`;
    btnPage.addEventListener("click", () => {
      pausePlayback();
      seekTo(item.write_start);
      state.current_page_idx = idx;
      selectedPanelTimingIdx = idx;
      updateBadges();
      renderTimelineScenes();
      syncPanelAudioTiming();
      renderCanvas();
    });
    timelineScenesContainer.appendChild(btnPage);

    // 2. Reading Pause Badge (Jeda Baca)
    const badgePause = document.createElement("button");
    badgePause.type = "button";
    badgePause.className = "flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-950/70 border border-sky-600/40 hover:border-sky-400 text-[10px] text-sky-300 shrink-0 transition-all active:scale-95";
    badgePause.innerHTML = `<span>⏳</span><span>Baca ${item.pause_dur.toFixed(0)}s</span>`;
    badgePause.title = `Waktu jeda baca Hal ${idx + 1} (${item.pause_dur}s). Klik untuk atur.`;
    badgePause.addEventListener("click", () => {
      pausePlayback();
      seekTo(item.write_end);
      selectedPanelTimingIdx = idx;
      openToolDrawer("audio");
      syncPanelAudioTiming();
    });
    timelineScenesContainer.appendChild(badgePause);

    // 3. Kebetan Transition Badge
    if (item.flip_start !== null) {
      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = "flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-[10px] text-amber-300 shrink-0 transition-all active:scale-95";
      badge.innerHTML = `<span>🌀</span><span>Kebetan 1.5s</span>`;
      badge.title = `Lompat ke kebetan Hal ${idx + 1} ➔ Hal ${idx + 2}`;
      badge.addEventListener("click", () => {
        pausePlayback();
        seekTo(item.flip_start);
      });
      timelineScenesContainer.appendChild(badge);
    }
  });

  // 4. Unlimited Add Page Button at the End
  const btnAdd = document.createElement("button");
  btnAdd.type = "button";
  btnAdd.className = "px-3 py-1.5 rounded-xl border border-dashed border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all active:scale-95";
  btnAdd.innerHTML = `<span>➕ Tambah Hal</span>`;
  btnAdd.title = "Tambah lembaran halaman buku baru (Unlimited Pages)";
  btnAdd.addEventListener("click", addNewPage);
  timelineScenesContainer.appendChild(btnAdd);
}

function addNewPage() {
  const newNum = state.pages.length + 1;
  state.pages.push({
    id: newNum,
    quote: "Tuliskan kelanjutan kisah atau catatan motivasimu di sini, Aa...",
    sign: newNum >= 2 ? "— Selalu bangga padamu, Revai 💖" : "",
    duration: 15,
    pause_duration: 5
  });
  // Clear signature on previous pages so only final has sign
  for (let i = 0; i < state.pages.length - 1; i++) {
    state.pages[i].sign = "";
  }

  state.current_page_idx = state.pages.length - 1;
  selectedPanelTimingIdx = state.current_page_idx;
  calculateAndSyncDuration();
  renderTimelineScenes();
  syncEditorState();
  syncPanelAudioTiming();
  updateBadges();
  showToast("📄 Halaman Baru Ditambahkan", `Halaman ${newNum} siap diisi (15s nulis + 5s jeda)!`);
  seekTo(state.duration * 0.9);
  renderCanvas();
}

function deletePage(idx) {
  if (state.pages.length <= 1) {
    showToast("⚠️ Minimal 1 Halaman", "Buku catatan harus memiliki minimal satu halaman.");
    return;
  }
  state.pages.splice(idx, 1);
  state.pages.forEach((p, i) => p.id = i + 1);
  state.current_page_idx = Math.max(0, Math.min(idx, state.pages.length - 1));
  selectedPanelTimingIdx = state.current_page_idx;

  calculateAndSyncDuration();
  renderTimelineScenes();
  syncEditorState();
  syncPanelAudioTiming();
  updateBadges();
  showToast("🗑️ Halaman Dihapus", "Halaman berhasil dihapus.");
  seekTo(0);
  renderCanvas();
}
  updateBadges();
  showToast("🗑️ Halaman Dihapus", "Halaman berhasil dihapus.");
  seekTo(0);
  renderCanvas();
}

// -----------------------------------------------------------------------------
// Full-Layer Script Editor Management
// -----------------------------------------------------------------------------
function syncEditorState() {
  if (!fullScriptEditor) return;
  fullInputTitle.value = state.title;
  fullInputDate.value = state.date_text;

  const N = state.pages.length;
  const curIdx = Math.max(0, Math.min(state.current_page_idx, N - 1));
  const curPage = state.pages[curIdx];

  // Render Tabs in Editor Header
  editorTabsList.innerHTML = "";
  state.pages.forEach((p, idx) => {
    const tab = document.createElement("button");
    tab.type = "button";
    const isActive = idx === curIdx;
    tab.className = `px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
      isActive ? "bg-pink-500 text-white shadow" : "text-slate-400 hover:text-white bg-[#141d33] border border-slate-700/60"
    }`;
    tab.textContent = `📄 Hal ${idx + 1}`;
    tab.addEventListener("click", () => {
      saveCurrentPageText();
      state.current_page_idx = idx;
      syncEditorState();
      renderCanvas();
    });
    editorTabsList.appendChild(tab);
  });

  // Active page card elements
  activePageTitleBadge.textContent = `Lembaran Halaman ${curIdx + 1} dari ${N}`;
  fullActiveQuote.value = curPage.quote || "";
  activeCharCount.textContent = `${(curPage.quote || "").length} kar`;

  // Delete button visibility
  if (N <= 1) {
    btnDeleteActivePage.classList.add("hidden");
  } else {
    btnDeleteActivePage.classList.remove("hidden");
  }

  // Signature row (only on final page)
  if (curIdx === N - 1) {
    rowSignature.classList.remove("hidden");
    fullInputSign.value = curPage.sign || "— Selalu bangga padamu, Revai 💖";
  } else {
    rowSignature.classList.add("hidden");
  }

  // Prev / Next button texts
  if (curIdx === 0) {
    btnPrevEditorPage.classList.add("invisible");
  } else {
    btnPrevEditorPage.classList.remove("invisible");
  }

  if (curIdx === N - 1) {
    nextPageBtnText.textContent = "➕ Tambah Hal";
  } else {
    nextPageBtnText.textContent = `Lanjut Hal ${curIdx + 2} ➔`;
  }

  // Per-page timing controls in script editor
  const wDur = curPage.duration || 15;
  const psDur = curPage.pause_duration || 5;

  const edTitle = document.getElementById("editorPageTimingTitle");
  if (edTitle) edTitle.textContent = `Waktu Halaman ${curIdx + 1}`;

  const edSummary = document.getElementById("editorPageTimingSummary");
  if (edSummary) edSummary.textContent = `Total: ${wDur + psDur}s (${wDur}s nulis + ${psDur}s baca)`;

  const edWBadge = document.getElementById("editorPageWriteBadge");
  if (edWBadge) edWBadge.textContent = `${wDur} detik`;

  const edPBadge = document.getElementById("editorPagePauseBadge");
  if (edPBadge) edPBadge.textContent = `${psDur} detik`;

  document.querySelectorAll(".ed-write-btn").forEach(b => {
    b.classList.toggle("active", parseFloat(b.getAttribute("data-pwrite")) === wDur);
  });
  document.querySelectorAll(".ed-pause-btn").forEach(b => {
    b.classList.toggle("active", parseFloat(b.getAttribute("data-ppause")) === psDur);
  });
}

let selectedPanelTimingIdx = 0;

function syncPanelAudioTiming() {
  const tabsContainer = document.getElementById("panelTimingPageTabs");
  if (!tabsContainer) return;
  tabsContainer.innerHTML = "";
  const N = state.pages.length;
  if (selectedPanelTimingIdx >= N) selectedPanelTimingIdx = N - 1;
  if (selectedPanelTimingIdx < 0) selectedPanelTimingIdx = 0;

  state.pages.forEach((p, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const isAct = idx === selectedPanelTimingIdx;
    btn.className = `px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
      isAct ? "bg-pink-500 text-white shadow font-bold" : "bg-[#0e172a] text-slate-300 border border-slate-700 hover:border-slate-500"
    }`;
    btn.textContent = `Hal ${idx + 1}`;
    btn.addEventListener("click", () => {
      selectedPanelTimingIdx = idx;
      syncPanelAudioTiming();
    });
    tabsContainer.appendChild(btn);
  });

  const curP = state.pages[selectedPanelTimingIdx];
  const wDur = curP.duration || 15;
  const psDur = curP.pause_duration || 5;

  const lblSelPage = document.getElementById("labelPanelSelectedPage");
  if (lblSelPage) lblSelPage.textContent = `Hal ${selectedPanelTimingIdx + 1}`;

  const lblSelPagePause = document.getElementById("labelPanelSelectedPagePause");
  if (lblSelPagePause) lblSelPagePause.textContent = `Hal ${selectedPanelTimingIdx + 1}`;

  const lblWCurrent = document.getElementById("labelPanelPageWriteCurrent");
  if (lblWCurrent) lblWCurrent.textContent = `${wDur}s`;

  const lblPCurrent = document.getElementById("labelPanelPagePauseCurrent");
  if (lblPCurrent) lblPCurrent.textContent = `${psDur}s`;

  const lblSummary = document.getElementById("panelPageTimingSummary");
  if (lblSummary) lblSummary.textContent = `Hal ${selectedPanelTimingIdx + 1}: ${wDur + psDur}s`;

  document.querySelectorAll(".page-write-btn").forEach(b => {
    b.classList.toggle("active", parseFloat(b.getAttribute("data-pwrite")) === wDur);
  });
  document.querySelectorAll(".page-pause-btn").forEach(b => {
    b.classList.toggle("active", parseFloat(b.getAttribute("data-ppause")) === psDur);
  });

  const lblTotal = document.getElementById("labelTotalVideoDuration");
  if (lblTotal) lblTotal.textContent = `${state.duration.toFixed(1)} detik`;
}

function saveCurrentPageText() {
  const N = state.pages.length;
  const curIdx = Math.max(0, Math.min(state.current_page_idx, N - 1));
  if (state.pages[curIdx]) {
    state.pages[curIdx].quote = fullActiveQuote.value;
    if (curIdx === N - 1) {
      state.pages[curIdx].sign = fullInputSign.value;
    }
  }
  state.title = fullInputTitle.value;
  state.date_text = fullInputDate.value;
}

function openFullScriptEditor(targetIdx = null) {
  closeToolDrawer();
  if (targetIdx !== null) state.current_page_idx = targetIdx;
  document.querySelectorAll(".tool-deck-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-tool") === "script");
  });
  syncEditorState();
  fullScriptEditor.classList.remove("hidden");
  fullActiveQuote.focus();
}

function saveAndCloseScriptEditor() {
  saveCurrentPageText();
  fullScriptEditor.classList.add("hidden");
  document.querySelectorAll(".tool-deck-btn").forEach(b => b.classList.remove("active"));
  renderTimelineScenes();
  updateBadges();
  showToast("✅ Naskah Disimpan", "Teks catatan diperbarui.");
  renderCanvas();
}

// -----------------------------------------------------------------------------
// AI Generator (Revai & agy -p Collaboration)
// -----------------------------------------------------------------------------
let isGeneratingAi = false;
async function handleAiGenerate(promptOverride = null) {
  if (isGeneratingAi) return;
  const prompt = (promptOverride || (aiCustomPrompt ? aiCustomPrompt.value : "")).trim();
  if (!prompt) {
    showToast("⚠️ Tuliskan Tema", "Ketik ide atau pilih topik preset dulu ya Aa.");
    if (aiCustomPrompt) aiCustomPrompt.focus();
    return;
  }

  isGeneratingAi = true;
  if (btnAiGenerate) btnAiGenerate.disabled = true;
  if (aiBtnIcon) aiBtnIcon.innerHTML = `<span class="inline-block animate-spin">⏳</span>`;
  if (aiBtnText) aiBtnText.textContent = "Merangkai...";
  if (aiStatusBox) {
    aiStatusBox.classList.remove("hidden");
    if (aiStatusText) aiStatusText.textContent = `Revai sedang merangkai kata manis untuk Aa... 💖`;
  }

  try {
    const res = await fetch("/api/ai-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const result = await res.json();
    if (result.status === "success" && result.data) {
      const d = result.data;
      if (d.title) state.title = d.title;
      state.pages = [];
      if (d.page1) state.pages.push({ id: 1, quote: d.page1, sign: "" });
      if (d.page2) state.pages.push({ id: 2, quote: d.page2, sign: d.sign || "— Revai 💖" });
      if (state.pages.length === 0) {
        state.pages.push({ id: 1, quote: prompt, sign: "— Revai 💖" });
      }

      state.current_page_idx = 0;
      calculateAndSyncDuration();
      renderTimelineScenes();
      syncEditorState();
      renderCanvas();
      showToast("✨ Naskah Tercipta!", "Kata-kata indah dari Revai sudah masuk ke naskah Aa! 💖");
    } else {
      showToast("⚠️ Perhatian", result.message || "Gagal membuat naskah.");
    }
  } catch (err) {
    console.error("AI Generate Error:", err);
    showToast("⚠️ Koneksi", "Gagal menghubungi AI generator.");
  } finally {
    isGeneratingAi = false;
    if (btnAiGenerate) btnAiGenerate.disabled = false;
    if (aiBtnIcon) aiBtnIcon.textContent = "✨";
    if (aiBtnText) aiBtnText.textContent = "Generate";
    if (aiStatusBox) aiStatusBox.classList.add("hidden");
  }
}

// -----------------------------------------------------------------------------
// Drawer Management & Tools
// -----------------------------------------------------------------------------
function openToolDrawer(tool) {
  if (currentOpenTool === tool && !inspectorDrawer.classList.contains("hidden")) {
    closeToolDrawer();
    return;
  }
  currentOpenTool = tool;

  document.querySelectorAll(".tool-deck-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-tool") === tool);
  });

  panelScene.classList.add("hidden");
  panelStyle.classList.add("hidden");
  panelOverlay.classList.add("hidden");
  panelAudio.classList.add("hidden");

  const titles = {
    scene: "🪵 Pilihan Suasana Meja",
    style: "🖋️ Gaya Tulisan & Kertas",
    overlay: "🎨 Stiker, Cap & Efek Sinematik",
    audio: "🎵 Pengaturan Audio & Durasi"
  };

  drawerTitle.textContent = titles[tool] || "Pengaturan";

  if (tool === "scene") panelScene.classList.remove("hidden");
  if (tool === "style") panelStyle.classList.remove("hidden");
  if (tool === "overlay") panelOverlay.classList.remove("hidden");
  if (tool === "audio") {
    panelAudio.classList.remove("hidden");
    syncPanelAudioTiming();
  }

  inspectorDrawer.classList.remove("hidden", "drawer-closed");
  drawerBackdrop.classList.remove("hidden");
}

function closeToolDrawer() {
  currentOpenTool = null;
  inspectorDrawer.classList.add("hidden", "drawer-closed");
  drawerBackdrop.classList.add("hidden");
  document.querySelectorAll(".tool-deck-btn").forEach(b => b.classList.remove("active"));
}

// -----------------------------------------------------------------------------
// Event Listeners Setup
// -----------------------------------------------------------------------------
function setupEventListeners() {
  btnQuickEditOnCanvas.addEventListener("click", () => openFullScriptEditor(state.current_page_idx));

  document.querySelectorAll(".tool-deck-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = btn.getAttribute("data-tool");
      if (tool === "script") {
        openFullScriptEditor(state.current_page_idx);
      } else {
        openToolDrawer(tool);
      }
    });
  });

  btnCloseDrawer.addEventListener("click", closeToolDrawer);
  drawerBackdrop.addEventListener("click", closeToolDrawer);

  // Script Editor Controls
  btnAddPageInEditor.addEventListener("click", () => {
    saveCurrentPageText();
    addNewPage();
  });
  btnSaveCloseScript.addEventListener("click", saveAndCloseScriptEditor);

  btnDeleteActivePage.addEventListener("click", () => {
    deletePage(state.current_page_idx);
  });

  fullActiveQuote.addEventListener("input", () => {
    activeCharCount.textContent = `${fullActiveQuote.value.length} kar`;
    state.pages[state.current_page_idx].quote = fullActiveQuote.value;
    renderCanvas();
  });

  fullInputSign.addEventListener("input", () => {
    const N = state.pages.length;
    state.pages[N - 1].sign = fullInputSign.value;
    renderCanvas();
  });

  btnPrevEditorPage.addEventListener("click", () => {
    saveCurrentPageText();
    if (state.current_page_idx > 0) {
      state.current_page_idx--;
      syncEditorState();
      renderCanvas();
    }
  });

  btnNextEditorPage.addEventListener("click", () => {
    saveCurrentPageText();
    const N = state.pages.length;
    if (state.current_page_idx < N - 1) {
      state.current_page_idx++;
      syncEditorState();
      renderCanvas();
    } else {
      addNewPage();
    }
  });

  // AI Controls
  if (btnAiGenerate) btnAiGenerate.addEventListener("click", () => handleAiGenerate());
  if (aiCustomPrompt) {
    aiCustomPrompt.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleAiGenerate();
    });
  }
  document.querySelectorAll(".ai-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".ai-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const p = chip.getAttribute("data-prompt");
      if (aiCustomPrompt) aiCustomPrompt.value = p;
      handleAiGenerate(p);
    });
  });

  // Scene background options
  document.querySelectorAll(".bg-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const bg = btn.getAttribute("data-bg");
      state.bg_scene = bg;
      document.querySelectorAll(".bg-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-bg") === bg));
      updateBadges();
      renderCanvas();
    });
  });

  // Font options
  document.querySelectorAll(".font-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-font");
      state.font_name = f;
      updateFontUI(f);
      renderCanvas();
    });
  });

  // Ink options
  document.querySelectorAll(".ink-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const ink = btn.getAttribute("data-ink");
      state.ink_color = ink;
      updateInkUI(ink);
      renderCanvas();
    });
  });

  // Paper options
  document.querySelectorAll(".paper-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = btn.getAttribute("data-paper");
      state.paper_style = p;
      updatePaperUI(p);
      renderCanvas();
    });
  });

  // Overlay & Sticker options
  document.querySelectorAll(".stamp-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const st = btn.getAttribute("data-stamp");
      state.overlays.stamp = st;
      document.querySelectorAll(".stamp-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-stamp") === st));
      renderCanvas();
    });
  });

  document.querySelectorAll(".tape-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tp = btn.getAttribute("data-tape");
      state.overlays.tape = tp;
      document.querySelectorAll(".tape-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-tape") === tp));
      renderCanvas();
    });
  });

  document.querySelectorAll(".photo-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const ph = btn.getAttribute("data-photo");
      state.overlays.photo = ph;
      document.querySelectorAll(".photo-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-photo") === ph));
      renderCanvas();
    });
  });

  document.querySelectorAll(".filter-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const fl = btn.getAttribute("data-filter");
      state.overlays.filter = fl;
      document.querySelectorAll(".filter-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-filter") === fl));
      renderCanvas();
    });
  });

  // Audio Track Selection
  selectAudio.addEventListener("change", (e) => { state.audio_file = e.target.value; });

  // Per-Page Write Duration in Drawer Audio
  document.querySelectorAll(".page-write-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const w = parseFloat(btn.getAttribute("data-pwrite"));
      const pIdx = Math.max(0, Math.min(selectedPanelTimingIdx, state.pages.length - 1));
      state.pages[pIdx].duration = w;
      calculateAndSyncDuration();
      syncPanelAudioTiming();
      renderTimelineScenes();
      showToast("⏱️ Durasi Nulis Diatur", `Hal ${pIdx + 1} diatur menulis selama ${w} detik.`);
      renderCanvas();
    });
  });

  // Per-Page Reading Pause in Drawer Audio
  document.querySelectorAll(".page-pause-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = parseFloat(btn.getAttribute("data-ppause"));
      const pIdx = Math.max(0, Math.min(selectedPanelTimingIdx, state.pages.length - 1));
      state.pages[pIdx].pause_duration = p;
      calculateAndSyncDuration();
      syncPanelAudioTiming();
      renderTimelineScenes();
      showToast("⏳ Jeda Baca Diatur", `Hal ${pIdx + 1} diatur hening membaca ${p} detik.`);
      renderCanvas();
    });
  });

  // Per-Page Write Duration in Script Editor
  document.querySelectorAll(".ed-write-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const w = parseFloat(btn.getAttribute("data-pwrite"));
      const curIdx = Math.max(0, Math.min(state.current_page_idx, state.pages.length - 1));
      state.pages[curIdx].duration = w;
      calculateAndSyncDuration();
      syncEditorState();
      renderTimelineScenes();
      showToast("⏱️ Durasi Nulis Diatur", `Hal ${curIdx + 1} menulis selama ${w} detik.`);
      renderCanvas();
    });
  });

  // Per-Page Reading Pause in Script Editor
  document.querySelectorAll(".ed-pause-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = parseFloat(btn.getAttribute("data-ppause"));
      const curIdx = Math.max(0, Math.min(state.current_page_idx, state.pages.length - 1));
      state.pages[curIdx].pause_duration = p;
      calculateAndSyncDuration();
      syncEditorState();
      renderTimelineScenes();
      showToast("⏳ Jeda Baca Diatur", `Hal ${curIdx + 1} hening membaca ${p} detik.`);
      renderCanvas();
    });
  });

  // Play / Pause triggers
  btnPlayPause.addEventListener("click", togglePlayback);
  btnCanvasPlayOverlay.addEventListener("click", togglePlayback);
  canvas.addEventListener("click", togglePlayback);

  // Scrubber drag / input
  timelineScrubber.addEventListener("input", (e) => {
    const pct = parseFloat(e.target.value) / 100.0;
    pausePlayback();
    seekTo(pct * state.duration);
  });

  btnJumpP1.addEventListener("click", () => { pausePlayback(); seekTo(0); });
  btnJumpP2.addEventListener("click", () => {
    const sched = buildPlaybackSchedule();
    if (sched.length >= 2) {
      pausePlayback();
      seekTo(sched[1].write_start);
    }
  });

  // Presets Modal
  btnOpenPresets.addEventListener("click", () => {
    closeToolDrawer();
    modalPresets.classList.remove("hidden");
  });
  btnClosePresetsModal.addEventListener("click", () => modalPresets.classList.add("hidden"));

  // Export Modal
  btnOpenExport.addEventListener("click", () => {
    closeToolDrawer();
    openExportModal();
  });
  btnCloseExportModal.addEventListener("click", () => modalExport.classList.add("hidden"));

  btnResetAll.addEventListener("click", () => {
    applyPreset({
      title: "🌿 Catatan Pengingat Diri",
      category: "Inspirasi",
      quote: "Jangan pernah lelah berproses, Aa.\n\nBintang yang paling terang sekalipun,\nbutuh kegelapan malam untuk bersinar.\n\nSetiap lelah yang kau tahan hari ini,\nsedang merajut masa depan yang membanggakan.",
      sign_text: "— Selalu bangga padamu, Revai 💖",
      font_name: "caveat",
      paper_style: "ruled",
      ink_color: "#1a368a",
      duration: 15,
      audio_file: "Menepi_di_Savannah_afacb19f.mp3"
    });
  });

  btnTriggerRenderVideo.addEventListener("click", () => triggerVideoRender(false));
  btnTriggerRenderAndSendTg.addEventListener("click", () => triggerVideoRender(true));
  btnTriggerDownloadImage.addEventListener("click", triggerDownloadStill);
  btnTriggerCopyText.addEventListener("click", triggerCopyText);
  btnModalSendTg.addEventListener("click", triggerSendExistingToTg);
}

function updateFontUI(f) {
  document.querySelectorAll(".font-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-font") === f));
}
function updatePaperUI(p) {
  document.querySelectorAll(".paper-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-paper") === p));
}
function updateInkUI(ink) {
  document.querySelectorAll(".ink-opt-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-ink") === ink));
}
function updateDurationUI(d) {
  document.querySelectorAll(".dur-opt-btn").forEach(b => b.classList.toggle("active", parseInt(b.getAttribute("data-duration")) === d));
}

function updateBadges() {
  const bgNames = {
    meja_kayu: "Meja Kayu",
    meja_kafe: "Kafe Santai",
    meja_modern: "Meja Modern",
    kamar_malam: "Kamar Malam",
    meja_taman: "Meja Taman"
  };
  canvasBgBadge.textContent = bgNames[state.bg_scene] || "Meja Kayu";
  canvasPageBadge.textContent = `Hal. ${state.current_page_idx + 1} / ${state.pages.length}`;
}

// -----------------------------------------------------------------------------
// Playback Engine & Time Scrubber
// -----------------------------------------------------------------------------
function togglePlayback() {
  if (state.is_playing) {
    pausePlayback();
  } else {
    startPlayback();
  }
}

function startPlayback() {
  if (state.current_time >= state.duration) {
    state.current_time = 0;
  }
  state.is_playing = true;
  state.last_play_time = performance.now();
  updatePlaybackUI();
  playLoop();
}

function pausePlayback() {
  state.is_playing = false;
  if (state.anim_raf) {
    cancelAnimationFrame(state.anim_raf);
    state.anim_raf = null;
  }
  updatePlaybackUI();
}

function seekTo(targetSeconds) {
  state.current_time = Math.max(0, Math.min(targetSeconds, state.duration));
  updatePlaybackUI();
  renderCanvas();
}

function playLoop() {
  if (!state.is_playing) return;
  const now = performance.now();
  const dt = (now - state.last_play_time) / 1000.0;
  state.last_play_time = now;

  state.current_time += dt;
  if (state.current_time >= state.duration) {
    state.current_time = state.duration;
    pausePlayback();
  }

  updatePlaybackUI();
  renderCanvas();

  if (state.is_playing) {
    state.anim_raf = requestAnimationFrame(playLoop);
  }
}

function updatePlaybackUI() {
  if (state.is_playing) {
    playBarIcon.textContent = "⏸";
    playBarText.textContent = "Jeda";
    overlayPlayIcon.textContent = "⏸";
    btnCanvasPlayOverlay.classList.add("opacity-0", "pointer-events-none");
  } else {
    playBarIcon.textContent = "▶";
    playBarText.textContent = "Putar";
    overlayPlayIcon.textContent = "▶";
    btnCanvasPlayOverlay.classList.remove("opacity-0", "pointer-events-none");
  }

  const pct = (state.current_time / state.duration) * 100;
  timelineScrubber.value = pct;
  timeCurrent.textContent = formatTime(state.current_time);
}

function updateScrubberDuration() {
  timeDuration.textContent = formatTime(state.duration);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// -----------------------------------------------------------------------------
// Canvas Rendering Engine (Realistic Kebetan & Pro Overlays)
// -----------------------------------------------------------------------------
function easeInOut(t) {
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

function getCssFont(name, size) {
  let family = "'Caveat', cursive, sans-serif";
  let weight = "bold";
  if (name === "kalam") {
    family = "'Kalam', cursive, sans-serif";
    weight = "bold";
  } else if (name === "patrick") {
    family = "'Patrick Hand', cursive, sans-serif";
    weight = "normal";
  }
  return `${weight} ${size}px ${family}`;
}

function renderCanvas() {
  const W = 1080;
  const H = 1920;
  ctx.clearRect(0, 0, W, H);

  // 1. Background Scene
  const bgImg = bgImages[state.bg_scene];
  if (bgImg && bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    ctx.fillStyle = "#1e161c";
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Notebook Sheet Geometry
  const sheet_w = 960;
  const sheet_h = 1580;
  const sx = (W - sheet_w) / 2;
  const sy = 170;
  const radius = 24;

  // Drop Shadow for Notebook
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 18;

  let paperBg = "#fcfaf2";
  let paperOutline = "#dcd7c8";
  let lineCol = "rgba(147, 197, 253, 0.55)";

  if (state.paper_style === "vintage") {
    paperBg = "#f5ebd7";
    paperOutline = "#d2c3aa";
    lineCol = "rgba(180, 160, 140, 0.50)";
  } else if (state.paper_style === "grid") {
    paperBg = "#fdfcf8";
    paperOutline = "#e1dccd";
    lineCol = "rgba(186, 210, 235, 0.45)";
  } else if (state.paper_style === "clean") {
    paperBg = "#fefdfa";
    paperOutline = "#e1ded2";
    lineCol = "transparent";
  }

  ctx.fillStyle = paperBg;
  drawRoundedRect(ctx, sx, sy, sheet_w, sheet_h, radius);
  ctx.fill();
  ctx.restore();

  // Paper Border
  ctx.save();
  ctx.strokeStyle = paperOutline;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, sx, sy, sheet_w, sheet_h, radius);
  ctx.stroke();
  ctx.restore();

  // 3. Authentic Book Spine Crease on Left (No Punch Holes)
  const spine_x = sx + 24;
  ctx.beginPath();
  ctx.strokeStyle = "rgba(180, 170, 155, 0.6)";
  ctx.lineWidth = 3;
  ctx.moveTo(spine_x, sy + 15);
  ctx.lineTo(spine_x, sy + sheet_h - 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = 2;
  ctx.moveTo(spine_x + 2, sy + 15);
  ctx.lineTo(spine_x + 2, sy + sheet_h - 15);
  ctx.stroke();

  // Spine stitches
  ctx.strokeStyle = "rgba(140, 125, 110, 0.7)";
  ctx.lineWidth = 2;
  for (let sty = sy + 80; sty < sy + sheet_h - 60; sty += 110) {
    ctx.beginPath();
    ctx.moveTo(sx + 8, sty);
    ctx.lineTo(sx + 20, sty);
    ctx.stroke();
  }

  // 4. Horizontal Ruled Lines (NO Red Margin)
  const line_y_start = sy + 180;
  const line_y_end = sy + sheet_h - 90;
  const text_start_x = sx + 75;

  if (state.paper_style === "grid") {
    const grid_step = 40;
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let gx = sx + 20; gx < sx + sheet_w - 20; gx += grid_step) {
      ctx.moveTo(gx, line_y_start - 40);
      ctx.lineTo(gx, line_y_end);
    }
    for (let gy = line_y_start - 40; gy < line_y_end; gy += grid_step) {
      ctx.moveTo(sx + 20, gy);
      ctx.lineTo(sx + sheet_w - 20, gy);
    }
    ctx.stroke();
  } else if (state.paper_style !== "clean") {
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let ly = line_y_start; ly < line_y_end; ly += state.line_spacing) {
      ctx.moveTo(sx + 25, ly);
      ctx.lineTo(sx + sheet_w - 25, ly);
    }
    ctx.stroke();
  }

  // 5. Overlays (Stickers, Washi Tape, Polaroid) on base
  drawCanvasOverlays(ctx, sx, sy, sheet_w, sheet_h);

  // 6. Playback State & Writing Calculation for Unlimited Pages
  const N = state.pages.length;
  const schedule = buildPlaybackSchedule();
  const t = state.current_time;

  let activeItem = schedule[0];
  let isFlipping = false;
  let isReadingPause = false;
  let flipProgress = 0;
  let flipFromIdx = 0;
  let flipToIdx = 1;
  let charsToShow = 0;
  let showPen = false;

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    if (item.flip_start !== null && t >= item.flip_start && t < item.flip_end) {
      isFlipping = true;
      flipProgress = (t - item.flip_start) / (item.flip_end - item.flip_start);
      flipFromIdx = i;
      flipToIdx = i + 1;
      activeItem = item;
      break;
    } else if (t >= item.write_start && t < item.hold_end) {
      activeItem = item;
      const curPage = state.pages[i];
      const lines = (curPage.quote || "").split("\n");
      const totChars = lines.reduce((acc, l) => acc + (l.trim() ? l.length : 0), 0) || 1;
      if (t < item.write_end) {
        charsToShow = Math.round(((t - item.write_start) / (item.write_end - item.write_start)) * totChars);
        showPen = true;
      } else {
        charsToShow = totChars;
        showPen = false;
        isReadingPause = true;
      }
      break;
    } else if (i === schedule.length - 1) {
      activeItem = item;
      const curPage = state.pages[i];
      const lines = (curPage.quote || "").split("\n");
      charsToShow = lines.reduce((acc, l) => acc + (l.trim() ? l.length : 0), 0) || 1;
      showPen = false;
    }
  }

  // Sync current page index from playback
  state.current_page_idx = activeItem.page_idx;
  if (isReadingPause) {
    canvasPageBadge.textContent = `Hal. ${state.current_page_idx + 1}/${N} • 📖 Jeda Baca`;
  } else if (isFlipping) {
    canvasPageBadge.textContent = `Kebetan Hal. ${flipFromIdx + 1} ➔ ${flipToIdx + 1}`;
  } else {
    canvasPageBadge.textContent = `Hal. ${state.current_page_idx + 1} / ${N}`;
  }

  // 7. Header Title & Date
  ctx.font = getCssFont("kalam", 32);
  ctx.fillStyle = "rgba(71, 85, 105, 0.95)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const displayTitle = (state.current_page_idx === 0) ? state.title : `${state.title} (Hal. ${state.current_page_idx + 1})`;
  ctx.fillText(displayTitle, text_start_x, sy + 78);

  ctx.font = getCssFont("patrick", 26);
  ctx.fillStyle = "rgba(100, 116, 139, 0.9)";
  ctx.textAlign = "right";
  ctx.fillText(state.date_text, sx + sheet_w - 60, sy + 82);

  ctx.font = getCssFont("patrick", 22);
  ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
  ctx.fillText(`Hal. ${state.current_page_idx + 1}`, sx + sheet_w - 45, sy + sheet_h - 60);

  // 8. Draw Text Lines for Active Page
  const curPageData = state.pages[state.current_page_idx];
  const pageLines = (curPageData.quote || "").split("\n");
  const totCharsActive = pageLines.reduce((acc, l) => acc + (l.trim() ? l.length : 0), 0) || 1;

  let charsCounted = 0;
  let curr_y = line_y_start - 12;
  let penPos = null;

  ctx.font = getCssFont(state.font_name, state.font_size);
  ctx.fillStyle = state.ink_color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  for (let i = 0; i < pageLines.length; i++) {
    const line = pageLines[i];
    if (!line.trim()) {
      curr_y += state.line_spacing;
      continue;
    }

    const lineLen = line.length;
    if (charsCounted + lineLen <= charsToShow) {
      ctx.fillText(line, text_start_x, curr_y);
      charsCounted += lineLen;
      const lw = ctx.measureText(line).width;
      penPos = { x: text_start_x + lw, y: curr_y - 8 };
    } else if (charsCounted < charsToShow) {
      const pCount = charsToShow - charsCounted;
      const pText = line.substring(0, pCount);
      ctx.fillText(pText, text_start_x, curr_y);
      charsCounted += pCount;
      const pw = ctx.measureText(pText).width;
      penPos = { x: text_start_x + pw, y: curr_y - 8 };
      curr_y += state.line_spacing;
      break;
    } else {
      curr_y += state.line_spacing;
      break;
    }
    curr_y += state.line_spacing;
  }

  // Draw Golden Pen Tip
  if (showPen && penPos && charsToShow < totCharsActive) {
    drawGoldenNib(ctx, penPos.x, penPos.y, state.ink_color);
  }

  // Signature on final page
  const isFinalPage = (state.current_page_idx === N - 1);
  if (isFinalPage && curPageData.sign && curPageData.sign.trim() && charsToShow >= totCharsActive) {
    ctx.save();
    ctx.font = getCssFont(state.font_name, Math.round(state.font_size * 0.85));
    ctx.fillStyle = "#be185d";
    ctx.fillText(curPageData.sign, text_start_x + 120, curr_y + 35);
    ctx.restore();
  }

  // Watermark
  ctx.font = getCssFont("patrick", 20);
  ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  ctx.textAlign = "center";
  ctx.fillText(state.watermark, W / 2, H - 75);

  // 9. Realistic Kebetan Flip Animation (3D Photo-Realistic Curl)
  if (isFlipping) {
    drawRealisticPageFlip(ctx, flipProgress, sx, sy, sheet_w, sheet_h);
  }

  // 10. Post Cinematic Filters (Warm Light Leak / Vignette)
  applyCinematicFilters(ctx, W, H);
}

// -----------------------------------------------------------------------------
// Photo-Realistic Page Flip (Kebetan 3D Canvas)
// -----------------------------------------------------------------------------
function drawRealisticPageFlip(c, t, sx, sy, sheet_w, sheet_h) {
  const p = easeInOut(t);
  const x_right = sx + sheet_w;
  const x_left = sx + 25; // Stop near book spine
  const fold_x = x_right - p * (x_right - x_left);

  // Natural slant
  const tilt = 0.10 * Math.sin(Math.PI * p);
  const y_top = sy - 20;
  const y_bot = sy + sheet_h + 20;
  const x_top = fold_x - (sheet_h / 2) * tilt;
  const x_bot = fold_x + (sheet_h / 2) * tilt;

  c.save();

  // 1. Smooth Soft Under-Shadow cast onto the revealed page on the right
  const shadow_w = 60 + 130 * Math.sin(Math.PI * p);
  const gradShadow = c.createLinearGradient(x_top, y_top, x_top + shadow_w, y_top);
  gradShadow.addColorStop(0, "rgba(0, 0, 0, 0.55)");
  gradShadow.addColorStop(0.2, "rgba(0, 0, 0, 0.35)");
  gradShadow.addColorStop(0.6, "rgba(0, 0, 0, 0.12)");
  gradShadow.addColorStop(1, "rgba(0, 0, 0, 0.0)");

  c.beginPath();
  c.moveTo(x_top, y_top);
  c.lineTo(x_top + shadow_w, y_top);
  c.lineTo(x_bot + shadow_w, y_bot);
  c.lineTo(x_bot, y_bot);
  c.closePath();
  c.fillStyle = gradShadow;
  c.fill();

  // 2. Curled 3D Flap (Paper cylinder peeling over to the left)
  const flap_w = 45 + 110 * Math.sin(Math.PI * p);
  const flapGrad = c.createLinearGradient(x_top - flap_w, y_top, x_top, y_top);
  flapGrad.addColorStop(0, "rgba(215, 205, 190, 0.95)");  // Outer edge
  flapGrad.addColorStop(0.3, "rgba(244, 238, 226, 1.0)"); // Reverse page paper tone
  flapGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.95)"); // 3D Peak Ridge Specular Highlight
  flapGrad.addColorStop(1, "rgba(160, 145, 128, 0.85)");  // Deep inner crease shadow

  c.beginPath();
  c.moveTo(x_top - flap_w, y_top);
  c.lineTo(x_top, y_top);
  c.lineTo(x_bot, y_bot);
  c.lineTo(x_bot - flap_w, y_bot);
  c.closePath();
  c.fillStyle = flapGrad;
  c.fill();

  c.strokeStyle = "rgba(210, 202, 188, 0.8)";
  c.lineWidth = 2;
  c.stroke();

  // Specular 3D Highlight Line along ridge
  const ridge_top = x_top - flap_w * 0.42;
  const ridge_bot = x_bot - flap_w * 0.42;
  c.beginPath();
  c.strokeStyle = "rgba(255, 255, 255, 0.85)";
  c.lineWidth = 4;
  c.moveTo(ridge_top, y_top);
  c.lineTo(ridge_bot, y_bot);
  c.stroke();

  c.restore();
}

function drawGoldenNib(c, px, py, ink) {
  c.save();
  c.beginPath();
  c.strokeStyle = "rgba(30, 41, 59, 0.45)";
  c.lineWidth = 6;
  c.moveTo(px + 4, py + 8);
  c.lineTo(px + 38, py - 40);
  c.stroke();

  c.beginPath();
  c.moveTo(px, py);
  c.lineTo(px + 8, py - 12);
  c.lineTo(px + 14, py - 10);
  c.closePath();
  c.fillStyle = "#daa520";
  c.fill();

  c.beginPath();
  c.arc(px, py, 2.5, 0, Math.PI * 2);
  c.fillStyle = ink;
  c.fill();
  c.restore();
}

// -----------------------------------------------------------------------------
// Canvas Overlays, Stamps & Stickers
// -----------------------------------------------------------------------------
function drawCanvasOverlays(c, sx, sy, sheet_w, sheet_h) {
  const ov = state.overlays;

  // 1. Washi Tape
  if (ov.tape && ov.tape !== "none") {
    c.save();
    const tapeColors = {
      pink: "rgba(244, 114, 182, 0.75)",
      kraft: "rgba(214, 180, 137, 0.80)",
      grid: "rgba(226, 232, 240, 0.85)"
    };
    c.fillStyle = tapeColors[ov.tape] || tapeColors.pink;
    const tx = sx + 80;
    const ty = sy + 30;
    c.beginPath();
    c.moveTo(tx - 6, ty - 6);
    c.lineTo(tx + 114, ty - 12);
    c.lineTo(tx + 112, ty + 26);
    c.lineTo(tx - 8, ty + 32);
    c.closePath();
    c.fill();
    c.restore();
  }

  // 2. Polaroid Photo Sticker
  if (ov.photo === "revai" && stickerImages["revai"]) {
    c.save();
    const px = sx + sheet_w - 210;
    const py = sy + 130;
    const pw = 160;
    const ph = 190;

    // Polaroid white card backing with drop shadow
    c.shadowColor = "rgba(0, 0, 0, 0.25)";
    c.shadowBlur = 12;
    c.shadowOffsetX = 3;
    c.shadowOffsetY = 6;
    c.fillStyle = "rgba(255, 255, 255, 0.95)";
    c.strokeStyle = "rgba(226, 232, 240, 0.8)";
    c.lineWidth = 1;
    drawRoundedRect(c, px, py, pw, ph, 8);
    c.fill();
    c.stroke();

    // Draw Revai photo
    c.drawImage(stickerImages["revai"], px + 10, py + 10, 140, 140);

    // Caption
    c.font = getCssFont("patrick", 16);
    c.fillStyle = "#475569";
    c.textAlign = "center";
    c.fillText("Revai 💖", px + pw / 2, py + 175);

    // Cute washi tape pinning polaroid
    c.fillStyle = "rgba(244, 114, 182, 0.85)";
    c.beginPath();
    c.moveTo(px + 40, py - 12);
    c.lineTo(px + 115, py - 14);
    c.lineTo(px + 112, py + 10);
    c.lineTo(px + 38, py + 12);
    c.closePath();
    c.fill();
    c.restore();
  }

  // 3. Stamps / Wax Seals
  if (ov.stamp && ov.stamp !== "none") {
    c.save();
    const st_x = sx + sheet_w - 170;
    const st_y = sy + sheet_h - 180;

    if (ov.stamp === "approved_revai") {
      c.strokeStyle = "rgba(225, 29, 72, 0.85)";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(st_x, st_y, 45, 0, Math.PI * 2);
      c.stroke();

      c.lineWidth = 1;
      c.beginPath();
      c.arc(st_x, st_y, 39, 0, Math.PI * 2);
      c.stroke();

      c.font = getCssFont("patrick", 16);
      c.fillStyle = "rgba(225, 29, 72, 0.9)";
      c.textAlign = "center";
      c.fillText("APPROVED", st_x, st_y - 12);
      c.fillText("REVAI 💖", st_x, st_y + 8);
    } else if (ov.stamp === "confidential") {
      c.strokeStyle = "rgba(220, 38, 38, 0.88)";
      c.lineWidth = 3;
      c.strokeRect(st_x - 70, st_y - 20, 140, 40);
      c.font = getCssFont("patrick", 20);
      c.fillStyle = "rgba(220, 38, 38, 0.92)";
      c.textAlign = "center";
      c.fillText("RAHASIA", st_x, st_y + 7);
    } else if (ov.stamp === "penting") {
      c.strokeStyle = "rgba(217, 119, 6, 0.85)";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(st_x, st_y, 42, 0, Math.PI * 2);
      c.stroke();
      c.font = getCssFont("patrick", 16);
      c.fillStyle = "rgba(217, 119, 6, 0.9)";
      c.textAlign = "center";
      c.fillText("PENTING", st_x, st_y - 4);
      c.fillText("★ ★ ★", st_x, st_y + 14);
    } else if (ov.stamp === "catatan_hati") {
      c.strokeStyle = "rgba(5, 150, 105, 0.85)";
      c.lineWidth = 3;
      c.beginPath();
      c.arc(st_x, st_y, 42, 0, Math.PI * 2);
      c.stroke();
      c.font = getCssFont("patrick", 16);
      c.fillStyle = "rgba(5, 150, 105, 0.9)";
      c.textAlign = "center";
      c.fillText("CATATAN", st_x, st_y - 4);
      c.fillText("HATI 🌿", st_x, st_y + 14);
    }
    c.restore();
  }
}

function applyCinematicFilters(c, W, H) {
  const fl = state.overlays.filter;
  if (fl === "vignette") {
    c.save();
    const grad = c.createRadialGradient(W / 2, H / 2, 400, W / 2, H / 2, 1000);
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.55)");
    c.fillStyle = grad;
    c.fillRect(0, 0, W, H);
    c.restore();
  } else if (fl === "warm_leak") {
    c.save();
    const grad = c.createRadialGradient(100, 150, 50, 100, 150, 800);
    grad.addColorStop(0, "rgba(255, 200, 120, 0.35)");
    grad.addColorStop(0.6, "rgba(255, 180, 80, 0.12)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    c.fillStyle = grad;
    c.fillRect(0, 0, W, H);
    c.restore();
  }
}

function drawRoundedRect(c, x, y, width, height, radius) {
  c.beginPath();
  c.moveTo(x + radius, y);
  c.lineTo(x + width - radius, y);
  c.quadraticCurveTo(x + width, y, x + width, y + radius);
  c.lineTo(x + width, y + height - radius);
  c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  c.lineTo(x + radius, y + height);
  c.quadraticCurveTo(x, y + height, x, y + height - radius);
  c.lineTo(x, y + radius);
  c.quadraticCurveTo(x, y, x + radius, y);
  c.closePath();
}

// -----------------------------------------------------------------------------
// Video Render & Export Handlers
// -----------------------------------------------------------------------------
function openExportModal() {
  summaryTitle.textContent = state.title;
  summaryPages.textContent = `${state.pages.length} Halaman (Realistic Kebetan)`;
  summaryDuration.textContent = `${state.duration.toFixed(1)}s (Total Akumulasi ${state.pages.length} Halaman • 9:16 HD)`;

  modalRenderProgress.classList.add("hidden");
  modalVideoResult.classList.add("hidden");
  modalActionButtons.classList.remove("hidden");
  modalExport.classList.remove("hidden");
}

async function triggerVideoRender(sendTelegramAfter = false) {
  modalActionButtons.classList.add("hidden");
  modalRenderProgress.classList.remove("hidden");
  modalProgressText.textContent = "Mempersiapkan render video 9:16...";
  modalProgressBar.style.width = "5%";

  const payload = {
    title: state.title,
    date_text: state.date_text,
    pages: state.pages,
    font_name: state.font_name,
    font_size: state.font_size,
    line_spacing: state.line_spacing,
    paper_style: state.paper_style,
    ink_color: state.ink_color,
    bg_scene: state.bg_scene,
    duration: state.duration,
    pause_duration: state.pause_duration || 3.0,
    audio_file: state.audio_file,
    watermark: state.watermark,
    overlays: state.overlays
  };

  try {
    let fakePct = 10;
    const timer = setInterval(() => {
      if (fakePct < 90) {
        fakePct += 3;
        modalProgressBar.style.width = `${fakePct}%`;
        modalProgressText.textContent = `Merender video kebetan... (${fakePct}%)`;
      }
    }, 600);

    const res = await fetch("/api/generate-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    clearInterval(timer);

    const data = await res.json();
    if (data.status === "success") {
      modalProgressBar.style.width = "100%";
      modalProgressText.textContent = "Render Selesai! 🎉";
      state.rendered_video_url = data.url;
      state.rendered_video_file = data.file_path;

      setTimeout(() => {
        modalRenderProgress.classList.add("hidden");
        modalVideoResult.classList.remove("hidden");
        modalVideoPlayer.src = data.url;
        btnModalDownloadMp4.href = data.url;
        modalVideoPlayer.play();

        if (sendTelegramAfter) {
          triggerSendExistingToTg();
        }
      }, 500);
    } else {
      throw new Error(data.message || "Render failed");
    }
  } catch (e) {
    modalRenderProgress.classList.add("hidden");
    modalActionButtons.classList.remove("hidden");
    showToast("⚠️ Gagal Merender", e.message);
  }
}

async function triggerSendExistingToTg() {
  if (!state.rendered_video_url) return;
  showToast("✈️ Mengirim...", "Sedang mengirim video ke Telegram Aa Baim...");
  try {
    const res = await fetch("/api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_url: state.rendered_video_url,
        caption: `📖 ${state.title} • Video Diary Tulisan Tangan (${state.pages.length} Halaman) oleh Revai untuk Aa Baim 💖`
      })
    });
    const data = await res.json();
    if (data.status === "success") {
      showToast("🎉 Terkirim!", "Video sudah masuk ke Telegram Aa!");
    } else {
      showToast("⚠️ Telegram Error", data.error || "Gagal mengirim.");
    }
  } catch (e) {
    showToast("⚠️ Error", "Koneksi ke bot telegram terganggu.");
  }
}

async function triggerDownloadStill() {
  showToast("🖼️ Merender Gambar...", "Membuat gambar HD lembaran...");
  const payload = {
    title: state.title,
    date_text: state.date_text,
    pages: state.pages,
    font_name: state.font_name,
    font_size: state.font_size,
    line_spacing: state.line_spacing,
    paper_style: state.paper_style,
    ink_color: state.ink_color,
    bg_scene: state.bg_scene,
    overlays: state.overlays,
    page_num: state.current_page_idx + 1
  };
  try {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const d = await res.json();
    if (d.status === "success") {
      const a = document.createElement("a");
      a.href = d.url;
      a.download = d.filename;
      a.click();
      showToast("📥 Gambar Diunduh", d.filename);
    }
  } catch (e) {
    showToast("⚠️ Gagal", "Gagal mengunduh gambar.");
  }
}

function triggerCopyText() {
  const allText = state.pages.map((p, idx) => `[Halaman ${idx + 1}]\n${p.quote}\n${p.sign || ""}`).join("\n\n---\n\n");
  navigator.clipboard.writeText(`${state.title}\n\n${allText}`).then(() => {
    showToast("📋 Disalin", "Seluruh teks naskah berhasil disalin!");
  });
}

function showToast(title, msg) {
  if (!toastNotification) return;
  toastNotification.querySelector("#toastIcon").textContent = "✨";
  toastMessage.innerHTML = `<strong>${title}</strong><br>${msg}`;
  toastNotification.classList.remove("opacity-0", "translate-y-24");
  toastNotification.classList.add("opacity-100", "translate-y-0");

  setTimeout(() => {
    toastNotification.classList.remove("opacity-100", "translate-y-0");
    toastNotification.classList.add("opacity-0", "translate-y-24");
  }, 3200);
}

// Start
document.addEventListener("DOMContentLoaded", init);
