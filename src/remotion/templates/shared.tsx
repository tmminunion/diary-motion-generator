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
