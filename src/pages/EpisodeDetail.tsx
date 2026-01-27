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
import { RichTranscript } from "@/components/RichTranscript";
import { VocabularyList } from "@/components/VocabularyList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import { useToast } from "@/hooks/use-toast";
import { episodesMeta } from "@/features/episodes/data";
import { loadEpisodeData, getEpisodeBasePath, type EpisodeData } from "@/features/episodes/loader";
import type { EpisodeMeta } from "@/features/episodes/types";
import { getLevelColor } from "@/lib/mockData";
import { useLanguage } from '@/contexts/LanguageContext';

const EpisodeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, toggleFavorite, logout } = useAuth();

  const [episode, setEpisode] = useState<EpisodeMeta | null>(null);
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [loading, setLoading] = useState(true);
  
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
    setIsFavorite(user?.favorites.includes(id) ?? false);
    
    // Load episode data from JSON
    loadEpisodeData(id).then(data => {
      setEpisodeData(data);
      setLoading(false);
    });
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
    if (!episodeData) return;
    
    let correct = 0;
    episodeData.quiz.forEach((q, index) => {
      if (quizAnswers[index.toString()] === q.correctAnswer) {
        correct++;
      }
    });
    
    setQuizScore(correct);
    setQuizSubmitted(true);
    
    const percentage = Math.round((correct / episodeData.quiz.length) * 100);
    toast({
      title: `Quiz Complete!`,
      description: `You scored ${correct}/${episodeData.quiz.length} (${percentage}%)`,
    });
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  if (!episode || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading episode...</p>
      </div>
    );
  }

  if (!episodeData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load episode content.</p>
      </div>
    );
  }

  const basePath = getEpisodeBasePath(episode.id);

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
          <AudioPlayer 
            title={episode.title} 
            duration={episode.duration}
            audioUrl={`${basePath}/${episodeData.metadata.audioFile}`}
          />
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Transcript</span>
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Vocabulary</span>
            </TabsTrigger>
            <TabsTrigger value="expressions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Expressions</span>
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
                <RichTranscript 
                  content={episodeData.content} 
                  basePath={basePath}
                  onTimestampClick={(timestamp) => {
                    console.log('Jump to timestamp:', timestamp);
                  }}
                />
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
                <VocabularyList vocabulary={episodeData.vocabulary} />
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
                <div className="grid gap-4 md:grid-cols-2">
                  {episodeData.expressions.map((expr, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg text-foreground">"{expr.expression}"</h4>
                          <Badge variant="outline" className="text-xs capitalize">{expr.usage}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{expr.meaning}</p>
                        <div className="bg-background rounded-lg p-3 border">
                          <p className="text-sm italic">"{expr.example}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                        Score: {quizScore}/{episodeData.quiz.length}
                      </span>
                      <Button variant="outline" size="sm" onClick={resetQuiz}>
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {episodeData.quiz.map((question, qIndex) => (
                    <QuizQuestionCard
                      key={qIndex}
                      question={question}
                      questionNumber={qIndex + 1}
                      selectedAnswer={quizAnswers[qIndex.toString()]}
                      onSelect={(answerIndex) => handleQuizAnswer(qIndex.toString(), answerIndex)}
                      showResult={quizSubmitted}
                    />
                  ))}
                  
                  {!quizSubmitted && (
                    <div className="flex justify-center pt-4">
                      <Button 
                        size="lg" 
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < episodeData.quiz.length}
                      >
                        Submit Quiz ({Object.keys(quizAnswers).length}/{episodeData.quiz.length} answered)
                      </Button>
                    </div>
                  )}
                </div>
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
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Preview of conversation topics:</p>
                    {episodeData.aiConversation.map((prompt, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm text-left max-w-md mx-auto">
                        "{prompt.prompt}"
                      </div>
                    ))}
                  </div>
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
  question: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
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
