import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

/**
 * Template memakai "Plus Jakarta Sans" dan "JetBrains Mono" tetapi font-nya
 * sebelumnya tidak pernah dimuat, jadi browser editor dan Chromium di Cloud Run
 * memakai font fallback yang berbeda. Fungsi ini dipanggil dari VideoComposition
 * sehingga berlaku di Player maupun render server (delayRender ditangani Remotion).
 */
let loaded = false;

export const ensureFonts = (): void => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    loadPlusJakartaSans("normal", {
      weights: ["600", "700", "800"],
      subsets: ["latin"],
    });
    loadJetBrainsMono("normal", {
      weights: ["400", "500", "700"],
      subsets: ["latin"],
    });
    loadCaveat("normal", {
      weights: ["400", "700"],
      subsets: ["latin"],
    });
  } catch (err) {
    console.warn("[fonts] Gagal memuat font, memakai fallback:", err);
  }
};
