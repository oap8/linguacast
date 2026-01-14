import { getRandomQuestionsForLevel } from './questions';
import {
  CEFRLevel,
  QuizQuestion,
  QuizResult,
  PlacementResult,
  CEFR_ORDER,
  PASSING_THRESHOLD,
  QUESTIONS_PER_LEVEL,
  cefrToAppLevel,
} from './types';

export interface PlacementState {
  currentLevelIndex: number;
  currentQuestionIndex: number;
  currentLevelQuestions: QuizQuestion[]; // Randomly selected questions for current level
  answers: Map<string, number>; // questionId -> selectedAnswer
  levelResults: QuizResult[];
  isComplete: boolean;
  assignedLevel: CEFRLevel | null;
}

// Generate initial random questions for A1
const getInitialQuestions = () => getRandomQuestionsForLevel('A1', QUESTIONS_PER_LEVEL);

let state: PlacementState = {
  currentLevelIndex: 0,
  currentQuestionIndex: 0,
  currentLevelQuestions: getInitialQuestions(),
  answers: new Map(),
  levelResults: [],
  isComplete: false,
  assignedLevel: null,
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const getSnapshot = (): PlacementState => state;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const placementService = {
  subscribe,
  getSnapshot,

  getCurrentLevel(): CEFRLevel {
    return CEFR_ORDER[state.currentLevelIndex];
  },

  getCurrentQuestions(): QuizQuestion[] {
    return state.currentLevelQuestions;
  },

  getCurrentQuestion(): QuizQuestion | null {
    const questions = this.getCurrentQuestions();
    if (state.currentQuestionIndex >= questions.length) {
      return null;
    }
    return questions[state.currentQuestionIndex];
  },

  getProgress(): { currentQuestion: number; totalQuestions: number; currentLevel: CEFRLevel } {
    return {
      currentQuestion: state.currentQuestionIndex + 1,
      totalQuestions: QUESTIONS_PER_LEVEL,
      currentLevel: this.getCurrentLevel(),
    };
  },

  answerQuestion(questionId: string, answerIndex: number): void {
    const newAnswers = new Map(state.answers);
    newAnswers.set(questionId, answerIndex);

    state = {
      ...state,
      answers: newAnswers,
    };
    notifyListeners();
  },

  nextQuestion(): { levelComplete: boolean; quizComplete: boolean } {
    const questions = this.getCurrentQuestions();
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      // Level complete, evaluate results
      const result = this.evaluateCurrentLevel();
      const newLevelResults = [...state.levelResults, result];

      if (!result.passed) {
        // User failed this level - assign them here
        state = {
          ...state,
          levelResults: newLevelResults,
          isComplete: true,
          assignedLevel: this.getCurrentLevel(),
        };
        notifyListeners();
        return { levelComplete: true, quizComplete: true };
      }

      // Check if this was the last level
      if (state.currentLevelIndex >= CEFR_ORDER.length - 1) {
        // Passed all levels - assign C2
        state = {
          ...state,
          levelResults: newLevelResults,
          isComplete: true,
          assignedLevel: 'C2',
        };
        notifyListeners();
        return { levelComplete: true, quizComplete: true };
      }

      // Move to next level with new random questions
      const nextLevel = CEFR_ORDER[state.currentLevelIndex + 1];
      state = {
        ...state,
        currentLevelIndex: state.currentLevelIndex + 1,
        currentQuestionIndex: 0,
        currentLevelQuestions: getRandomQuestionsForLevel(nextLevel, QUESTIONS_PER_LEVEL),
        levelResults: newLevelResults,
      };
      notifyListeners();
      return { levelComplete: true, quizComplete: false };
    }

    // Move to next question in same level
    state = {
      ...state,
      currentQuestionIndex: nextIndex,
    };
    notifyListeners();
    return { levelComplete: false, quizComplete: false };
  },

  evaluateCurrentLevel(): QuizResult {
    const questions = this.getCurrentQuestions();
    let correctCount = 0;

    questions.forEach((q) => {
      const userAnswer = state.answers.get(q.id);
      if (userAnswer === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = correctCount / questions.length;

    return {
      level: this.getCurrentLevel(),
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      passed: score >= PASSING_THRESHOLD,
    };
  },

  getResult(): PlacementResult | null {
    if (!state.isComplete || !state.assignedLevel) {
      return null;
    }

    return {
      assignedLevel: state.assignedLevel,
      levelResults: state.levelResults,
    };
  },

  getAppLevel(): 'beginner' | 'intermediate' | 'advanced' | 'master' | null {
    if (!state.assignedLevel) return null;
    return cefrToAppLevel(state.assignedLevel);
  },

  reset(): void {
    state = {
      currentLevelIndex: 0,
      currentQuestionIndex: 0,
      currentLevelQuestions: getRandomQuestionsForLevel('A1', QUESTIONS_PER_LEVEL),
      answers: new Map(),
      levelResults: [],
      isComplete: false,
      assignedLevel: null,
    };
    notifyListeners();
  },
};
