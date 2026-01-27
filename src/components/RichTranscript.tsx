import { ContentBlock } from '@/features/episodes/types';
import { cn } from '@/lib/utils';

interface RichTranscriptProps {
  content: ContentBlock[];
  basePath: string; // e.g., "/content/episodes/a1/01-morning-coffee"
  onTimestampClick?: (timestamp: number) => void;
}

export const RichTranscript = ({ content, basePath, onTimestampClick }: RichTranscriptProps) => {
  const renderBlock = (block: ContentBlock, index: number): JSX.Element => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            className={cn(
              'font-display font-bold text-foreground',
              block.level === 1 && 'text-3xl mb-4',
              block.level === 2 && 'text-2xl mb-3 mt-6',
              block.level === 3 && 'text-xl mb-2 mt-4'
            )}
          >
            {block.text}
          </HeadingTag>
        );

      case 'text':
        return (
          <p
            key={index}
            className={cn(
              'mb-3 leading-relaxed',
              block.highlight
                ? 'text-primary font-semibold text-lg'
                : 'text-foreground'
            )}
          >
            {block.text}
          </p>
        );

      case 'image':
        return (
          <div key={index} className="my-6">
            <img
              src={`${basePath}/${block.src}`}
              alt={block.alt}
              className="rounded-lg max-w-md mx-auto shadow-md"
            />
            {block.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {block.caption}
              </p>
            )}
          </div>
        );

      case 'audio-cue':
        return (
          <button
            key={index}
            onClick={() => onTimestampClick?.(block.timestamp)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-2 transition-colors"
          >
            <span className="text-sm">🔊</span>
            <span className="underline">{block.text}</span>
          </button>
        );

      case 'practice':
        return (
          <div key={index} className="bg-muted/50 rounded-lg p-4 my-4 border-l-4 border-primary">
            <p className="text-foreground font-medium mb-2">{block.instruction}</p>
            <p className="text-sm text-muted-foreground">
              You say: <span className="text-primary font-semibold">{block.expected}</span>
            </p>
          </div>
        );

      case 'dialogue':
        return (
          <div key={index} className="mb-2 pl-4 border-l-2 border-muted">
            <p className="text-sm font-semibold text-primary">
              {block.speaker === 'Barista' ? 'The barista' : block.speaker} says:
            </p>
            <p className="text-foreground italic">"{block.text}"</p>
          </div>
        );

      case 'section':
        return (
          <section key={index} className="my-6">
            <h4 className="font-display text-lg font-bold mb-3">{block.title}</h4>
            <div className="pl-4">
              {block.blocks.map((subBlock, subIndex) => renderBlock(subBlock, subIndex))}
            </div>
          </section>
        );

      default:
        return <div key={index} />;
    }
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
};
