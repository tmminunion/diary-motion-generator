import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/**
 * Linimasa perjalanan. Satu baris content = satu tonggak, format "Tahun|Cerita"
 * (tanpa "|" baris dianggap cerita saja). title/subtitle jadi kepala linimasa.
 */
export const TimelineStoryScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#38bdf8";
  const items = splitLines(scene.content).map((l) => {
    const i = l.indexOf("|");
    return i > 0 ? { when: l.slice(0, i).trim(), text: l.slice(i + 1).trim() } : { when: "", text: l };
  });
  const n = Math.max(items.length, 1);
  const step = Math.max(fps * 1.2, 14);
  const startAt = fps * 0.8;
  const lineH = 1180;
  const rowH = Math.min(220, lineH / n);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0b1220 0%, #101a30 100%)",
        fontFamily: FONT_SANS,
        color: "#f1f5f9",
        padding: "130px 70px 0",
      }}
    >
      <div style={{ opacity: progress(frame, 0, fps * 0.5) }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 6, color: accent }}>
          {(scene.subtitle || "PERJALANAN").toUpperCase()}
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>{scene.title}</div>
      </div>

      <div style={{ position: "relative", marginTop: 70, height: lineH }}>
        <div
          style={{
            position: "absolute",
            left: 21,
            top: 10,
            width: 6,
            borderRadius: 3,
            background: accent,
            height: (lineH - 20) * progress(frame, startAt, startAt + step * n),
            opacity: 0.55,
          }}
        />
        {items.map((it, i) => {
          const t = frame - (startAt + i * step);
          const p = Math.min(1, Math.max(0, spring({ frame: t, fps, config: { damping: 14, mass: 0.7 } })));
          if (t < -2) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: i * rowH,
                left: 0,
                right: 0,
                display: "flex",
                gap: 40,
                alignItems: "flex-start",
                opacity: p,
                transform: `translateX(${(1 - p) * 60}px)`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: i === items.length - 1 ? accent : "#0b1220",
                  border: `6px solid ${accent}`,
                  boxSizing: "border-box",
                  flexShrink: 0,
                  transform: `scale(${0.6 + 0.4 * p})`,
                }}
              />
              <div style={{ flex: 1 }}>
                {it.when ? (
                  <div style={{ fontSize: 34, fontWeight: 800, color: accent, lineHeight: 1 }}>{it.when}</div>
                ) : null}
                <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.25, marginTop: 8 }}>{it.text}</div>
              </div>
            </div>
          );
        })}
      </div>
      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
