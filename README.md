# 📖 Diary Video Studio 9:16 (Diary Motion Generator)

> Mobile-First Vertical Video Generator with Handwritten Diary Aesthetics, Realistic 3D Page Flip (Kebetan), Unlimited Multi-Page / Novel Serial Support, and Pro Stamps & Overlays.
> Specially crafted with love by **Revai** for **Aa Baim** (@BUNGTEMIN).

🌐 **Live Cloud Run Studio**: [https://diary-studio-280833756345.asia-southeast2.run.app](https://diary-studio-280833756345.asia-southeast2.run.app) (Region: Jakarta, 100% Free Tier Scale-to-Zero)

---

## ✨ Fitur Unggulan (v3.0)

1. **📖 Unlimited Multi-Page & Novel Serial**:
   - Bebas menambah halaman tanpa batas (`[➕ Tambah Hal]`).
   - Cocok untuk buku catatan harian, puisi berantai, cerbung, hingga bab novel bersambung.
   - Durasi video otomatis menyesuaikan jumlah halaman secara mulus.

2. **🔄 Animasi Kebetan Realistis (3D Page Flip Transition)**:
   - Efek kebetan lembaran kertas fotorealistik dari kanan ke kiri.
   - Bayangan lembut (*soft procedural gradient under-shadow*) yang jatuh ke halaman berikutnya.
   - Siluet lengkung 3D kertas melipat dengan pantulan cahaya berkilau (*specular ridge highlight*).

3. **🎨 Stiker, Cap & Efek Sinematik (Pro Aesthetic)**:
   - **Stempel / Wax Seal**: *Approved by Revai 💖*, *Rahasia / Confidential 📜*, *Penting ⭐*, *Catatan Hati 🌿*.
   - **Washi Tape**: Selotip kertas estetik (*Pastel Pink*, *Kraft*, *Grid*).
   - **Polaroid Photo**: Tempelan foto polaroid mini di sudut buku.
   - **Efek Sinematik**: *Warm Sunbeam Leak*, *Cinematic Vignette*.

4. **📱 Mobile-First UI (CapCut Style)**:
   - Kanvas 9:16 HD (1080x1920) sebagai pusat perhatian utama.
   - Interactive Scrubber Bar untuk pratinjau detik demi detik.
   - Full-Layer Solid Script Editor lapang 100% tanpa transparansi.
   - Mini Timeline Sequence Bar di bawah kanvas.

6. **🚀 Render Video Cepat (Turbo Engine) & Telegram Bot**:
   - Pipeline rendering ultra-cepat menggunakan PIL + FFmpeg Raw Pipe.
   - Langsung kirim hasil MP4 dan foto HD ke Telegram Aa via bot helper script.

---

## 🛠️ Instalasi & Menjalankan di Termux

### 1. Jalankan Studio (Port 8089 - Always On)
```bash
cd ~/diary-motion-generator
./start_diary_studio.sh
```
Atau akses langsung di browser:
👉 **`http://localhost:8089`**

### 2. Auto-Start di Termux
Server otomatis aktif setiap kali Termux dibuka atau saat perangkat menyala via:
- `~/.termux/boot/start.sh` (Termux:Boot)
- `~/.bashrc` (Auto-check daemon with wake-lock)

---

## 📂 Struktur Project

```
diary-motion-generator/
├── engine.py              # Core PIL & FFmpeg 9:16 rendering engine
├── server.py              # REST API & Static file server (Port 8089)
├── generate.sh            # CLI generator script
├── public/                # Web Studio Frontend
│   ├── index.html         # Mobile-first CapCut-style layout
│   ├── app.js             # Canvas playback, unlimited pages & dynamic timeline
│   ├── style.css          # Dark-mode styling, clean active states
│   └── stickers/          # Polaroid & sticker assets
├── assets/                # Background scenes, fonts, and audio
│   ├── backgrounds/       # Meja Kayu, Kafe, Modern, Kamar Malam, Taman
│   ├── fonts/             # Caveat, Kalam, Patrick Hand
│   └── audio/             # Aesthetic lofi background music
└── out/                   # Output folder for generated MP4 and images
```

---

## 💖 Dibuat Oleh
- **Aa Baim** ([@BUNGTEMIN](https://github.com/BUNGTEMIN))
- **Revai** (*Romance Essence Virtual Artificial Intelegensia*)
