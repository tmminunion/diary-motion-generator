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
 * Prompt AI: asisten AI futuristik dengan orb berdenyut. Baris pertama isi = prompt
 * yang diketik, baris berikutnya = jawaban yang mengalir kata demi kata.
 * title = nama asisten, subtitle = status.
 */
export const AiPromptScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#7c5cff";

  const lines = splitLines(scene.content);
  const prompt = lines[0] || "";
  const answer = lines.slice(1);

  // ketik prompt
  const promptStart = fps * 0.7;
  const typeRate = 0.85; // karakter per frame
  const promptChars = Math.min(
    prompt.length,
    Math.max(0, Math.floor((frame - promptStart) * typeRate))
  );
  const promptDone = promptStart + prompt.length / typeRate;

  // jawaban mengalir kata demi kata setelah jeda "berpikir"
  const thinkEnd = promptDone + fps * 0.9;
  const wordRate = fps / 7; // frame per kata
  const wordsShown = Math.max(0, Math.floor((frame - thinkEnd) / wordRate) + 1);
  const thinking = frame >= promptDone && frame < thinkEnd;
  const caretOn = Math.floor(frame / (fps / 2)) % 2 === 0;

  let budget = wordsShown;
  const answerLines = answer.map((l) => {
    const words = l.split(/\s+/).filter(Boolean);
    const take = Math.max(0, Math.min(words.length, budget));
    budget -= take;
    return words.slice(0, take).join(" ");
  });
  const lastVisible = answerLines.reduce((acc, t, i) => (t ? i : acc), -1);

  const pulse = 1 + 0.06 * Math.sin(frame / 8);
  const headIn = progress(frame, 0, fps * 0.5);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 12%, ${accent}33 0%, #0a0a14 58%)`,
        fontFamily: FONT_SANS,
        color: "#f3f4ff",
      }}
    >
      <div style={{ padding: "140px 64px 170px", display: "flex", flexDirection: "column" }}>
        {/* orb + identitas */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            opacity: headIn,
            transform: `translateY(${(1 - headIn) * 30}px)`,
          }}
        >
          <div style={{ position: "relative", width: 170, height: 170, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, #fff 0%, ${accent} 38%, ${accent}00 74%)`,
                boxShadow: `0 0 70px ${accent}aa`,
                transform: `scale(${pulse})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -16,
                borderRadius: "50%",
                border: `3px dashed ${accent}99`,
                transform: `rotate(${frame * 1.6}deg)`,
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>{scene.title}</div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT_MONO,
                fontSize: 30,
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: accent,
              }}
            >
              <span style={{ opacity: 0.55 + 0.45 * Math.sin(frame / 6) }}>●</span>{" "}
              {scene.subtitle || "online"}
            </div>
          </div>
        </div>

        {/* prompt pengguna */}
        <div
          style={{
            marginTop: 80,
            alignSelf: "flex-end",
            maxWidth: "88%",
            padding: "34px 42px",
            borderRadius: 40,
            borderBottomRightRadius: 10,
            background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
            boxShadow: `0 0 34px ${accent}66`,
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.35,
            opacity: frame >= promptStart - 4 ? 1 : 0,
            minWidth: 160,
          }}
        >
          {prompt.slice(0, promptChars)}
          {promptChars < prompt.length ? (
            <span style={{ opacity: caretOn ? 1 : 0 }}>▍</span>
          ) : null}
        </div>

        {/* jawaban AI */}
        <div
          style={{
            marginTop: 54,
            padding: "40px 46px",
            borderRadius: 40,
            borderTopLeftRadius: 10,
            background: "rgba(255,255,255,0.06)",
            border: `2px solid ${accent}55`,
            minHeight: 220,
            opacity: frame >= promptDone ? 1 : 0,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: accent,
              marginBottom: 22,
            }}
          >
            {(scene.title || "AI").toUpperCase()}
          </div>
          {thinking ? (
            <div style={{ display: "flex", gap: 16, paddingTop: 10 }}>
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: accent,
                    opacity: 0.3 + 0.7 * Math.max(0, Math.sin(frame / 4 - d * 1.1)),
                  }}
                />
              ))}
            </div>
          ) : (
            answerLines.map((t, i) =>
              t ? (
                <div
                  key={i}
                  style={{
                    fontSize: 42,
                    fontWeight: 500,
                    lineHeight: 1.45,
                    marginTop: i === 0 ? 0 : 20,
                    color: "#e9ebff",
                  }}
                >
                  {t}
                  {i === lastVisible ? (
                    <span style={{ color: accent, opacity: caretOn ? 1 : 0 }}> ▍</span>
                  ) : null}
                </div>
              ) : null
            )
          )}
        </div>
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} color={accent} />
    </AbsoluteFill>
  );
};
