import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/**
 * Hitung mundur. Tiap baris content = satu langkah (contoh: 3 / 2 / 1 / Mulai!).
 * Waktu dibagi rata; cincin progres mengisi di tiap langkah.
 */
export const CountdownIntroScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#f97316";
  const steps = splitLines(scene.content).length ? splitLines(scene.content) : ["3", "2", "1", "Mulai!"];
  const total = fps * scene.durationInSeconds;
  const usable = Math.max(fps, total - fps * 0.6);
  const per = usable / steps.length;
  const idx = Math.min(steps.length - 1, Math.floor(frame / per));
  const local = frame - idx * per;
  const isLast = idx === steps.length - 1;

  const pop = spring({ frame: local, fps, config: { damping: 9, mass: 0.7 } });
  const ring = isLast ? 1 : progress(local, 0, per);
  const R = 300;
  const C = 2 * Math.PI * R;
  const exit = progress(local, per - 5, per);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 45%, #2a1608 0%, #0e0904 75%)",
        fontFamily: FONT_SANS,
        color: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.15 }}>{scene.title}</div>
        {scene.subtitle ? (
          <div style={{ fontSize: 30, fontWeight: 700, color: accent, marginTop: 10, letterSpacing: "0.14em" }}>
            {scene.subtitle.toUpperCase()}
          </div>
        ) : null}
      </div>

      <div style={{ position: "relative", width: 700, height: 700, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg width={700} height={700} viewBox="0 0 700 700" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={350} cy={350} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={22} />
          <circle
            cx={350}
            cy={350}
            r={R}
            fill="none"
            stroke={accent}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - ring)}
          />
        </svg>
        <div
          style={{
            fontSize: steps[idx].length > 3 ? 150 : 300,
            fontWeight: 800,
            color: isLast ? accent : "#fff",
            transform: `scale(${Math.min(1.1, 0.4 + pop * 0.7)})`,
            opacity: 1 - exit * (isLast ? 0 : 0.8),
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {steps[idx]}
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
