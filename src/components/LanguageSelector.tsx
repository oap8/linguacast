import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-6 w-6 text-primary" />
          <CardTitle>Choose Your Native Language</CardTitle>
        </div>
        <CardDescription>
          Select your native language to see vocabulary translations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant={language === 'es' ? 'default' : 'outline'}
          className="w-full justify-start text-lg h-14"
          onClick={() => setLanguage('es')}
        >
          <span className="text-2xl mr-3">🇪🇸</span>
          Español (Spanish)
        </Button>
        <Button
          variant={language === 'pt' ? 'default' : 'outline'}
          className="w-full justify-start text-lg h-14"
          onClick={() => setLanguage('pt')}
        >
          <span className="text-2xl mr-3">🇧🇷</span>
          Português (Portuguese)
        </Button>
      </CardContent>
    </Card>
  );
};
