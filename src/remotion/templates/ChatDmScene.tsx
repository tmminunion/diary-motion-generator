import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, splitLines } from "./shared";

/**
 * Chat DM: format baris "Nama: pesan". Pembicara pertama di kiri (abu),
 * pembicara lain di kanan (warna tema). Baris tanpa "Nama:" dianggap pembicara kedua.
 */
export const ChatDmScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#3b82f6";

  const parsed = splitLines(scene.content).map((l) => {
    const m = l.match(/^([^:]{1,20}):\s*(.+)$/);
    return m ? { who: m[1].trim(), text: m[2].trim() } : { who: "", text: l };
  });
  const first = parsed.find((p) => p.who)?.who || "";
  const msgs = parsed.map((p) => ({ ...p, mine: p.who !== first }));
  const step = Math.max(fps * 1.1, 12);

  return (
    <AbsoluteFill
      style={{ background: "#0b141a", fontFamily: FONT_SANS, color: "#e9edef" }}
    >
      <div
        style={{
          padding: "110px 44px 28px",
          background: "#1f2c34",
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {(first || scene.title || "?").charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>{first || scene.title}</div>
          <div style={{ fontSize: 24, color: "#8696a0", fontWeight: 600 }}>
            {scene.subtitle || "online"}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "40px 40px 170px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 22,
        }}
      >
        {msgs.map((m, i) => {
          const p = spring({
            frame: frame - (fps * 0.5 + i * step),
            fps,
            config: { damping: 14, mass: 0.7 },
          });
          const v = Math.min(1, Math.max(0, p));
          if (frame < fps * 0.5 + i * step - 2) return null;
          return (
            <div
              key={i}
              style={{
                alignSelf: m.mine ? "flex-end" : "flex-start",
                maxWidth: "78%",
                padding: "22px 30px",
                borderRadius: 30,
                borderBottomRightRadius: m.mine ? 8 : 30,
                borderBottomLeftRadius: m.mine ? 30 : 8,
                background: m.mine ? accent : "#202c33",
                color: m.mine ? "#fff" : "#e9edef",
                fontSize: 38,
                lineHeight: 1.35,
                fontWeight: 600,
                opacity: v,
                transform: `scale(${0.8 + 0.2 * v}) translateY(${(1 - v) * 24}px)`,
                transformOrigin: m.mine ? "bottom right" : "bottom left",
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
