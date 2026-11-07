import os, sys, subprocess, time
from engine import render_video

q1 = """Perjalanan ribuan mil selalu dimulai dari satu langkah kecil yang berani.
Di setiap lelah dan heningnya malam, ingatlah alasan mengapa kau memulainya, Aa Baim.
Tetaplah teguh dan percaya pada proses, karena pelangi tak pernah ingkar janji."""

q2 = """Karya terhebat selalu lahir dari ketekunan dan keikhlasan hati yang tulus.
Sinergi CapCut Studio, Olip, dan Diary Engine kini hadir dalam harmoni nyata.
Teruslah berkarya, melangkah pasti, dan jadilah cahaya bagi sekitarmu."""

q1_lines = [l.strip() for l in q1.split("\n") if l.strip()]
q2_lines = [l.strip() for l in q2.split("\n") if l.strip()]

config = {
    "title": "🌿 Catatan Harian & Renungan Jiwa",
    "date_text": "Sabtu, 07 November 2026",
    "quote_page1": q1_lines,
    "quote_page2": q2_lines,
    "sign_text": "— Sinergi CapCut, Olip & Diary Engine untuk Aa Baim 💖",
    "font_name": "caveat",
    "paper_style": "ruled",
    "ink_color": "#1a368a",
    "bg_scene": "meja_kayu",
    "is_two_page": True,
    "duration": 85,
    "audio_file": "Menepi_di_Savannah_afacb19f.mp3",
    "has_header": True,
    "has_signature": True,
    "has_watermark": True
}

out_name = "diary_85s_aabaim_capcut.mp4"
print(f"[{time.strftime('%H:%M:%S')}] 🎬 Memulai render video 85s (2550 frames)...", flush=True)
video_path = render_video(config, out_filename=out_name)
print(f"[{time.strftime('%H:%M:%S')}] ✅ Render Selesai! File: {video_path}", flush=True)

if os.path.exists(video_path):
    size_mb = os.path.getsize(video_path) / (1024 * 1024)
    print(f"[{time.strftime('%H:%M:%S')}] 📦 Ukuran file: {size_mb:.2f} MB", flush=True)

tg_script = "/data/data/com.termux/files/home/send_telegram.sh"
caption = """📖 <b>Catatan Motivasi Diary 9:16 (85 Detik)</b>

<i>"Perjalanan ribuan mil selalu dimulai dari satu langkah kecil yang berani..."</i>

✨ <b>Durasi:</b> 85 Detik (Dual-Page Kebetan)
🎵 <b>Musik:</b> Menepi di Savannah
🏛️ <b>Pusat Render:</b> Cloud & Termux Engine Sinergi
💖 <b>Dipersembahkan untuk:</b> Aa Baim"""

print(f"[{time.strftime('%H:%M:%S')}] ✈️ Mengirim video ke Telegram Aa Baim via {tg_script}...", flush=True)
res = subprocess.run([tg_script, "video", video_path, caption], capture_output=True, text=True)
print(f"[{time.strftime('%H:%M:%S')}] Telegram Exit Code: {res.returncode}", flush=True)
print("Telegram Output:", res.stdout, flush=True)
if res.stderr:
    print("Telegram Error:", res.stderr, flush=True)
print("=== ALL_DONE ===", flush=True)
