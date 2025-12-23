import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EpisodeCard from '@/components/EpisodeCard';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { mockUser, mockEpisodes, type Episode, getLevelColor } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [favorites, setFavorites] = useState<string[]>(mockUser.favorites);
  const [recommendedEpisodes, setRecommendedEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    // Get recommended episodes based on user level
    const recommended = mockEpisodes
      .filter(ep => ep.level === mockUser.level)
      .slice(0, 3);
    setRecommendedEpisodes(recommended);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const levelColorClass = getLevelColor(mockUser.level);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn onLogout={() => {}} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent">Welcome back!</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-2">
            Hello, {mockUser.name.split(' ')[0]}! 👋
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Ready to continue learning?</p>
            <span className={cn('text-sm px-3 py-1 rounded-full border capitalize font-medium', levelColorClass)}>
              {mockUser.level} Level
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatsCard
            icon={Flame}
            label="Day Streak"
            value={mockUser.progress.streak}
            subtext="Keep it up!"
            variant="accent"
          />
          <StatsCard
            icon={Trophy}
            label="Total XP"
            value={mockUser.progress.xp.toLocaleString()}
            variant="primary"
          />
          <StatsCard
            icon={BookOpen}
            label="Episodes"
            value={mockUser.progress.episodesCompleted}
            subtext="Completed"
            variant="success"
          />
          <StatsCard
            icon={Clock}
            label="Time Spent"
            value={`${Math.floor(mockUser.progress.totalMinutes / 60)}h`}
            subtext={`${mockUser.progress.totalMinutes % 60}m`}
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
                Episodes matching your {mockUser.level} level
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
                  {mockEpisodes[0].title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">35%</span>
                </div>
              </div>
              <Link to={`/episode/${mockEpisodes[0].id}`}>
                <Button variant="default" size="lg">
                  Continue
                </Button>
              </Link>
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
              {mockEpisodes
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
