import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AuthorFooter,
  FONT_HAND,
  FONT_SANS,
  SpiralRings,
  TemplateSceneProps,
  progress,
  splitLines,
} from "./shared";

/**
 * Buku catatan spiral (miring di atas meja) seperti foto referensi.
 * title = judul halaman, subtitle = tanggal / label, content = satu poin per baris.
 */
export const SpiralNotebookScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ink = scene.themeColor || "#1d4ed8";
  const lines = splitLines(scene.content);
  const lineH = 92;

  const enter = progress(frame, 0, fps * 0.8);
  const bookW = 860;
  const bookH = 1360;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #e9e4da 0%, #d9d2c3 100%)",
        fontFamily: FONT_SANS,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: bookW,
          height: bookH,
          marginTop: -40,
          transform: `translateY(${(1 - enter) * 120}px) rotate(${-3 - (1 - enter) * 6}deg)`,
          opacity: enter,
        }}
      >
        {/* tumpukan halaman di belakang */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "translate(10px, 12px)",
            background: "#cfc9bc",
            borderRadius: "10px 22px 22px 10px",
          }}
        />
        {/* kertas */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fdfdfb",
            borderRadius: "10px 22px 22px 10px",
            boxShadow: "0 24px 40px rgba(60,45,20,0.28)",
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${lineH - 2}px, #c7d8ee ${lineH - 2}px, #c7d8ee ${lineH}px)`,
            backgroundPosition: "0 28px",
            overflow: "hidden",
          }}
        />

        <SpiralRings edgeX={0} top={30} height={bookH - 60} spacing={54} />

        {/* isi tulisan */}
        <div style={{ position: "absolute", left: 120, right: 50, top: 28 }}>
          <div
            style={{
              fontFamily: FONT_HAND,
              fontSize: 48,
              fontWeight: 700,
              color: `${ink}aa`,
              lineHeight: `${lineH}px`,
              opacity: progress(frame, fps * 0.6, fps * 1.1),
            }}
          >
            {scene.subtitle || ""}
          </div>
          <div
            style={{
              fontFamily: FONT_HAND,
              fontSize: 76,
              fontWeight: 700,
              color: ink,
              lineHeight: `${lineH}px`,
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${100 - progress(frame, fps * 0.8, fps * 1.8) * 100}% 0 0)`,
            }}
          >
            {scene.title}
          </div>
          {lines.map((l, i) => {
            const s = fps * 1.8 + i * fps * 0.9;
            const p = progress(frame, s, s + fps * 0.8);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 18,
                  fontFamily: FONT_HAND,
                  fontSize: 58,
                  color: ink,
                  lineHeight: `${lineH}px`,
                  clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
                }}
              >
                <span style={{ opacity: 0.7 }}>✦</span>
                <span>{l}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color="#4b3f2a" />
    </AbsoluteFill>
  );
};
