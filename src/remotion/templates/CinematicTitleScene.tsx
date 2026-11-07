import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress } from "./shared";

/** Judul sinematik: letterbox hitam, judul melebar-lalu-merapat, tagline halus. */
export const CinematicTitleScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#fcd34d";
  const total = fps * scene.durationInSeconds;

  const bars = progress(frame, 0, fps * 0.9);
  const title = progress(frame, fps * 0.6, fps * 2.2);
  const sub = progress(frame, fps * 1.8, fps * 2.8);
  const line = progress(frame, fps * 1.4, fps * 2.4);
  const tag = progress(frame, fps * 3, fps * 4);
  const exit = progress(frame, total - fps * 0.6, total);
  const zoom = 1 + progress(frame, 0, total) * 0.08;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 45%, #2b2433 0%, #0d0b12 70%)",
        fontFamily: FONT_SANS,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${zoom})`,
          opacity: 1 - exit,
        }}
      >
        <div style={{ textAlign: "center", padding: "0 70px" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: `${(1 - title) * 0.35 + 0.02}em`,
              opacity: title,
              textTransform: "uppercase",
            }}
          >
            {scene.title}
          </div>
          <div
            style={{
              margin: "36px auto",
              height: 4,
              width: 260 * line,
              background: accent,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: sub,
            }}
          >
            {scene.subtitle}
          </div>
          <div
            style={{
              marginTop: 46,
              fontSize: 38,
              lineHeight: 1.5,
              fontWeight: 500,
              color: "#c9c3d3",
              opacity: tag,
              transform: `translateY(${(1 - tag) * 20}px)`,
            }}
          >
            {scene.content}
          </div>
        </div>
      </AbsoluteFill>

      {/* letterbox */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 230 * bars, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230 * bars, background: "#000" }} />

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
