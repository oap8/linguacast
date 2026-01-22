import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, CheckCircle, Play, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks';
import { episodesMeta } from '@/features/episodes/data';
import { getLevelColor } from '@/lib/mockData';
import type { EpisodeMeta } from '@/features/episodes/types';

// For MVP, simulate completed episodes (first 2 beginner episodes)
const completedEpisodeIds = ['b1', 'b2'];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  // Get completed episodes
  const completedEpisodes = useMemo(() => {
    let episodes = episodesMeta.filter(ep => completedEpisodeIds.includes(ep.id));
    
    if (searchQuery) {
      episodes = episodes.filter(ep => 
        ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return episodes;
  }, [searchQuery]);

  // Stats for completed episodes
  const stats = useMemo(() => {
    const completed = completedEpisodes.length;
    const totalMinutes = completedEpisodes.reduce((sum, ep) => sum + Math.floor(ep.duration / 60), 0);
    const quizzesPassed = completed; // Assuming all completed episodes have passed quizzes
    return { completed, totalMinutes, quizzesPassed };
  }, [completedEpisodes]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-2">
            My Library
          </h1>
          <p className="text-muted-foreground">
            Review your completed episodes and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Episodes Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMinutes} min</p>
                <p className="text-sm text-muted-foreground">Total Learning Time</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.quizzesPassed}</p>
                <p className="text-sm text-muted-foreground">Quizzes Passed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        {completedEpisodes.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search completed episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Completed Episodes */}
        {completedEpisodes.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Completed Episodes ({completedEpisodes.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedEpisodes.map((episode) => (
                <CompletedEpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No completed episodes match your search.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Episodes Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your learning journey! Complete episodes from your Dashboard to see them here for review.
            </p>
            <Link to="/dashboard">
              <Button className="gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

// Completed Episode Card Component
const CompletedEpisodeCard = ({ episode }: { episode: EpisodeMeta }) => {
  return (
    <Card className="group hover:border-primary hover:shadow-md transition-all">
      <CardContent className="p-4">
        {/* Completion badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={getLevelColor(episode.level)}>{episode.level}</Badge>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Completed</span>
          </div>
        </div>

        {/* Episode info */}
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {episode.order}. {episode.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {episode.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span>{episode.category}</span>
          <span>•</span>
          <span>{Math.floor(episode.duration / 60)} min</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/episode/${episode.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <RotateCcw className="h-3 w-3" />
              Review
            </Button>
          </Link>
          <Link to={`/episode/${episode.id}`}>
            <Button size="sm" className="gap-2">
              <Play className="h-3 w-3" />
              Play
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Library;
