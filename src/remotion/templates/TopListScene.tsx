import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, splitLines } from "./shared";

/** Daftar bernomor (Top 5 / Tips): tiap baris content = satu item. */
export const TopListScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#fbbf24";
  const items = splitLines(scene.content);
  const head = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #0f172a 0%, #1e1b4b 100%)",
        fontFamily: FONT_SANS,
        color: "#f8fafc",
        padding: "130px 64px 0",
      }}
    >
      <div
        style={{
          opacity: head,
          transform: `translateY(${(1 - head) * -40}px)`,
          marginBottom: 56,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 22px",
            borderRadius: 999,
            background: accent,
            color: "#111827",
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: "0.1em",
          }}
        >
          {(scene.subtitle || "TIPS").toUpperCase()}
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 22, lineHeight: 1.15 }}>
          {scene.title}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {items.map((item, i) => {
          const p = spring({
            frame: frame - (fps * 0.6 + i * fps * 0.55),
            fps,
            config: { damping: 14, mass: 0.8 },
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "26px 30px",
                borderRadius: 28,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                opacity: Math.min(1, Math.max(0, p)),
                transform: `translateX(${(1 - Math.min(1, Math.max(0, p))) * 160}px) scale(${0.9 + 0.1 * Math.min(1, Math.max(0, p))})`,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  flexShrink: 0,
                  borderRadius: 24,
                  background: accent,
                  color: "#111827",
                  fontSize: 46,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.25 }}>{item}</div>
            </div>
          );
        })}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
