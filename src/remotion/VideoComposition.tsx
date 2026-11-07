import React from "react";
import { Audio, staticFile } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { SceneType, TemplateId, VideoProjectState } from "@/types/editor";
import { CodingAsmrScene } from "./templates/CodingAsmrScene";
import { StoryChatScene } from "./templates/StoryChatScene";
import { AudioSpectrumScene } from "./templates/AudioSpectrumScene";
import { ImageCinematicScene } from "./templates/ImageCinematicScene";
import { RobloxStoryScene } from "./templates/RobloxStoryScene";
import { QuoteMinimalScene } from "./templates/QuoteMinimalScene";
import { LyricKaraokeScene } from "./templates/LyricKaraokeScene";
import { TopListScene } from "./templates/TopListScene";
import { BreakingNewsScene } from "./templates/BreakingNewsScene";
import { TerminalHackerScene } from "./templates/TerminalHackerScene";
import { DiaryPaperScene } from "./templates/DiaryPaperScene";
import { ChatDmScene } from "./templates/ChatDmScene";
import { StatCounterScene } from "./templates/StatCounterScene";
import { getTransitionPresentation, getTransitionTiming } from "./transitions/TransitionRenderer";
import { ensureFonts } from "./fonts";

/** Template -> tipe scene default. Template baru cukup ditambah di sini. */
const TEMPLATE_DEFAULT_TYPE: Record<TemplateId, SceneType> = {
  asmr_code: "code",
  story_quote: "story",
  suno_visualizer: "spectrum",
  roblox_story: "roblox",
  quote_minimal: "quote_minimal",
  lyric_karaoke: "lyric_karaoke",
  top_list: "top_list",
  breaking_news: "breaking_news",
  terminal_hacker: "terminal_hacker",
  diary_paper: "diary_paper",
  chat_dm: "chat_dm",
  stat_counter: "stat_counter",
};

/** Tipe scene baru (tanpa props khusus) -> komponen. */
const SIMPLE_SCENES: Partial<
  Record<SceneType, React.FC<{ scene: any; authorName?: string; authorHandle?: string }>>
> = {
  quote_minimal: QuoteMinimalScene,
  lyric_karaoke: LyricKaraokeScene,
  top_list: TopListScene,
  breaking_news: BreakingNewsScene,
  terminal_hacker: TerminalHackerScene,
  diary_paper: DiaryPaperScene,
  chat_dm: ChatDmScene,
  stat_counter: StatCounterScene,
};

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
          const effectiveType: SceneType =
            scene.sceneType || TEMPLATE_DEFAULT_TYPE[templateId] || "code";
          const SimpleScene = SIMPLE_SCENES[effectiveType];

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
                {SimpleScene && (
                  <SimpleScene
                    scene={scene}
                    authorName={authorName}
                    authorHandle={authorHandle}
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
