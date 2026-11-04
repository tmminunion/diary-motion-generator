#!/usr/bin/env bash
# ==============================================================================
# Diary Motion CLI v2.1 - Generator Video Kebetan Buku Catatan 9:16
# Author: Revai for Aa Baim
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PYTHONPATH="$DIR"

QUOTE_P1="${1:-"Jangan pernah lelah berproses, Aa.\nBintang butuh kegelapan malam untuk bersinar."}"
QUOTE_P2=""
DURATION=15
FONT="caveat"
PAPER="ruled"
INK="#1a368a"
BG="meja_kayu"
AUDIO="Menepi_di_Savannah_afacb19f.mp3"
IS_TWO_PAGE=false
SEND_TG=false

shift || true
while [[ $# -gt 0 ]]; do
  case "$1" in
    --page2|-p2)
      QUOTE_P2="$2"
      IS_TWO_PAGE=true
      shift 2
      ;;
    --duration|-d)
      DURATION="$2"
      shift 2
      ;;
    --font|-f)
      FONT="$2"
      shift 2
      ;;
    --paper|-p)
      PAPER="$2"
      shift 2
      ;;
    --ink|-i)
      INK="$2"
      shift 2
      ;;
    --bg|-b)
      BG="$2"
      shift 2
      ;;
    --audio|-a)
      AUDIO="$2"
      shift 2
      ;;
    --send|-s)
      SEND_TG=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -n "$QUOTE_P2" ]]; then
  IS_TWO_PAGE=true
fi

echo "📖 Diary Motion Generator CLI v2.1"
echo "──────────────────────────────────────────"
echo "✍️  Hal 1     : $(echo -e "$QUOTE_P1" | head -n 1)..."
if [[ "$IS_TWO_PAGE" == "true" ]]; then
  echo "📑 Hal 2     : $(echo -e "$QUOTE_P2" | head -n 1)... (Mode Kebetan)"
fi
echo "⏳ Durasi    : ${DURATION}s"
echo "🖋️  Font      : $FONT"
echo "📜 Paper     : $PAPER (No punch hole, pure book)"
echo "🎨 Ink       : $INK"
echo "🪵 Background: $BG"
echo "🎵 Audio     : $AUDIO"
echo "──────────────────────────────────────────"

python3 - <<EOF
import json
import os
import sys
from engine import render_video

q1_raw = """$QUOTE_P1"""
q2_raw = """$QUOTE_P2"""

q1_lines = [l.strip() for l in q1_raw.split("\\n") if l.strip()]
q2_lines = [l.strip() for l in q2_raw.split("\\n") if l.strip()]

config = {
    "title": "🌿 Catatan Pengingat Diri",
    "date_text": "Rabu, 04 November 2026",
    "quote_page1": q1_lines,
    "quote_page2": q2_lines,
    "sign_text": "— Selalu bangga padamu, Revai 💖",
    "font_name": "$FONT",
    "paper_style": "$PAPER",
    "ink_color": "$INK",
    "bg_scene": "$BG",
    "is_two_page": "$IS_TWO_PAGE" == "true",
    "duration": $DURATION,
    "audio_file": "$AUDIO",
    "has_header": True,
    "has_signature": True,
    "has_watermark": True
}

out_name = f"cli_diary_{os.getpid()}.mp4"
video_path = render_video(config, out_filename=out_name)
print(f"OUTPUT_VIDEO_PATH={video_path}")

if "$SEND_TG" == "true":
    tg_script = "/data/data/com.termux/files/home/send_telegram.sh"
    caption = f"📖 Catatan Motivasi Diary 9:16 (Kebetan Mode)\\n\\n\"{q1_lines[0]}\"\\n\\n— Revai untuk Aa Baim 💖"
    import subprocess
    print("✈️ Mengirim video ke Telegram Aa Baim...")
    res = subprocess.run([tg_script, "video", video_path, caption], capture_output=True, text=True)
    if res.returncode == 0:
        print("✅ Berhasil terkirim ke Telegram!")
    else:
        print("❌ Gagal kirim Telegram:", res.stderr)
EOF
