import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePlacement } from '@/features/placement/hooks';
import { useAuth } from '@/features/auth/hooks';
import { CEFR_ORDER, QUESTIONS_PER_LEVEL } from '@/features/placement/types';
import { CheckCircle, XCircle, ArrowRight, Trophy, Target } from 'lucide-react';

const PlacementQuiz = () => {
  const navigate = useNavigate();
  const { state, getCurrentQuestion, getProgress, answerQuestion, nextQuestion, getResult, getAppLevel, reset } = usePlacement();
  const { user, updateProfile } = useAuth();
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    reset();
  }, [reset]);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const result = getResult();

  const totalProgress = ((CEFR_ORDER.indexOf(progress.currentLevel) * QUESTIONS_PER_LEVEL) + progress.currentQuestion) 
    / (CEFR_ORDER.length * QUESTIONS_PER_LEVEL) * 100;

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleCheckAndContinue = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    // If not showing feedback yet, check the answer
    if (!showFeedback) {
      answerQuestion(currentQuestion.id, selectedAnswer);
      setIsCorrect(selectedAnswer === currentQuestion.correctAnswer);
      setShowFeedback(true);
      setIsTransitioning(true);

      // Auto-advance after 3 seconds
      setTimeout(() => {
        handleNextQuestion();
        setIsTransitioning(false);
      }, 3000);
    }
  };

  const handleNextQuestion = () => {
    const { levelComplete, quizComplete } = nextQuestion();
    setSelectedAnswer(null);
    setShowFeedback(false);

    if (quizComplete) {
      // Quiz is done, update user level
      const appLevel = getAppLevel();
      if (appLevel && user) {
        updateProfile({ level: appLevel });
      }
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'A1': return 'Beginner';
      case 'A2': return 'Elementary';
      case 'B1': return 'Intermediate';
      case 'B2': return 'Upper Intermediate';
      case 'C1': return 'Advanced';
      case 'C2': return 'Mastery';
      default: return level;
    }
  };

  // Show results screen
  if (state.isComplete && result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Placement Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Your English level is</p>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
                <span className="text-3xl font-bold text-primary">{result.assignedLevel}</span>
                <span className="text-lg text-primary/80">
                  ({getLevelDescription(result.assignedLevel)})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">Your Results</h3>
              {result.levelResults.map((levelResult) => (
                <div
                  key={levelResult.level}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {levelResult.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">{levelResult.level}</span>
                    <span className="text-sm text-muted-foreground">
                      ({getLevelDescription(levelResult.level)})
                    </span>
                  </div>
                  <span className={`font-medium ${levelResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {levelResult.correctAnswers}/{levelResult.totalQuestions}
                  </span>
                </div>
              ))}
            </div>

            <Button onClick={handleFinish} className="w-full" size="lg">
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show question screen
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-semibold">Placement Test</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Level {progress.currentLevel} • Question {progress.currentQuestion}/{progress.totalQuestions}
            </div>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {progress.currentLevel} - {getLevelDescription(progress.currentLevel)}
              </span>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let optionClass = 'border-2 border-border hover:border-primary/50 cursor-pointer';
                
                if (showFeedback) {
                  if (index === currentQuestion.correctAnswer) {
                    optionClass = 'border-2 border-green-500 bg-green-50 dark:bg-green-950';
                  } else if (index === selectedAnswer && !isCorrect) {
                    optionClass = 'border-2 border-red-500 bg-red-50 dark:bg-red-950';
                  } else {
                    optionClass = 'border-2 border-border opacity-50';
                  }
                } else if (selectedAnswer === index) {
                  optionClass = 'border-2 border-primary bg-primary/5';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-lg text-left transition-all ${optionClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showFeedback && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showFeedback && index === selectedAnswer && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                onClick={handleCheckAndContinue}
                disabled={selectedAnswer === null || isTransitioning}
                className="w-full"
                size="lg"
              >
                {isTransitioning ? 'Next question in 3s...' : 'Check and Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlacementQuiz;
