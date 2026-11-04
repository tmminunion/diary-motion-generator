import { TransitionType } from "@/types/editor";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { springTiming } from "@remotion/transitions";

export function getTransitionPresentation(type: TransitionType): any {
  switch (type) {
    case "slide_right":
      return slide({ direction: "from-right" });
    case "slide_left":
      return slide({ direction: "from-left" });
    case "slide_up":
      return slide({ direction: "from-bottom" });
    case "fade":
      return fade();
    case "flip":
      return flip();
    case "wipe":
      return wipe();
    case "none":
    default:
      return fade();
  }
}

export function getTransitionTiming(fps: number = 30) {
  return springTiming({
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 120,
    },
    durationInFrames: Math.round(fps * 0.7), // 0.7s transition
  });
}
