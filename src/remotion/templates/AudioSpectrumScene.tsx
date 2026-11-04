import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneData } from "@/types/editor";

export const AudioSpectrumScene: React.FC<{
  scene: SceneData;
  authorName?: string;
  authorHandle?: string;
  audioTitle?: string;
}> = ({
  scene,
  authorName = "Aa Baim",
  authorHandle = "@bungtemin",
  audioTitle = "Suno AI Original Soundtrack",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.9 },
  });

  const barCount = 28;
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Generate dynamic waveform bounce using sine & cosine harmonic phases
    const wave1 = Math.sin((frame * 0.15) + (i * 0.4));
    const wave2 = Math.cos((frame * 0.08) - (i * 0.2));
    const heightPercent = 20 + Math.abs(wave1 * wave2) * 80;
    return heightPercent;
  });

  const rotation = (frame * 1.5) % 360;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050814",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
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
          background: "rgba(10, 18, 38, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(14, 165, 233, 0.2)",
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
              color: "#38bdf8",
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
            background: "rgba(14, 165, 233, 0.2)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            color: "#38bdf8",
          }}
        >
          SPECTRUM 9:16
        </div>
      </div>

      {/* Center Vinyl & Waveform */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* Glowing Vinyl / Disk */}
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0284c7, #6366f1, #d946ef)",
            padding: 8,
            boxShadow: "0 0 60px rgba(56, 189, 248, 0.35)",
            transform: `rotate(${rotation}deg) scale(${0.9 + entrance * 0.1})`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#090d1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#0f172a",
                fontSize: 20,
              }}
            >
              ♫
            </div>
          </div>
        </div>

        {/* Audio Title & Subtitle */}
        <div style={{ textAlign: "center", maxWidth: "80%" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#f8fafc" }}>
            {audioTitle}
          </div>
          <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 8 }}>
            "{scene.content}"
          </div>
        </div>

        {/* Dynamic Spectrum Waveform Bars */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 8,
            height: 120,
            width: "90%",
            padding: "0 20px",
          }}
        >
          {bars.map((h, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${h}%`,
                background: "linear-gradient(to top, #0284c7, #38bdf8)",
                borderRadius: 4,
                boxShadow: "0 0 12px rgba(56, 189, 248, 0.5)",
                transition: "height 0.05s ease-out",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        style={{
          transform: `translateY(${(1 - entrance) * 40}px)`,
          opacity: entrance,
          background: "rgba(10, 18, 38, 0.85)",
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
              background: "linear-gradient(135deg, #0284c7, #38bdf8)",
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
        <div style={{ fontSize: 16, color: "#94a3b8", fontWeight: 600 }}>
          Olip Studio • Visualizer
        </div>
      </div>
    </AbsoluteFill>
  );
};
