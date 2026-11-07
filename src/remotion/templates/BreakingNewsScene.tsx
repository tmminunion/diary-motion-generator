import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress } from "./shared";

/** Breaking news: banner merah, headline, dan ticker berjalan di bawah. */
export const BreakingNewsScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const accent = scene.themeColor || "#dc2626";
  const banner = spring({ frame, fps, config: { damping: 13 } });
  const head = progress(frame, 12, 30);
  const body = progress(frame, 30, 50);
  const blink = Math.floor(frame / 15) % 2 === 0;

  const ticker = `${scene.subtitle ? scene.subtitle + "  •  " : ""}${scene.title}  •  `;
  const tickerWidth = Math.max(ticker.length * 22, width);
  const x = -((frame * 6) % tickerWidth);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0b1220 0%, #111827 60%, #1f2937 100%)",
        fontFamily: FONT_SANS,
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          transform: `translateX(${(1 - banner) * -600}px)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: accent,
          padding: "16px 44px 16px 36px",
          borderTopRightRadius: 18,
          borderBottomRightRadius: 18,
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: "0.12em",
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            background: "#fff",
            opacity: blink ? 1 : 0.25,
          }}
        />
        BREAKING NEWS
      </div>

      <div style={{ position: "absolute", top: 340, left: 64, right: 64 }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.12,
            opacity: head,
            transform: `translateY(${(1 - head) * 40}px)`,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            marginTop: 40,
            height: 6,
            width: 220 * head,
            background: accent,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 42,
            lineHeight: 1.45,
            color: "#d1d5db",
            fontWeight: 600,
            opacity: body,
            transform: `translateY(${(1 - body) * 30}px)`,
          }}
        >
          {scene.content}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 130,
          height: 84,
          background: "#fff",
          color: "#111827",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          fontSize: 36,
          fontWeight: 800,
        }}
      >
        <div style={{ transform: `translateX(${x}px)`, display: "flex" }}>
          {[0, 1, 2].map((k) => (
            <span key={k} style={{ width: tickerWidth, flexShrink: 0 }}>
              {ticker}
            </span>
          ))}
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
