import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/**
 * Sebelum vs Sesudah. content = dua baris:
 *   "Sebelum: ..." dan "Sesudah: ..."  (awalan sebelum ':' dipakai sebagai label)
 * Tanpa awalan, label default SEBELUM / SESUDAH.
 */
const parseSide = (line: string | undefined, fallbackLabel: string) => {
  if (!line) return { label: fallbackLabel, text: "" };
  const m = line.match(/^([^:]{1,14}):\s*(.+)$/);
  return m ? { label: m[1].trim().toUpperCase(), text: m[2].trim() } : { label: fallbackLabel, text: line };
};

export const BeforeAfterScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#22c55e";
  const lines = splitLines(scene.content);
  const before = parseSide(lines[0], "SEBELUM");
  const after = parseSide(lines[1], "SESUDAH");

  const head = progress(frame, 0, 15);
  const a = spring({ frame: frame - fps * 0.6, fps, config: { damping: 15 } });
  const b = spring({ frame: frame - fps * 2.2, fps, config: { damping: 15 } });
  const arrow = spring({ frame: frame - fps * 1.8, fps, config: { damping: 10 } });
  const c = (v: number) => Math.min(1, Math.max(0, v));

  const card = (
    label: string,
    text: string,
    color: string,
    bg: string,
    p: number,
    fromX: number
  ) => (
    <div
      style={{
        flex: 1,
        borderRadius: 40,
        padding: "40px 48px",
        background: bg,
        border: `3px solid ${color}`,
        opacity: c(p),
        transform: `translateX(${(1 - c(p)) * fromX}px)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          padding: "6px 24px",
          borderRadius: 999,
          background: color,
          color: "#0b1020",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "0.16em",
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 28, fontSize: 56, fontWeight: 800, lineHeight: 1.25 }}>{text}</div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0b1020 0%, #131a33 100%)",
        fontFamily: FONT_SANS,
        color: "#f8fafc",
        padding: "120px 56px 170px",
      }}
    >
      <div style={{ textAlign: "center", opacity: head, marginBottom: 36 }}>
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.15 }}>{scene.title}</div>
        {scene.subtitle ? (
          <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 8, fontWeight: 600 }}>{scene.subtitle}</div>
        ) : null}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
        {card(before.label, before.text, "#f87171", "rgba(248,113,113,0.10)", a, -240)}

        <div style={{ height: 70, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2 }}>
          <div
            style={{
              width: 92,
              height: 92,
              marginTop: -10,
              borderRadius: 46,
              background: accent,
              color: "#0b1020",
              fontSize: 56,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${c(arrow)})`,
              boxShadow: `0 0 0 10px ${accent}33`,
            }}
          >
            ↓
          </div>
        </div>

        {card(after.label, after.text, accent, `${accent}1a`, b, 240)}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
