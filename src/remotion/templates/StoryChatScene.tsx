import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneData } from "@/types/editor";

export const StoryChatScene: React.FC<{
  scene: SceneData;
  authorName?: string;
  authorHandle?: string;
}> = ({ scene, authorName = "Aa Baim", authorHandle = "@bungtemin" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.9 },
  });

  const bubble1Entrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14 },
  });

  const bubble2Entrance = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080612",
        backgroundImage:
          "radial-gradient(circle at 50% 30%, rgba(244, 63, 94, 0.15) 0%, transparent 60%)",
        color: "#f8fafc",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          transform: `translateY(${(1 - entrance) * -40}px)`,
          opacity: entrance,
          background: "rgba(22, 17, 36, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(244, 63, 94, 0.2)",
          borderRadius: 24,
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#fb7185",
              fontWeight: 700,
            }}
          >
            {scene.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>
            {scene.title}
          </div>
        </div>
        <div
          style={{
            padding: "8px 18px",
            background: "rgba(244, 63, 94, 0.18)",
            border: "1px solid rgba(244, 63, 94, 0.4)",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            color: "#fb7185",
          }}
        >
          STORY 9:16
        </div>
      </div>

      {/* Main Chat Bubble Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          padding: "0 10px",
        }}
      >
        {/* Incoming Bubble 1 */}
        {frame >= 15 && (
          <div
            style={{
              transform: `scale(${0.9 + bubble1Entrance * 0.1}) translateY(${(1 - bubble1Entrance) * 30}px)`,
              opacity: bubble1Entrance,
              alignSelf: "flex-start",
              maxWidth: "85%",
              background: "rgba(30, 24, 48, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "28px 28px 28px 6px",
              padding: "24px 28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: 16, color: "#fb7185", fontWeight: 700, marginBottom: 8 }}>
              {scene.subtitle || "Cerita Singkat"}
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.6, color: "#e2e8f0" }}>
              "{scene.content}"
            </div>
          </div>
        )}

        {/* Outgoing Bubble 2 (Insight / Reply) */}
        {frame >= 35 && (
          <div
            style={{
              transform: `scale(${0.9 + bubble2Entrance * 0.1}) translateY(${(1 - bubble2Entrance) * 30}px)`,
              opacity: bubble2Entrance,
              alignSelf: "flex-end",
              maxWidth: "85%",
              background: "linear-gradient(135deg, #e11d48, #be123c)",
              borderRadius: "28px 28px 6px 28px",
              padding: "24px 28px",
              boxShadow: "0 20px 40px rgba(225, 29, 72, 0.4)",
            }}
          >
            <div style={{ fontSize: 16, color: "#fecdd3", fontWeight: 700, marginBottom: 6 }}>
              {authorName}
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.5, color: "#ffffff", fontWeight: 600 }}>
              Tetap fokus, terus berkembang, dan tak pernah berhenti belajar! 🔥✨
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div
        style={{
          transform: `translateY(${(1 - entrance) * 40}px)`,
          opacity: entrance,
          background: "rgba(22, 17, 36, 0.85)",
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
              background: "linear-gradient(135deg, #fb7185, #f43f5e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 22,
              color: "#ffffff",
            }}
          >
            {authorName.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{authorName}</div>
            <div style={{ fontSize: 16, color: "#fb7185" }}>{authorHandle}</div>
          </div>
        </div>
        <div style={{ fontSize: 16, color: "#94a3b8", fontWeight: 600 }}>
          Olip Studio • Story
        </div>
      </div>
    </AbsoluteFill>
  );
};
