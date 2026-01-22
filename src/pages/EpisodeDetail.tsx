import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Bookmark, 
  Clock, 
  Headphones, 
  FileText, 
  Lightbulb, 
  BookOpen, 
  HelpCircle,
  MessageCircle,
  Lock,
  CheckCircle,
  Volume2
} from "lucide-react";

import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import { useToast } from "@/hooks/use-toast";
import { episodesMeta, getEpisodeContent } from "@/features/episodes/data";
import type { EpisodeMeta, EpisodeContent, QuizQuestion } from "@/features/episodes/types";
import { getLevelColor } from "@/lib/mockData";

const EpisodeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, toggleFavorite, logout } = useAuth();

  const [episode, setEpisode] = useState<EpisodeMeta | null>(null);
  const [content, setContent] = useState<EpisodeContent | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate("/not-found");
      return;
    }

    const ep = episodesMeta.find((e) => e.id === id);
    if (!ep) {
      navigate("/not-found");
      return;
    }

    if (ep.isLocked) {
      toast({
        title: "Episode Locked",
        description: "Complete previous episodes to unlock this one.",
        variant: "destructive",
      });
      navigate("/library");
      return;
    }

    setEpisode(ep);
    setContent(getEpisodeContent(id));
    setIsFavorite(user?.favorites.includes(id) ?? false);
  }, [id, navigate, user, toast]);

  const handleToggleFavorite = async () => {
    if (!episode || !user) return;
    setIsFavorite((prev) => !prev);
    await toggleFavorite(episode.id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: episode.title,
    });
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleQuizSubmit = () => {
    if (!content) return;
    
    let correct = 0;
    content.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    setQuizScore(correct);
    setQuizSubmitted(true);
    
    const percentage = Math.round((correct / content.quiz.length) * 100);
    toast({
      title: `Quiz Complete!`,
      description: `You scored ${correct}/${content.quiz.length} (${percentage}%)`,
    });
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  if (!episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading episode...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Episode Header */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft mb-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <Badge className={getLevelColor(episode.level)}>{episode.level}</Badge>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(episode.duration / 60)} min</span>
            </div>
            <span>{episode.category}</span>
            {episode.isNew && <Badge variant="secondary">New</Badge>}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">{episode.title}</h1>
              <p className="text-muted-foreground">{episode.description}</p>
            </div>
            <Button
              variant={isFavorite ? "default" : "outline"}
              className="flex items-center gap-2 shrink-0"
              onClick={handleToggleFavorite}
              disabled={!user}
            >
              <Bookmark className="h-4 w-4" />
              {isFavorite ? "Favorited" : "Add to favorites"}
            </Button>
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-6">
          <AudioPlayer title={episode.title} duration={episode.duration} />
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Transcript</span>
            </TabsTrigger>
            <TabsTrigger value="expressions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Expressions</span>
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Vocabulary</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Transcript Tab */}
          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content?.transcript ? (
                  <div className="space-y-4">
                    {content.transcript.map((segment) => (
                      <div key={segment.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-xs text-muted-foreground font-mono min-w-[50px]">
                          {Math.floor(segment.startTime / 60)}:{String(segment.startTime % 60).padStart(2, '0')}
                        </span>
                        <div>
                          {segment.speaker && (
                            <span className="font-semibold text-primary mr-2">{segment.speaker}:</span>
                          )}
                          <span className="text-foreground">{segment.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Transcript not available for this episode yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expressions Tab */}
          <TabsContent value="expressions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Expressions & Idioms
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content?.expressions ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {content.expressions.map((expr) => (
                      <Card key={expr.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg text-foreground">"{expr.phrase}"</h4>
                            <Badge variant="outline" className="text-xs capitalize">{expr.type.replace('_', ' ')}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{expr.meaning}</p>
                          <div className="bg-background rounded-lg p-3 border">
                            <p className="text-sm italic">"{expr.example}"</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Expressions not available for this episode yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vocabulary Tab */}
          <TabsContent value="vocabulary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Vocabulary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content?.vocabulary ? (
                  <div className="space-y-4">
                    {content.vocabulary.map((word) => (
                      <div key={word.id} className="flex items-start gap-4 p-4 rounded-lg border bg-muted/20">
                        <Button variant="ghost" size="icon" className="shrink-0 mt-1">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3 mb-1">
                            <h4 className="font-bold text-lg text-foreground">{word.word}</h4>
                            <span className="text-muted-foreground text-sm">{word.pronunciation}</span>
                            <Badge variant="secondary" className="text-xs">{word.partOfSpeech}</Badge>
                          </div>
                          <p className="text-foreground mb-2">{word.definition}</p>
                          <p className="text-sm text-muted-foreground italic">"{word.example}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Vocabulary not available for this episode yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Comprehension Quiz
                  </div>
                  {quizSubmitted && (
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold">
                        Score: {quizScore}/{content?.quiz.length || 0}
                      </span>
                      <Button variant="outline" size="sm" onClick={resetQuiz}>
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content?.quiz ? (
                  <div className="space-y-6">
                    {content.quiz.map((question, qIndex) => (
                      <QuizQuestionCard
                        key={question.id}
                        question={question}
                        questionNumber={qIndex + 1}
                        selectedAnswer={quizAnswers[question.id]}
                        onSelect={(answerIndex) => handleQuizAnswer(question.id, answerIndex)}
                        showResult={quizSubmitted}
                      />
                    ))}
                    
                    {!quizSubmitted && (
                      <div className="flex justify-center pt-4">
                        <Button 
                          size="lg" 
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < content.quiz.length}
                        >
                          Submit Quiz ({Object.keys(quizAnswers).length}/{content.quiz.length} answered)
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Quiz not available for this episode yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Conversation Tab */}
          <TabsContent value="conversation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Conversation Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Practice conversation with our AI tutor. Answer questions about the podcast 
                    and get instant feedback on your responses.
                  </p>
                  {content?.aiPrompts && (
                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-muted-foreground">Preview of conversation topics:</p>
                      {content.aiPrompts.map((prompt) => (
                        <div key={prompt.id} className="p-3 bg-muted/50 rounded-lg text-sm text-left max-w-md mx-auto">
                          "{prompt.question}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Quiz Question Component
interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswer?: number;
  onSelect: (answerIndex: number) => void;
  showResult: boolean;
}

const QuizQuestionCard = ({ question, questionNumber, selectedAnswer, onSelect, showResult }: QuizQuestionCardProps) => {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <h4 className="font-semibold mb-4">
        <span className="text-primary mr-2">{questionNumber}.</span>
        {question.question}
      </h4>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          
          let optionClass = "p-3 rounded-lg border cursor-pointer transition-colors ";
          
          if (showResult) {
            if (isCorrect) {
              optionClass += "bg-green-100 border-green-500 dark:bg-green-900/30";
            } else if (isSelected && !isCorrect) {
              optionClass += "bg-red-100 border-red-500 dark:bg-red-900/30";
            } else {
              optionClass += "bg-muted/30";
            }
          } else {
            optionClass += isSelected 
              ? "bg-primary/10 border-primary" 
              : "hover:bg-muted/50";
          }
          
          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => !showResult && onSelect(index)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
            </div>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
          <span className="font-medium">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
};

export default EpisodeDetail;
