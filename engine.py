#!/usr/bin/env python3
"""
Diary Motion Generator - Core Engine v2.1 (Turbo Optimized)
- Clean book styling (NO punch holes, NO red margin)
- Realistic multi-page support with animated page-flip / kebetan buku
- Flexible background scenes (Meja Kayu, Kafe, Modern, Kamar Malam, Taman)
- 9:16 Vertical Video (1080x1920) with PIL + FFmpeg pipe
- Pre-cached static layers for maximum render speed (>20 FPS)
"""

import math
import os
import subprocess
import sys
import time
from datetime import datetime
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(BASE_DIR, "assets", "fonts")
AUDIO_DIR = os.path.join(BASE_DIR, "assets", "audio")
BG_DIR = os.path.join(BASE_DIR, "assets", "backgrounds")
OUT_DIR = os.path.join(BASE_DIR, "out")

WIDTH = 1080
HEIGHT = 1920
FPS = 30

FONT_MAP = {
    "caveat": os.path.join(FONTS_DIR, "Caveat-Bold.ttf"),
    "kalam": os.path.join(FONTS_DIR, "Kalam-Bold.ttf"),
    "patrick": os.path.join(FONTS_DIR, "PatrickHand-Regular.ttf")
}

BG_MAP = {
    "meja_kayu": os.path.join(BG_DIR, "meja_kayu.jpg"),
    "meja_kafe": os.path.join(BG_DIR, "meja_kafe.jpg"),
    "meja_modern": os.path.join(BG_DIR, "meja_modern.jpg"),
    "kamar_malam": os.path.join(BG_DIR, "kamar_malam.jpg"),
    "meja_taman": os.path.join(BG_DIR, "meja_taman.jpg")
}

def hex_to_rgb(hex_code, alpha=255):
    hex_code = hex_code.lstrip('#')
    if len(hex_code) == 3:
        hex_code = ''.join(c * 2 for c in hex_code)
    rgb = tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
    return (*rgb, alpha)

def get_font(name_or_key, size):
    font_path = FONT_MAP.get(name_or_key.lower(), FONT_MAP["caveat"])
    if not os.path.exists(font_path):
        font_path = FONT_MAP["caveat"]
    return ImageFont.truetype(font_path, size)

def ease_in_out(t):
    return 0.5 - 0.5 * math.cos(math.pi * t)

