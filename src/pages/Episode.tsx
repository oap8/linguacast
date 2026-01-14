import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Clock, Headphones } from "lucide-react";

import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import EpisodeCard from "@/components/EpisodeCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";
import { useEpisodes } from "@/features/episodes/hooks";
import { useToast } from "@/hooks/use-toast";
import type { Episode } from "@/lib/mockData";

const EpisodePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, toggleFavorite, logout } = useAuth();
  const { episodes, fetchAll, fetchById, getRecommended } = useEpisodes();

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!id) {
      navigate("/not-found");
      return;
    }

    const loadEpisode = async () => {
      setIsLoading(true);
      try {
        const data = (await fetchById(id)) ?? episodes.find((ep) => ep.id === id) ?? null;
        if (!data) {
          navigate("/not-found");
          return;
        }
        setEpisode(data);
        setIsFavorite(user?.favorites.includes(data.id) ?? false);
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisode();
  }, [id, fetchById, episodes, navigate, user]);

  const handleToggleFavorite = async () => {
    if (!episode || !user) return;
    setIsFavorite((prev) => !prev);
    await toggleFavorite(episode.id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: episode.title,
    });
  };

  const recommendations = useMemo(() => {
    if (!episode) return [];
    return getRecommended(episode.level, 3).filter((rec) => rec.id !== episode.id);
  }, [episode, getRecommended]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading episode...</p>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Episode not found.</p>
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

        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <Headphones className="h-4 w-4" />
                <span className="capitalize">{episode.level} Level</span>
                <Clock className="h-4 w-4" />
                <span>{Math.floor(episode.duration / 60)} min</span>
                <span>{episode.category}</span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">{episode.title}</h1>
                  <p className="text-muted-foreground">{episode.description}</p>
                </div>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={handleToggleFavorite}
                  disabled={!user}
                >
                  <Bookmark className="h-4 w-4" />
                  {isFavorite ? "Favorited" : "Add to favorites"}
                </Button>
              </div>
            </div>

            <AudioPlayer title={episode.title} duration={episode.duration} />

            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold text-foreground mb-3">Transcript</h2>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{episode.transcript}</p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Suggested Episodes</h3>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <EpisodeCard
                      key={rec.id}
                      episode={rec}
                      compact
                      isFavorite={user?.favorites.includes(rec.id)}
                      onToggleFavorite={() => toggleFavorite(rec.id)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">More episodes coming soon.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5 text-sm text-muted-foreground">
              <p>Need help? Visit the <Link to="/library" className="text-primary underline">Library</Link> to browse all lessons.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default EpisodePage;
