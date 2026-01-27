import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface VocabularyItem {
  word: string;
  translations: {
    es: string;
    pt: string;
  };
  partOfSpeech: string;
  example: string;
}

interface VocabularyListProps {
  vocabulary: VocabularyItem[];
}

export const VocabularyList = ({ vocabulary }: VocabularyListProps) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      {vocabulary.map((word, index) => (
        <div key={index} className="p-4 rounded-lg border bg-muted/20">
          <div className="flex items-baseline gap-3 mb-1">
            <h4 className="font-bold text-lg text-foreground">{word.word}</h4>
            <span className="text-muted-foreground text-sm">
              {word.translations[language]}
            </span>
            <Badge variant="secondary" className="text-xs">{word.partOfSpeech}</Badge>
          </div>
          <p className="text-sm text-muted-foreground italic">"{word.example}"</p>
        </div>
      ))}
    </div>
  );
};
