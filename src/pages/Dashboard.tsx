import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EpisodeCard from '@/components/EpisodeCard';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks';
import { useEpisodes } from '@/features/episodes/hooks';
import { type Episode, getLevelColor } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { user, toggleFavorite, logout } = useAuth();
  const { episodes, fetchAll, getRecommended } = useEpisodes();
  const [favorites, setFavorites] = useState<string[]>(user?.favorites ?? []);
  const [recommendedEpisodes, setRecommendedEpisodes] = useState<Episode[]>([]);

  const isAuthenticated = !!user;
  const level = user?.level ?? 'beginner';
  const progress = user?.progress ?? {
    streak: 0,
    xp: 0,
    episodesCompleted: 0,
    totalMinutes: 0,
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setFavorites(user?.favorites ?? []);
    if (user) {
      setRecommendedEpisodes(getRecommended(user.level, 3));
    } else {
      setRecommendedEpisodes([]);
    }
  }, [user, getRecommended]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) {
      return;
    }
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
    await toggleFavorite(id);
  };

  const levelColorClass = getLevelColor(level);

  const continueEpisode = useMemo(() => episodes[0], [episodes]);
  const totalHours = Math.floor(progress.totalMinutes / 60);
  const remainingMinutes = progress.totalMinutes % 60;
  const xpDisplay = progress.xp.toLocaleString();

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isAuthenticated} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent">Welcome back!</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-2">
            Hello, {user?.name?.split(' ')[0] ?? 'Learner'}! 👋
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Ready to continue learning?</p>
            <span className={cn('text-sm px-3 py-1 rounded-full border capitalize font-medium', levelColorClass)}>
              {level} Level
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
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

        {/* Recommended Episodes */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Recommended for You
              </h2>
              <p className="text-muted-foreground">
                Episodes matching your {level} level
              </p>
            </div>
            <Link to="/library">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedEpisodes.map((episode, index) => (
              <div key={episode.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <EpisodeCard
                  episode={episode}
                  isFavorite={favorites.includes(episode.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Continue Learning */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Continue Learning
          </h2>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <BookOpen className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Last episode</p>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {continueEpisode?.title ?? 'Keep learning'}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">35%</span>
                </div>
              </div>
              {continueEpisode && (
                <Link to={`/episode/${continueEpisode.id}`}>
                  <Button variant="default" size="lg">
                    Continue
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Favorites Preview */}
        {favorites.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Your Favorites
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {episodes
                .filter(ep => favorites.includes(ep.id))
                .slice(0, 3)
                .map(episode => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    isFavorite
                    onToggleFavorite={handleToggleFavorite}
                    compact
                  />
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
