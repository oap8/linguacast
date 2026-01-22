import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Clock, BookOpen, ArrowRight, Sparkles, Lock, Play, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/features/auth/hooks';
import { getLevelColor } from '@/lib/mockData';
import { episodesMeta, getEpisodesByLevel } from '@/features/episodes/data';
import type { EpisodeMeta } from '@/features/episodes/types';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const isAuthenticated = !!user;
  const userLevel = user?.level ?? 'beginner';
  const progress = user?.progress ?? {
    streak: 0,
    xp: 0,
    episodesCompleted: 0,
    totalMinutes: 0,
  };

  const levelColorClass = getLevelColor(userLevel);
  const totalHours = Math.floor(progress.totalMinutes / 60);
  const remainingMinutes = progress.totalMinutes % 60;
  const xpDisplay = progress.xp.toLocaleString();

  // Get first unlocked episode for "Continue Learning"
  const nextEpisode = useMemo(() => {
    return episodesMeta.find(ep => !ep.isLocked);
  }, []);

  // Get episodes for user's current level only
  const currentLevelEpisodes = useMemo(() => {
    return getEpisodesByLevel(userLevel as 'beginner' | 'intermediate' | 'advanced');
  }, [userLevel]);

  // Calculate stats for current level
  const levelStats = useMemo(() => {
    const unlocked = currentLevelEpisodes.filter(ep => !ep.isLocked).length;
    const completed = 0; // TODO: track actual completion
    return {
      total: currentLevelEpisodes.length,
      unlocked,
      completed,
      progress: Math.round((unlocked / currentLevelEpisodes.length) * 100),
    };
  }, [currentLevelEpisodes]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isAuthenticated} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent">Welcome back!</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-2">
            Hello, {user?.name?.split(' ')[0] ?? 'Learner'}! 👋
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Your learning journey awaits</p>
            <span className={cn('text-sm px-3 py-1 rounded-full border capitalize font-medium', levelColorClass)}>
              {userLevel} Level
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            icon={Flame}
            label="Day Streak"
            value={progress.streak}
            subtext="Keep it up!"
            variant="accent"
          />
          <StatsCard
            icon={Trophy}
            label="Total XP"
            value={xpDisplay}
            variant="primary"
          />
          <StatsCard
            icon={BookOpen}
            label="Episodes"
            value={progress.episodesCompleted}
            subtext="Completed"
            variant="success"
          />
          <StatsCard
            icon={Clock}
            label="Time Spent"
            value={`${totalHours}h`}
            subtext={`${remainingMinutes}m`}
          />
        </div>

        {/* Continue Learning Card */}
        {nextEpisode && (
          <section className="mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-xl bg-primary shadow-lg">
                    <Play className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Continue where you left off</p>
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {nextEpisode.order}. {nextEpisode.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={getLevelColor(nextEpisode.level)}>{nextEpisode.level}</Badge>
                      <span>•</span>
                      <span>{Math.floor(nextEpisode.duration / 60)} min</span>
                      <span>•</span>
                      <span>{nextEpisode.category}</span>
                    </div>
                  </div>
                  <Link to={`/episode/${nextEpisode.id}`}>
                    <Button size="lg" className="gap-2">
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Learning Path - Current Level Only */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Your Learning Path
              </h2>
              <p className="text-muted-foreground">
                {levelStats.unlocked}/{levelStats.total} episodes available
              </p>
            </div>
            <Link to="/library">
              <Button variant="ghost" className="group">
                My Library
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Current Level Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={cn(getLevelColor(userLevel), 'text-sm px-3 py-1 capitalize')}>
                    {userLevel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {levelStats.unlocked}/{levelStats.total} episodes available
                  </span>
                </div>
                <span className="text-sm font-medium">{levelStats.progress}%</span>
              </div>
              <Progress value={levelStats.progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Episodes Grid */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {currentLevelEpisodes.map((episode) => (
              <EpisodeListItem key={episode.id} episode={episode} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

// Compact Episode List Item for Dashboard
const EpisodeListItem = ({ episode }: { episode: EpisodeMeta }) => {
  const isLocked = episode.isLocked;
  const isCompleted = false; // TODO: track actual completion

  return (
    <Link 
      to={isLocked ? '#' : `/episode/${episode.id}`}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all",
        isLocked 
          ? "opacity-50 cursor-not-allowed bg-muted/30" 
          : "hover:border-primary hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
        isCompleted 
          ? "bg-green-100 dark:bg-green-900/30" 
          : isLocked 
            ? "bg-muted" 
            : "bg-primary/10"
      )}>
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : isLocked ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Play className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium truncate",
          isLocked ? "text-muted-foreground" : "text-foreground"
        )}>
          {episode.order}. {episode.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{Math.floor(episode.duration / 60)} min</span>
          <span>•</span>
          <span>{episode.category}</span>
        </div>
      </div>
      {episode.isNew && !isLocked && (
        <Badge variant="secondary" className="text-xs">New</Badge>
      )}
    </Link>
  );
};

export default Dashboard;
