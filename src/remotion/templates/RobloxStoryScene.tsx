import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneData } from "@/types/editor";
import {
  CHARACTER_ROSTER,
  RobloxCharacterAvatar,
} from "./robloxCharacters";

export const RobloxStoryScene: React.FC<{
  scene: SceneData;
  authorName?: string;
  authorHandle?: string;
}> = ({ scene, authorName = "Aa Baim", authorHandle = "@bungtemin" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Selected character metadata
  const charId = scene.characterId || "noob";
  const charMeta = CHARACTER_ROSTER.find((c) => c.id === charId) || CHARACTER_ROSTER[0];
  const bgTheme = scene.backgroundTheme || "rainbow_obby";

  // Entrance spring animation
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  // Talking animations
  const isTalking = true; // Active speech throughout the scene
  const mouthOpen = Math.sin(frame * 0.75) > 0.15;
  const isBlinking = frame % 85 >= 0 && frame % 85 <= 4;
  const bobY = Math.sin(frame * 0.35) * 12;
  const swayRot = Math.sin(frame * 0.18) * 2.5;

  // Kinetic Hormozi Subtitles calculation
  // Split words by space
  const words = (scene.content || "").trim().split(/\s+/).filter(Boolean);
  const totalWords = Math.max(words.length, 1);

  // Time window for words (leave 10 frames intro and 10 frames outro)
  const speechStartFrame = 12;
  const speechEndFrame = Math.max(durationInFrames - 12, speechStartFrame + 30);
  
  const currentWordIndex = Math.min(
    Math.max(
      Math.floor(
        interpolate(frame, [speechStartFrame, speechEndFrame], [0, totalWords - 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      ),
      0
    ),
    totalWords - 1
  );

  // Show 3 words at a time (sliding window)
  const windowSize = 3;
  const windowStart = Math.max(
    0,
    Math.min(
      Math.floor(currentWordIndex / windowSize) * windowSize,
      Math.max(0, totalWords - windowSize)
    )
  );
  const visibleWords = words.slice(windowStart, windowStart + windowSize);

  // Avatar position styles
  const position = scene.avatarPosition || "center";
  let avatarContainerStyle: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  };

  if (position === "center") {
    avatarContainerStyle = {
      ...avatarContainerStyle,
      top: "28%",
      left: "50%",
      transform: `translateX(-50%) translateY(${bobY}px) rotate(${swayRot}deg) scale(${entrance})`,
    };
  } else if (position === "bottom") {
    avatarContainerStyle = {
      ...avatarContainerStyle,
      bottom: "6%",
      right: "6%",
      transform: `translateY(${bobY}px) rotate(${swayRot}deg) scale(${entrance * 0.85})`,
    };
  } else if (position === "left") {
    avatarContainerStyle = {
      ...avatarContainerStyle,
      top: "32%",
      left: "6%",
      transform: `translateY(${bobY}px) rotate(${swayRot}deg) scale(${entrance * 0.9})`,
    };
  } else if (position === "right") {
    avatarContainerStyle = {
      ...avatarContainerStyle,
      top: "32%",
      right: "6%",
      transform: `translateY(${bobY}px) rotate(${swayRot}deg) scale(${entrance * 0.9})`,
    };
  }

  // Parallax background movement
  const bgOffsetY = (frame * 3) % 240;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060814",
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* 1. Voice Over Audio (if scene has its own TTS audio) */}
      {scene.audioVoiceUrl && <Audio src={scene.audioVoiceUrl} />}

      {/* 2. DYNAMIC BACKGROUND */}
      {scene.customBgUrl ? (
        <AbsoluteFill>
          <img
            src={scene.customBgUrl}
            alt="Custom Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.65) blur(1px)",
            }}
          />
        </AbsoluteFill>
      ) : bgTheme === "rainbow_obby" ? (
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, #38bdf8 0%, #818cf8 40%, #c084fc 75%, #f472b6 100%)",
            overflow: "hidden",
          }}
        >
          {/* Obby floating blocks */}
          <div
            style={{
              position: "absolute",
              inset: -200,
              display: "flex",
              flexDirection: "column",
              gap: 90,
              transform: `translateY(${bgOffsetY}px)`,
              opacity: 0.85,
            }}
          >
            {[
              { color: "#ef4444", left: 120, w: 260 },
              { color: "#f97316", left: 380, w: 220 },
              { color: "#eab308", left: 180, w: 300 },
              { color: "#22c55e", left: 450, w: 240 },
              { color: "#06b6d4", left: 100, w: 280 },
              { color: "#8b5cf6", left: 340, w: 260 },
              { color: "#ec4899", left: 200, w: 320 },
              { color: "#3b82f6", left: 420, w: 240 },
            ].map((block, idx) => (
              <div
                key={idx}
                style={{
                  marginLeft: block.left,
                  width: block.w,
                  height: 48,
                  backgroundColor: block.color,
                  borderRadius: 12,
                  boxShadow: `0 20px 30px rgba(0,0,0,0.35), inset 0 4px 6px rgba(255,255,255,0.4), 0 8px 0 rgba(0,0,0,0.25)`,
                }}
              />
            ))}
          </div>
          {/* Subtle clouds */}
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 40,
              width: 180,
              height: 50,
              background: "rgba(255,255,255,0.65)",
              borderRadius: 30,
              filter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 380,
              right: 60,
              width: 220,
              height: 60,
              background: "rgba(255,255,255,0.5)",
              borderRadius: 30,
              filter: "blur(6px)",
            }}
          />
        </AbsoluteFill>
      ) : bgTheme === "minecraft" ? (
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, #60a5fa 0%, #93c5fd 55%, #15803d 56%, #166534 100%)",
          }}
        >
          {/* Minecraft pixel sun */}
          <div
            style={{
              position: "absolute",
              top: 100,
              right: 120,
              width: 90,
              height: 90,
              backgroundColor: "#fef08a",
              boxShadow: "0 0 40px #fef08a",
            }}
          />
          {/* Voxel floating stone & grass blocks */}
          <div
            style={{
              position: "absolute",
              bottom: 180,
              left: 80,
              width: 140,
              height: 140,
              backgroundColor: "#78350f",
              borderTop: "30px solid #22c55e",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 320,
              right: 90,
              width: 160,
              height: 160,
              backgroundColor: "#78350f",
              borderTop: "35px solid #22c55e",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          />
        </AbsoluteFill>
      ) : bgTheme === "cyberpunk" ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 30%, #581c87 0%, #0f172a 70%, #020617 100%)",
          }}
        >
          {/* Neon grid floor */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 400,
              backgroundImage:
                "linear-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.4) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              transform: "perspective(400px) rotateX(60deg)",
              transformOrigin: "bottom center",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 80%)",
          }}
        />
      )}

      {/* Vignette Overlay for focus */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.75)",
          pointerEvents: "none",
        }}
      />

      {/* 3. TOP BRANDING / SCENE TITLE CARD */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 40,
          right: 40,
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(18px)",
          border: "2px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 24,
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: charMeta.primaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              boxShadow: `0 8px 20px ${charMeta.primaryColor}66`,
            }}
          >
            🎮
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#38bdf8",
              }}
            >
              {charMeta.name}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#ffffff",
                marginTop: 2,
              }}
            >
              {scene.title}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "8px 16px",
            background: "rgba(56, 189, 248, 0.2)",
            border: "1px solid rgba(56, 189, 248, 0.5)",
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 800,
            color: "#38bdf8",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🔥</span> ROBLOX
        </div>
      </div>

      {/* 4. ANIMATED TALKING AVATAR */}
      <div style={avatarContainerStyle}>
        {/* Neon Aura Rings while speaking */}
        {isTalking && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.4) * 0.12})`,
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${charMeta.primaryColor}44 0%, transparent 70%)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* Character Badge / Tagline Float */}
        <div
          style={{
            marginBottom: 16,
            padding: "8px 20px",
            background: "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${charMeta.primaryColor}`,
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 800,
            color: "#ffffff",
            boxShadow: `0 8px 25px ${charMeta.primaryColor}88`,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: mouthOpen ? "#22c55e" : "#ef4444",
              boxShadow: mouthOpen ? "0 0 10px #22c55e" : "none",
            }}
          />
          <span>{charMeta.badge}</span>
        </div>

        {/* Avatar SVG component */}
        <div style={{ zIndex: 1 }}>
          <RobloxCharacterAvatar
            characterId={charId}
            isTalking={isTalking}
            isBlinking={isBlinking}
            mouthOpen={mouthOpen}
            customAvatarUrl={scene.customAvatarUrl}
            size={position === "bottom" ? 340 : 420}
          />
        </div>
      </div>

      {/* 5. TIKTOK / ALEX HORMOZI DYNAMIC KINETIC SUBTITLES */}
      <div
        style={{
          position: "absolute",
          bottom: position === "bottom" ? 380 : 200,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(20px)",
            border: "3px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 32,
            padding: "24px 36px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px 20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
            maxWidth: "92%",
          }}
        >
          {visibleWords.map((word, idx) => {
            const actualIndex = windowStart + idx;
            const isCurrent = actualIndex === currentWordIndex;
            const wordBounce = isCurrent ? 1.15 : 1.0;

            return (
              <span
                key={actualIndex}
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  color: isCurrent ? "#facc15" : "#ffffff",
                  transform: `scale(${wordBounce})`,
                  transition: "transform 0.1s ease",
                  textShadow: isCurrent
                    ? "0 0 20px rgba(250, 204, 21, 0.9), 3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000"
                    : "3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000",
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* 6. BOTTOM CREATOR FOOTER & PROGRESS BAR */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 10,
        }}
      >
        {/* Scene progress line */}
        <div
          style={{
            width: "100%",
            height: 8,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(frame / durationInFrames) * 100}%`,
              height: "100%",
              backgroundColor: charMeta.primaryColor,
              boxShadow: `0 0 12px ${charMeta.primaryColor}`,
            }}
          />
        </div>

        {/* Creator branding tag */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#f8fafc",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            @{authorHandle.replace("@", "")} &bull; {authorName}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#94a3b8",
            }}
          >
            Olip Video Studio 🎬
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
