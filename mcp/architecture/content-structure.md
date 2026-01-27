# Content Structure

## Overview

LinguaCast stores episode content in structured JSON files within the public folder. This approach separates content from code, enables easy updates without rebuilds, and provides a clear migration path to Supabase.

## Folder Organization

```
public/content/episodes/
├── a1/                    # CEFR A1 (Beginner)
│   ├── 01-morning-coffee/
│   │   ├── episode.json
│   │   ├── audio_01.mp3
│   │   └── images/
│   │       ├── icon.png
│   │       ├── Anna_barista.png
│   │       └── coffee_cup.png
│   ├── 02-ordering-restaurant/
│   └── ...
├── a2/                    # CEFR A2 (Elementary)
├── b1/                    # CEFR B1 (Intermediate)
└── b2/                    # CEFR B2 (Upper-Intermediate)
```

### Naming Convention

- **Level folders**: Lowercase CEFR codes (a1, a2, b1, b2)
- **Episode folders**: `{order}-{slug}` format (e.g., `01-morning-coffee`)
- **Order prefix**: Two-digit number for natural sorting
- **Slug**: Kebab-case descriptive name

## Episode JSON Schema

### Complete Structure

```json
{
  "metadata": { ... },
  "content": [ ... ],
  "vocabulary": [ ... ],
  "expressions": [ ... ],
  "quiz": [ ... ],
  "aiConversation": [ ... ]
}
```

### Metadata Section

```json
{
  "metadata": {
    "id": "a1",                              // Unique episode ID
    "level": "a1",                           // CEFR level
    "order": 1,                              // Episode number within level
    "title": "Morning Coffee Conversations", // Display title
    "subtitle": "Saying Hello During the Day", // Short description
    "duration": 180,                         // Duration in seconds
    "category": "Daily Life",                // Category/topic
    "isLocked": false,                       // Access control
    "isNew": true,                           // New badge flag
    "audioFile": "audio_01.mp3"              // Audio filename (relative)
  }
}
```

### Content Section (ContentBlock Array)

The content array uses a discriminated union type system. Each block has a `type` field that determines its structure.

#### 1. Heading Block
```json
{
  "type": "heading",
  "text": "Morning Coffee Conversations",
  "level": 1  // 1, 2, or 3 (h1, h2, h3)
}
```

#### 2. Text Block
```json
{
  "type": "text",
  "text": "Learn how to greet people at different times of the day.",
  "highlight": false  // Optional: true for highlighted text
}
```

#### 3. Image Block
```json
{
  "type": "image",
  "src": "images/coffee_cup.png",  // Relative to episode folder
  "alt": "A cup of coffee",         // Required for accessibility
  "caption": "Morning coffee time"  // Optional caption
}
```

#### 4. Dialogue Block
```json
{
  "type": "dialogue",
  "speaker": "Anna",
  "text": "Good morning! How are you?"
}
```

#### 5. Practice Block
```json
{
  "type": "practice",
  "instruction": "Try saying 'Good morning' to someone today!",
  "expected": "Good morning!"
}
```

#### 6. Audio Cue Block
```json
{
  "type": "audio-cue",
  "text": "Listen to the pronunciation",
  "timestamp": 45  // Seconds into audio
}
```

#### 7. Section Block (Nested)
```json
{
  "type": "section",
  "title": "Greetings Throughout the Day",
  "blocks": [
    { "type": "text", "text": "..." },
    { "type": "dialogue", "speaker": "...", "text": "..." }
  ]
}
```

### Vocabulary Section

Multi-language vocabulary with translations:

```json
{
  "vocabulary": [
    {
      "word": "morning",
      "translations": {
        "es": "mañana",
        "pt": "manhã"
      },
      "partOfSpeech": "noun",
      "example": "Good morning, how are you?"
    }
  ]
}
```

**Supported Languages:**
- `es` - Spanish (Español)
- `pt` - Portuguese (Português)
- Future: `zh` (Mandarin), `hi` (Hindi), `ar` (Arabic), `fr` (French)

### Expressions Section

```json
{
  "expressions": [
    {
      "expression": "Good morning",
      "meaning": "A greeting used from early morning until about 12 o'clock",
      "usage": "Formal and informal",
      "example": "Good morning! Did you sleep well?"
    }
  ]
}
```

### Quiz Section

```json
{
  "quiz": [
    {
      "question": "It is 8 a.m. What do you say?",
      "options": [
        "Good night",
        "Good morning",
        "Good evening"
      ],
      "correctAnswer": 1,  // 0-indexed
      "explanation": "We say 'Good morning' at 8 a.m. in the morning."
    }
  ]
}
```

### AI Conversation Section

