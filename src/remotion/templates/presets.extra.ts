import { TemplateDefinition, TemplateId } from "@/types/editor";

/**
 * Template tambahan (kumpulan 8 template baru).
 * Format content per template:
 * - chat_dm        : "Nama: pesan" per baris (pembicara pertama di kiri)
 * - stat_counter   : "ANGKA|Label" per baris, contoh "1250000|Penayangan" atau "98%|Puas"
 * - top_list       : satu item per baris
 * - lyric_karaoke  : satu baris lirik per baris
 * - terminal_hacker: baris berawalan "$ " diketik, baris lain jadi output
 * - diary_paper    : teks bebas; subtitle = tanggal, title = salam pembuka
 * - quote_minimal  : teks bebas; title/subtitle = sumber quote
 * - breaking_news  : title = headline, subtitle = label ticker, content = isi berita
 */
export const EXTRA_TEMPLATE_PRESETS: Partial<Record<TemplateId, TemplateDefinition>> = {
  quote_minimal: {
    id: "quote_minimal",
    name: "Quote Minimalis",
    description: "Kata muncul satu per satu di atas gradien ungu lembut, elegan dan bersih.",
    badge: "Estetik ✨",
    icon: "Quote",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Quote",
        durationInSeconds: 10,
        title: "Olip",
        subtitle: "Pengingat hari ini",
        content: "Pelan-pelan saja, asal tidak berhenti. Yang penting kamu masih berjalan.",
        themeColor: "#f5d0a9",
        transitionToNext: "fade",
      },
      {
        id: "scene-2",
        name: "Scene 2: Quote",
        durationInSeconds: 10,
        title: "Aa Baim",
        subtitle: "Catatan kecil",
        content: "Rezeki itu tidak tertukar, hanya kadang waktunya tidak sesuai dengan jadwal kita.",
        themeColor: "#fbcfe8",
        transitionToNext: "none",
      },
    ],
  },
  lyric_karaoke: {
    id: "lyric_karaoke",
    name: "Lirik Karaoke",
    description: "Baris lirik menyala berurutan seperti karaoke, cocok untuk lagu Suno.",
    badge: "Lagu & Suno 🎵",
    icon: "Mic",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Verse",
        durationInSeconds: 12,
        title: "Langkah Kecil",
        subtitle: "Verse 1",
        content:
          "Malam turun di ujung jalan\nKu bawa mimpi dalam genggaman\nWalau lelah menghadang\nKu tetap berjalan",
        themeColor: "#38bdf8",
        transitionToNext: "fade",
      },
      {
        id: "scene-2",
        name: "Scene 2: Reff",
        durationInSeconds: 12,
        title: "Langkah Kecil",
        subtitle: "Reff",
        content:
          "Terus melangkah, jangan menyerah\nPagi pasti datang menyapa\nSetiap luka jadi cerita\nSetiap sabar ada harganya",
        themeColor: "#f472b6",
        transitionToNext: "none",
      },
    ],
  },
  top_list: {
    id: "top_list",
    name: "Top List & Tips",
    description: "Daftar bernomor yang muncul bergantian: Top 5, tips, atau checklist.",
    badge: "Edukasi 📋",
    icon: "ListOrdered",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Tips",
        durationInSeconds: 12,
        title: "5 Tips Hemat Kuota",
        subtitle: "Tips Harian",
        content:
          "Matikan auto-play video\nPakai Wi-Fi untuk update aplikasi\nAktifkan mode hemat data\nUnduh konten saat Wi-Fi\nBatasi data latar belakang",
        themeColor: "#fbbf24",
        transitionToNext: "slide_left",
      },
      {
        id: "scene-2",
        name: "Scene 2: Tips",
        durationInSeconds: 10,
        title: "3 Kebiasaan Coder Produktif",
        subtitle: "Developer",
        content: "Commit kecil tapi sering\nTulis catatan sebelum lupa\nIstirahat tiap 50 menit",
        themeColor: "#34d399",
        transitionToNext: "none",
      },
    ],
  },
  breaking_news: {
    id: "breaking_news",
    name: "Breaking News",
    description: "Banner merah, headline besar, dan ticker berjalan ala berita TV.",
    badge: "Berita 📰",
    icon: "Newspaper",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Headline",
        durationInSeconds: 10,
        title: "Olip Rilis Template Remotion Baru",
        subtitle: "Olip Video Studio",
        content:
          "Delapan template baru kini tersedia dan siap dipakai untuk konten TikTok, Reels, dan Shorts.",
        themeColor: "#dc2626",
        transitionToNext: "wipe",
      },
      {
        id: "scene-2",
        name: "Scene 2: Update",
        durationInSeconds: 10,
        title: "Render Tetap Ringan di Cloud Run",
        subtitle: "Update Terbaru",
        content: "Template baru memakai animasi ringan sehingga render tetap hemat sumber daya.",
        themeColor: "#2563eb",
        transitionToNext: "none",
      },
    ],
  },
  terminal_hacker: {
    id: "terminal_hacker",
    name: "Terminal Hacker",
    description: "Jendela terminal hijau, perintah diketik per huruf dengan output bertahap.",
    badge: "Tech 💻",
    icon: "Terminal",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Deploy",
        durationInSeconds: 14,
        title: "olip@termux",
        subtitle: "deploy",
        content:
          "$ git push origin main\nEnumerating objects: 24, done.\nWriting objects: 100% (24/24)\n$ vercel --prod\nBuilding... done\nProduction: https://olip.vercel.app",
        themeColor: "#22c55e",
        transitionToNext: "fade",
      },
      {
        id: "scene-2",
        name: "Scene 2: Render",
        durationInSeconds: 12,
        title: "diary-studio",
        subtitle: "cloud run",
        content:
          "$ npm run render\nBundling Remotion... done\nRendering frames 0-299\nvideo.mp4 siap dikirim",
        themeColor: "#38bdf8",
        transitionToNext: "none",
      },
    ],
  },
  diary_paper: {
    id: "diary_paper",
    name: "Diary Kertas Tulisan Tangan",
    description: "Buku catatan bergaris dengan tulisan tangan yang muncul per huruf.",
    badge: "Diary 📖",
    icon: "BookOpen",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Hari Ini",
        durationInSeconds: 14,
        title: "Dear Diary,",
        subtitle: "Sabtu, 7 November 2026",
        content:
          "Hari ini capek banget, tapi ada satu hal kecil yang bikin tersenyum: video pertamaku berhasil selesai dirender.",
        themeColor: "#1e3a8a",
        transitionToNext: "fade",
      },
      {
        id: "scene-2",
        name: "Scene 2: Harapan",
        durationInSeconds: 12,
        title: "Untuk Besok",
        subtitle: "Minggu, 8 November 2026",
        content:
          "Semoga besok lebih tenang. Aku mau bikin lebih banyak karya dan tidak menyerah sebelum selesai.",
        themeColor: "#9d174d",
        transitionToNext: "none",
      },
    ],
  },
  chat_dm: {
    id: "chat_dm",
    name: "Chat DM Percakapan",
    description: "Percakapan dua orang ala chat. Format per baris: Nama: pesan.",
    badge: "Story Chat 💬",
    icon: "MessageCircle",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Curhat",
        durationInSeconds: 14,
        title: "Chat",
        subtitle: "online",
        content:
          "Dina: Kamu udah makan belum?\nBaim: Belum, lagi ngerjain video\nDina: Jangan lupa makan ya\nBaim: Siap, 5 menit lagi selesai",
        themeColor: "#25d366",
        transitionToNext: "slide_up",
      },
      {
        id: "scene-2",
        name: "Scene 2: Kabar",
        durationInSeconds: 12,
        title: "Chat",
        subtitle: "online",
        content: "Dina: Videonya udah jadi?\nBaim: Udah, tinggal upload\nDina: Mantap, kabarin ya kalau viral",
        themeColor: "#3b82f6",
        transitionToNext: "none",
      },
    ],
  },
  stat_counter: {
    id: "stat_counter",
    name: "Statistik Angka Naik",
    description: "Angka berhitung naik dengan animasi halus. Format per baris: ANGKA|Label.",
    badge: "Data 📊",
    icon: "TrendingUp",
    defaultScenes: [
      {
        id: "scene-1",
        name: "Scene 1: Capaian",
        durationInSeconds: 12,
        title: "Capaian Kita Tahun Ini",
        subtitle: "Dalam Angka",
        content: "1250000|Total penayangan\n48500|Pengikut baru\n98%|Penonton puas",
        themeColor: "#34d399",
        transitionToNext: "fade",
      },
      {
        id: "scene-2",
        name: "Scene 2: Target",
        durationInSeconds: 10,
        title: "Target Berikutnya",
        subtitle: "Menuju 2027",
        content: "5000000|Penayangan\n100000|Pengikut",
        themeColor: "#fbbf24",
        transitionToNext: "none",
      },
    ],
  },
};
