import { SceneType, TemplateId } from "@/types/editor";

/**
 * Template -> tipe scene default. Sumber tunggal dipakai VideoComposition
 * (render) dan InsertSceneModal (daftar template di editor).
 * Template baru cukup ditambah di sini + presets + VideoComposition.
 */
export const TEMPLATE_DEFAULT_TYPE: Record<TemplateId, SceneType> = {
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
  neon_sign: "neon_sign",
  before_after: "before_after",
  checklist_todo: "checklist_todo",
  cinematic_title: "cinematic_title",
  countdown_intro: "countdown_intro",
  spiral_notebook: "spiral_notebook",
  timeline_story: "timeline_story",
  qna_card: "qna_card",
  receipt_struk: "receipt_struk",
  poll_versus: "poll_versus",
  hud_scanner: "hud_scanner",
  glass_aurora: "glass_aurora",
  ai_prompt: "ai_prompt",
};
