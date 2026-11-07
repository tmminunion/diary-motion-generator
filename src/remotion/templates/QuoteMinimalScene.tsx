import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress } from "./shared";

/** Quote minimalis: kata muncul satu per satu di atas gradien lembut. */
export const QuoteMinimalScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#f5d0a9";
  const words = (scene.content || "").split(/\s+/).filter(Boolean);
  const total = fps * scene.durationInSeconds;
  const revealEnd = Math.max(fps, total * 0.7);
  const perWord = Math.max(2, (revealEnd - fps * 0.8) / Math.max(words.length, 1));

  const head = progress(frame, 0, fps * 0.6);
  const exit = progress(frame, total - fps * 0.5, total);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #14101f 0%, #2a1b3d 55%, #3b2347 100%)",
        fontFamily: FONT_SANS,
        color: "#fdf8f3",
        justifyContent: "center",
        padding: "0 90px",
        opacity: 1 - exit * 0.4,
      }}
    >
      <div
        style={{
          fontSize: 220,
          lineHeight: 0.8,
          color: accent,
          opacity: head * 0.9,
          transform: `translateY(${(1 - head) * 30}px)`,
          fontWeight: 800,
        }}
      >
        “
      </div>

      <div style={{ fontSize: 62, lineHeight: 1.35, fontWeight: 700, marginTop: 10 }}>
        {words.map((w, i) => {
          const p = progress(frame, fps * 0.8 + i * perWord, fps * 0.8 + i * perWord + 8);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 16,
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 60,
          width: 120 * progress(frame, fps * 1.2, fps * 1.8),
          height: 5,
          borderRadius: 3,
          background: accent,
        }}
      />
      <div
        style={{
          marginTop: 26,
          fontSize: 32,
          fontWeight: 800,
          color: accent,
          letterSpacing: "0.04em",
          opacity: progress(frame, revealEnd, revealEnd + 12),
        }}
      >
        {scene.title}
        {scene.subtitle ? (
          <span style={{ color: "#cbbfd8", fontWeight: 600 }}> · {scene.subtitle}</span>
        ) : null}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
