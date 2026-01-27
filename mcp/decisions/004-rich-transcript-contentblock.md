# Decision 004 – Rich Transcript ContentBlock System

**Date**: January 26, 2026  
**Status**: ✅ Implemented

## Decision

Implement a flexible, type-safe ContentBlock system for rich transcript rendering that supports multiple content types (text, images, dialogue, practice exercises, audio cues) rather than plain text transcripts.

## Context

Traditional podcast transcripts are plain text with timestamps. For language learning, we need:
- Visual elements (images, icons)
- Structured dialogue (speaker identification)
- Practice prompts (interactive exercises)
- Highlighted vocabulary
- Sectioned content (chapters/topics)

A plain string transcript doesn't support these requirements.

## Approach

### ContentBlock Type System

Created a discriminated union type supporting 7 content types:

```typescript
export type ContentBlock =
  | { type: 'heading'; text: string; level: 1 | 2 | 3 }
  | { type: 'text'; text: string; highlight?: boolean }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'audio-cue'; text: string; timestamp: number }
  | { type: 'practice'; instruction: string; expected: string }
  | { type: 'dialogue'; speaker: string; text: string }
  | { type: 'section'; title: string; blocks: ContentBlock[] };
```

### Block Types Explained

1. **heading** - Section titles (h1, h2, h3)
2. **text** - Paragraph text with optional highlighting
3. **image** - Visual content with alt text and optional caption
4. **audio-cue** - Timestamp markers for audio synchronization
5. **practice** - Interactive practice prompts with expected responses
6. **dialogue** - Speaker-identified conversation lines
7. **section** - Nested content grouping (recursive structure)

### Rendering Component

Created `RichTranscript.tsx` component:
- Recursively renders ContentBlock arrays
- Type-safe rendering with TypeScript
- Styled with Tailwind CSS
- Handles nested sections
- Supports timestamp click events

## Rationale

### Why ContentBlock System?

1. **Flexibility**: Easy to add new content types
2. **Type Safety**: TypeScript ensures correct structure
3. **Reusability**: Same system for all episodes
4. **Rich UX**: Images, dialogue, practice exercises
5. **Maintainability**: Clear structure, easy to debug

### Why Discriminated Union?

- TypeScript narrows types automatically
- Impossible to create invalid combinations
- IDE autocomplete works perfectly
- Compile-time validation
- No runtime type checking needed

### Why Recursive Sections?

Allows nested content structure:
```
Section: "Greetings"
  ├── Heading: "Morning Greetings"
  ├── Text: "We use different greetings..."
  ├── Dialogue: Anna says "Good morning!"
  └── Practice: "Say good morning to someone"
```

## Implementation

### Files Created
- `src/features/episodes/types.ts` - ContentBlock type definitions
- `src/components/RichTranscript.tsx` - Rendering component

### Files Modified
- `src/pages/EpisodeDetail.tsx` - Uses RichTranscript component
- `public/content/episodes/a1/01-morning-coffee/episode.json` - Content array

### Example Usage

```json
{
  "content": [
    {
      "type": "heading",
      "text": "Morning Coffee Conversations",
      "level": 1
    },
    {
      "type": "text",
      "text": "Learn how to greet people at different times of the day."
    },
    {
      "type": "image",
      "src": "images/coffee_cup.png",
      "alt": "A cup of coffee",
      "caption": "Morning coffee time"
    },
    {
      "type": "dialogue",
      "speaker": "Anna",
      "text": "Good morning! How are you?"
    },
    {
      "type": "practice",
      "instruction": "Try saying 'Good morning' to someone today!",
      "expected": "Good morning!"
    }
  ]
}
```

## Trade-offs

### Pros
- ✅ Rich, engaging transcripts
- ✅ Type-safe content structure
- ✅ Easy to extend with new types
- ✅ Supports images and media
- ✅ Interactive elements possible
- ✅ Clear content hierarchy

### Cons
- ❌ More complex than plain text
- ❌ Larger JSON files
- ❌ Requires content authoring tool (future)
- ❌ Manual JSON creation is tedious

## Content Authoring

Current process:
1. Write content in structured format
2. Convert to JSON manually
3. Validate JSON syntax
4. Test in app

Future enhancement:
- Visual content editor
- Drag-and-drop block builder
- Live preview
- Template library

## Supported Content Types

### Current (v1)
- ✅ Headings (3 levels)
- ✅ Text paragraphs
- ✅ Images with captions
- ✅ Dialogue (speaker + text)
- ✅ Practice prompts
- ✅ Audio cues
- ✅ Nested sections

### Future (v2)
- 🔜 Video embeds
- 🔜 Audio clips (inline)
- 🔜 Interactive quizzes (inline)
- 🔜 Vocabulary tooltips
- 🔜 Grammar explanations
- 🔜 Cultural notes
- 🔜 Pronunciation guides

## Accessibility

Considerations:
- Alt text for all images (required)
- Semantic HTML (headings, sections)
- Screen reader friendly
- Keyboard navigation support
- High contrast text

## Performance

Optimizations:
- Lazy load images
- Virtual scrolling for long transcripts
- Memoized rendering
- Efficient re-renders with React keys

## Migration to Database

When moving to Supabase:

```sql
CREATE TABLE episode_content (
  id UUID PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id),
  order_index INT,
  block_type VARCHAR(20),
  content JSONB,
  created_at TIMESTAMP
);
```

Each ContentBlock becomes a row with:
- `block_type`: 'heading', 'text', 'image', etc.
- `content`: JSON object with type-specific fields
- `order_index`: Maintains block order

## Validation Rules

Content must follow:
1. Images must have `src` and `alt`
2. Headings must have `level` 1-3
3. Dialogue must have `speaker` and `text`
4. Sections can nest up to 3 levels deep
5. Audio cues must have valid timestamps

## Success Metrics

- Transcript renders in < 200ms
- Images load progressively
- No layout shift during load
- Accessible to screen readers
- Easy to add new content types

## Examples in Production

**Morning Coffee Conversations** uses:
- 15 text blocks
- 3 images
- 8 dialogue blocks
- 4 practice prompts
- 2 sections

Total JSON size: ~12KB (acceptable)

## Related Decisions

- Decision 003: Episode JSON Structure (content array in episode.json)
- Future: Decision on content editor UI
- Future: Decision on video/audio inline support

## Revisit When

1. Need to add new content types (extend ContentBlock union)
2. Performance issues with large transcripts (implement virtualization)
3. Content authoring becomes bottleneck (build editor)
4. Need real-time collaboration (move to CMS)
5. Accessibility issues reported (enhance a11y)

## Notes

- Keep ContentBlock types simple and focused
- Avoid deeply nested sections (max 3 levels)
- Always provide alt text for images
- Test with screen readers
- Consider mobile layout for all block types