def load_background_scene(scene_key):
    """Loads atmospheric background scene image or fallback."""
    bg_path = BG_MAP.get(scene_key, BG_MAP["meja_kayu"])
    if os.path.exists(bg_path):
        return Image.open(bg_path).convert("RGBA")
    
    img = Image.new("RGBA", (WIDTH, HEIGHT), (24, 18, 22, 255))
    draw = ImageDraw.Draw(img)
    for r in range(800, 100, -50):
        a = int(30 * (1 - r / 800.0))
        draw.ellipse([WIDTH // 2 - r, 300 - r, WIDTH // 2 + r, 300 + r], fill=(255, 215, 160, a))
    return img

def prebuild_desk_with_shadow(bg_img):
    """Pre-renders the desk with the notebook drop-shadow once."""
    out = bg_img.copy()
    sheet_w, sheet_h = 960, 1580
    sx, sy = (WIDTH - sheet_w) // 2, 170

    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle([sx + 8, sy + 16, sx + sheet_w + 8, sy + sheet_h + 16], radius=24, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(26))
    out.alpha_composite(shadow)
    return out

def prebuild_page_base(desk_img, config, page_num=1):
    """
    Pre-renders the static notebook paper base:
    NO punch holes, NO red margin, pure book spine & ruled lines.
    Returns: (base_image, start_x, start_y, line_spacing, max_x)
    """
    out = desk_img.copy()
    paper_style = config.get("paper_style", "ruled")
    line_spacing = config.get("line_spacing", 56)
    has_header = config.get("has_header", True)
    title = config.get("title", "🌿 Catatan Pengingat Diri")
    date_text = config.get("date_text", datetime.now().strftime("%A, %d %B %Y"))

    sheet_w, sheet_h = 960, 1580
    sx, sy = (WIDTH - sheet_w) // 2, 170

    paper_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(paper_layer)

    if paper_style == "vintage":
        paper_bg = (245, 235, 215, 255)
        paper_outline = (210, 195, 170, 255)
        line_col = (180, 160, 140, 120)
    elif paper_style == "grid":
        paper_bg = (253, 252, 248, 255)
        paper_outline = (225, 220, 205, 255)
        line_col = (186, 210, 235, 110)
    elif paper_style == "folio":
        paper_bg = (252, 251, 246, 255)
        paper_outline = (220, 215, 200, 255)
        line_col = (147, 197, 253, 130)
    elif paper_style == "clean":
        paper_bg = (254, 253, 250, 255)
        paper_outline = (225, 222, 210, 255)
        line_col = (0, 0, 0, 0)
    else:  # ruled default
        paper_bg = (252, 250, 242, 255)
        paper_outline = (220, 215, 200, 255)
        line_col = (147, 197, 253, 130)

    # 1. Main Sheet Shape
    pdraw.rounded_rectangle([sx, sy, sx + sheet_w, sy + sheet_h], radius=24, fill=paper_bg, outline=paper_outline, width=2)

    # 2. Book Spine Crease on Left
    spine_x = sx + 24
    pdraw.line([(spine_x, sy + 15), (spine_x, sy + sheet_h - 15)], fill=(180, 170, 155, 90), width=3)
    pdraw.line([(spine_x + 2, sy + 15), (spine_x + 2, sy + sheet_h - 15)], fill=(255, 255, 255, 140), width=2)
    for stitch_y in range(sy + 80, sy + sheet_h - 60, 110):
        pdraw.line([(sx + 8, stitch_y), (sx + 20, stitch_y)], fill=(140, 125, 110, 160), width=2)

    # 3. Ruled Lines (NO red margin)
    line_y_start = sy + 180
    line_y_end = sy + sheet_h - 90
    text_start_x = sx + 75
    text_max_x = sx + sheet_w - 75

    if paper_style == "grid":
        grid_step = 40
        for gx in range(sx + 20, sx + sheet_w - 20, grid_step):
            pdraw.line([(gx, line_y_start - 40), (gx, line_y_end)], fill=line_col, width=1)
        for gy in range(line_y_start - 40, line_y_end, grid_step):
            pdraw.line([(sx + 20, gy), (sx + sheet_w - 20, gy)], fill=line_col, width=1)
    elif paper_style != "clean":
        for ly in range(line_y_start, line_y_end, line_spacing):
            pdraw.line([(sx + 25, ly), (sx + sheet_w - 25, ly)], fill=line_col, width=2)

    # 4. Header & Page pill
    if has_header:
        f_title = get_font("kalam", 32)
        f_date = get_font("patrick", 26)
        f_pg = get_font("patrick", 22)

        page_title = title if page_num == 1 else f"{title} (Hal. 2)"
        pdraw.text((text_start_x, sy + 75), page_title, font=f_title, fill=(71, 85, 105, 240))

        date_str = date_text
        dw = int(pdraw.textlength(date_str, font=f_date))
        pdraw.text((sx + sheet_w - dw - 60, sy + 78), date_str, font=f_date, fill=(100, 116, 139, 220))

        pg_str = f"Hal. {page_num}"
        pw = int(pdraw.textlength(pg_str, font=f_pg))
        pdraw.text((sx + sheet_w - pw - 45, sy + sheet_h - 60), pg_str, font=f_pg, fill=(148, 163, 184, 180))

    out.alpha_composite(paper_layer)
    return out, text_start_x, line_y_start, line_spacing, text_max_x

def draw_text_on_page(base_img, config, quote_lines, start_x, start_y, line_spacing, sign_text="", reveal_chars=None, is_final=False):
    """
    Blits handwriting text onto the pre-rendered page base.
    Ultra-fast execution per frame.
    """
    out = base_img.copy()
    draw = ImageDraw.Draw(out)

    font_name = config.get("font_name", "caveat")
    font_size = int(config.get("font_size", 46))
    ink_hex = config.get("ink_color", "#1a368a")
    ink_color = hex_to_rgb(ink_hex, 245)

    f_quote = get_font(font_name, font_size)
    f_sign = get_font(font_name, int(font_size * 0.85))
    f_watermark = get_font("patrick", 20)

    total_chars = sum(len(l) for l in quote_lines if l.strip())
    chars_to_show = total_chars if reveal_chars is None else reveal_chars

    curr_y = start_y - 12
    chars_counted = 0
    pen_pos = None

    for line in quote_lines:
        if not line.strip():
            curr_y += line_spacing
            continue

        line_len = len(line)
        if chars_counted + line_len <= chars_to_show:
            draw.text((start_x, curr_y), line, font=f_quote, fill=ink_color)
            chars_counted += line_len
            pen_pos = (start_x + int(draw.textlength(line, font=f_quote)), curr_y + 15)
        elif chars_counted < chars_to_show:
            p_count = chars_to_show - chars_counted
            p_text = line[:p_count]
            draw.text((start_x, curr_y), p_text, font=f_quote, fill=ink_color)
            chars_counted += p_count
            pen_pos = (start_x + int(draw.textlength(p_text, font=f_quote)), curr_y + 15)
            curr_y += line_spacing
            break
        else:
            curr_y += line_spacing
            break

        curr_y += line_spacing

    has_signature = config.get("has_signature", True)
    if has_signature and sign_text.strip() and (reveal_chars is None or reveal_chars >= total_chars):
        draw.text((start_x + 120, curr_y + 35), sign_text, font=f_sign, fill=(190, 24, 93, 240))

    if config.get("has_watermark", True):
        wm_text = config.get("watermark", "📖 DIARY MOTIVATION • REVAI")
        draw.text((WIDTH // 2 - 140, HEIGHT - 75), wm_text, font=f_watermark, fill=(148, 163, 184, 180))

    return out, pen_pos

def parse_quote_input(quote_input):
    if isinstance(quote_input, list):
        return quote_input
    if isinstance(quote_input, str):
        return [l.strip() for l in quote_input.strip().split("\n")]
    return ["Jangan pernah lelah berproses, Aa."]

def get_normalized_pages(config):
    """
    Parses pages array or falls back to legacy quote_page1 and quote_page2.
    Returns list of dicts: [{"id": 1, "quote": [...], "sign": "..."}]
    """
    pages_input = config.get("pages", None)
    if pages_input and isinstance(pages_input, list) and len(pages_input) > 0:
        pages = []
        for i, p in enumerate(pages_input):
            if isinstance(p, dict):
                pages.append({
                    "id": i + 1,
                    "quote": parse_quote_input(p.get("quote", "")),
                    "sign": p.get("sign", "")
                })
            elif isinstance(p, str):
                pages.append({
                    "id": i + 1,
                    "quote": parse_quote_input(p),
                    "sign": ""
                })
        return pages

    # Fallback to legacy 2-page or 1-page structure
    quote_1 = parse_quote_input(config.get("quote_page1", config.get("quote", [])))
    quote_2 = parse_quote_input(config.get("quote_page2", []))
    sign_text = config.get("sign_text", "— Revai 💖")
    has_p2 = config.get("is_two_page", False) or bool(quote_2 and any(l.strip() for l in quote_2))

    pages = [{
        "id": 1,
        "quote": quote_1,
        "sign": "" if has_p2 else sign_text
    }]
    if has_p2:
        pages.append({
            "id": 2,
            "quote": quote_2 or ["Tetaplah melangkah dengan senyuman."],
            "sign": sign_text
        })
    return pages

def draw_overlays_and_stickers(img, config):
    """
    Renders professional stamps, washi tape, polaroids, and cinematic overlays.
    """
    overlays = config.get("overlays", {})
    if not overlays or not isinstance(overlays, dict):
        # Check direct keys
        stamp_type = config.get("stamp_type", "none")
        tape_type = config.get("tape_type", "none")
        photo_type = config.get("photo_type", "none")
        filter_type = config.get("filter_type", "none")
    else:
        stamp_type = overlays.get("stamp", "none")
        tape_type = overlays.get("tape", "none")
        photo_type = overlays.get("photo", "none")
        filter_type = overlays.get("filter", "none")

    sheet_w, sheet_h = 960, 1580
    sx, sy = (WIDTH - sheet_w) // 2, 170

    draw = ImageDraw.Draw(img)

    # 1. Washi Tape (Decorative Tape across top corner)
    if tape_type and tape_type != "none":
        tape_colors = {
            "pink": (244, 114, 182, 175),
            "kraft": (214, 180, 137, 180),
            "grid": (226, 232, 240, 190)
        }
        col = tape_colors.get(tape_type, tape_colors["pink"])
        # Tape at top-left holding page
        tx, ty = sx + 80, sy + 30
        tw, th = 110, 36
        draw.polygon([
            (tx - 6, ty - 6),
            (tx + tw + 4, ty - 12),
            (tx + tw + 2, ty + th - 10),
            (tx - 8, ty + th - 4)
        ], fill=col)
        # Subtle tape edge line
        draw.line([(tx - 6, ty - 6), (tx + tw + 4, ty - 12)], fill=(255, 255, 255, 120), width=1)

    # 2. Polaroid Photo Sticker
    if photo_type and photo_type != "none":
        # Load avatar or custom photo
        avatar_path = os.path.join(BASE_DIR, "assets", "stickers", "revai_avatar.png")
        if os.path.exists(avatar_path):
            try:
                av = Image.open(avatar_path).convert("RGBA")
                # Scale down for cute polaroid
                av = av.resize((140, 140), Image.Resampling.LANCZOS)
                pw, ph = 160, 190
                px, py = sx + sheet_w - 210, sy + 130
                # Polaroid white backing
                draw.rounded_rectangle([px - 4, py - 4, px + pw + 4, py + ph + 4], radius=6, fill=(255, 255, 255, 240), outline=(226, 232, 240, 200), width=1)
                img.alpha_composite(av, (px + 10, py + 10))
                # Cute caption below polaroid
                f_pola = get_font("patrick", 16)
                draw.text((px + 38, py + 160), "Revai 💖", font=f_pola, fill=(71, 85, 105, 220))
                # Washi tape on top of polaroid
                draw.polygon([
                    (px + 40, py - 12),
                    (px + 115, py - 14),
                    (px + 112, py + 10),
                    (px + 38, py + 12)
                ], fill=(244, 114, 182, 180))
            except Exception:
                pass

    # 3. Stamps / Wax Seals
    if stamp_type and stamp_type != "none":
        st_x, st_y = sx + sheet_w - 170, sy + sheet_h - 180
        if stamp_type == "approved_revai":
            # Sweet pink wax seal / stamp
            draw.ellipse([st_x - 45, st_y - 45, st_x + 45, st_y + 45], outline=(225, 29, 72, 210), width=3)
            draw.ellipse([st_x - 39, st_y - 39, st_x + 39, st_y + 39], outline=(225, 29, 72, 140), width=1)
            f_st = get_font("patrick", 16)
            draw.text((st_x - 32, st_y - 20), "APPROVED", font=f_st, fill=(225, 29, 72, 220))
            draw.text((st_x - 22, st_y - 2), "REVAI", font=f_st, fill=(225, 29, 72, 220))
            draw.text((st_x - 12, st_y + 14), "💖", font=f_st, fill=(225, 29, 72, 220))
        elif stamp_type == "confidential":
            # Red rectangular distress stamp
            cx, cy = st_x - 30, st_y
            draw.rectangle([cx - 50, cy - 18, cx + 55, cy + 18], outline=(220, 38, 38, 220), width=3)
            f_st = get_font("patrick", 18)
            draw.text((cx - 42, cy - 12), "RAHASIA", font=f_st, fill=(220, 38, 38, 230))
        elif stamp_type == "penting":
            # Gold amber badge
            draw.ellipse([st_x - 42, st_y - 42, st_x + 42, st_y + 42], outline=(217, 119, 6, 210), width=3)
            f_st = get_font("patrick", 16)
            draw.text((st_x - 28, st_y - 12), "PENTING", font=f_st, fill=(217, 119, 6, 220))
            draw.text((st_x - 10, st_y + 8), "★", font=f_st, fill=(217, 119, 6, 220))
        elif stamp_type == "catatan_hati":
            # Emerald seal
            draw.ellipse([st_x - 42, st_y - 42, st_x + 42, st_y + 42], outline=(5, 150, 105, 210), width=3)
            f_st = get_font("patrick", 15)
            draw.text((st_x - 36, st_y - 14), "CATATAN", font=f_st, fill=(5, 150, 105, 220))
            draw.text((st_x - 20, st_y + 4), "HATI 🌿", font=f_st, fill=(5, 150, 105, 220))

    # 4. Cinematic Filters (Vignette, Light Leak, Film Grain)
    if filter_type == "vignette":
        vign = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        vdraw = ImageDraw.Draw(vign)
        vdraw.rectangle([0, 0, WIDTH, HEIGHT], fill=(0, 0, 0, 70))
        vdraw.ellipse([100, 200, WIDTH - 100, HEIGHT - 200], fill=(0, 0, 0, 0))
        vign = vign.filter(ImageFilter.GaussianBlur(100))
        img.alpha_composite(vign)
    elif filter_type == "warm_leak":
        leak = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        ldraw = ImageDraw.Draw(leak)
        ldraw.ellipse([-150, -150, 750, 750], fill=(255, 200, 100, 60))
        leak = leak.filter(ImageFilter.GaussianBlur(120))
        img.alpha_composite(leak)

    return img

def render_realistic_page_curl(p_from, p_to, t):
    """
    Photo-realistic 3D page flip transition (Kebetan):
    - Page From curls from right edge towards left spine.
    - Page To is revealed underneath.
    - Realistic multi-layered under-shadow cast on Page To.
    - High-fidelity 3D curled cylinder flap with specular ridge reflection and reverse-side tone.
    """
    W, H = WIDTH, HEIGHT
    sheet_w, sheet_h = 960, 1580
    sx, sy = (W - sheet_w) // 2, 170

    p = ease_in_out(t)
    if p <= 0.001:
        return p_from
    if p >= 0.999:
        return p_to

    out = p_to.copy()

    # Fold sweeps from right edge to spine
    x_right = sx + sheet_w
    x_left = sx + 25  # Near book spine
    fold_x = x_right - p * (x_right - x_left)

    # Gentle natural slant/tilt
    tilt = 0.10 * math.sin(math.pi * p)
    y_top = sy - 20
    y_bot = sy + sheet_h + 20
    x_top = fold_x - (sheet_h / 2) * tilt
    x_bot = fold_x + (sheet_h / 2) * tilt

    # 1. Mask for the remaining visible part of Page From on the LEFT of the fold
    mask_from = Image.new("L", (W, H), 0)
    mdraw = ImageDraw.Draw(mask_from)
    pts_from = [
        (sx - 20, y_top),
        (x_top, y_top),
        (x_bot, y_bot),
        (sx - 20, y_bot)
    ]
    mdraw.polygon(pts_from, fill=255)
    p_from_visible = Image.composite(p_from, Image.new("RGBA", (W, H), (0, 0, 0, 0)), mask_from)
    out.alpha_composite(p_from_visible)

    draw = ImageDraw.Draw(out)

    # 2. Dynamic Deep Under-Shadow cast onto Page To on the RIGHT of the fold
    shadow_max_w = int(60 + 130 * math.sin(math.pi * p))
    # Soft multi-pass gradient shadow
    for step in range(shadow_max_w, 0, -4):
        ratio = step / float(shadow_max_w)
        # Quadratic falloff for ultra-realistic soft shadow
        alpha = int(140 * math.sin(math.pi * p) * (1.0 - ratio) ** 1.8)
        if alpha > 0:
            draw.line([(x_top + step, y_top), (x_bot + step, y_bot)], fill=(0, 0, 0, alpha), width=5)

    # 3. Curled 3D Flap (Paper arch peeling over)
    # The flap arches up and rolls to the left of the fold
    flap_w = int(45 + 110 * math.sin(math.pi * p))
    flap_pts = [
        (x_top - flap_w, y_top),
        (x_top, y_top),
        (x_bot, y_bot),
        (x_bot - flap_w, y_bot)
    ]

    # Fill curled flap with authentic cream paper reverse tone
    draw.polygon(flap_pts, fill=(244, 238, 226, 255), outline=(210, 202, 188, 240), width=2)

    # Inner fold shadow (near the crease)
    draw.line([(x_top - 4, y_top), (x_bot - 4, y_bot)], fill=(150, 138, 122, 140), width=6)

    # Specular 3D Ridge Highlight (where light hits the curve of the paper cylinder)
    ridge_x_top = x_top - flap_w * 0.42
    ridge_x_bot = x_bot - flap_w * 0.42
    draw.line([(ridge_x_top, y_top), (ridge_x_bot, y_bot)], fill=(255, 255, 255, 220), width=5)

    # Outer peeling edge shadow
    draw.line([(x_top - flap_w + 2, y_top), (x_bot - flap_w + 2, y_bot)], fill=(170, 160, 145, 130), width=3)

    return out

def render_still_image(config, out_filename="still_preview.png", page_num=1):
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, out_filename)

    scene_key = config.get("bg_scene", "meja_kayu")
    bg_img = load_background_scene(scene_key)
    desk_with_shadow = prebuild_desk_with_shadow(bg_img)

    pages = get_normalized_pages(config)
    idx = max(0, min(page_num - 1, len(pages) - 1))
    target_page = pages[idx]

    p_base, sx, sy, sp, mx = prebuild_page_base(desk_with_shadow, config, page_num=idx + 1)
    p_base = draw_overlays_and_stickers(p_base, config)

    img, _ = draw_text_on_page(
        p_base, config, target_page["quote"], sx, sy, sp,
        sign_text=target_page["sign"], reveal_chars=None, is_final=True
    )
    img.save(out_path, format="PNG")
    return out_path

def render_video(config, out_filename="diary_handwriting.mp4", progress_callback=None):
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, out_filename)

    pages = get_normalized_pages(config)
    N = len(pages)

    # Dynamic duration calculation if needed
    default_dur = max(10, N * 7 if N == 1 else N * 6 + (N - 1) * 2)
    duration = int(config.get("duration", default_dur))
    if duration < N * 4:
        duration = N * 5 + (N - 1) * 2

    total_frames = duration * FPS

    scene_key = config.get("bg_scene", "meja_kayu")
    bg_img = load_background_scene(scene_key)
    desk_with_shadow = prebuild_desk_with_shadow(bg_img)

    ink_hex = config.get("ink_color", "#1a368a")
    ink_color = hex_to_rgb(ink_hex, 245)

    # Pre-render base layers and full pages for all N pages
    prebuilt_bases = []
    prebuilt_fulls = []
    page_total_chars = []
    sx_list, sy_list, sp_list = [], [], []

    for i, p in enumerate(pages):
        p_base, sx, sy, sp, mx = prebuild_page_base(desk_with_shadow, config, page_num=i + 1)
        p_base = draw_overlays_and_stickers(p_base, config)
        sx_list.append(sx)
        sy_list.append(sy)
        sp_list.append(sp)

        p_full, _ = draw_text_on_page(
            p_base, config, p["quote"], sx, sy, sp,
            sign_text=p["sign"], reveal_chars=None, is_final=True
        )
        prebuilt_bases.append(p_base)
        prebuilt_fulls.append(p_full)

        tot_chars = sum(len(l) for l in p["quote"] if l.strip()) or 1
        page_total_chars.append(tot_chars)

    audio_choice = config.get("audio_file", "Menepi_di_Savannah_afacb19f.mp3")
    audio_path = os.path.join(AUDIO_DIR, audio_choice) if audio_choice else None
    has_audio = audio_path and os.path.exists(audio_path)

    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-"
    ]

    if has_audio:
        fade_start = max(1, duration - 2)
        ffmpeg_cmd.extend([
            "-i", audio_path,
            "-af", f"afade=t=out:st={fade_start}:d=2",
            "-shortest"
        ])

    ffmpeg_cmd.extend([
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-pix_fmt", "yuv420p"
    ])

    if has_audio:
        ffmpeg_cmd.extend(["-c:a", "aac", "-b:a", "192k"])

    ffmpeg_cmd.append(out_path)

    print(f"[Engine v3.0] Unlimited Multi-Page Render: {out_path} ({duration}s, {N} Pages, BG: {scene_key})...", flush=True)
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    t0 = time.time()

    # Timeline calculation for N pages
    # Total flip transitions = N - 1
    flip_frames = int(1.5 * FPS) if N > 1 else 0
    total_flip_frames = (N - 1) * flip_frames
    remaining_frames = max(N * 30, total_frames - total_flip_frames)
    frames_per_page = remaining_frames // N

    # Build sequence timetable
    timeline = []
    cur_f = 0
    for i in range(N):
        write_dur = int(frames_per_page * 0.78)
        p_info = {
            "page_idx": i,
            "write_start": cur_f,
            "write_end": cur_f + write_dur,
            "hold_end": cur_f + frames_per_page,
            "flip_start": None,
            "flip_end": None
        }
        cur_f += frames_per_page
        if i < N - 1:
            p_info["flip_start"] = cur_f
            p_info["flip_end"] = cur_f + flip_frames
            cur_f += flip_frames
        timeline.append(p_info)

    actual_total_frames = cur_f

    for frame in range(actual_total_frames):
        img = None
        for i, info in enumerate(timeline):
            if info["flip_start"] is not None and info["flip_start"] <= frame < info["flip_end"]:
                # Flipping from page i to i+1
                progress = (frame - info["flip_start"]) / float(info["flip_end"] - info["flip_start"])
                img = render_realistic_page_curl(prebuilt_fulls[i], prebuilt_bases[i + 1], progress)
                break
            elif info["write_start"] <= frame < info["write_end"]:
                # Writing page i
                tot_c = page_total_chars[i]
                chars = int(((frame - info["write_start"]) / float(info["write_end"] - info["write_start"])) * tot_c)
                is_last_page = (i == N - 1)
                sign_to_show = pages[i]["sign"] if is_last_page else ""
                img, pen_pos = draw_text_on_page(
                    prebuilt_bases[i], config, pages[i]["quote"],
                    sx_list[i], sy_list[i], sp_list[i],
                    sign_text=sign_to_show, reveal_chars=chars
                )
                if pen_pos:
                    px, py = pen_pos
                    draw = ImageDraw.Draw(img)
                    draw.line([(px + 4, py + 8), (px + 38, py - 40)], fill=(30, 41, 59, 120), width=6)
                    draw.polygon([(px, py), (px + 8, py - 12), (px + 14, py - 10)], fill=(218, 165, 32))
                    draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill=ink_color)
                break
            elif info["write_end"] <= frame < info["hold_end"]:
                # Holding page i
                img = prebuilt_fulls[i]
                break

        if img is None:
            img = prebuilt_fulls[-1]

        proc.stdin.write(img.convert("RGB").tobytes())

        if (frame + 1) % 75 == 0 or frame == actual_total_frames - 1:
            pct = int(((frame + 1) / actual_total_frames) * 100)
            elapsed = time.time() - t0
            if progress_callback:
                progress_callback(pct, (frame + 1) / elapsed)
            print(f"[Engine] {frame + 1}/{actual_total_frames} ({pct}%)", flush=True)

    proc.stdin.close()
    ret = proc.wait()
    if ret != 0:
        err = proc.stderr.read().decode()
        print(f"[Engine] FFmpeg error: {err}", file=sys.stderr)
        raise RuntimeError(f"FFmpeg render failed: {err}")

    elapsed = time.time() - t0
    print(f"[Engine] Video rendered in {elapsed:.2f}s ({actual_total_frames/elapsed:.1f} fps) -> {out_path}", flush=True)
    return out_path
