import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/** Lirik karaoke: baris aktif menyala, baris lain meredup. */
export const LyricKaraokeScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#38bdf8";
  const lines = splitLines(scene.content);
  const total = fps * scene.durationInSeconds;
  const start = fps * 1;
  const span = Math.max(total - start - fps * 1, lines.length * fps * 0.8);
  const perLine = span / Math.max(lines.length, 1);
  const activeFloat = (frame - start) / perLine;
  const active = Math.min(lines.length - 1, Math.max(-1, Math.floor(activeFloat)));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #050816 0%, #0b1730 100%)",
        fontFamily: FONT_SANS,
        color: "#f1f5f9",
        padding: "150px 80px 0",
      }}
    >
      <div style={{ opacity: progress(frame, 0, 15), textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 800 }}>{scene.title}</div>
        {scene.subtitle ? (
          <div style={{ fontSize: 26, color: accent, marginTop: 8, fontWeight: 700 }}>
            {scene.subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 34,
          paddingBottom: 150,
        }}
      >
        {lines.map((line, i) => {
          const isActive = i === active;
          const isPast = i < active;
          const fill = isActive ? progress(activeFloat - i, 0, 0.9) : isPast ? 1 : 0;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                fontSize: isActive ? 60 : 48,
                fontWeight: 800,
                lineHeight: 1.25,
                textAlign: "center",
                color: "rgba(148,163,184,0.45)",
                transition: "none",
              }}
            >
              {line}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  color: accent,
                  clipPath: `inset(0 ${100 - fill * 100}% 0 0)`,
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
