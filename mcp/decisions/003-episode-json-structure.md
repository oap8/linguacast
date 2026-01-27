# Decision 003 – Episode JSON Structure

**Date**: January 26, 2026  
**Status**: ✅ Implemented

## Decision

Store episode content in structured JSON files within the public folder, organized by CEFR level and episode order, rather than hardcoding content in TypeScript files.

## Context

Initially, episode content (transcripts, vocabulary, expressions, quiz) was hardcoded in TypeScript data files. This approach:
- Made content updates difficult
- Required rebuilding the app for content changes
- Mixed content with code
- Made migration to Supabase harder

## Approach

### Folder Structure
```
public/content/episodes/
  ├── a1/
  │   ├── 01-morning-coffee/
  │   │   ├── episode.json
  │   │   ├── audio_01.mp3
  │   │   └── images/
  │   │       ├── icon.png
  │   │       ├── Anna_barista.png
  │   │       └── coffee_cup.png
  │   ├── 02-ordering-restaurant/
  │   └── ...
  ├── a2/
  ├── b1/
  └── b2/
```

### Episode JSON Schema
```json
{
  "metadata": {
    "id": "a1",
    "level": "a1",
    "order": 1,
    "title": "Morning Coffee Conversations",
    "subtitle": "Saying Hello During the Day",
    "duration": 180,
    "category": "Daily Life",
    "isLocked": false,
    "isNew": true,
    "audioFile": "audio_01.mp3"
  },
  "content": [
    { "type": "heading", "text": "...", "level": 1 },
    { "type": "text", "text": "...", "highlight": false },
    { "type": "image", "src": "images/...", "alt": "...", "caption": "..." },
    { "type": "dialogue", "speaker": "Anna", "text": "..." },
    { "type": "practice", "instruction": "...", "expected": "..." }
  ],
  "vocabulary": [...],
  "expressions": [...],
  "quiz": [...],
  "aiConversation": [...]
}
```

### Loading System
Created `src/features/episodes/loader.ts`:
- `loadEpisodeData(episodeId)` - Fetches episode JSON
- `getEpisodeBasePath(episodeId)` - Returns asset path
- Handles errors gracefully
- Returns null if episode not found

## Rationale

### Why JSON Files?
1. **Content separation**: Content editors don't need to touch code
2. **No rebuild needed**: Update content without recompiling
3. **Easy migration**: JSON structure maps directly to Supabase tables
4. **Version control**: Git tracks content changes separately
5. **Scalability**: Easy to add 100+ episodes

### Why Public Folder?
1. **Direct access**: Vite serves files as-is
2. **Asset co-location**: Audio, images, JSON in same folder
3. **CDN-ready**: Can be moved to CDN without code changes
4. **Development**: Hot reload works for content changes

### Why This Structure?
- **Level-based**: Easy to find episodes by CEFR level
- **Order prefix**: Natural sorting (01-, 02-, 03-)
- **Descriptive names**: Readable folder names
- **Self-contained**: Each episode has all its assets

## Implementation

### Files Created
- `src/features/episodes/loader.ts` - Episode loading logic
- `src/features/episodes/types.ts` - TypeScript interfaces
- `public/content/episodes/a1/01-morning-coffee/episode.json` - First episode

### Files Modified
- `src/pages/EpisodeDetail.tsx` - Uses loader instead of hardcoded data
- `src/components/AudioPlayer.tsx` - Accepts dynamic audio URL
- `src/components/RichTranscript.tsx` - Renders content blocks

### Type Definitions
```typescript
interface EpisodeData {
  metadata: { ... };
  content: ContentBlock[];
  vocabulary: Array<{ ... }>;
  expressions: Array<{ ... }>;
  quiz: Array<{ ... }>;
  aiConversation: Array<{ ... }>;
}
```

## Trade-offs

### Pros
- ✅ Content/code separation
- ✅ No rebuild for content updates
- ✅ Easy to add new episodes
- ✅ Supabase migration path clear
- ✅ Can be edited by non-developers
- ✅ Asset co-location

### Cons
- ❌ Larger initial bundle (mitigated by lazy loading)
- ❌ No type checking for JSON content
- ❌ Manual JSON validation needed
- ❌ Potential for JSON syntax errors

## Migration Path to Supabase

When moving to Supabase:
1. Create `episodes` table matching metadata schema
2. Create `episode_content` table for content blocks
3. Create `vocabulary`, `expressions`, `quiz` tables
4. Write migration script to parse JSON → database
5. Update loader to fetch from Supabase instead of JSON
6. Keep JSON as backup/seed data

## Validation

Content validation should check:
- Valid JSON syntax
- Required fields present
- Correct data types
- Image/audio files exist
- Translations complete for all languages

## Success Metrics

- Episode loads in < 500ms
- Content updates don't require rebuild
- Easy to add new episodes (< 15 min)
- Assets load correctly
- No broken references

## Future Enhancements

1. **JSON Schema validation** - Validate structure automatically
2. **Content editor UI** - Web interface for editing episodes
3. **Lazy loading** - Load episodes on-demand
4. **CDN integration** - Serve assets from CDN
5. **Compression** - Gzip JSON files for faster loading

## Related Decisions

- Decision 001: Supabase First (future backend for episodes)
- Decision 002: Multi-language Vocabulary (vocabulary structure in JSON)
- Decision 004: Rich Transcript ContentBlock System (content array structure)

## Revisit When

1. Episode count exceeds 50 (consider database migration)
2. Content updates become frequent (build content editor)
3. Performance issues arise (implement lazy loading)
4. Need collaborative editing (move to CMS)
