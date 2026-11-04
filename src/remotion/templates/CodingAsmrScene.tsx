import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneData } from "@/types/editor";

export const CodingAsmrScene: React.FC<{
  scene: SceneData;
  authorName?: string;
  authorHandle?: string;
}> = ({ scene, authorName = "Aa Baim", authorHandle = "@bungtemin" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation values
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  const lines = scene.content.split("\n");
  const totalChars = scene.content.length;
  // Typewriter progress
  const charsTyped = Math.floor(
    interpolate(frame, [10, 180], [0, totalChars], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const displayedContent = scene.content.slice(0, charsTyped);
  const displayedLines = displayedContent.split("\n");

  const cursorBlink = Math.floor(frame / 12) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080f",
        backgroundImage:
          "radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 60%)",
        color: "#f8fafc",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      {/* Top Header Card */}
      <div
        style={{
          transform: `translateY(${(1 - entrance) * -40}px)`,
          opacity: entrance,
          background: "rgba(13, 19, 34, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 24,
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#38bdf8",
              fontWeight: 700,
            }}
          >
            {scene.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>
            {scene.title}
          </div>
          {scene.subtitle && (
            <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 4 }}>
              {scene.subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            color: "#38bdf8",
          }}
        >
          9:16 HD
        </div>
      </div>

      {/* Center Carbon Code IDE Window */}
      <div
        style={{
          transform: `scale(${0.9 + entrance * 0.1})`,
          opacity: entrance,
          background: "rgba(13, 18, 30, 0.96)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          flex: 1,
          margin: "32px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "#111726",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#27c93f" }} />
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 16,
              color: "#94a3b8",
            }}
          >
            {scene.title.toLowerCase().replace(/\s+/g, "_")}.ts
          </div>
          <div style={{ width: 44 }} />
        </div>

        {/* Code Content Area */}
        <div
          style={{
            padding: "28px 24px",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 22,
            lineHeight: 1.7,
            color: "#e2e8f0",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {lines.slice(0, Math.max(displayedLines.length, 1)).map((fullLine, idx) => {
            const currentLineText = displayedLines[idx] || "";
            const isLastActiveLine = idx === displayedLines.length - 1;

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 20,
                  opacity: idx < displayedLines.length ? 1 : 0.4,
                }}
              >
                <span
                  style={{
                    color: "#475569",
                    userSelect: "none",
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {currentLineText}
                  {isLastActiveLine && cursorBlink && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 24,
                        background: "#38bdf8",
                        marginLeft: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Author Card */}
      <div
        style={{
          transform: `translateY(${(1 - entrance) * 40}px)`,
          opacity: entrance,
          background: "rgba(13, 19, 34, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 24,
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 22,
              color: "#0f172a",
            }}
          >
            {authorName.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{authorName}</div>
            <div style={{ fontSize: 16, color: "#38bdf8" }}>{authorHandle}</div>
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          Olip Studio • Remotion
        </div>
      </div>
    </AbsoluteFill>
  );
};
