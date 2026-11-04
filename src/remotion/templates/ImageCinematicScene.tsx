import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneData } from "@/types/editor";

export const ImageCinematicScene: React.FC<{
  scene: SceneData;
  authorName?: string;
  authorHandle?: string;
}> = ({ scene, authorName = "Aa Baim", authorHandle = "@bungtemin" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Smooth entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.9 },
  });

  // Ken Burns zoom effect (smooth 1x to 1.15x over the scene duration)
  const zoomScale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pan
  const panY = interpolate(frame, [0, durationInFrames], [0, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const defaultPlaceholder =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80";
  const imageSource = scene.imageUrl || defaultPlaceholder;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070f",
        overflow: "hidden",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}
    >
      {/* Background Image with Ken Burns Zoom & Pan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomScale}) translateY(${panY}px)`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={imageSource}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Cinematic Dark Vignette & Gradient Overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to bottom, rgba(5,7,15,0.7) 0%, rgba(5,7,15,0.1) 40%, rgba(5,7,15,0.85) 80%, rgba(5,7,15,0.98) 100%)",
        }}
      />

      {/* Top Header Tag */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          right: 40,
          transform: `translateY(${(1 - entrance) * -40}px)`,
          opacity: entrance,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(13, 19, 34, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 20,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 10px #38bdf8",
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", letterSpacing: "0.1em" }}>
            {scene.name.toUpperCase()}
          </span>
        </div>

        <div
          style={{
            background: "rgba(56, 189, 248, 0.2)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 16,
            padding: "8px 18px",
            fontSize: 16,
            fontWeight: 800,
            color: "#38bdf8",
          }}
        >
          CINEMATIC 9:16
        </div>
      </div>

      {/* Bottom Cinematic Caption Card */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          transform: `translateY(${(1 - entrance) * 40}px)`,
          opacity: entrance,
          background: "rgba(10, 15, 28, 0.88)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: 28,
          padding: "32px 36px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 10,
        }}
      >
        {scene.subtitle && (
          <div
            style={{
              fontSize: 18,
              color: "#38bdf8",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {scene.subtitle}
          </div>
        )}

        <div style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", lineHeight: 1.25 }}>
          {scene.title}
        </div>

        {scene.content && (
          <div style={{ fontSize: 22, color: "#cbd5e1", lineHeight: 1.6, marginTop: 4 }}>
            "{scene.content}"
          </div>
        )}

        {/* Author Footer inside card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                color: "#0f172a",
              }}
            >
              {authorName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>{authorName}</div>
              <div style={{ fontSize: 14, color: "#38bdf8" }}>{authorHandle}</div>
            </div>
          </div>

          <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>
            Olip Studio • Visual
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
