import type { SceneData } from "../types/editor";

/**
 * Sumber tunggal perhitungan durasi video.
 *
 * <TransitionSeries> membuat scene berikutnya masuk SAAT scene sebelumnya
 * masih tampil, sehingga tiap transisi "memakan" sejumlah frame overlap.
 * Total frame video = jumlah durasi scene - (jumlah transisi x frame transisi).
 *
 * Player (browser), seek timeline, entry.tsx (render Cloud Run), dan API render
 * semuanya WAJIB memakai helper ini supaya preview == hasil render.
 */

export const TRANSITION_SECONDS = 0.7;

export const getTransitionFrames = (fps: number = 30): number =>
  Math.round(fps * TRANSITION_SECONDS);

type SceneLike = Pick<SceneData, "durationInSeconds">;

export const getSceneFrames = (scene: SceneLike, fps: number = 30): number =>
  Math.round((Number(scene.durationInSeconds) || 5) * fps);

/** Frame awal scene ke-`index` pada timeline (sudah memperhitungkan overlap transisi). */
export const getSceneStartFrame = (
  scenes: SceneLike[],
  index: number,
  fps: number = 30
): number => {
  let frame = 0;
  const overlap = getTransitionFrames(fps);
  for (let i = 0; i < index && i < scenes.length; i++) {
    frame += getSceneFrames(scenes[i], fps) - overlap;
  }
  return Math.max(frame, 0);
};

/** Total frame komposisi. */
export const getTotalDurationInFrames = (
  scenes: SceneLike[],
  fps: number = 30
): number => {
  if (!scenes || scenes.length === 0) return 30;
  const sum = scenes.reduce((acc, s) => acc + getSceneFrames(s, fps), 0);
  const overlap = (scenes.length - 1) * getTransitionFrames(fps);
  return Math.max(sum - overlap, 30);
};
