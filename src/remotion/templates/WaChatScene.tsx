import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_SANS, TemplateSceneProps, splitLines } from "./shared";

/**
 * Chat gaya WA (tema terang): pesan mengalir dari ATAS ke bawah dan otomatis
 * menggulung ke pesan terbaru saat layar penuh.
 *
 * Format baris isi:
 * - "Nama: pesan"        pembicara pertama = masuk (kiri, putih); lainnya = keluar (kanan, hijau + centang biru)
 * - "# teks"             chip tanggal di tengah, mis. "# Hari ini"
 * - baris hanya emoji    tampil besar tanpa gelembung
 * - akhiran " @00.07"    jam pesan (jika kosong, memakai jam pesan sebelumnya)
 * title = nama kontak, subtitle = status (mis. "online"), themeColor = warna avatar & tombol mic.
 */

const INK = "#111b21";
const MUTED = "#667781";

type Item =
  | { kind: "chip"; text: string; t: number }
  | {
      kind: "msg";
      text: string;
      mine: boolean;
      time: string;
      emoji: boolean;
      first: boolean;
      t: number;
    };

const Svg: React.FC<{ size?: number; stroke?: string; fill?: string; children: React.ReactNode }> = ({
  size = 64,
  stroke = INK,
  fill = "none",
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const Ticks: React.FC = () => (
  <svg width={38} height={26} viewBox="0 0 24 16" fill="none" stroke="#53bdeb" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 9l4 4L14 3" />
    <path d="M9 11l2 2L21 3" />
  </svg>
);

export const WaChatScene: React.FC<TemplateSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#1fa855";
  const name = scene.title || "Kontak";
  const baseStatus = scene.subtitle || "online";

  // ---- parse isi ----
  const lines = splitLines(scene.content);
  let firstWho = "";
  let lastTime = "00.00";
  let prevMine: boolean | null = null;
  const step = Math.max(fps * 1.35, 14);
  const start = fps * 0.7;
  let k = 0;
  const items: Item[] = [];

  for (const l of lines) {
    if (l.startsWith("#")) {
      const text = l.replace(/^#+\s*/, "");
      // chip muncul sedikit sebelum pesan berikutnya
      items.push({ kind: "chip", text, t: start + k * step - fps * 0.25 });
      prevMine = null;
      continue;
    }
    let body = l;
    const tm = body.match(/\s@(\d{1,2})[.:](\d{2})$/);
    if (tm && tm.index !== undefined) {
      lastTime = `${tm[1].padStart(2, "0")}.${tm[2]}`;
      body = body.slice(0, tm.index).trim();
    }
    const m = body.match(/^([^:]{1,20}):\s*(.+)$/);
    const who = m ? m[1].trim() : "";
    const text = m ? m[2].trim() : body;
    if (!firstWho && who) firstWho = who;
    const mine = who !== firstWho;
    const emoji = text.length <= 8 && !/[A-Za-z0-9]/.test(text);
    items.push({
      kind: "msg",
      text,
      mine,
      time: lastTime,
      emoji,
      first: prevMine === null || prevMine !== mine,
      t: start + k * step,
    });
    prevMine = mine;
    k += 1;
  }

  // status header: "mengetik..." sebelum pesan masuk
  const typing = items.some(
    (it) => it.kind === "msg" && !it.mine && frame >= it.t - fps * 0.7 && frame < it.t
  );
  const status = typing ? "mengetik..." : baseStatus;

  // jam di status bar = jam pesan terakhir yang sudah tampil
  const shown = items.filter((it) => it.kind === "msg" && frame >= it.t) as Extract<Item, { kind: "msg" }>[];
  const clock = shown.length ? shown[shown.length - 1].time : "00.00";
  const caretOn = Math.floor(frame / (fps / 2)) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: "#efeae2", fontFamily: FONT_SANS, color: INK }}>
      {/* wallpaper doodle ringan */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 18px 18px, rgba(11,20,26,0.07) 4px, transparent 5px), radial-gradient(circle at 66px 58px, rgba(11,20,26,0.05) 7px, transparent 8px)",
          backgroundSize: "96px 96px",
        }}
      />

      {/* status bar + header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 290, background: "#ffffff", boxShadow: "0 2px 0 rgba(0,0,0,0.08)", zIndex: 3 }}>
        <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 76px" }}>
          <div style={{ fontSize: 46, fontWeight: 700 }}>{clock.replace(".", ".")}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 34 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              {[14, 22, 30, 38].map((h, i) => (
                <div key={i} style={{ width: 9, height: h, background: INK, borderRadius: 2 }} />
              ))}
            </div>
            <div style={{ width: 74, height: 38, borderRadius: 10, border: `4px solid ${INK}`, boxSizing: "border-box", padding: 3 }}>
              <div style={{ width: "70%", height: "100%", background: INK, borderRadius: 4 }} />
            </div>
          </div>
        </div>
        <div style={{ height: 180, display: "flex", alignItems: "center", padding: "0 34px 0 40px", gap: 30 }}>
          <Svg size={66}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 54, fontWeight: 600, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </div>
            <div style={{ fontSize: 36, color: MUTED, marginTop: 4 }}>{status}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 46 }}>
            <Svg size={70}>
              <rect x="2" y="6" width="13" height="12" rx="2" />
              <path d="M15 10l7-4v12l-7-4z" />
            </Svg>
            <Svg size={62}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </Svg>
            <Svg size={58} fill={INK}>
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </Svg>
          </div>
        </div>
      </div>

      {/* area chat: column-reverse + anak min-height 100% => mulai dari atas, menggulung ke bawah saat penuh */}
      <div
        style={{
          position: "absolute",
          top: 290,
          bottom: 190,
          left: 0,
          right: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "26px 32px 24px",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              maxWidth: "88%",
              padding: "22px 34px",
              borderRadius: 24,
              background: "#fff3c4",
              color: "#54656f",
              fontSize: 34,
              lineHeight: 1.35,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            🔒 Cerita fiksi untuk hiburan. Nama, isi, dan kejadian hanya karangan.
          </div>

          {items.map((it, i) => {
            if (frame < it.t - 2) return null;
            const p = spring({ frame: frame - it.t, fps, config: { damping: 15, mass: 0.7 } });
            const v = Math.min(1, Math.max(0, p));

            if (it.kind === "chip") {
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: "center",
                    marginTop: 26,
                    padding: "12px 30px",
                    borderRadius: 20,
                    background: "#ffffff",
                    boxShadow: "0 2px 0 rgba(0,0,0,0.1)",
                    fontSize: 34,
                    fontWeight: 600,
                    color: "#54656f",
                    opacity: v,
                  }}
                >
                  {it.text}
                </div>
              );
            }

            const align = it.mine ? "flex-end" : "flex-start";
            const wrapStyle: React.CSSProperties = {
              alignSelf: align,
              marginTop: it.first ? 24 : 8,
              opacity: v,
              transform: `translateY(${(1 - v) * 34}px) scale(${0.92 + 0.08 * v})`,
              transformOrigin: it.mine ? "bottom right" : "bottom left",
              maxWidth: "80%",
            };

            if (it.emoji) {
              return (
                <div key={i} style={{ ...wrapStyle, display: "flex", flexDirection: "column", alignItems: align }}>
                  <div style={{ fontSize: 130, lineHeight: 1.1 }}>{it.text}</div>
                  <div
                    style={{
                      marginTop: 6,
                      padding: "6px 22px",
                      borderRadius: 24,
                      background: "#ffffff",
                      fontSize: 30,
                      color: MUTED,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    {it.time}
                    {it.mine ? <Ticks /> : null}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={i}
                style={{
                  ...wrapStyle,
                  padding: "18px 26px 12px 28px",
                  background: it.mine ? "#d9fdd3" : "#ffffff",
                  borderRadius: 28,
                  borderTopLeftRadius: !it.mine && it.first ? 6 : 28,
                  borderTopRightRadius: it.mine && it.first ? 6 : 28,
                  boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  columnGap: 22,
                }}
              >
                <div style={{ fontSize: 46, lineHeight: 1.3, fontWeight: 400, paddingBottom: 6 }}>{it.text}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 30, color: MUTED, paddingBottom: 6 }}>
                  {it.time}
                  {it.mine ? <Ticks /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* bar input */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190, zIndex: 3 }}>
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 38,
            width: 880,
            height: 114,
            borderRadius: 57,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 34px 0 30px",
            gap: 24,
            boxShadow: "0 2px 0 rgba(0,0,0,0.1)",
          }}
        >
          <Svg size={62} stroke={MUTED}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01M15 9h.01" />
          </Svg>
          <div style={{ flex: 1, fontSize: 46, color: MUTED, display: "flex", alignItems: "center" }}>
            <span style={{ width: 4, height: 54, background: accent, marginRight: 10, opacity: caretOn ? 1 : 0 }} />
            Ketik pesan
          </div>
          <Svg size={54} stroke={MUTED}>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </Svg>
          <Svg size={58} stroke={MUTED}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </Svg>
        </div>
        <div
          style={{
            position: "absolute",
            right: 24,
            bottom: 32,
            width: 126,
            height: 126,
            borderRadius: 63,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg size={64} stroke="#ffffff">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M19 10a7 7 0 0 1-14 0M12 19v3" />
          </Svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
