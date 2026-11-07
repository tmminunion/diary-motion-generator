import { TemplateDefinition, TemplateId } from "@/types/editor";

/**
 * Template gelombang ketiga (10 template). Format content per template:
 * - neon_sign       : title = tulisan neon besar, subtitle = nama tempat, content = satu tulisan kecil per baris
 * - before_after    : dua baris "Sebelum: ..." dan "Sesudah: ..."
 * - checklist_todo  : satu tugas per baris
 * - cinematic_title : title = judul, subtitle = label atas, content = tagline
 * - countdown_intro : satu langkah per baris (3 / 2 / 1 / Mulai!)
 * - spiral_notebook : title = judul halaman, subtitle = tanggal, content = satu poin per baris
 * - timeline_story  : satu tonggak per baris, format "Tahun|Cerita"
 * - qna_card        : baris 1 = pertanyaan, baris berikutnya = jawaban; title = penanya
 * - receipt_struk   : "Item|harga" per baris, total otomatis; title = nama toko, subtitle = tanggal
 * - poll_versus     : "Opsi|persen" per baris (maks 5); title = pertanyaan
 */
export const MORE_TEMPLATE_PRESETS: Partial<Record<TemplateId, TemplateDefinition>> = {
  neon_sign: {
    id: "neon_sign",
    name: "Papan Neon",
    description: "Judul menyala seperti papan neon kafe malam, dengan kedip nyala awal.",
    badge: "Estetik Malam 🌃",
    icon: "Zap",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Neon",
                "durationInSeconds": 8,
                "title": "OPEN 24 JAM",
                "subtitle": "Warung Kopi Olip",
                "content": "Kopi hitam\nCurhat gratis\nWiFi: sabar",
                "themeColor": "#ff3df2",
                "transitionToNext": "fade",
                "sceneType": "neon_sign"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Neon",
                "durationInSeconds": 8,
                "title": "NGOPI DULU",
                "subtitle": "Malam Minggu",
                "content": "Tenang aja\nBesok masih ada",
                "themeColor": "#22d3ee",
                "transitionToNext": "none",
                "sceneType": "neon_sign"
          }
    ],
  },
  before_after: {
    id: "before_after",
    name: "Sebelum vs Sesudah",
    description: "Dua kartu perbandingan. Cocok untuk transformasi, glow up, dan hasil kerja.",
    badge: "Transformasi 🔄",
    icon: "ArrowLeftRight",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Before After",
                "durationInSeconds": 9,
                "title": "Glow Up Kode",
                "subtitle": "Refactor 1 minggu",
                "content": "Sebelum: 1 file 3000 baris, nama variabel a, b, c\nSesudah: modul rapi, test hijau, tidur nyenyak",
                "themeColor": "#22c55e",
                "transitionToNext": "fade",
                "sceneType": "before_after"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Before After",
                "durationInSeconds": 9,
                "title": "Kamar Kerja",
                "subtitle": "Beres-beres sehari",
                "content": "Sebelum: kabel kusut dan gelas kopi 7 biji\nSesudah: meja bersih, fokus naik",
                "themeColor": "#38bdf8",
                "transitionToNext": "none",
                "sceneType": "before_after"
          }
    ],
  },
  checklist_todo: {
    id: "checklist_todo",
    name: "Checklist To-Do",
    description: "Daftar tugas dicentang satu per satu dengan penghitung progres.",
    badge: "Produktif ✅",
    icon: "ListChecks",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Checklist",
                "durationInSeconds": 10,
                "title": "Rencana Hari Ini",
                "subtitle": "Daftar Tugas",
                "content": "Bangun sebelum alarm kelima\nRender video baru\nBalas chat penting\nMinum air putih\nTidur sebelum jam 12",
                "themeColor": "#10b981",
                "transitionToNext": "fade",
                "sceneType": "checklist_todo"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Checklist",
                "durationInSeconds": 9,
                "title": "Launching Aplikasi",
                "subtitle": "Persiapan",
                "content": "Tes di HP asli\nCek server\nSiapkan konten promosi\nDoa bersama",
                "themeColor": "#f59e0b",
                "transitionToNext": "none",
                "sceneType": "checklist_todo"
          }
    ],
  },
  cinematic_title: {
    id: "cinematic_title",
    name: "Judul Sinematik",
    description: "Letterbox hitam dengan judul melebar lalu merapat, seperti trailer film.",
    badge: "Film Trailer 🎬",
    icon: "Clapperboard",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Judul",
                "durationInSeconds": 8,
                "title": "BAYANGAN DI ALENGKA",
                "subtitle": "Sebuah kisah fiksi",
                "content": "Segera tayang di layar HP kamu",
                "themeColor": "#fcd34d",
                "transitionToNext": "fade",
                "sceneType": "cinematic_title"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Judul",
                "durationInSeconds": 8,
                "title": "MALAM TANPA SINYAL",
                "subtitle": "Dari Aa Baim",
                "content": "Karena cerita terbaik lahir saat internet mati",
                "themeColor": "#f87171",
                "transitionToNext": "none",
                "sceneType": "cinematic_title"
          }
    ],
  },
  countdown_intro: {
    id: "countdown_intro",
    name: "Hitung Mundur",
    description: "Hitung mundur dengan cincin progres, cocok untuk intro atau pengumuman.",
    badge: "Intro Seru ⏱️",
    icon: "Timer",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Hitung Mundur",
                "durationInSeconds": 8,
                "title": "Video Dimulai Dalam",
                "subtitle": "Bersiap",
                "content": "3\n2\n1\nMulai!",
                "themeColor": "#f97316",
                "transitionToNext": "fade",
                "sceneType": "countdown_intro"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Hitung Mundur",
                "durationInSeconds": 8,
                "title": "Launching Sebentar Lagi",
                "subtitle": "Pengumuman",
                "content": "5\n4\n3\n2\n1\nLive!",
                "themeColor": "#a855f7",
                "transitionToNext": "none",
                "sceneType": "countdown_intro"
          }
    ],
  },
  spiral_notebook: {
    id: "spiral_notebook",
    name: "Buku Catatan Spiral",
    description: "Halaman buku spiral miring di atas meja dengan poin-poin tulisan tangan.",
    badge: "Catatan Harian 📓",
    icon: "NotebookPen",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Catatan",
                "durationInSeconds": 10,
                "title": "Catatan Hari Ini",
                "subtitle": "Sabtu, 7 November",
                "content": "Bangun kesiangan\nKopi tumpah di keyboard\nUntung kode tetap jalan\nMalam ini lembur lagi",
                "themeColor": "#2563eb",
                "transitionToNext": "fade",
                "sceneType": "spiral_notebook"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Catatan",
                "durationInSeconds": 9,
                "title": "Target Minggu Ini",
                "subtitle": "Mingguan",
                "content": "Tambah 5 template\nPerbaiki editor\nIstirahat yang cukup",
                "themeColor": "#be185d",
                "transitionToNext": "none",
                "sceneType": "spiral_notebook"
          }
    ],
  },
  timeline_story: {
    id: "timeline_story",
    name: "Linimasa Perjalanan",
    description: "Tonggak waktu muncul berurutan di sepanjang garis vertikal.",
    badge: "Perjalanan 🛤️",
    icon: "Route",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Linimasa",
                "durationInSeconds": 12,
                "title": "Perjalanan Ngoding",
                "subtitle": "Dari Nol",
                "content": "2015|Pertama kenal HTML\n2018|Bikin aplikasi pertama\n2021|Kerja remote dari Termux\n2026|Bikin studio video sendiri",
                "themeColor": "#38bdf8",
                "transitionToNext": "fade",
                "sceneType": "timeline_story"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Linimasa",
                "durationInSeconds": 10,
                "title": "Rencana Ke Depan",
                "subtitle": "Targetku",
                "content": "Q1|Seribu pengguna\nQ2|Fitur suara AI\nQ4|Tidur cukup",
                "themeColor": "#f472b6",
                "transitionToNext": "none",
                "sceneType": "timeline_story"
          }
    ],
  },
  qna_card: {
    id: "qna_card",
    name: "Tanya Jawab",
    description: "Kartu pertanyaan ala Instagram dengan jawaban yang diketik kata per kata.",
    badge: "Jawab Netizen 💬",
    icon: "HelpCircle",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Tanya Jawab",
                "durationInSeconds": 10,
                "title": "Netizen",
                "subtitle": "Jawaban Aa",
                "content": "Kak, ngoding itu susah nggak?\nSusah di awal, nagih di tengah, dan lucu kalau lihat error sendiri tiga bulan kemudian.",
                "themeColor": "#f43f5e",
                "transitionToNext": "fade",
                "sceneType": "qna_card"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Tanya Jawab",
                "durationInSeconds": 10,
                "title": "Anonim",
                "subtitle": "Jawaban Aa",
                "content": "Rahasia sukses apa?\nKonsisten dikit dikit, dan jangan lupa commit sebelum tidur.",
                "themeColor": "#8b5cf6",
                "transitionToNext": "none",
                "sceneType": "qna_card"
          }
    ],
  },
  receipt_struk: {
    id: "receipt_struk",
    name: "Struk Belanja",
    description: "Struk kasir lucu dengan total otomatis dan stempel LUNAS.",
    badge: "Konten Lucu 🧾",
    icon: "Receipt",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Struk",
                "durationInSeconds": 11,
                "title": "TOKO KEHIDUPAN",
                "subtitle": "07/11/2026 23:59",
                "content": "Kopi susu|18000\nKuota habis|50000\nLangganan tak terpakai|99000\nHarapan palsu|0\nCinta mantan|0",
                "themeColor": "#ef4444",
                "transitionToNext": "fade",
                "sceneType": "receipt_struk"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Struk",
                "durationInSeconds": 10,
                "title": "WARUNG PROGRAMMER",
                "subtitle": "Nota Lembur",
                "content": "Mie instan|4000\nEnergy drink|9000\nBug misterius|0\nWaktu tidur|0",
                "themeColor": "#2563eb",
                "transitionToNext": "none",
                "sceneType": "receipt_struk"
          }
    ],
  },
  poll_versus: {
    id: "poll_versus",
    name: "Polling Pilih Mana",
    description: "Batang polling bergerak ke persentase akhir dan menyorot pemenang.",
    badge: "Interaktif 📊",
    icon: "BarChart3",
    defaultScenes: [
          {
                "id": "scene-1",
                "name": "Scene 1: Polling",
                "durationInSeconds": 9,
                "title": "Bubur Diaduk atau Nggak?",
                "subtitle": "Hasil Polling",
                "content": "Diaduk|38\nNggak diaduk|62",
                "themeColor": "#38bdf8",
                "transitionToNext": "fade",
                "sceneType": "poll_versus"
          },
          {
                "id": "scene-2",
                "name": "Scene 2: Polling",
                "durationInSeconds": 9,
                "title": "Tim Kerja Terbaik",
                "subtitle": "Hasil Polling",
                "content": "Pagi|24\nSiang|11\nMalam|65",
                "themeColor": "#f472b6",
                "transitionToNext": "none",
                "sceneType": "poll_versus"
          }
    ],
  },
};
