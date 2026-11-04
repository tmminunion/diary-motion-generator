import React from "react";
import { registerRoot, Composition } from "remotion";
import { VideoComposition } from "./VideoComposition";
import { VideoProjectState } from "../types/editor";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OlipStudio"
      component={VideoComposition as any}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        templateId: "asmr_code",
        title: "Olip Video Studio",
        scenes: [],
        authorName: "Aa Baim",
        authorHandle: "@bungtemin",
        fps: 30,
      } as VideoProjectState}
      calculateMetadata={({ props }: { props: VideoProjectState }) => {
        const fps = props.fps || 30;
        const scenes = props.scenes || [];
        const totalSeconds = scenes.reduce(
          (acc: number, s: any) => acc + (Number(s.durationInSeconds) || 5),
          0
        );
        return {
          durationInFrames: Math.max(Math.round(totalSeconds * fps), 30),
          fps,
          width: 1080,
          height: 1920,
        };
      }}
    />
  );
};

registerRoot(RemotionRoot);
