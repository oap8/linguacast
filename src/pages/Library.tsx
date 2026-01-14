import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EpisodeCard from '@/components/EpisodeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEpisodes } from '@/features/episodes/hooks';
import { useAuth } from '@/features/auth/hooks';

type Level = 'all' | 'beginner' | 'intermediate' | 'advanced';
type Category = 'all' | string;

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const { episodes, fetchAll } = useEpisodes();
  const { user, toggleFavorite, logout } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(user?.favorites ?? []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setFavorites(user?.favorites ?? []);
  }, [user]);

  const categories = useMemo(() => {
    const cats = [...new Set(episodes.map(ep => ep.category))];
    return ['all', ...cats];
  }, [episodes]);

  const levels: Level[] = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
      const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || episode.level === selectedLevel;
      const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory;
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [episodes, searchQuery, selectedLevel, selectedCategory]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) {
      return;
    }
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    await toggleFavorite(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!user} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-2">
            Podcast Library
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of English learning episodes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-fade-in">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Level:
            </span>
            {levels.map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className="capitalize"
              >
                {level === 'all' ? 'All Levels' : level}
              </Button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category:
            </span>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Topics' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? 's' : ''}
        </p>

        {/* Episodes Grid */}
        {filteredEpisodes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEpisodes.map((episode, index) => (
              <div key={episode.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <EpisodeCard
                  episode={episode}
                  isFavorite={favorites.includes(episode.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No episodes found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('all');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;
