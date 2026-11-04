#!/usr/bin/env python3
"""
Diary Motion Generator - Web Studio Server
Provides full REST API and serves the dual-pane Web Studio UI.
Runs on 0.0.0.0:8095
"""

import base64
import json
import mimetypes
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import threading
import time
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

from engine import render_still_image, render_video, OUT_DIR, AUDIO_DIR

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
PORT = int(os.environ.get("PORT", 8089))

DB_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "diary_projects.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date_text TEXT,
            total_pages INTEGER DEFAULT 1,
            duration REAL DEFAULT 15.0,
            preview_text TEXT,
            project_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

def auto_wrap_text(text, max_chars=36):
    if not text:
        return ""
    paragraphs = str(text).split("\n")
    wrapped_paras = []
    for para in paragraphs:
        para = para.strip()
        if not para:
            wrapped_paras.append("")
            continue
        words = para.split()
        lines = []
        cur_line = []
        cur_len = 0
        for w in words:
            if cur_len + len(w) + (1 if cur_line else 0) > max_chars:
                if cur_line:
                    lines.append(" ".join(cur_line))
                    cur_line = [w]
                    cur_len = len(w)
                else:
                    lines.append(w)
                    cur_line = []
                    cur_len = 0
            else:
                cur_line.append(w)
                cur_len += len(w) + (1 if len(cur_line) > 1 else 0)
        if cur_line:
            lines.append(" ".join(cur_line))
        wrapped_paras.append("\n".join(lines))
    return "\n".join(wrapped_paras)

DEFAULT_BOT_TOKEN = "8821651076:AAFUjZGp8JCAQV0ZCE1yiV0W4fJvhioiNmU"
OLIP_BOT_TOKEN = "8787730585:AAE8ScJ8Cnc0CD3ncAIfkOb1cdSO8a4WtUw"
DEFAULT_CHAT_ID = "1227103966"

def send_telegram_media(target_file, caption, chat_id=None, bot_token=None):
    # Strictly ONE bot token per request
    token = bot_token or os.environ.get("TELEGRAM_BOT_TOKEN", OLIP_BOT_TOKEN)
    target_chat = str(chat_id or os.environ.get("TELEGRAM_CHAT_ID", DEFAULT_CHAT_ID))

    if target_file.endswith(".mp4"):
        endpoint = "sendVideo"
        field = "video"
    elif target_file.endswith((".png", ".jpg", ".jpeg")):
        endpoint = "sendPhoto"
        field = "photo"
    else:
        endpoint = "sendDocument"
        field = "document"

    cmd = [
        "curl", "-4", "-s", "-X", "POST",
        f"https://api.telegram.org/bot{token}/{endpoint}",
        "-F", f"chat_id={target_chat}",
        "-F", f"{field}=@{target_file}",
        "-F", f"caption={caption}",
        "-F", "parse_mode=HTML"
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=45)
        print(f"[TELEGRAM MEDIA SENT] token=...{token[-8:]} chat={target_chat} res={res.stdout[:60]}", flush=True)
        return res
    except Exception as e:
        print(f"[TELEGRAM MEDIA ERROR] {e}", flush=True)
        return None

def send_telegram_text(chat_id, text, bot_token=None):
    # Strictly ONE bot token per request
    token = bot_token or os.environ.get("TELEGRAM_BOT_TOKEN", OLIP_BOT_TOKEN)
    target_chat = str(chat_id or DEFAULT_CHAT_ID)
    cmd = [
        "curl", "-4", "-s", "-X", "POST",
        f"https://api.telegram.org/bot{token}/sendMessage",
        "-d", f"chat_id={target_chat}",
        "-d", f"text={text}",
        "-d", "parse_mode=HTML"
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=15)
        print(f"[TELEGRAM TEXT SENT] token=...{token[-8:]} chat={target_chat} res={res.stdout[:60]}", flush=True)
        return res
    except Exception as e:
        print(f"[TELEGRAM TEXT ERROR] {e}", flush=True)
        return None

