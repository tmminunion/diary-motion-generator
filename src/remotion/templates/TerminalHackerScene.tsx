import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_MONO, TemplateSceneProps, splitLines } from "./shared";

/**
 * Terminal hacker: baris berawalan "$ " diketik per karakter,
 * baris lain muncul sebagai output setelah perintah selesai.
 */
export const TerminalHackerScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const green = scene.themeColor || "#22c55e";
  const lines = splitLines(scene.content);
  const charsPerFrame = 1.2;
  const lineGap = 10; // jeda antar baris (frame)

  let cursorFrame = fps * 0.5;
  const timeline = lines.map((line) => {
    const isCmd = line.startsWith("$");
    const typeFrames = isCmd ? Math.ceil(line.length / charsPerFrame) : 4;
    const startF = cursorFrame;
    cursorFrame += typeFrames + lineGap;
    return { line, isCmd, startF, typeFrames };
  });

  const blink = Math.floor(frame / 12) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: "#020a05",
        fontFamily: FONT_MONO,
        color: green,
        padding: "120px 48px 0",
      }}
    >
      <div
        style={{
          borderRadius: 26,
          border: `2px solid ${green}55`,
          background: "#04120a",
          overflow: "hidden",
          flex: 1,
          marginBottom: 150,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 26px",
            background: "#0a1f13",
            borderBottom: `1px solid ${green}33`,
          }}
        >
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
          ))}
          <span style={{ marginLeft: 16, fontSize: 24, opacity: 0.75 }}>
            {scene.title || "terminal"} {scene.subtitle ? `— ${scene.subtitle}` : ""}
          </span>
        </div>

        <div style={{ padding: "34px 30px", fontSize: 34, lineHeight: 1.6, flex: 1 }}>
          {timeline.map((t, i) => {
            if (frame < t.startF) return null;
            const shown = t.isCmd
              ? t.line.slice(0, Math.floor((frame - t.startF) * charsPerFrame))
              : t.line;
            const done = !t.isCmd || shown.length >= t.line.length;
            const isLast = i === timeline.length - 1 || frame < timeline[i + 1].startF;
            return (
              <div
                key={i}
                style={{
                  color: t.isCmd ? green : "#a7f3d0",
                  opacity: t.isCmd ? 1 : 0.85,
                  wordBreak: "break-word",
                }}
              >
                {shown}
                {isLast && (!done || blink) ? (
                  <span style={{ background: green, color: "#04120a" }}>&nbsp;</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color={green} />
    </AbsoluteFill>
  );
};
