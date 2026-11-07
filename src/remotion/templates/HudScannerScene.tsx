import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AuthorFooter,
  FONT_MONO,
  FONT_SANS,
  TemplateSceneProps,
  progress,
  splitLines,
} from "./shared";

/**
 * HUD Sci-Fi: panel antarmuka futuristik dengan grid, garis pemindai, siku sudut,
 * judul diketik, dan baris data. Format baris: "Label|0-100" jadi bar terisi,
 * baris lain jadi log "> teks". Tanpa blur supaya ringan di Cloud Run.
 */
export const HudScannerScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#22d3ee";
  const title = scene.title || "";

  const rows = splitLines(scene.content).map((l) => {
    const m = l.match(/^([^|]{1,28})\|\s*(-?\d+(?:[.,]\d+)?)\s*%?$/);
    return m
      ? { label: m[1].trim(), value: Math.min(100, Math.max(0, parseFloat(m[2].replace(",", ".")))), plain: "" }
      : { label: "", value: -1, plain: l };
  });

  const titleChars = Math.floor(progress(frame, fps * 0.3, fps * 1.7) * title.length);
  const caretOn = Math.floor(frame / (fps / 2)) % 2 === 0;
  const cycle = fps * 3;
  const scanTop = ((frame % cycle) / cycle) * 100;
  const secs = String(Math.floor(frame / fps)).padStart(2, "0");
  const fr = String(frame % fps).padStart(2, "0");
  const pulse = 0.55 + 0.45 * Math.sin(frame / 7);

  const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 110,
    height: 110,
    opacity: 0.55 + 0.35 * pulse,
    ...pos,
  });
  const edge = `5px solid ${accent}`;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${accent}22 0%, #02060f 62%)`,
        fontFamily: FONT_MONO,
        color: "#e6faff",
      }}
    >
      {/* grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${accent}14 1px, transparent 1px), linear-gradient(90deg, ${accent}14 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* garis pemindai */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanTop}%`,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 26px ${accent}`,
          opacity: 0.85,
        }}
      />
      {/* siku sudut */}
      <div style={corner({ top: 70, left: 50, borderTop: edge, borderLeft: edge })} />
      <div style={corner({ top: 70, right: 50, borderTop: edge, borderRight: edge })} />
      <div style={corner({ bottom: 70, left: 50, borderBottom: edge, borderLeft: edge })} />
      <div style={corner({ bottom: 70, right: 50, borderBottom: edge, borderRight: edge })} />

      <div style={{ padding: "150px 90px 170px", display: "flex", flexDirection: "column" }}>
        {/* bilah status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: accent,
          }}
        >
          <span>
            <span style={{ opacity: pulse }}>●</span> SYSTEM ONLINE
          </span>
          <span>
            T+{secs}:{fr}
          </span>
        </div>

        {scene.subtitle ? (
          <div
            style={{
              marginTop: 54,
              fontFamily: FONT_SANS,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: `${accent}`,
              opacity: progress(frame, fps * 0.1, fps * 0.6),
            }}
          >
            // {scene.subtitle}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 22,
            fontFamily: FONT_SANS,
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.08,
            color: "#fff",
            textShadow: `0 0 18px ${accent}aa`,
            minHeight: 210,
          }}
        >
          {title.slice(0, titleChars)}
          <span style={{ color: accent, opacity: caretOn ? 1 : 0 }}>▍</span>
        </div>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 40 }}>
          {rows.map((r, i) => {
            const start = fps * 1.8 + i * fps * 0.55;
            const reveal = progress(frame, start, start + fps * 0.4);
            if (reveal <= 0) return null;
            if (r.value < 0) {
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 40,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    opacity: reveal,
                    transform: `translateX(${(1 - reveal) * -40}px)`,
                    color: "#c8f4ff",
                  }}
                >
                  <span style={{ color: accent }}>&gt; </span>
                  {r.plain}
                </div>
              );
            }
            const fill = r.value * progress(frame, start, start + fps * 1.0);
            return (
              <div key={i} style={{ opacity: reveal }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>{r.label}</span>
                  <span style={{ color: accent }}>{Math.round(fill)}%</span>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    height: 22,
                    border: `2px solid ${accent}88`,
                    background: `${accent}12`,
                    padding: 3,
                  }}
                >
                  <div
                    style={{
                      width: `${fill}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${accent}66, ${accent})`,
                      boxShadow: `0 0 16px ${accent}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color={accent} />
    </AbsoluteFill>
  );
};
