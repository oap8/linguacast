// Episode content types for podcast interaction page

// Rich content block types for transcript
export type ContentBlock =
  | { type: 'heading'; text: string; level: 1 | 2 | 3 }
  | { type: 'text'; text: string; highlight?: boolean }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'audio-cue'; text: string; timestamp: number }
  | { type: 'practice'; instruction: string; expected: string }
  | { type: 'dialogue'; speaker: string; text: string }
  | { type: 'section'; title: string; blocks: ContentBlock[] };

export interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime: number;
  text: string;
  speaker?: string;
}

export interface Expression {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
  type: 'idiom' | 'slang' | 'phrasal_verb' | 'expression' | 'grammar';
}

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  audioUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AIConversationPrompt {
  id: string;
  question: string;
  expectedTopics: string[]; // Topics AI will check for in user's response
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface EpisodeContent {
  episodeId: string;
  transcript: TranscriptSegment[];
  expressions: Expression[];
  vocabulary: VocabularyWord[];
  quiz: QuizQuestion[];
  aiPrompts: AIConversationPrompt[];
}

export interface EpisodeMeta {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  audioUrl: string;
  thumbnail: string;
  category: string;
  isNew?: boolean;
  isLocked: boolean;
  order: number; // Position within level (1-12)
}

// Progress tracking for episode completion
export interface EpisodeProgress {
  episodeId: string;
  listenedSeconds: number;
  completedSections: {
    transcript: boolean;
    expressions: boolean;
    vocabulary: boolean;
    quiz: boolean;
    aiConversation: boolean;
  };
  quizScore?: number;
  completedAt?: string;
}
