import type { ContentBlock } from './types';

export interface EpisodeData {
  metadata: {
    id: string;
    level: string;
    order: number;
    title: string;
    subtitle: string;
    duration: number;
    category: string;
    isLocked: boolean;
    isNew: boolean;
    audioFile: string;
  };
  content: ContentBlock[];
  vocabulary: Array<{
    word: string;
    translations: {
      es: string;
      pt: string;
    };
    partOfSpeech: string;
    example: string;
  }>;
  expressions: Array<{
    expression: string;
    meaning: string;
    usage: string;
    example: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  aiConversation: Array<{
    prompt: string;
    context: string;
    expectedVocabulary: string[];
    rubric?: Record<string, string>;
  }>;
}

export async function loadEpisodeData(episodeId: string): Promise<EpisodeData | null> {
  try {
    // Map episode ID to folder path
    // Episode IDs are like 'b1', 'b2', 'i1', 'a1', etc.
    // We need to map to a1 level for beginner episodes
    let level = 'a1'; // Default to beginner
    let folderName = '02-placeholder';
    
    // Map b1 (Morning Coffee) to a1/01-morning-coffee
    if (episodeId === 'b1') {
      level = 'a1';
      folderName = '01-morning-coffee';
    }
    
    const response = await fetch(`/content/episodes/${level}/${folderName}/episode.json`);
    
    if (!response.ok) {
      console.error(`Failed to load episode data for ${episodeId}. URL: /content/episodes/${level}/${folderName}/episode.json`);
      return null;
    }
    
    const data: EpisodeData = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading episode data:', error);
    return null;
  }
}

export function getEpisodeBasePath(episodeId: string): string {
  let level = 'a1';
  let folderName = '02-placeholder';
  
  if (episodeId === 'b1') {
    level = 'a1';
    folderName = '01-morning-coffee';
  }
  
  return `/content/episodes/${level}/${folderName}`;
}
