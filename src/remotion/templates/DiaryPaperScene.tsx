import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_HAND, FONT_SANS, TemplateSceneProps, progress } from "./shared";

/** Diary kertas bergaris: tulisan tangan muncul per huruf, lengkap dengan tanggal. */
export const DiaryPaperScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ink = scene.themeColor || "#1e3a8a";
  const text = scene.content || "";
  const total = fps * scene.durationInSeconds;
  const typeStart = fps * 1.2;
  const typeEnd = Math.max(typeStart + fps, total - fps * 1.5);
  const chars = Math.floor(progress(frame, typeStart, typeEnd) * text.length);
  const lineH = 78;

  const paper = progress(frame, 0, 18);

  return (
    <AbsoluteFill style={{ background: "#d6c7a8", fontFamily: FONT_SANS }}>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 110,
          bottom: 170,
          background: "#fffdf5",
          borderRadius: 14,
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          transform: `translateY(${(1 - paper) * 60}px) rotate(${(1 - paper) * -2}deg)`,
          opacity: paper,
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${lineH - 2}px, #bfd3ea ${lineH - 2}px, #bfd3ea ${lineH}px)`,
          backgroundPosition: "0 28px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 104,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#f4a3a3",
          }}
        />
        <div style={{ position: "absolute", left: 140, right: 50, top: 28 }}>
          <div
            style={{
              fontFamily: FONT_HAND,
              fontSize: 56,
              fontWeight: 700,
              color: ink,
              lineHeight: `${lineH}px`,
            }}
          >
            {scene.subtitle || ""}
          </div>
          <div
            style={{
              fontFamily: FONT_HAND,
              fontSize: 64,
              fontWeight: 700,
              color: ink,
              lineHeight: `${lineH}px`,
              textDecoration: "underline",
              textDecorationColor: `${ink}66`,
            }}
          >
            {scene.title}
          </div>
          <div
            style={{
              fontFamily: FONT_HAND,
              fontSize: 54,
              color: ink,
              lineHeight: `${lineH}px`,
              whiteSpace: "pre-wrap",
              marginTop: 0,
            }}
          >
            {text.slice(0, chars)}
          </div>
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color="#3f2e14" />
    </AbsoluteFill>
  );
};
