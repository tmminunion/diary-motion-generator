import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AuthorFooter, FONT_SANS, TemplateSceneProps, formatId, progress, splitLines } from "./shared";

/**
 * Statistik angka: format baris "ANGKA|Label", contoh "1250000|Pengguna aktif",
 * "98%|Kepuasan", "Rp 5.000|Harga". Angka berhitung naik dengan easing.
 */
const parseStat = (line: string) => {
  const [rawValue, ...rest] = line.split("|");
  const label = rest.join("|").trim();
  const m = (rawValue || "").match(/^(\D*?)([\d.,]+)(.*)$/);
  if (!m) return { prefix: "", value: 0, decimals: 0, suffix: "", label: label || rawValue, raw: rawValue };
  const [, prefix, num, suffix] = m;
  const decimal = num.match(/,(\d{1,2})$/);
  const decimals = decimal ? decimal[1].length : 0;
  const cleaned = decimal ? num.replace(/\./g, "").replace(",", ".") : num.replace(/[.,]/g, "");
  return { prefix: prefix.trim(), value: parseFloat(cleaned) || 0, decimals, suffix, label, raw: rawValue };
};

export const StatCounterScene: React.FC<TemplateSceneProps> = ({
  scene,
  authorName,
  authorHandle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = scene.themeColor || "#34d399";
  const stats = splitLines(scene.content).map(parseStat);
  const head = progress(frame, 0, 18);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #04141a 0%, #0a2530 100%)",
        fontFamily: FONT_SANS,
        color: "#ecfeff",
        padding: "140px 64px 0",
      }}
    >
      <div style={{ opacity: head, transform: `translateY(${(1 - head) * -30}px)` }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.18em", color: accent }}>
          {(scene.subtitle || "DALAM ANGKA").toUpperCase()}
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, marginTop: 12, lineHeight: 1.12 }}>
          {scene.title}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 44,
          paddingBottom: 150,
        }}
      >
        {stats.map((s, i) => {
          const startF = fps * 0.6 + i * fps * 0.7;
          const p = interpolate(frame, [startF, startF + fps * 1.6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const cur = s.value * p;
          const shown = s.decimals
            ? cur.toFixed(s.decimals).replace(".", ",")
            : formatId(cur);
          const enter = progress(frame, startF, startF + 10);
          return (
            <div
              key={i}
              style={{
                opacity: enter,
                transform: `translateY(${(1 - enter) * 40}px)`,
                borderLeft: `8px solid ${accent}`,
                paddingLeft: 32,
              }}
            >
              <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, color: accent }}>
                {s.prefix ? `${s.prefix} ` : ""}
                {shown}
                {s.suffix}
              </div>
              <div style={{ fontSize: 40, fontWeight: 600, color: "#a5d8e6", marginTop: 8 }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      <AuthorFooter authorName={authorName} authorHandle={authorHandle} />
    </AbsoluteFill>
  );
};