```json
{
  "aiConversation": [
    {
      "prompt": "Practice greeting someone in the morning",
      "context": "You are at a coffee shop in the morning. Greet the barista.",
      "expectedVocabulary": ["morning", "hello", "coffee"],
      "rubric": {
        "greeting": "Used appropriate morning greeting",
        "politeness": "Maintained polite tone",
        "vocabulary": "Used target vocabulary correctly"
      }
    }
  ]
}
```

## File Size Guidelines

- **episode.json**: Target < 50KB (typical: 10-20KB)
- **Images**: < 200KB each (optimized for web)
- **Audio**: Variable (typical: 2-5MB for 3-5 min episode)

## Validation Rules

### Required Fields
- ✅ `metadata.id`, `metadata.title`, `metadata.audioFile`
- ✅ All images must have `alt` text
- ✅ Vocabulary must have translations for all supported languages
- ✅ Quiz `correctAnswer` must be valid index

### Content Rules
- ✅ Heading levels: 1, 2, or 3 only
- ✅ Section nesting: Max 3 levels deep
- ✅ Image paths: Relative to episode folder
- ✅ Audio timestamps: Valid seconds within audio duration

### Data Integrity
- ✅ No duplicate vocabulary words
- ✅ Quiz must have 2+ options
- ✅ All referenced files must exist
- ✅ Valid JSON syntax

## Loading System

### TypeScript Interface

```typescript
interface EpisodeData {
  metadata: {
    id: string;
    level: string;
    order: number;
    title: string;
    subtitle: string;
    duration: number;
    category: string;
    isLocked: boolean;
    isNew: boolean;
    audioFile: string;
  };
  content: ContentBlock[];
  vocabulary: Array<{
    word: string;
    translations: { es: string; pt: string };
    partOfSpeech: string;
    example: string;
  }>;
  expressions: Array<{
    expression: string;
    meaning: string;
    usage: string;
    example: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  aiConversation: Array<{
    prompt: string;
    context: string;
    expectedVocabulary: string[];
    rubric?: Record<string, string>;
  }>;
}
```

### Loading Function

```typescript
// src/features/episodes/loader.ts
export async function loadEpisodeData(episodeId: string): Promise<EpisodeData | null> {
  try {
    const level = 'a1'; // Determine from episodeId
    const folderName = '01-morning-coffee'; // Map episodeId to folder
    
    const response = await fetch(`/content/episodes/${level}/${folderName}/episode.json`);
    
    if (!response.ok) {
      console.error(`Failed to load episode data for ${episodeId}`);
      return null;
    }
    
    const data: EpisodeData = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading episode data:', error);
    return null;
  }
}
```

## Asset Paths

### In JSON
```json
{
  "type": "image",
  "src": "images/coffee_cup.png"  // Relative path
}
```

### In Code
```typescript
const basePath = getEpisodeBasePath(episodeId);
// Returns: "/content/episodes/a1/01-morning-coffee"

const imageUrl = `${basePath}/${imageSrc}`;
// Results in: "/content/episodes/a1/01-morning-coffee/images/coffee_cup.png"
```

## Migration to Supabase

When moving to database:

### Tables Structure

```sql
-- Episodes table
CREATE TABLE episodes (
  id UUID PRIMARY KEY,
  level VARCHAR(2),
  order_index INT,
  title TEXT,
  subtitle TEXT,
  duration INT,
  category VARCHAR(50),
  is_locked BOOLEAN,
  is_new BOOLEAN,
  audio_url TEXT
);

-- Episode content (ContentBlocks)
CREATE TABLE episode_content (
  id UUID PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id),
  order_index INT,
  block_type VARCHAR(20),
  content JSONB
);

-- Vocabulary
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id),
  word TEXT,
  translations JSONB,
  part_of_speech VARCHAR(20),
  example TEXT
);

-- Similar tables for expressions, quiz, ai_conversation
```

### Migration Script

1. Parse all episode.json files
2. Insert metadata into `episodes` table
3. Insert content blocks into `episode_content` table
4. Insert vocabulary into `vocabulary` table
5. Upload audio/images to Supabase Storage
6. Update URLs to point to storage

## Best Practices

### Content Creation
1. Start with metadata
2. Write content blocks in logical order
3. Add vocabulary as you reference words
4. Create quiz questions testing key concepts
5. Design AI conversation prompts for practice

### File Management
- Keep images optimized (use WebP when possible)
- Use descriptive filenames
- Maintain consistent naming conventions
- Version control all content files

### Quality Assurance
- Validate JSON syntax before committing
- Test audio playback
- Verify all images load
- Check translations for accuracy
- Review quiz questions for clarity

## Examples

See `public/content/episodes/a1/01-morning-coffee/episode.json` for a complete, production-ready example.

## Future Enhancements

1. **JSON Schema validation** - Automated structure validation
2. **Content editor UI** - Visual editor for non-developers
3. **Translation management** - Workflow for adding new languages
4. **Asset optimization** - Automated image/audio compression
5. **CDN integration** - Serve assets from CDN for performance
