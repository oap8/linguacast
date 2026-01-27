# Rich Transcripts

## Overview

LinguaCast uses a flexible ContentBlock system to create rich, interactive transcripts that go beyond plain text. Transcripts can include images, dialogue, practice prompts, audio cues, and structured sections, providing an engaging learning experience.

## ContentBlock System

### Architecture

Rich transcripts are built using a discriminated union type system that ensures type safety and flexibility:

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

### Block Types

#### 1. Heading Block
**Purpose**: Section titles and content organization

```json
{
  "type": "heading",
  "text": "Morning Coffee Conversations",
  "level": 1
}
```

**Levels:**
- `1` - Main title (h1)
- `2` - Section heading (h2)
- `3` - Subsection heading (h3)

**Rendered as:**
```html
<h1 className="text-3xl font-bold">Morning Coffee Conversations</h1>
```

---

#### 2. Text Block
**Purpose**: Paragraph content with optional highlighting

```json
{
  "type": "text",
  "text": "Learn how to greet people at different times of the day.",
  "highlight": false
}
```

**Features:**
- Standard paragraph text
- Optional highlighting for emphasis
- Supports long-form content

**Rendered as:**
```html
<p className="text-foreground mb-4">
  Learn how to greet people at different times of the day.
</p>
```

---

#### 3. Image Block
**Purpose**: Visual content with accessibility

```json
{
  "type": "image",
  "src": "images/coffee_cup.png",
  "alt": "A cup of coffee",
  "caption": "Morning coffee time"
}
```

**Requirements:**
- `src` - Relative path to image
- `alt` - Required for accessibility
- `caption` - Optional descriptive text

**Rendered as:**
```html
<figure className="my-6">
  <img src="/content/episodes/a1/01-morning-coffee/images/coffee_cup.png" 
       alt="A cup of coffee" 
       className="rounded-lg" />
  <figcaption className="text-sm text-muted-foreground mt-2">
    Morning coffee time
  </figcaption>
</figure>
```

---

#### 4. Dialogue Block
**Purpose**: Speaker-identified conversation

```json
{
  "type": "dialogue",
  "speaker": "Anna",
  "text": "Good morning! How are you?"
}
```

**Features:**
- Clear speaker identification
- Formatted as conversation
- Visual distinction from narrative text

**Rendered as:**
```html
<div className="mb-2 pl-4 border-l-2 border-muted">
  <p className="text-sm font-semibold text-primary">Anna says:</p>
  <p className="text-foreground italic">"Good morning! How are you?"</p>
</div>
```

**Special Case:**
- "Barista" speaker displays as "The barista says:" for proper grammar

---

#### 5. Practice Block
**Purpose**: Interactive learning prompts

```json
{
  "type": "practice",
  "instruction": "Try saying 'Good morning' to someone today!",
  "expected": "Good morning!"
}
```

**Features:**
- Clear instruction
- Expected response shown
- Encourages active practice

**Rendered as:**
```html
<div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg my-4">
  <p className="font-semibold text-primary mb-2">Practice:</p>
  <p className="text-foreground mb-2">
    Try saying 'Good morning' to someone today!
  </p>
  <p className="text-sm text-muted-foreground">
    Expected: "Good morning!"
  </p>
</div>
```

---

#### 6. Audio Cue Block
**Purpose**: Timestamp markers for audio synchronization

```json
{
  "type": "audio-cue",
  "text": "Listen to the pronunciation",
  "timestamp": 45
}
```

**Features:**
- Links to specific audio timestamp
- Clickable to jump to audio position
- Visual indicator for audio content

**Rendered as:**
```html
<button 
  onClick={() => jumpToTimestamp(45)}
  className="flex items-center gap-2 text-primary hover:underline my-2"
>
  <Headphones className="h-4 w-4" />
  <span>Listen to the pronunciation (0:45)</span>
</button>
```

---

#### 7. Section Block
**Purpose**: Nested content grouping

```json
{
  "type": "section",
  "title": "Greetings Throughout the Day",
  "blocks": [
    { "type": "text", "text": "..." },
    { "type": "dialogue", "speaker": "Anna", "text": "..." }
  ]
}
```

