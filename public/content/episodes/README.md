# Episode Content Structure

This directory contains all podcast episode content organized by CEFR level.

## Folder Structure

```
episodes/
├── a1/                    # Beginner (A1)
│   ├── 01-morning-coffee/
│   │   ├── audio.mp3      # Episode audio file
│   │   ├── episode.json   # All episode data (metadata, transcript, vocab, quiz)
│   │   └── images/        # Images used in transcript
│   ├── 02-ordering-restaurant/
│   └── ...
├── a2/                    # Elementary (A2)
├── b1/                    # Intermediate (B1)
├── b2/                    # Upper Intermediate (B2)
├── c1/                    # Advanced (C1)
└── c2/                    # Proficiency (C2)
```

## Episode JSON Schema

Each `episode.json` contains:

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
    "audioFile": "audio.mp3"
  },
  "content": [
    {
      "type": "heading",
      "text": "Morning Coffee Conversations",
      "level": 1
    },
    {
      "type": "image",
      "src": "images/times-of-day.png",
      "alt": "Coffee cup showing times of day",
      "caption": "Good morning, Afternoon, Evening, Night"
    },
    {
      "type": "audio-cue",
      "text": "Good morning.",
      "timestamp": 15
    }
  ],
  "vocabulary": [
    {
      "word": "morning",
      "translation": "mañana",
      "partOfSpeech": "noun",
      "example": "Good morning, how are you?"
    }
  ],
  "expressions": [
    {
      "expression": "Good morning",
      "meaning": "A greeting used before noon",
      "usage": "Formal and informal",
      "example": "Good morning, Mr. Smith!"
    }
  ],
  "quiz": [
    {
      "question": "What do you say at 8 AM?",
      "options": ["Good morning", "Good afternoon", "Good evening", "Good night"],
      "correctAnswer": 0,
      "explanation": "We say 'Good morning' from early morning until about 12 o'clock."
    }
  ],
  "aiConversation": [
    {
      "prompt": "Practice greeting someone in the morning",
      "context": "You meet your neighbor at 9 AM",
      "expectedVocabulary": ["morning", "hello", "how are you"]
    }
  ]
}
```

## Content Block Types

- `heading` - Section headers (level 1-3)
- `text` - Regular text paragraphs (with optional highlight)
- `image` - Inline images with captions
- `audio-cue` - Clickable text that jumps to timestamp
- `practice` - Interactive practice prompts
- `vocabulary` - Highlighted vocabulary words
- `section` - Nested content sections

## Migration to Supabase

This structure maps directly to database tables:
- `metadata` → `episodes` table
- `content` → `transcript_content` (JSONB column)
- `vocabulary` → `vocabulary` table
- `expressions` → `expressions` table
- `quiz` → `quiz_questions` table
- `aiConversation` → `ai_prompts` table
