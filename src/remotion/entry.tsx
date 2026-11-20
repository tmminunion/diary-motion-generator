import React from "react";
import { registerRoot, Composition } from "remotion";
import { VideoComposition } from "./VideoComposition";
import { VideoProjectState } from "../types/editor";
import { getTotalDurationInFrames } from "./duration";
import { AfterProductionDiaryComposition, diaryDurationInFrames, FPS as DIARY_FPS, W as DIARY_W, H as DIARY_H } from "./AfterDiary";

/**
 * Entry point Remotion untuk render server (Cloud Run / diary-studio).
 * File ini ikut disalin oleh scripts/sync-to-diary.sh, jadi durasi render
 * selalu dihitung dengan helper yang sama dengan Player di editor.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="AfterDiary"
      component={AfterProductionDiaryComposition as any}
      durationInFrames={300}
      fps={DIARY_FPS}
      width={DIARY_W}
      height={DIARY_H}
      defaultProps={{ data: { date: "2026-01-01", shift: "RED", jamPulang: "-", tasks: [] } } as unknown as Record<string, unknown>}
      calculateMetadata={({ props }) => {
        const tasks = ((props as any)?.data?.tasks || []) as unknown[];
        return { durationInFrames: diaryDurationInFrames(tasks.length), fps: DIARY_FPS, width: DIARY_W, height: DIARY_H };
      }}
    />
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
      } as unknown as Record<string, unknown>}
      calculateMetadata={({ props }) => {
        const project = props as unknown as VideoProjectState;
        const fps = project.fps || 30;
        return {
          durationInFrames: getTotalDurationInFrames(project.scenes || [], fps),
          fps,
          width: 1080,
          height: 1920,
        };
      }}
    />
    </>
  );
};

registerRoot(RemotionRoot);
