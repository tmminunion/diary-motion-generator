# AGENTS.md — Diary Motion Generator (Diary Studio)

Panduan singkat untuk AI agent (Claude, Gemini, Cursor, Antigravity, dll) yang bekerja di repo ini.
Pemilik: Aa Baim (@BUNGTEMIN). Bahasa komunikasi default: Indonesia.

## Ringkasan
Dua fungsi dalam satu repo:
1. **Diary Studio** — web studio video diary 9:16 (engine Python: PIL + FFmpeg), UI di `public/`.
2. **Render worker Remotion** — menerima job dari `olip-video-studio` dan merender template Remotion jadi MP4
   lalu mengirim ke Telegram.

| Item | Nilai |
|---|---|
| Repo | https://github.com/tmminunion/diary-motion-generator |
| Repo saudara (sumber template) | https://github.com/BUNGTEMIN/olip-video-studio |
| Port lokal (Termux) | 8089 (`./start_diary_studio.sh`) |
| Port Cloud Run | 8080 (env `PORT`) |
| Cloud Run service | `diary-studio`, region `asia-southeast2` (Jakarta), project `qcc-online` |
| URL | https://diary-studio-280833756345.asia-southeast2.run.app |
| Lokasi di Termux | `~/diary-motion-generator` |

## Peta folder
- `server.py` — HTTP server + REST API.
- `engine.py` — engine render diary (PIL + FFmpeg raw pipe, multi-page, page flip, stempel, emoji).
- `render_remotion.mjs` — script render Remotion (dipanggil server.py untuk job template).
- `src/remotion/**`, `src/types/editor.ts` — **SALINAN** dari olip-video-studio. Jangan diedit di sini.
- `public/` — frontend studio (`index.html`, `app.js`, `style.css`, `stickers/`).
- `assets/` — background, font, audio, `emoji/` (aset emoji untuk engine).
- `data/` — database SQLite proyek (tidak di-commit). `out/` — hasil render (tidak di-commit).
- `Dockerfile` — image Cloud Run (Node 20 + Python 3 + ffmpeg + chromium; pre-bundle Remotion).
- `start_diary_studio.sh` — daemon lokal Termux (wake-lock, port 8089).

## API (server.py)
GET: `/health` & `/api/status`, `/api/presets`, `/api/audio-list`, `/api/projects`, `/api/projects/<id>`, `/api/job-status`, `/out/<file>`
POST: `/api/projects`, `/api/projects/delete`, `/api/generate-image`, `/api/generate-video`, `/api/send-telegram`,
`/api/render-job` (job dari olip; `stream:true` memberi progres NDJSON)

## Environment variable
| Nama | Fungsi |
|---|---|
| `PORT` | Port server (Cloud Run = 8080, Termux = 8089) |
| `TELEGRAM_BOT_TOKEN` | Token bot untuk kirim hasil render |
| `TELEGRAM_CHAT_ID` | Chat tujuan default |

Nilai secret JANGAN pernah ditulis ke repo/dokumen. Di Cloud Run sudah terpasang sebagai env var service;
`gcloud run deploy` berikutnya mempertahankannya.

## Alur kerja perubahan template (parity)
1. Edit template di `olip-video-studio` (bukan di sini).
2. Di olip: `npm run sync:diary` → harus muncul "Parity OK" (`npm run check:parity`).
3. Commit & push olip, lalu commit & push repo ini.
4. Deploy ke Cloud Run (di bawah).

## Deploy ke Google Cloud Run
Prasyarat: `gcloud auth list` aktif, `gcloud config get project` = `qcc-online`.
```bash
cd ~/diary-motion-generator
gcloud run deploy diary-studio \
  --source . \
  --region asia-southeast2 \
  --cpu 2 --memory 2Gi \
  --concurrency 1 --timeout 300 \
  --max-instances 2 --cpu-boost \
  --allow-unauthenticated
```
Konfigurasi live saat ini: 2 vCPU, 2Gi, concurrency 1, timeout 300s, maxScale 2, startup CPU boost.
Cek hasil: `curl https://diary-studio-280833756345.asia-southeast2.run.app/health`
Log: `gcloud run services logs read diary-studio --region asia-southeast2 --limit 50`

## Menjalankan lokal (Termux)
```bash
./start_diary_studio.sh        # http://localhost:8089
tail -f server.log
```

## Catatan untuk agent
- Render pakai `.dockerignore`/`.gcloudignore`; periksa keduanya bila file tidak ikut ter-deploy.
- File `*.bak*`, `engine_old.py`, `out/*.mp4`, `data/*.db`, `server.log` jangan di-commit.
- Jangan menjalankan banyak render bersamaan di Termux (RAM terbatas).
- Jangan menulis token/secret ke file apa pun yang masuk git.