**Features:**
- Recursive structure (sections within sections)
- Logical content organization
- Visual hierarchy

**Rendered as:**
```html
<section className="my-6 p-4 bg-muted/30 rounded-lg">
  <h3 className="text-xl font-semibold mb-4">
    Greetings Throughout the Day
  </h3>
  <!-- Nested blocks rendered recursively -->
</section>
```

**Nesting Limit**: Maximum 3 levels deep

---

## RichTranscript Component

**File**: `src/components/RichTranscript.tsx`

### Props

```typescript
interface RichTranscriptProps {
  content: ContentBlock[];
  basePath: string;
  onTimestampClick?: (timestamp: number) => void;
}
```

### Features

- **Type-safe rendering**: TypeScript ensures correct block structure
- **Recursive rendering**: Handles nested sections
- **Image path resolution**: Converts relative paths to absolute
- **Timestamp handling**: Callback for audio synchronization
- **Responsive design**: Mobile-friendly layout
- **Accessibility**: Semantic HTML, ARIA labels

### Usage

```tsx
import { RichTranscript } from '@/components/RichTranscript';

<RichTranscript 
  content={episodeData.content}
  basePath={getEpisodeBasePath(episodeId)}
  onTimestampClick={(timestamp) => {
    audioPlayer.seekTo(timestamp);
  }}
/>
```

## Content Creation Workflow

### 1. Plan Structure
```
Episode: Morning Coffee Conversations
├── Heading: Title
├── Text: Introduction
├── Image: Coffee shop scene
├── Section: Morning Greetings
│   ├── Text: Explanation
│   ├── Dialogue: Anna greets barista
│   └── Practice: Try greeting
└── Section: Vocabulary Practice
    ├── Text: Key words
    └── Practice: Use in sentence
```

### 2. Write Content
Create content blocks in logical order:
- Start with main heading
- Add introductory text
- Include visual elements
- Structure dialogue naturally
- Add practice prompts strategically

### 3. Convert to JSON
```json
{
  "content": [
    { "type": "heading", "text": "...", "level": 1 },
    { "type": "text", "text": "..." },
    { "type": "image", "src": "...", "alt": "...", "caption": "..." }
  ]
}
```

### 4. Validate
- Check JSON syntax
- Verify all images exist
- Test audio cue timestamps
- Review dialogue formatting
- Validate section nesting

### 5. Test in UI
- Load episode in browser
- Check all blocks render correctly
- Test image loading
- Verify audio cues work
- Check mobile responsiveness

## Best Practices

### Content Structure
✅ **Do:**
- Start with clear heading
- Use sections for logical grouping
- Include visuals every 3-4 paragraphs
- Add practice prompts after new concepts
- Keep text blocks concise (2-3 sentences)

❌ **Don't:**
- Nest sections more than 3 levels
- Use images without alt text
- Create walls of text
- Skip dialogue formatting
- Forget audio cues for pronunciation

### Image Guidelines
- **Format**: WebP or PNG
- **Size**: < 200KB per image
- **Dimensions**: Max 1200px width
- **Alt text**: Descriptive, concise
- **Captions**: Optional but recommended

### Dialogue Formatting
- Always identify speaker
- Use natural language
- Keep exchanges short
- Add context when needed
- Format consistently

### Practice Prompts
- Clear instructions
- Realistic scenarios
- Show expected response
- Encourage active use
- Place after learning content

