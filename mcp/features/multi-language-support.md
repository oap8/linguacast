# Multi-Language Support

## Overview

LinguaCast supports multiple native languages for vocabulary translations, allowing users worldwide to learn English with translations in their native language. Currently supports Spanish and Portuguese, with an extensible architecture for adding more languages.

## Current Implementation

### Supported Languages

| Code | Language | Flag | Speakers | Status |
|------|----------|------|----------|--------|
| `es` | Spanish (Español) | 🇪🇸 | 500M+ | ✅ Active |
| `pt` | Portuguese (Português) | 🇧🇷 | 250M+ | ✅ Active |

### Planned Languages (Priority Order)

| Code | Language | Speakers | Market Potential | Priority |
|------|----------|----------|------------------|----------|
| `zh` | Mandarin (中文) | 1B+ | Very High | High |
| `hi` | Hindi (हिन्दी) | 600M+ | High | High |
| `ar` | Arabic (العربية) | 420M+ | High | Medium |
| `fr` | French (Français) | 280M+ | Medium | Medium |
| `id` | Indonesian (Bahasa) | 270M+ | Medium | Low |

## Architecture

### Data Structure

Vocabulary items store translations as an object with language codes as keys:

```json
{
  "word": "morning",
  "translations": {
    "es": "mañana",
    "pt": "manhã"
  },
  "partOfSpeech": "noun",
  "example": "Good morning, how are you?"
}
```

### Context Provider

**File**: `src/contexts/LanguageContext.tsx`

```typescript
export type SupportedLanguage = 'es' | 'pt';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}
```

**Features:**
- Provides language preference globally
- Persists selection in localStorage
- Defaults to Spanish if no preference set
- Type-safe language codes

### Components

#### LanguageSelector
**File**: `src/components/LanguageSelector.tsx`

**Purpose**: UI for selecting native language preference

**Features:**
- Card-based design
- Flag emojis for visual recognition
- Active state highlighting
- Accessible button controls

**Usage:**
```tsx
import { LanguageSelector } from '@/components/LanguageSelector';

<LanguageSelector />
```

#### VocabularyList
**File**: `src/components/VocabularyList.tsx`

**Purpose**: Renders vocabulary with language-aware translations

**Features:**
- Reads language from LanguageContext
- Displays translation in user's language
- Fallback to Spanish if translation missing
- Type-safe vocabulary items

**Usage:**
```tsx
import { VocabularyList } from '@/components/VocabularyList';

<VocabularyList vocabulary={episodeData.vocabulary} />
```

## User Flow

### First-Time User
1. User signs up
2. Redirected to Profile page
3. Sees LanguageSelector (defaults to Spanish)
4. Selects preferred language
5. Preference saved to localStorage
6. All vocabulary displays in selected language

### Returning User
1. User logs in
2. Language preference loaded from localStorage
3. Vocabulary automatically displays in saved language
4. Can change language anytime in Profile

### Language Switching
1. User navigates to Profile
2. Clicks different language button
3. LanguageContext updates
4. localStorage updated
5. VocabularyList re-renders with new translations
6. Change persists across sessions

## Implementation Details

### localStorage Key
```typescript
const STORAGE_KEY = 'userLanguage';

// Save
localStorage.setItem(STORAGE_KEY, 'pt');

// Load
const saved = localStorage.getItem(STORAGE_KEY);
```

### Type Safety

```typescript
// Vocabulary type with translations
interface VocabularyItem {
  word: string;
  translations: {
    es: string;
    pt: string;
  };
  partOfSpeech: string;
  example: string;
}

// Language context hook
const { language, setLanguage } = useLanguage();

// Type-safe translation access
const translation = vocabulary.translations[language];
```

### Provider Setup

```tsx
// App.tsx
import { LanguageProvider } from '@/contexts/LanguageContext';

<LanguageProvider>
  <App />
</LanguageProvider>
```

## Scope

### Currently Supported ✅
- **Vocabulary tab**: Full multi-language support
- **User preference**: Saved and persisted
- **UI selector**: Profile page integration

### Not Yet Supported ❌
- **Expressions**: Single language only
- **Quiz questions**: English only
- **AI prompts**: English only
- **UI text**: English only (no i18n)

## Adding a New Language

### Step 1: Update Type Definition
```typescript
// src/contexts/LanguageContext.tsx
export type SupportedLanguage = 'es' | 'pt' | 'zh'; // Add 'zh'
```

