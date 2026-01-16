export type Level = 'beginner' | 'intermediate' | 'advanced' | 'master';

export const LEVEL_THRESHOLDS = {
  beginner: { min: 0, max: 1000 },
  intermediate: { min: 1000, max: 3000 },
  advanced: { min: 3000, max: 5000 },
  master: { min: 5000, max: Infinity },
} as const;

export const calculateLevel = (xp: number): Level => {
  if (xp >= LEVEL_THRESHOLDS.master.min) return 'master';
  if (xp >= LEVEL_THRESHOLDS.advanced.min) return 'advanced';
  if (xp >= LEVEL_THRESHOLDS.intermediate.min) return 'intermediate';
  return 'beginner';
};

export const getNextLevelInfo = (xp: number) => {
  const currentLevel = calculateLevel(xp);
  
  let nextLevel: Level | null = 'intermediate';
  let xpNeeded: number = LEVEL_THRESHOLDS.beginner.max;
  let currentLevelMin: number = LEVEL_THRESHOLDS.beginner.min;

  switch (currentLevel) {
    case 'beginner':
      nextLevel = 'intermediate';
      xpNeeded = LEVEL_THRESHOLDS.beginner.max;
      currentLevelMin = LEVEL_THRESHOLDS.beginner.min;
      break;
    case 'intermediate':
      nextLevel = 'advanced';
      xpNeeded = LEVEL_THRESHOLDS.intermediate.max;
      currentLevelMin = LEVEL_THRESHOLDS.intermediate.min;
      break;
    case 'advanced':
      nextLevel = 'master';
      xpNeeded = LEVEL_THRESHOLDS.advanced.max;
      currentLevelMin = LEVEL_THRESHOLDS.advanced.min;
      break;
    case 'master':
      nextLevel = null; // Max level reached
      xpNeeded = LEVEL_THRESHOLDS.master.min;
      currentLevelMin = LEVEL_THRESHOLDS.master.min;
      break;
  }

  return {
    currentLevel,
    nextLevel,
    xpNeeded,
    currentLevelMin
  };
};
