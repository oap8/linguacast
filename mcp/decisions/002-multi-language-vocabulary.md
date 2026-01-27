# Decision 002 – Multi-Language Vocabulary Support

**Date**: January 26, 2026  
**Status**: ✅ Implemented

## Decision

Implement multi-language vocabulary translations starting with Spanish (es) and Portuguese (pt), with the ability to easily add more languages in the future.

## Context

LinguaCast is designed as a universal English learning platform for users worldwide. Hardcoding translations in a single language (Spanish) limits the app's global reach and user experience for non-Spanish speakers.

## Approach

### 1. Data Structure
Changed vocabulary schema from single translation to multi-language object:

**Before:**
```json
{
  "word": "morning",
  "translation": "mañana",
  "partOfSpeech": "noun",
  "example": "Good morning, how are you?"
}
```

**After:**
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

### 2. User Language Preference
- Created `LanguageContext` to manage user's native language preference
- Stored in `localStorage` for persistence across sessions
- Supports: Spanish (es), Portuguese (pt)
- Easy to extend for additional languages

### 3. UI Components
- **LanguageSelector**: Card-based selector with flag emojis (🇪🇸 🇧🇷)
- **VocabularyList**: Dynamically renders translation based on user's language
- Added to Profile page for easy access

### 4. Scope
- **Included**: Vocabulary tab only (for MVP)
- **Not included**: Expressions, quiz questions, AI prompts (future enhancement)

## Rationale

### Why Spanish + Portuguese First?
1. **Market size**: Combined 750M+ potential learners
2. **Similar languages**: Easy to translate between them
3. **Geographic focus**: Latin America (high growth market)
4. **MVP scope**: Manageable translation workload

### Why Not API Translation?
- **Cost**: $20 per million characters at scale
- **Quality**: Pre-translated content ensures accuracy
- **Offline**: Works without internet connection
- **Performance**: No API latency

### Future Languages (Priority Order)
1. Mandarin (zh) - 1B speakers, highest revenue potential
2. Hindi (hi) - 600M speakers, volume play
3. Arabic (ar) - 420M speakers, premium market
4. French (fr) - 280M speakers, Africa + Europe
5. Indonesian (id) - 270M speakers, Southeast Asia

## Implementation

### Files Created
- `src/contexts/LanguageContext.tsx` - Context provider
- `src/components/LanguageSelector.tsx` - UI selector
- `src/components/VocabularyList.tsx` - Language-aware vocabulary renderer

### Files Modified
- `src/App.tsx` - Wrapped with LanguageProvider
- `src/pages/EpisodeDetail.tsx` - Uses VocabularyList component
- `src/pages/Profile.tsx` - Added LanguageSelector
- `src/features/episodes/loader.ts` - Updated vocabulary type
- `public/content/episodes/a1/01-morning-coffee/episode.json` - Updated vocabulary schema

## Trade-offs

### Pros
- ✅ Scalable architecture
- ✅ Clean separation of concerns
- ✅ Easy to add new languages
- ✅ No external dependencies
- ✅ Fast and offline-capable

### Cons
- ❌ Requires manual translation work
- ❌ Larger JSON files
- ❌ Only vocabulary tab supported initially

## Success Metrics

- User can select language preference
- Vocabulary displays in selected language
- Preference persists across sessions
- Easy to add new languages (< 30 min per language)

## Revisit When

1. Adding 3+ more languages (consider translation management system)
2. Expanding to expressions, quiz, AI prompts
3. Community translation feature requested
4. Translation quality issues arise

## Related Decisions

- Decision 001: Supabase First (backend will store user language preference)
- Future: Decision on whether to extend to all content types
