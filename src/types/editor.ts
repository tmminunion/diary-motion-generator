export type TransitionType =
  | "slide_right"
  | "slide_left"
  | "slide_up"
  | "fade"
  | "flip"
  | "wipe"
  | "none";

export type SceneType =
  | "code"
  | "story"
  | "spectrum"
  | "image"
  | "roblox"
  | "quote_minimal"
  | "lyric_karaoke"
  | "top_list"
  | "breaking_news"
  | "terminal_hacker"
  | "diary_paper"
  | "chat_dm"
  | "stat_counter"
  | "neon_sign"
  | "before_after"
  | "checklist_todo"
  | "cinematic_title"
  | "countdown_intro"
  | "spiral_notebook"
  | "timeline_story"
  | "qna_card"
  | "receipt_struk"
  | "poll_versus";

export interface SceneData {
  id: string;
  name: string;
  durationInSeconds: number; // e.g. 15s
  title: string;
  subtitle?: string;
  content: string; // Code snippet, chat text, or quote
  themeColor?: string; // Custom highlight color
  transitionToNext?: TransitionType; // Transition leading to next scene
  sceneType?: SceneType; // Type of scene rendering
  imageUrl?: string; // Image URL or Base64 data URL for photo slides
  characterId?: string; // Character identifier: 'noob' | 'bacon' | 'pink_girl' | 'police' | 'dominus' | 'hacker' | 'chill_guy' | 'ceo' | 'olip' | 'custom'
  customAvatarUrl?: string; // Base64 or URL for custom avatar image
  backgroundTheme?: string; // 'rainbow_obby' | 'minecraft' | 'cyberpunk' | 'studio' | 'custom'
  customBgUrl?: string; // Base64 or URL for custom background
  audioVoiceUrl?: string; // Audio URL / Data URL for voice over
  voiceType?: string; // Voice gender/style e.g. 'id_male' | 'id_female' | 'robot'
  avatarPosition?: "center" | "bottom" | "left" | "right"; // Position of character
}

export type TemplateId =
  | "asmr_code"
  | "story_quote"
  | "suno_visualizer"
  | "roblox_story"
  | "quote_minimal"
  | "lyric_karaoke"
  | "top_list"
  | "breaking_news"
  | "terminal_hacker"
  | "diary_paper"
  | "chat_dm"
  | "stat_counter"
  | "neon_sign"
  | "before_after"
  | "checklist_todo"
  | "cinematic_title"
  | "countdown_intro"
  | "spiral_notebook"
  | "timeline_story"
  | "qna_card"
  | "receipt_struk"
  | "poll_versus";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  badge: string;
  icon: string;
  defaultScenes: SceneData[];
  defaultAudioUrl?: string;
}

export interface VideoProjectState {
  title: string;
  templateId: TemplateId;
  aspectRatio: "9:16" | "16:9";
  fps: number;
  scenes: SceneData[];
  audioUrl?: string;
  audioTitle?: string;
  authorName: string;
  authorHandle: string;
}