### Step 2: Add to LanguageSelector
```tsx
// src/components/LanguageSelector.tsx
<Button
  variant={language === 'zh' ? 'default' : 'outline'}
  onClick={() => setLanguage('zh')}
>
  <span className="text-2xl mr-3">🇨🇳</span>
  中文 (Mandarin)
</Button>
```

### Step 3: Update Vocabulary Data
```json
{
  "word": "morning",
  "translations": {
    "es": "mañana",
    "pt": "manhã",
    "zh": "早晨"
  }
}
```

### Step 4: Update TypeScript Interface
```typescript
// src/features/episodes/loader.ts
translations: {
  es: string;
  pt: string;
  zh: string; // Add new language
};
```

**Estimated Time**: 30 minutes per language

## Translation Workflow

### Current Process (Manual)
1. Identify vocabulary words
2. Translate to target languages
3. Update episode.json files
4. Validate JSON syntax
5. Test in UI

### Future Process (Automated)
1. Content creator adds English vocabulary
2. Translation management system suggests translations
3. Professional translator reviews/edits
4. Approved translations pushed to database
5. Automatic deployment

## Quality Assurance

### Translation Guidelines
- Use natural, conversational language
- Match formality level of English word
- Consider regional variations
- Provide context-appropriate translations
- Avoid literal word-for-word translations

### Validation Checklist
- ✅ All vocabulary words have translations
- ✅ No missing language codes
- ✅ Translations are culturally appropriate
- ✅ JSON syntax is valid
- ✅ UI displays correctly for all languages

## Performance

### Current
- **Bundle size**: +2KB per language
- **Load time**: Negligible (JSON parsing)
- **Switching**: Instant (React re-render)

### Optimization
- Translations loaded with episode
- No external API calls
- No network latency
- Cached in memory

## Accessibility

- Language selector uses semantic HTML
- Buttons have proper ARIA labels
- Flag emojis have text alternatives
- Keyboard navigation supported
- Screen reader friendly

## Future Enhancements

### Phase 1: Expand Vocabulary Coverage
- Add Mandarin (zh)
- Add Hindi (hi)
- Add Arabic (ar)

### Phase 2: Extend to Other Content
- Expressions translations
- Quiz question translations
- AI prompt translations

### Phase 3: Full Internationalization (i18n)
- UI text in multiple languages
- Date/time formatting
- Number formatting
- RTL support for Arabic

### Phase 4: Translation Management
- Web-based translation editor
- Professional translator workflow
- Community contributions
- Translation memory
- Quality scoring

### Phase 5: Advanced Features
- Dialect support (Latin American vs European Spanish)
- Audio pronunciation in native language
- Cultural notes and context
- Synonym suggestions

## Analytics & Metrics

### Track
- Language preference distribution
- Language switching frequency
- Vocabulary engagement by language
- Translation quality feedback

### Success Metrics
- 80%+ users select non-default language
- < 5% language switching after initial selection
- High vocabulary retention across languages
- Positive user feedback on translation quality

## Known Limitations

1. **Manual translation**: Requires human effort for each language
2. **Vocabulary only**: Other content types not yet supported
3. **No dialect support**: Single variant per language
4. **Static content**: No dynamic translation
5. **File size**: Grows with each language added

## Migration to Database

When moving to Supabase:

```sql
CREATE TABLE vocabulary_translations (
  id UUID PRIMARY KEY,
  vocabulary_id UUID REFERENCES vocabulary(id),
  language_code VARCHAR(2),
  translation TEXT,
  verified BOOLEAN DEFAULT false,
  translator_id UUID REFERENCES users(id),
  created_at TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX idx_vocab_lang ON vocabulary_translations(vocabulary_id, language_code);
```

## Related Documentation

- [Decision 002: Multi-Language Vocabulary](../decisions/002-multi-language-vocabulary.md)
- [Content Structure](../architecture/content-structure.md)
- [Frontend Structure](../architecture/frontend-structure.md)

## Support & Troubleshooting

### Issue: Translation not displaying
**Solution**: Check language preference in localStorage, verify translation exists in JSON

### Issue: Language selector not working
**Solution**: Ensure LanguageProvider wraps app, check Context is accessible

### Issue: Wrong language after refresh
**Solution**: Verify localStorage persistence, check default fallback logic

### Issue: Missing translations
**Solution**: Add translations to episode.json, update TypeScript types
