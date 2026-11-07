import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/**
 * Polling / pilih mana. Satu baris content = satu opsi, format "Opsi|persen"
 * (contoh "Nasi uduk|62"). title = pertanyaan, subtitle = label kecil. Opsi tertinggi disorot.
 */
const PALETTE = ["#38bdf8", "#f472b6", "#fbbf24", "#34d399", "#a78bfa"];

export const PollVersusScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opts = splitLines(scene.content).slice(0, 5).map((l, i) => {
    const k = l.lastIndexOf("|");
    const label = k > 0 ? l.slice(0, k).trim() : l;
    const pct = k > 0 ? Math.min(100, Math.max(0, Number(l.slice(k + 1).replace(/[^0-9.]/g, "")) || 0)) : 0;
    return { label, pct, color: i === 0 && scene.themeColor ? scene.themeColor : PALETTE[i % PALETTE.length] };
  });
  const best = opts.reduce((m, o, i) => (o.pct > opts[m].pct ? i : m), 0);
  const grow = progress(frame, fps * 1.2, fps * 3.2);
  const crown = Math.min(1, Math.max(0, spring({ frame: frame - fps * 3.4, fps, config: { damping: 10, mass: 0.6 } })));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        fontFamily: FONT_SANS,
        color: "#f8fafc",
        padding: "140px 64px 0",
      }}
    >
      <div style={{ opacity: progress(frame, 0, fps * 0.5) }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, color: "#a5b4fc" }}>
          {(scene.subtitle || "POLLING").toUpperCase()}
        </div>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.12, marginTop: 14 }}>{scene.title}</div>
      </div>

      <div style={{ marginTop: 90, display: "flex", flexDirection: "column", gap: 34 }}>
        {opts.map((o, i) => {
          const appear = progress(frame, fps * 0.5 + i * 6, fps * 0.9 + i * 6);
          const win = i === best && crown > 0;
          return (
            <div key={i} style={{ opacity: appear, transform: `translateY(${(1 - appear) * 40}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, fontWeight: 800, marginBottom: 12 }}>
                <span>
                  {win ? "👑 " : ""}
                  {o.label}
                </span>
                <span style={{ color: o.color }}>{Math.round(o.pct * grow)}%</span>
              </div>
              <div style={{ height: 64, borderRadius: 32, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${o.pct * grow}%`,
                    height: "100%",
                    borderRadius: 32,
                    background: o.color,
                    transform: win ? `scaleY(${1 + 0.08 * crown})` : undefined,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
