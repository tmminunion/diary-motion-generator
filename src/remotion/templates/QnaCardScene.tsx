import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/**
 * Tanya jawab ala stiker pertanyaan Instagram.
 * Baris pertama content = pertanyaan, baris berikutnya = jawaban (muncul kata per kata).
 * title = nama penanya/label kartu, subtitle = penjawab.
 */
export const QnaCardScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#f43f5e";
  const lines = splitLines(scene.content);
  const question = lines[0] || "";
  const answer = lines.slice(1).join(" ");
  const words = answer.split(/\s+/).filter(Boolean);

  const card = Math.min(1, Math.max(0, spring({ frame: frame - 4, fps, config: { damping: 13, mass: 0.8 } })));
  const ansStart = fps * 2;
  const shown = Math.floor(progress(frame, ansStart, ansStart + Math.max(words.length * 5, 20)) * words.length);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${accent} 0%, #7c3aed 100%)`,
        fontFamily: FONT_SANS,
        justifyContent: "center",
        padding: "0 64px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 48,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          transform: `scale(${0.85 + 0.15 * card}) translateY(${(1 - card) * 80}px)`,
          opacity: card,
        }}
      >
        <div style={{ padding: "34px 44px", background: "#f8fafc", display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: accent,
              color: "#fff",
              fontSize: 32,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(scene.title || "?").charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#475569" }}>{scene.title || "Anonim"} bertanya</div>
        </div>
        <div style={{ padding: "50px 44px 56px", fontSize: 56, fontWeight: 800, lineHeight: 1.2, color: "#0f172a" }}>
          {question}
        </div>
      </div>

      <div style={{ marginTop: 56, color: "#fff", fontSize: 50, fontWeight: 700, lineHeight: 1.3, minHeight: 360 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 5, opacity: 0.8, marginBottom: 14 }}>
          {(scene.subtitle || "JAWABAN").toUpperCase()}
        </div>
        {words.slice(0, shown).join(" ")}
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>▍</span>
      </div>
      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
