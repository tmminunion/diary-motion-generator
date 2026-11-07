import React from "react";
import { interpolate } from "remotion";

/**
 * Helper ringan untuk template baru.
 * Sengaja TANPA backdrop-filter / blur besar supaya render di Cloud Run
 * (free tier, CPU kecil) tetap cepat dan hemat memori.
 */

export const FONT_SANS = '"Plus Jakarta Sans", system-ui, sans-serif';
export const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';
export const FONT_HAND = '"Caveat", "Comic Sans MS", cursive';

/** Pecah content jadi baris tidak kosong. */
export const splitLines = (content: string): string[] =>
  (content || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** Progres 0..1 antara dua frame. */
export const progress = (frame: number, from: number, to: number): number =>
  clamp01(interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

/** Format angka gaya Indonesia (titik ribuan) tanpa bergantung ICU. */
export const formatId = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Watermark kreator di bagian bawah. */
export const AuthorFooter: React.FC<{
  authorName?: string;
  authorHandle?: string;
  color?: string;
}> = ({ authorName = "Aa Baim", authorHandle = "@bungtemin", color = "#ffffff" }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 48,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      fontFamily: FONT_SANS,
      fontSize: 24,
      fontWeight: 700,
      color,
      opacity: 0.7,
    }}
  >
    <span>{authorName}</span>
    <span style={{ opacity: 0.6 }}>{authorHandle}</span>
  </div>
);

export interface TemplateSceneProps {
  scene: import("@/types/editor").SceneData;
  authorName?: string;
  authorHandle?: string;
}

/**
 * Cincin spiral ala buku catatan. Taruh di dalam container kertas
 * (position: relative). `edgeX` = posisi tepi kiri kertas relatif container.
 * Lubang ada di dalam kertas, loop kawat keluar melewati tepi kiri.
 */
export const SpiralRings: React.FC<{
  edgeX?: number;
  top?: number;
  height: number;
  spacing?: number;
  wire?: string;
}> = ({ edgeX = 0, top = 0, height, spacing = 52, wire = "#2b2d35" }) => {
  const count = Math.max(1, Math.floor((height - 20) / spacing));
  const startY = top + (height - (count - 1) * spacing) / 2;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const y = startY + i * spacing;
        return (
          <React.Fragment key={i}>
            {/* lubang di kertas */}
            <div
              style={{
                position: "absolute",
                left: edgeX + 30,
                top: y - 8,
                width: 20,
                height: 16,
                borderRadius: "50%",
                background: "radial-gradient(ellipse at 40% 35%, #8a8f99 0%, #3a3d46 70%)",
              }}
            />
            {/* loop kawat */}
            <div
              style={{
                position: "absolute",
                left: edgeX - 30,
                top: y - 14,
                width: 82,
                height: 28,
                borderRadius: "50%",
                border: `6px solid ${wire}`,
                borderRightColor: wire,
                boxSizing: "border-box",
              }}
            />
            {/* kilap logam */}
            <div
              style={{
                position: "absolute",
                left: edgeX - 20,
                top: y - 11,
                width: 62,
                height: 12,
                borderRadius: "50%",
                borderTop: "2px solid rgba(220,225,235,0.75)",
                boxSizing: "border-box",
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
