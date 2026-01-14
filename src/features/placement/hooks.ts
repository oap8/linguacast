import { useSyncExternalStore, useCallback } from 'react';
import { placementService } from './service';

export const usePlacement = () => {
  const state = useSyncExternalStore(
    placementService.subscribe,
    placementService.getSnapshot
  );

  const getCurrentQuestion = useCallback(() => {
    return placementService.getCurrentQuestion();
  }, []);

  const getProgress = useCallback(() => {
    return placementService.getProgress();
  }, []);

  const answerQuestion = useCallback((questionId: string, answerIndex: number) => {
    placementService.answerQuestion(questionId, answerIndex);
  }, []);

  const nextQuestion = useCallback(() => {
    return placementService.nextQuestion();
  }, []);

  const getResult = useCallback(() => {
    return placementService.getResult();
  }, []);

  const getAppLevel = useCallback(() => {
    return placementService.getAppLevel();
  }, []);

  const reset = useCallback(() => {
    placementService.reset();
  }, []);

  return {
    state,
    getCurrentQuestion,
    getProgress,
    answerQuestion,
    nextQuestion,
    getResult,
    getAppLevel,
    reset,
  };
};
