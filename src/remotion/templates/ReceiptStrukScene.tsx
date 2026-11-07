import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_MONO, TemplateSceneProps, formatId, progress, splitLines } from "./shared";

/**
 * Struk belanja lucu. Satu baris content = satu item, format "Nama item|harga"
 * (contoh "Kopi susu|18000"). Total dihitung otomatis dari angka. title = nama toko, subtitle = tanggal.
 */
export const ReceiptStrukScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#ef4444";
  const rows = splitLines(scene.content).map((l) => {
    const i = l.lastIndexOf("|");
    const name = i > 0 ? l.slice(0, i).trim() : l;
    const raw = i > 0 ? l.slice(i + 1).trim() : "";
    const num = Number(raw.replace(/[^0-9]/g, "")) || 0;
    return { name, raw, num, hasPrice: i > 0 };
  });
  const total = rows.reduce((a, r) => a + r.num, 0);
  const step = Math.max(fps * 0.9, 10);
  const start = fps * 0.9;
  const endAt = start + rows.length * step;
  const totalP = progress(frame, endAt, endAt + fps * 0.5);
  const stamp = Math.min(1, Math.max(0, spring({ frame: frame - (endAt + fps * 0.9), fps, config: { damping: 9, mass: 0.6 } })));
  const drop = Math.min(1, Math.max(0, spring({ frame: frame - 2, fps, config: { damping: 15 } })));

  return (
    <AbsoluteFill style={{ background: "#e2e8f0", fontFamily: FONT_MONO, alignItems: "center" }}>
      <div
        style={{
          marginTop: 120,
          width: 860,
          background: "#fffef9",
          padding: "70px 60px 90px",
          color: "#111827",
          transform: `translateY(${(1 - drop) * -300}px)`,
          boxShadow: "0 18px 40px rgba(15,23,42,0.22)",
          backgroundImage:
            "linear-gradient(135deg, transparent 75%, #e2e8f0 75%), linear-gradient(225deg, transparent 75%, #e2e8f0 75%)",
          backgroundSize: "30px 30px",
          backgroundPosition: "0 100%, 0 100%",
          backgroundRepeat: "repeat-x",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", fontSize: 52, fontWeight: 700, letterSpacing: 2 }}>{scene.title}</div>
        <div style={{ textAlign: "center", fontSize: 26, color: "#6b7280", marginTop: 8 }}>{scene.subtitle}</div>
        <div style={{ borderTop: "3px dashed #9ca3af", margin: "34px 0 26px" }} />

        {rows.map((r, i) => {
          const t = frame - (start + i * step);
          if (t < 0) return null;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                fontSize: 34,
                lineHeight: 1.35,
                marginBottom: 14,
                opacity: Math.min(1, t / 6),
              }}
            >
              <span>{r.name}</span>
              {r.hasPrice ? <span style={{ whiteSpace: "nowrap" }}>{r.num ? formatId(r.num) : r.raw}</span> : null}
            </div>
          );
        })}

        <div style={{ borderTop: "3px dashed #9ca3af", margin: "26px 0", opacity: totalP }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 44,
            fontWeight: 700,
            opacity: totalP,
          }}
        >
          <span>TOTAL</span>
          <span>Rp {formatId(total * totalP)}</span>
        </div>

        <div
          style={{
            position: "absolute",
            right: 50,
            bottom: 120,
            fontSize: 66,
            fontWeight: 800,
            color: accent,
            border: `8px solid ${accent}`,
            borderRadius: 14,
            padding: "4px 26px",
            transform: `rotate(-14deg) scale(${2 - stamp})`,
            opacity: stamp,
          }}
        >
          LUNAS
        </div>
      </div>
      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color="#334155" />
    </AbsoluteFill>
  );
};
