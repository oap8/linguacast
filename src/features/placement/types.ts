export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface QuizQuestion {
  id: string;
  level: CEFRLevel;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface QuizResult {
  level: CEFRLevel;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean; // true if >= 70%
}

export interface PlacementResult {
  assignedLevel: CEFRLevel;
  levelResults: QuizResult[];
}

// Map CEFR levels to our app's level system
export const cefrToAppLevel = (cefr: CEFRLevel): 'beginner' | 'intermediate' | 'advanced' | 'master' => {
  switch (cefr) {
    case 'A1':
    case 'A2':
      return 'beginner';
    case 'B1':
    case 'B2':
      return 'intermediate';
    case 'C1':
      return 'advanced';
    case 'C2':
      return 'master';
  }
};

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const PASSING_THRESHOLD = 0.7; // 70%
export const QUESTIONS_PER_LEVEL = 6;
