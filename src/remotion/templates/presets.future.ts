import { TemplateDefinition, TemplateId } from "@/types/editor";

/**
 * Template gelombang keempat: nuansa modern & futuristik, plus chat gaya WA (4 template).
 * Format content per template:
 * - hud_scanner : title = judul yang diketik, subtitle = label, content = "Label|0-100" (bar) atau teks biasa (log "> ...")
 * - glass_aurora: title = judul kartu utama, subtitle = label, content = "Judul|isi" atau teks biasa, satu kartu per baris
 * - ai_prompt   : title = nama asisten, subtitle = status, content = baris 1 prompt, baris berikutnya jawaban AI
 * - wa_chat     : title = nama kontak, subtitle = status, content = "Nama: pesan" per baris; "# teks" = chip tanggal; akhiran " @00.07" = jam; baris emoji saja = emoji besar
 */
export const FUTURE_TEMPLATE_PRESETS: Partial<Record<TemplateId, TemplateDefinition>> = {
  hud_scanner: {
    id: "hud_scanner",
    name: "HUD Sci-Fi",
    description: "Panel antarmuka futuristik: grid, garis pemindai, judul diketik, dan bar data bergerak.",
    badge: "Futuristik 🛰️",
    icon: "Radar",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Status Sistem",
        durationInSeconds: 10,
        title: "OLIP CORE ONLINE",
        subtitle: "Status Sistem",
        content: "Render Engine|92\nKreativitas|100\nKopi|34\nBug|7\nSiap tempur, Komandan",
        themeColor: "#22d3ee",
        transitionToNext: "fade",
        sceneType: "hud_scanner",
      },
      {
        id: "scene-2",
        name: "Scene 2: Laporan",
        durationInSeconds: 10,
        title: "SCAN SELESAI",
        subtitle: "Laporan Malam",
        content: "Semangat|88\nTidur|12\nDeploy|100\nSemua aman, kecuali dompet",
        themeColor: "#34d399",
        transitionToNext: "none",
        sceneType: "hud_scanner",
      },
    ],
  },
  glass_aurora: {
    id: "glass_aurora",
    name: "Kaca Aurora",
    description: "Kartu kaca di atas aurora bergerak, meluncur satu per satu. Modern dan bersih.",
    badge: "Modern ✨",
    icon: "Layers",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Hari Ini",
        durationInSeconds: 10,
        title: "Hari Ini",
        subtitle: "Aurora Mode",
        content: "Fokus|Selesaikan satu hal dulu\nIstirahat|Minum air, tarik napas\nSyukur|Satu langkah kecil tetap maju",
        themeColor: "#a78bfa",
        transitionToNext: "fade",
        sceneType: "glass_aurora",
      },
      {
        id: "scene-2",
        name: "Scene 2: Besok",
        durationInSeconds: 10,
        title: "Besok",
        subtitle: "Rencana",
        content: "Pagi|Mulai dari yang paling sulit\nSiang|Review bareng AI\nMalam|Matikan notifikasi",
        themeColor: "#38bdf8",
        transitionToNext: "none",
        sceneType: "glass_aurora",
      },
    ],
  },
  ai_prompt: {
    id: "ai_prompt",
    name: "Prompt AI",
    description: "Asisten AI dengan orb berdenyut: prompt diketik, lalu jawaban mengalir kata demi kata.",
    badge: "AI Chat 🤖",
    icon: "Bot",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Tanya AI",
        durationInSeconds: 13,
        title: "Olip AI",
        subtitle: "online",
        content:
          "Kenapa kodenya jalan di laptopku doang?\nKarena laptopmu satu-satunya yang masih percaya sama kodenya.\nCoba deploy dulu, nanti kita lihat siapa lagi yang percaya.",
        themeColor: "#7c5cff",
        transitionToNext: "fade",
        sceneType: "ai_prompt",
      },
      {
        id: "scene-2",
        name: "Scene 2: Ide Konten",
        durationInSeconds: 14,
        title: "Olip AI",
        subtitle: "online",
        content:
          "Bikinin aku ide konten yang viral dong.\nTentu. Ide satu: tunjukkan prosesmu, bukan hasilnya.\nIde dua: pasang hook di dua detik pertama.\nIde tiga: tutup dengan punchline yang bikin orang kirim ke temannya.",
        themeColor: "#38bdf8",
        transitionToNext: "none",
        sceneType: "ai_prompt",
      },
    ],
  },
  wa_chat: {
    id: "wa_chat",
    name: "Chat Gaya WA",
    description: "Tampilan chat terang ala aplikasi pesan: pesan mengalir dari atas, centang biru, dan menggulung otomatis saat penuh.",
    badge: "Story Chat 💚",
    icon: "Smartphone",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Ditanya Mamah",
        durationInSeconds: 14,
        title: "Mamah 💚",
        subtitle: "online",
        content:
          "# Hari ini\nMamah: Aa, udah makan belum? @00.00\nAa Baim: Belum Mah, lagi ngoding\nMamah: Ngoding terus, nasi udah dingin\nMamah: 😢\nAa Baim: Iya Mah, lima menit lagi\nMamah: Itu kemarin juga lima menit @00.03",
        themeColor: "#1fa855",
        transitionToNext: "fade",
        sceneType: "wa_chat",
      },
      {
        id: "scene-2",
        name: "Scene 2: Janji",
        durationInSeconds: 12,
        title: "Mamah 💚",
        subtitle: "online",
        content:
          "Aa Baim: Mah, aku makan sekarang @00.05\nMamah: Nah gitu dong\nMamah: Pakai telur ya\nAa Baim: Siap Mah\nAa Baim: 🙂\nMamah: Jangan lupa cuci piring @00.06",
        themeColor: "#1fa855",
        transitionToNext: "none",
        sceneType: "wa_chat",
      },
    ],
  },
};
