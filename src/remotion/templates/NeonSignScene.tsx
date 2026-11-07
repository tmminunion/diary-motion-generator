import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/** Papan neon: judul menyala dengan kedip singkat, baris content jadi tulisan neon kecil. */
export const NeonSignScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const neon = scene.themeColor || "#ff3df2";
  const lines = splitLines(scene.content);

  // kedip awal: nyala-mati-nyala sebelum stabil
  const flick = [1, 0.15, 1, 0.3, 0.1, 1, 1, 0.5, 1];
  const fi = Math.floor(frame / 3);
  const on = fi < flick.length ? flick[fi] : 1;
  const hum = 0.94 + 0.06 * Math.sin(frame / 5);
  const power = on * (frame > flick.length * 3 ? hum : 1);
  const glow = `0 0 6px ${neon}, 0 0 22px ${neon}`;
  const tube = (extra = 1) => ({ color: "#fff", textShadow: glow, opacity: power * extra });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #07040d 0%, #130a1f 100%)",
        fontFamily: FONT_SANS,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "70px 40px",
          borderRadius: 48,
          border: `8px solid ${neon}`,
          boxShadow: `0 0 18px ${neon}, inset 0 0 18px ${neon}`,
          opacity: power,
          textAlign: "center",
        }}
      >
        <div style={{ ...tube(), fontSize: 100, fontWeight: 800, lineHeight: 1.1, letterSpacing: "0.04em" }}>
          {scene.title}
        </div>
        {scene.subtitle ? (
          <div
            style={{
              ...tube(progress(frame, fps * 1.2, fps * 1.7)),
              marginTop: 30,
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            {scene.subtitle}
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 70, textAlign: "center" }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.5,
              color: "#f5e9ff",
              opacity: progress(frame, fps * (1.8 + i * 0.6), fps * (2.3 + i * 0.6)),
              textShadow: `0 0 10px ${neon}88`,
            }}
          >
            {l}
          </div>
        ))}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color={neon} />
    </AbsoluteFill>
  );
};
