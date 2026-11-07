import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AuthorFooter,
  FONT_SANS,
  TemplateSceneProps,
  progress,
  splitLines,
} from "./shared";

/**
 * Kaca Aurora: latar aurora bergerak (gradien radial, tanpa blur/backdrop-filter)
 * dan kartu "kaca" yang meluncur satu per satu.
 * Format baris isi: "Judul|isi" (dua tingkat teks) atau teks biasa.
 */
export const GlassAuroraScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#a78bfa";

  const cards = splitLines(scene.content).map((l) => {
    const m = l.match(/^([^|]{1,32})\|\s*(.+)$/);
    return m ? { head: m[1].trim(), body: m[2].trim() } : { head: "", body: l };
  });

  const blob = (
    cx: number,
    cy: number,
    size: number,
    color: string,
    phase: number,
    speed: number
  ): React.CSSProperties => {
    const t = frame / (fps * speed);
    return {
      position: "absolute",
      width: size,
      height: size,
      left: cx + 160 * Math.sin(t + phase) - size / 2,
      top: cy + 200 * Math.cos(t * 0.8 + phase) - size / 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}cc 0%, ${color}00 66%)`,
    };
  };

  const headIn = spring({ frame: frame - 4, fps, config: { damping: 16, mass: 0.8 } });
  const hv = Math.min(1, Math.max(0, headIn));

  const glass: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))",
    border: "2px solid rgba(255,255,255,0.26)",
    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.3), 0 24px 60px rgba(0,0,0,0.35)",
    borderRadius: 56,
  };

  return (
    <AbsoluteFill style={{ background: "#07071a", fontFamily: FONT_SANS, color: "#fff" }}>
      <div style={blob(250, 420, 1200, accent, 0, 3.4)} />
      <div style={blob(860, 1050, 1100, "#22d3ee", 2, 4.1)} />
      <div style={blob(300, 1600, 1100, "#f472b6", 4, 3.8)} />

      <div style={{ padding: "150px 64px 170px", display: "flex", flexDirection: "column", gap: 34 }}>
        <div
          style={{
            ...glass,
            padding: "56px 56px 60px",
            opacity: hv,
            transform: `translateY(${(1 - hv) * 50}px)`,
          }}
        >
          {scene.subtitle ? (
            <div
              style={{
                display: "inline-block",
                padding: "10px 26px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.28)",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {scene.subtitle}
            </div>
          ) : null}
          <div style={{ marginTop: 26, fontSize: 104, fontWeight: 800, lineHeight: 1.05 }}>
            {scene.title}
          </div>
        </div>

        {cards.map((c, i) => {
          const p = spring({
            frame: frame - (fps * 0.9 + i * fps * 0.6),
            fps,
            config: { damping: 15, mass: 0.7 },
          });
          const v = Math.min(1, Math.max(0, p));
          if (v <= 0.001) return null;
          return (
            <div
              key={i}
              style={{
                ...glass,
                padding: "40px 46px",
                display: "flex",
                alignItems: "center",
                gap: 34,
                opacity: v,
                transform: `translateX(${(1 - v) * 120}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 92,
                  height: 92,
                  borderRadius: 30,
                  background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                  boxShadow: `0 0 28px ${accent}99`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 800,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                {c.head ? (
                  <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15 }}>{c.head}</div>
                ) : null}
                <div
                  style={{
                    marginTop: c.head ? 8 : 0,
                    fontSize: c.head ? 36 : 42,
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: "rgba(255,255,255,0.86)",
                    opacity: c.head ? progress(frame, fps * (1.1 + i * 0.6), fps * (1.5 + i * 0.6)) : 1,
                  }}
                >
                  {c.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