## Example: Complete Transcript

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
      "type": "section",
      "title": "At the Coffee Shop",
      "blocks": [
        {
          "type": "text",
          "text": "Anna walks into her favorite coffee shop."
        },
        {
          "type": "image",
          "src": "images/Anna_barista.png",
          "alt": "Anna talking to a barista"
        },
        {
          "type": "dialogue",
          "speaker": "Anna",
          "text": "Good morning! How are you?"
        },
        {
          "type": "dialogue",
          "speaker": "Barista",
          "text": "Good morning! I'm fine, thank you. And you?"
        },
        {
          "type": "practice",
          "instruction": "Try greeting someone at a coffee shop!",
          "expected": "Good morning! How are you?"
        }
      ]
    },
    {
      "type": "audio-cue",
      "text": "Listen to the full conversation",
      "timestamp": 0
    }
  ]
}
```

## Performance

### Rendering
- **Initial render**: < 200ms for typical episode
- **Re-renders**: Optimized with React keys
- **Image loading**: Progressive (lazy load future)
- **Memory**: Efficient with virtual scrolling (future)

### Optimization Strategies
1. Memoize block rendering
2. Lazy load images below fold
3. Virtual scrolling for long transcripts
4. Code splitting for heavy components

## Accessibility

### Standards Compliance
- ✅ WCAG 2.1 AA compliant
- ✅ Semantic HTML structure
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Screen reader friendly

### Implementation
- All images have alt text
- Headings use proper hierarchy
- Buttons have descriptive labels
- Color contrast meets standards
- Focus indicators visible

## Future Enhancements

### Phase 1: Interactive Elements
- ✅ Audio cue timestamps
- 🔜 Inline vocabulary tooltips
- 🔜 Expandable grammar notes
- 🔜 Interactive practice exercises

### Phase 2: Media Support
- 🔜 Video embeds
- 🔜 Inline audio clips
- 🔜 GIF animations
- 🔜 Interactive diagrams

### Phase 3: Advanced Features
- 🔜 Text-to-speech for any block
- 🔜 Translation overlay
- 🔜 Note-taking inline
- 🔜 Bookmark specific blocks
- 🔜 Share individual sections

### Phase 4: Personalization
- 🔜 Adjustable text size
- 🔜 Dark/light mode per block
- 🔜 Hide/show block types
- 🔜 Custom highlighting
- 🔜 Progress tracking per block

## Analytics

### Track
- Block type engagement
- Time spent per block type
- Image view rates
- Practice prompt completion
- Audio cue usage

### Metrics
- Average blocks per episode
- Most engaging block types
- Scroll depth
- Interaction rates
- Completion rates

## Migration to Database

```sql
CREATE TABLE episode_content (
  id UUID PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id),
  order_index INT,
  block_type VARCHAR(20),
  content JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_episode_content_episode ON episode_content(episode_id);
CREATE INDEX idx_episode_content_order ON episode_content(episode_id, order_index);
```

## Troubleshooting

### Issue: Images not loading
**Solution**: Check file path, verify image exists, check basePath

### Issue: Sections not rendering
**Solution**: Verify nesting depth < 3, check JSON structure

### Issue: Audio cues not working
**Solution**: Ensure onTimestampClick prop passed, verify timestamp valid

### Issue: Dialogue formatting wrong
**Solution**: Check speaker name, verify text field present

## Related Documentation

- [Decision 004: Rich Transcript ContentBlock](../decisions/004-rich-transcript-contentblock.md)
- [Content Structure](../architecture/content-structure.md)
- [Episode JSON Structure](../decisions/003-episode-json-structure.md)

## Content Editor (Future)

### Planned Features
- Visual block builder
- Drag-and-drop reordering
- Live preview
- Template library
- Bulk operations
- Version history
- Collaboration tools

### UI Mockup
```
┌─────────────────────────────────────┐
│ Episode Editor                      │
├─────────────────────────────────────┤
│ [+ Add Block ▼]                     │
│                                     │
│ ┌─ Heading Block ──────────────┐  │
│ │ Text: Morning Coffee          │  │
│ │ Level: [1 ▼]                  │  │
│ └───────────────────────────────┘  │
│                                     │
│ ┌─ Text Block ─────────────────┐  │
│ │ Learn how to greet...         │  │
│ │ Highlight: [ ]                │  │
│ └───────────────────────────────┘  │
│                                     │
│ [Preview] [Save] [Publish]          │
└─────────────────────────────────────┘
```

## Summary

Rich transcripts transform static text into engaging, interactive learning experiences. The ContentBlock system provides flexibility while maintaining type safety, making it easy to create diverse, accessible content that enhances language learning.