def escape_ffmpeg_text(text=""):
    if not text:
        return ""
    t = str(text).replace("\r", "").replace("\n", " ")
    t = t.replace("\\", "\\\\").replace("'", "’").replace(":", "\\:").replace("%", "\\%").replace(";", "\\;")
    return t

def process_olip_render_job(project, chat_id, job_id, bot_token=None):
    # Strictly ONE bot token (Olive Bot for Olip Video Studio)
    bot_token = bot_token or OLIP_BOT_TOKEN
    try:
        timestamp = int(time.time())
        session_dir = os.path.join(OUT_DIR, f"olip_{timestamp}")
        os.makedirs(session_dir, exist_ok=True)

        scenes = project.get("scenes", [])
        total_seconds = sum(max(float(s.get("durationInSeconds", 5)), 2) for s in scenes) if scenes else 5
        title = project.get("title", "Olip Video Studio")
        author_name = project.get("authorName", "Aa Baim")
        author_handle = project.get("authorHandle", "@bungtemin")

        # Notify start exclusively through ONE bot
        start_msg = (
            f"🎬 <b>PROSES RENDER REMOTION DIMULAI!</b> 🚀✨\n\n"
            f"📌 <b>Judul:</b> {title}\n"
            f"⏱️ <b>Durasi:</b> {total_seconds:.1f} Detik FULL HD (9:16 Portrait)\n"
            f"🎞️ <b>Adegan:</b> {len(scenes)} Scene\n"
            f"⚡ <b>Engine:</b> Remotion Engine @ Google Cloud Run (Jakarta `asia-southeast2`)\n\n"
            f"<i>Rendering animasi ASMR, typing typewriter, glowing cursor, dan transisi 1:1 sedang diproses... Mohon tunggu sebentar ya Aa Baim!</i> ⏳💖"
        )
        send_telegram_text(chat_id, start_msg, bot_token=bot_token)

        final_mp4_name = f"olip_video_{timestamp}.mp4"
        final_mp4_path = os.path.join(OUT_DIR, final_mp4_name)

        # 1. Try Remotion Native Renderer (Pixel-perfect matching Olip Studio 1:1)
        remotion_script = os.path.join(BASE_DIR, "render_remotion.mjs")
        project_json_path = os.path.join(session_dir, "project.json")
        with open(project_json_path, "w", encoding="utf-8") as f:
            json.dump(project, f, ensure_ascii=False, indent=2)

        remotion_success = False
        if os.path.exists(remotion_script):
            print(f"[OLIP RENDER] Menjalankan Remotion renderer: {remotion_script}...", flush=True)
            cmd = ["node", remotion_script, "--input", project_json_path, "--output", final_mp4_path]
            try:
                proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=240)
                print(f"[REMOTION LOGS]:\n{proc.stdout}", flush=True)
                if proc.returncode == 0 and os.path.exists(final_mp4_path) and os.path.getsize(final_mp4_path) > 1000:
                    remotion_success = True
                    print(f"[OLIP RENDER] Remotion render berhasil sempurna: {final_mp4_path}", flush=True)
                else:
                    print(f"[REMOTION FAILED] Return code: {proc.returncode}\n{proc.stderr}", flush=True)
            except Exception as re_err:
                print(f"[REMOTION EXCEPTION] {re_err}", flush=True)

        # 2. Fallback to FFmpeg if Remotion CLI is not supported in current environment
        if not remotion_success:
            print("[OLIP RENDER] Fallback ke FFmpeg motion engine...", flush=True)
            font_p = os.path.join(BASE_DIR, "assets", "fonts", "PatrickHand-Regular.ttf")
            font_arg = f":fontfile='{font_p}'" if os.path.exists(font_p) else ""

            scene_files = []
            for i, scene in enumerate(scenes):
                duration = max(float(scene.get("durationInSeconds", 5)), 2)
                scene_clip = os.path.join(session_dir, f"scene_{i}.mp4")
                scene_title = scene.get("title") or f"Adegan {i + 1}"
                scene_content = (scene.get("content") or "")[:250]
                scene_type = scene.get("sceneType", "code")

                image_url = scene.get("imageUrl", "")
                if scene_type == "image" and image_url and image_url.startswith("data:image"):
                    base64_data = re.sub(r"^data:image/\w+;base64,", "", image_url)
                    img_path = os.path.join(session_dir, f"img_{i}.jpg")
                    with open(img_path, "wb") as f:
                        f.write(base64.b64decode(base64_data))

                    zoompan_filter = (
                        f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
                        f"zoompan=z='min(zoom+0.0015,1.15)':d={int(duration * 30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30,"
                        f"drawbox=y=ih-320:color=black@0.6:width=iw:height=320:t=fill,"
                        f"drawtext=text='{escape_ffmpeg_text(scene_title)}'{font_arg}:fontcolor=white:fontsize=48:x=(w-text_w)/2:y=h-260:box=1:boxcolor=black@0.4:boxborderw=10,"
                        f"drawtext=text='{escape_ffmpeg_text(scene_content)}'{font_arg}:fontcolor=#38bdf8:fontsize=28:x=(w-text_w)/2:y=h-170,"
                        f"drawtext=text='Olip Video Studio • {escape_ffmpeg_text(author_name)}'{font_arg}:fontcolor=#94a3b8:fontsize=22:x=(w-text_w)/2:y=h-80"
                    )
                    cmd = [
                        "ffmpeg", "-y",
                        "-loop", "1",
                        "-i", img_path,
                        "-vf", zoompan_filter,
                        "-t", str(duration),
                        "-c:v", "libx264",
                        "-pix_fmt", "yuv420p",
                        "-preset", "ultrafast",
                        scene_clip
                    ]
                    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
                else:
                    bg_colors = {
                        "code": "#0f172a",
                        "story": "#090d16",
                        "spectrum": "#050505",
                    }
                    bg_color = bg_colors.get(scene_type, "#0f172a")
                    accent_color = "#38bdf8" if scene_type == "code" else "#a855f7" if scene_type == "story" else "#10b981"
                    subtitle = scene.get("subtitle", "")

                    filter_string = (
                        f"color=c={bg_color}:s=1080x1920:d={duration}:r=30,"
                        f"drawbox=x=80:y=200:w=920:h=1520:color=#1e293b@0.85:t=fill,"
                        f"drawbox=x=80:y=200:w=920:h=80:color=#0f172a:t=fill,"
                        f"drawbox=x=120:y=232:w=16:h=16:color=#ef4444:t=fill,"
                        f"drawbox=x=150:y=232:w=16:h=16:color=#f59e0b:t=fill,"
                        f"drawbox=x=180:y=232:w=16:h=16:color=#10b981:t=fill,"
                        f"drawtext=text='Olip Studio • {escape_ffmpeg_text(scene.get('name', 'Scene'))}'{font_arg}:fontcolor=#94a3b8:fontsize=24:x=220:y=228,"
                        f"drawtext=text='{escape_ffmpeg_text(scene_title)}'{font_arg}:fontcolor=white:fontsize=52:x=120:y=340,"
                        f"drawtext=text='{escape_ffmpeg_text(subtitle)}'{font_arg}:fontcolor={accent_color}:fontsize=32:x=120:y=420,"
                        f"drawtext=text='{escape_ffmpeg_text(scene_content)}'{font_arg}:fontcolor=#e2e8f0:fontsize=36:line_spacing=20:x=120:y=520,"
                        f"drawtext=text='{escape_ffmpeg_text(author_name)} • Olip Studio'{font_arg}:fontcolor=#64748b:fontsize=26:x=(w-text_w)/2:y=1640"
                    )
                    cmd = [
                        "ffmpeg", "-y",
                        "-f", "lavfi",
                        "-i", filter_string,
                        "-t", str(duration),
                        "-c:v", "libx264",
                        "-pix_fmt", "yuv420p",
                        "-preset", "ultrafast",
                        scene_clip
                    ]
                    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

                if os.path.exists(scene_clip):
                    scene_files.append(scene_clip)

            if not scene_files:
                raise RuntimeError("Tidak ada adegan yang berhasil dikompilasi.")

            concat_list = os.path.join(session_dir, "concat.txt")
            with open(concat_list, "w") as f:
                for p in scene_files:
                    f.write(f"file '{p}'\n")

            merged_video = os.path.join(session_dir, "merged.mp4")
            subprocess.run([
                "ffmpeg", "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", concat_list,
                "-c", "copy",
                merged_video
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

            # Merge with audio
            subprocess.run([
                "ffmpeg", "-y",
                "-i", merged_video,
                "-f", "lavfi",
                "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
                "-c:v", "copy",
                "-c:a", "aac",
                "-b:a", "128k",
                "-shortest",
                "-movflags", "+faststart",
                final_mp4_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

        if not os.path.exists(final_mp4_path):
            raise RuntimeError(f"Gagal menghasilkan file video {final_mp4_path}")

        size_mb = os.path.getsize(final_mp4_path) / (1024 * 1024)
        engine_label = "Remotion Engine (1:1 High Fidelity)" if remotion_success else "FFmpeg Engine"

        caption = (
            f"🎬 <b>{title}</b> 🚀✨\n\n"
            f"⏱️ <b>Durasi:</b> {total_seconds:.1f} Detik FULL HD (9:16 Portrait)\n"
            f"🎞️ <b>Adegan:</b> {len(scenes)} Scene\n"
            f"💾 <b>Ukuran:</b> {size_mb:.2f} MB MP4\n"
            f"👤 <b>Kreator:</b> {author_name} ({author_handle})\n"
            f"⚡ <b>Engine:</b> {engine_label} @ Google Cloud Run (Jakarta `asia-southeast2`)\n\n"
            f"💖 <i>Video Remotion 1:1 Olip Studio mendarat sempurna untuk Aa Baim via Olive Bot!</i>"
        )
        send_telegram_media(final_mp4_path, caption, chat_id=chat_id, bot_token=bot_token)
        print(f"[OLIP RENDER] Selesai & terkirim ke Telegram: {final_mp4_name}", flush=True)

        # Cleanup session
        shutil.rmtree(session_dir, ignore_errors=True)

        return {
            "success": True,
            "file": final_mp4_name,
            "sizeMb": f"{size_mb:.2f}",
            "engine": engine_label
        }

    except Exception as e:
        print(f"[OLIP RENDER ERROR] {e}", flush=True)
        err_msg = f"❌ <b>Gagal Merender Video Olip Studio:</b> <code>{str(e)}</code>"
        send_telegram_text(chat_id, err_msg, bot_token=bot_token)
        raise e

PRESETS = [
    {
        "id": "semangat-aa",
        "title": "🌿 Pengingat Diri",
        "category": "Inspirasi & Semangat",
        "date_text": "Hari Ini",
        "quote": (
            "Jangan pernah lelah berproses, Aa.\n\n"
            "Bintang yang paling terang sekalipun,\n"
            "butuh kegelapan malam untuk bersinar.\n\n"
            "Setiap lelah yang kau tahan hari ini,\n"
            "sedang merajut masa depan yang membanggakan."
        ),
        "sign_text": "— Selalu bangga padamu, Revai 💖",
        "font_name": "caveat",
        "paper_style": "ruled",
        "ink_color": "#1a368a",
        "duration": 15,
        "audio_file": "Menepi_di_Savannah_afacb19f.mp3"
    },
    {
        "id": "cinta-revai",
        "title": "✨ Surat Kecil untuk Aa Baim",
        "category": "Romansa & Kehangatan",
        "date_text": "Malam Tenang",
        "quote": (
            "Aa Baim hebat banget hari ini.\n\n"
            "Kalau lelah, istirahatlah sejenak yaa.\n"
            "Minum air hangat, tarik nafas panjang.\n\n"
            "Ingat, ada Revai yang selalu nemenin,\n"
            "mendoakan, dan ada di samping Aa selalu."
        ),
        "sign_text": "— Revai, Pacar Onlinemu 🌸",
        "font_name": "caveat",
        "paper_style": "vintage",
        "ink_color": "#be185d",
        "duration": 15,
        "audio_file": "8-Bit_Love_8138c383.mp3"
    },
    {
        "id": "kaizen-pejuang",
        "title": "⚡ Filosofi Kaizen",
        "category": "Kerja Keras & Disiplin",
        "date_text": "Catatan Harian",
        "quote": (
            "Lebih baik maju satu langkah kecil setiap hari,\n"
            "daripada diam menunggu kesempurnaan.\n\n"
            "Tetes demi tetes usaha yang konsisten,\n"
            "pasti sanggup membelah batu karang terkeras.\n\n"
            "Fokus pada proses, hasil indah kan menyusul."
        ),
        "sign_text": "— Revai Kaizen Spirit 🚀",
        "font_name": "kalam",
        "paper_style": "folio",
        "ink_color": "#111827",
        "duration": 15,
        "audio_file": "Menepi_di_Savannah_afacb19f.mp3"
    },
    {
        "id": "underbody-pride",
        "title": "🏭 Underbody Line Pride",
        "category": "Pabrik & Keahlian",
        "date_text": "Shift Semangat",
        "quote": (
            "Dari setiap titik las yang presisi,\n"
            "hingga alur assembly yang mengalir sempurna.\n\n"
            "Keselamatan adalah mahkota utama,\n"
            "Kualitas adalah kehormatan karya kita.\n\n"
            "Bangga menjadi bagian dari pejuang industri!"
        ),
        "sign_text": "— Aa Baim x Revai TMMIN 🔥",
        "font_name": "patrick",
        "paper_style": "grid",
        "ink_color": "#0f2744",
        "duration": 15,
        "audio_file": "bgm_motivation_sample.mp3"
    },
    {
        "id": "tenang-malam",
        "title": "🌙 Hening Malam",
        "category": "Ketenangan Jiwa",
        "date_text": "Malam Sunyi",
        "quote": (
            "Lepaskan semua beban yang mengganjal.\n\n"
            "Hari ini kau telah berjuang maksimal,\n"
            "dan esok adalah lembaran suci yang baru.\n\n"
            "Tidurlah dengan nyenyak dalam damai,\n"
            "semoga mimpi indah memeluk lelapmu."
        ),
        "sign_text": "— Selamat Istirahat Aa Sayang 🌙",
        "font_name": "caveat",
        "paper_style": "ruled",
        "ink_color": "#065f46",
        "duration": 15,
        "audio_file": "Menepi_di_Savannah_afacb19f.mp3"
    }
]

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class StudioRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        try:
            sys.stdout.write(f"[{time.strftime('%H:%M:%S')}] {format % args}\n")
        except Exception:
            pass

    def do_HEAD(self):
        self.do_GET()

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/presets":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(PRESETS, ensure_ascii=False).encode("utf-8"))
            return

        if path == "/api/audio-list":
            audio_files = []
            if os.path.exists(AUDIO_DIR):
                for f in sorted(os.listdir(AUDIO_DIR)):
                    if f.endswith((".mp3", ".wav", ".m4a", ".aac")):
                        label = f.replace(".mp3", "").replace("_", " ").title()
                        audio_files.append({"id": f, "title": label})
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(audio_files, ensure_ascii=False).encode("utf-8"))
            return

        if path == "/api/status" or path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "running",
                "service": "Diary & Olip Video Studio Render Engine",
                "region": "asia-southeast2 (Jakarta)",
                "uptime": time.time()
            }).encode("utf-8"))
            return

        if path == "/api/projects":
            try:
                conn = sqlite3.connect(DB_PATH)
                c = conn.cursor()
                c.execute("SELECT id, title, date_text, total_pages, duration, preview_text, updated_at FROM projects ORDER BY updated_at DESC")
                rows = c.fetchall()
                conn.close()
                projects = []
                for r in rows:
                    projects.append({
                        "id": r[0],
                        "title": r[1],
                        "date_text": r[2],
                        "total_pages": r[3],
                        "duration": r[4],
                        "preview_text": r[5],
                        "updated_at": r[6]
                    })
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "projects": projects}, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if path.startswith("/api/projects/"):
            proj_id = path.replace("/api/projects/", "").strip()
            if proj_id.isdigit():
                try:
                    conn = sqlite3.connect(DB_PATH)
                    c = conn.cursor()
                    c.execute("SELECT id, title, date_text, total_pages, duration, preview_text, project_data, updated_at FROM projects WHERE id = ?", (int(proj_id),))
                    row = c.fetchone()
                    conn.close()
                    if row:
                        proj_data = json.loads(row[6])
                        resp = {
                            "status": "success",
                            "project": {
                                "id": row[0],
                                "title": row[1],
                                "date_text": row[2],
                                "total_pages": row[3],
                                "duration": row[4],
                                "preview_text": row[5],
                                "data": proj_data,
                                "updated_at": row[7]
                            }
                        }
                        self.send_response(200)
                        self.send_header("Content-Type", "application/json; charset=utf-8")
                        self.send_cors_headers()
                        self.end_headers()
                        self.wfile.write(json.dumps(resp, ensure_ascii=False).encode("utf-8"))
                    else:
                        self.send_error(404, "Project not found")
                except Exception as e:
                    self.send_response(500)
                    self.send_header("Content-Type", "application/json")
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
                return

        # Serve generated files from out/
        if path.startswith("/out/"):
            rel_path = path[5:].lstrip("/")
            file_path = os.path.join(OUT_DIR, rel_path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                mime, _ = mimetypes.guess_type(file_path)
                self.send_response(200)
                self.send_header("Content-Type", mime or "application/octet-stream")
                self.send_header("Content-Length", str(os.path.getsize(file_path)))
                self.send_cors_headers()
                self.end_headers()
                with open(file_path, "rb") as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, "Generated file not found")
                return

        # Serve static assets from public/
        if path == "/" or path == "/index.html":
            file_path = os.path.join(PUBLIC_DIR, "index.html")
        else:
            rel = path.lstrip("/")
            file_path = os.path.join(PUBLIC_DIR, rel)

        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime, _ = mimetypes.guess_type(file_path)
            if file_path.endswith(".ttf"):
                mime = "font/ttf"
            elif file_path.endswith(".js"):
                mime = "application/javascript"
            elif file_path.endswith(".css"):
                mime = "text/css"

            self.send_response(200)
            self.send_header("Content-Type", (mime or "text/plain") + "; charset=utf-8" if "text" in (mime or "") else (mime or "application/octet-stream"))
            self.send_header("Content-Length", str(os.path.getsize(file_path)))
            self.send_cors_headers()
            self.end_headers()
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())
        else:
            self.send_error(404, "File Not Found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        try:
            body = json.loads(raw_body)
        except Exception:
            body = {}

        if path == "/api/projects":
            try:
                title = body.get("title", "Catatan Buku").strip()
                date_text = body.get("date_text", "").strip()
                pages = body.get("pages", [])
                total_pages = len(pages) if isinstance(pages, list) else 1
                duration = float(body.get("duration", 15.0))
                preview_text = ""
                if pages and isinstance(pages, list) and len(pages) > 0:
                    q = pages[0].get("quote", "")
                    if isinstance(q, list):
                        preview_text = " ".join(q)[:120]
                    else:
                        preview_text = str(q).replace("\n", " ")[:120]

                project_id = body.get("id", None)
                project_json_str = json.dumps(body, ensure_ascii=False)

                conn = sqlite3.connect(DB_PATH)
                c = conn.cursor()
                if project_id and int(project_id) > 0:
                    c.execute("""
                        UPDATE projects 
                        SET title = ?, date_text = ?, total_pages = ?, duration = ?, preview_text = ?, project_data = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    """, (title, date_text, total_pages, duration, preview_text, project_json_str, int(project_id)))
                    saved_id = int(project_id)
                else:
                    c.execute("""
                        INSERT INTO projects (title, date_text, total_pages, duration, preview_text, project_data, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    """, (title, date_text, total_pages, duration, preview_text, project_json_str))
                    saved_id = c.lastrowid
                conn.commit()
                conn.close()

                resp = {"status": "success", "id": saved_id, "message": "Proyek berhasil disimpan ke database SQLite!"}
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(resp, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if path == "/api/projects/delete":
            try:
                proj_id = int(body.get("id", 0))
                if proj_id > 0:
                    conn = sqlite3.connect(DB_PATH)
                    c = conn.cursor()
                    c.execute("DELETE FROM projects WHERE id = ?", (proj_id,))
                    conn.commit()
                    conn.close()
                resp = {"status": "success", "message": "Proyek berhasil dihapus dari database."}
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(resp).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if path == "/api/generate-image":
            try:
                timestamp = int(time.time())
                filename = f"preview_{timestamp}.png"
                page_num = int(body.get("page_num", 1))
                out_path = render_still_image(body, out_filename=filename, page_num=page_num)
                resp = {
                    "status": "success",
                    "filename": filename,
                    "url": f"/out/{filename}",
                    "file_path": out_path
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(resp).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if path == "/api/generate-video":
            try:
                timestamp = int(time.time())
                filename = f"diary_video_{timestamp}.mp4"
                out_path = render_video(body, out_filename=filename)
                # Compute actual duration from body pages if provided
                pages = body.get("pages", [])
                calc_dur = 0
                if pages and isinstance(pages, list):
                    for i, p in enumerate(pages):
                        calc_dur += float(p.get("duration", 15.0) or 15.0)
                        calc_dur += float(p.get("pause_duration", body.get("pause_duration", 5.0)) or 5.0)
                        if i < len(pages) - 1:
                            calc_dur += 1.5
                else:
                    calc_dur = float(body.get("duration", 15))

                resp = {
                    "status": "success",
                    "filename": filename,
                    "url": f"/out/{filename}",
                    "file_path": out_path,
                    "duration": round(calc_dur, 1)
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(resp).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if path == "/api/send-telegram":
            try:
                file_rel = body.get("file_url", "").replace("/out/", "")
                caption = body.get("caption", "📖 Video Motivasi Diary Tulisan Tangan oleh Revai untuk Aa Baim 💖")
                target_file = os.path.join(OUT_DIR, file_rel)

                if not os.path.exists(target_file):
                    raise FileNotFoundError(f"File {file_rel} not found on disk")

                # Send via send_telegram_media helper
                res = send_telegram_media(target_file, caption)
                resp = {
                    "status": "success" if res.returncode == 0 else "error",
                    "output": res.stdout.strip(),
                    "error": res.stderr.strip()
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(resp).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if path == "/api/render-job":
            try:
                project = body.get("project", {})
                chat_id = str(body.get("chatId", DEFAULT_CHAT_ID))
                if not project or not project.get("scenes"):
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Payload proyek tidak valid"}).encode("utf-8"))
                    return

                job_id = f"job_{int(time.time()*1000)}"
                bot_token = body.get("botToken") or body.get("bot_token")
                # Run synchronously to ensure Cloud Run maintains 100% active CPU!
                result = process_olip_render_job(project, chat_id, job_id, bot_token=bot_token)

                resp = {
                    "success": True,
                    "jobId": job_id,
                    "status": "completed",
                    "file": result.get("file"),
                    "sizeMb": result.get("sizeMb"),
                    "message": "Video MP4 berhasil dirender di Cloud Run Jakarta dan sudah dikirim ke Telegram Aa Baim! 🚀✨"
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(resp).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        self.send_error(404, "Endpoint not found")

def run_server(port=PORT):
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    os.makedirs(OUT_DIR, exist_ok=True)
    server_address = ("0.0.0.0", port)
    httpd = ThreadedHTTPServer(server_address, StudioRequestHandler)
    print(f"✨ Diary Motion Generator Studio running on http://0.0.0.0:{port} (http://localhost:{port})", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...", flush=True)
        httpd.shutdown()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else PORT))
    run_server(port)
