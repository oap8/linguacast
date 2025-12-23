import { Link } from 'react-router-dom';
import { Clock, Heart, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type Episode, getLevelColor, formatDuration } from '@/lib/mockData';

interface EpisodeCardProps {
  episode: Episode;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  compact?: boolean;
}

const EpisodeCard = ({ episode, isFavorite = false, onToggleFavorite, compact = false }: EpisodeCardProps) => {
  const levelColorClass = getLevelColor(episode.level);

  if (compact) {
    return (
      <Link
        to={`/episode/${episode.id}`}
        className="group flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
      >
        <div className="relative flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
          <Play className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {episode.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize', levelColorClass)}>
              {episode.level}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(episode.duration)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-300 animate-scale-in">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/10 to-success/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <Play className="h-12 w-12 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
        
        {/* New badge */}
        {episode.isNew && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            <Sparkles className="h-3 w-3" />
            New
          </div>
        )}

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-3 right-3 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card',
            isFavorite && 'text-accent'
          )}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(episode.id);
          }}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </Button>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/80 backdrop-blur-sm text-xs font-medium">
          <Clock className="h-3 w-3" />
          {formatDuration(episode.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize font-medium', levelColorClass)}>
            {episode.level}
          </span>
          <span className="text-xs text-muted-foreground">{episode.category}</span>
        </div>

        <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {episode.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {episode.description}
        </p>

        <Link to={`/episode/${episode.id}`} className="mt-4">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
            <Play className="h-4 w-4 mr-2" />
            Start Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EpisodeCard;
