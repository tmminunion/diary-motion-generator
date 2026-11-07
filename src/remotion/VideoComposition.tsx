import React from "react";
import { Audio, staticFile } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { VideoProjectState } from "@/types/editor";
import { CodingAsmrScene } from "./templates/CodingAsmrScene";
import { StoryChatScene } from "./templates/StoryChatScene";
import { AudioSpectrumScene } from "./templates/AudioSpectrumScene";
import { ImageCinematicScene } from "./templates/ImageCinematicScene";
import { RobloxStoryScene } from "./templates/RobloxStoryScene";
import { getTransitionPresentation, getTransitionTiming } from "./transitions/TransitionRenderer";
import { ensureFonts } from "./fonts";

export const VideoComposition: React.FC<VideoProjectState> = ({
  templateId,
  scenes,
  fps = 30,
  audioUrl,
  audioTitle,
  authorName = "Aa Baim",
  authorHandle = "@bungtemin",
}) => {
  ensureFonts();

  return (
    <>
      {audioUrl && <Audio src={audioUrl} />}
      <TransitionSeries>
        {scenes.map((scene, index) => {
          const durationInFrames = Math.round(scene.durationInSeconds * fps);
          const isLastScene = index === scenes.length - 1;
          const nextTransition = scene.transitionToNext || "slide_right";

          // Determine scene type: explicit sceneType or fallback to template
          const effectiveType = scene.sceneType || (
            templateId === "asmr_code" ? "code" :
            templateId === "story_quote" ? "story" :
            templateId === "suno_visualizer" ? "spectrum" :
            templateId === "roblox_story" ? "roblox" : "code"
          );

          return (
            <React.Fragment key={scene.id}>
              <TransitionSeries.Sequence
                name={scene.name}
                durationInFrames={durationInFrames}
              >
                {effectiveType === "image" && (
                  <ImageCinematicScene
                    scene={scene}
                    authorName={authorName}
                    authorHandle={authorHandle}
                  />
                )}
                {effectiveType === "code" && (
                  <CodingAsmrScene
                    scene={scene}
                    authorName={authorName}
                    authorHandle={authorHandle}
                  />
                )}
                {effectiveType === "story" && (
                  <StoryChatScene
                    scene={scene}
                    authorName={authorName}
                    authorHandle={authorHandle}
                  />
                )}
                {effectiveType === "spectrum" && (
                  <AudioSpectrumScene
                    scene={scene}
                    authorName={authorName}
                    authorHandle={authorHandle}
                    audioTitle={audioTitle}
                  />
                )}
                {effectiveType === "roblox" && (
                  <RobloxStoryScene
                    scene={scene}
                    authorName={authorName}
                    authorHandle={authorHandle}
                  />
                )}
              </TransitionSeries.Sequence>

              {!isLastScene && (
                <TransitionSeries.Transition
                  presentation={getTransitionPresentation(nextTransition) as any}
                  timing={getTransitionTiming(fps) as any}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </>
  );
};
