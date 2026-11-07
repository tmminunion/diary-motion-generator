import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, progress, splitLines } from "./shared";

/** Checklist / to-do: item muncul lalu dicentang berurutan, ada penghitung progres. */
export const ChecklistTodoScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#10b981";
  const items = splitLines(scene.content);
  const step = fps * 1.1;
  const t0 = fps * 0.8;

  const checkedCount = items.filter((_, i) => frame >= t0 + i * step + fps * 0.5).length;
  const pct = items.length ? checkedCount / items.length : 0;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #f8fafc 0%, #e2e8f0 100%)",
        fontFamily: FONT_SANS,
        color: "#0f172a",
        padding: "130px 60px 0",
      }}
    >
      <div style={{ opacity: progress(frame, 0, 15) }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: accent, letterSpacing: "0.16em" }}>
          {(scene.subtitle || "CHECKLIST").toUpperCase()}
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.12, marginTop: 10 }}>{scene.title}</div>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ flex: 1, height: 18, borderRadius: 9, background: "#cbd5e1", overflow: "hidden" }}>
            <div style={{ width: `${pct * 100}%`, height: "100%", background: accent, borderRadius: 9 }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: accent }}>
            {checkedCount}/{items.length}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 46, display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((item, i) => {
          const s = t0 + i * step;
          const appear = spring({ frame: frame - s, fps, config: { damping: 15 } });
          const a = Math.min(1, Math.max(0, appear));
          const check = progress(frame, s + fps * 0.5, s + fps * 0.5 + 8);
          const done = check >= 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 30px",
                borderRadius: 28,
                background: "#fff",
                boxShadow: "0 4px 14px rgba(15,23,42,0.10)",
                opacity: a,
                transform: `translateY(${(1 - a) * 40}px)`,
              }}
            >
              <div
                style={{
                  width: 66,
                  height: 66,
                  flexShrink: 0,
                  borderRadius: 20,
                  border: `5px solid ${done ? accent : "#94a3b8"}`,
                  background: done ? accent : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={40} height={40} viewBox="0 0 40 40">
                  <path
                    d="M8 21 L17 30 L33 11"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={50}
                    strokeDashoffset={50 * (1 - check)}
                  />
                </svg>
              </div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: done ? "#64748b" : "#0f172a",
                  textDecoration: done ? "line-through" : "none",
                  textDecorationColor: "#94a3b8",
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color="#334155" />
    </AbsoluteFill>
  );
};
