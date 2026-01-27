# Glossary

## Language Learning Terms

**CEFR**  
Common European Framework of Reference for Languages. International standard for describing language proficiency with 6 levels: A1, A2, B1, B2, C1, C2. LinguaCast currently supports A1-B2.

**Episode**  
A single podcast lesson containing audio, transcript, vocabulary, expressions, quiz, and practice exercises. Episodes are organized by CEFR level and numbered sequentially.

**Transcript**  
Rich, interactive content that accompanies the audio. Includes text, images, dialogue, practice prompts, and audio cues. Rendered using ContentBlock system.

**Vocabulary**  
Key words and phrases taught in an episode, with translations in multiple languages, part of speech, and example sentences.

**Expressions**  
Idioms, phrases, and common expressions with meaning, usage context, and examples.

**Placement Quiz**  
Assessment quiz to determine user's CEFR level. Taken during onboarding to personalize learning path.

**Spaced Repetition**  
Learning technique that reviews vocabulary at increasing intervals to improve long-term retention. Planned for Phase 3.

---

## Technical Terms

**ContentBlock**  
Type-safe data structure for rich transcript content. Supports 7 types: heading, text, image, dialogue, practice, audio-cue, section. Defined as TypeScript discriminated union.

**LanguageContext**  
React Context that manages user's native language preference (Spanish, Portuguese, etc.). Persists selection in localStorage.

**episode.json**  
Structured JSON file containing all episode content: metadata, transcript, vocabulary, expressions, quiz, and AI prompts. Located in `/public/content/episodes/{level}/{order}-{title}/`.

**Mock Data**  
Simulated data used during MVP phase before Supabase migration. Stored in TypeScript files and localStorage.

**RLS (Row Level Security)**  
Supabase security feature that restricts database access at the row level based on user authentication. Policies defined for all tables.

**Supabase**  
Backend-as-a-Service platform providing PostgreSQL database, authentication, and file storage. Planned for Phase 2 migration.

**shadcn/ui**  
Collection of reusable React components built with Radix UI and Tailwind CSS. Used for all UI components.

---

## Architecture Terms

**Feature-based Structure**  
Code organization pattern where related files (components, hooks, services, types) are grouped by feature rather than file type.

**Service Layer**  
Abstraction layer that handles business logic and data fetching. Examples: `authService`, `loadEpisodeData()`.

**Context Provider**  
React pattern for sharing state globally without prop drilling. Used for auth and language preference.

**Content Block Types**  
- **heading**: Section titles (h1, h2, h3)
- **text**: Paragraph content with optional highlighting
- **image**: Visual content with alt text and captions
- **dialogue**: Speaker-identified conversation lines
- **practice**: Interactive learning prompts
- **audio-cue**: Timestamp markers for audio synchronization
- **section**: Nested content grouping (recursive)

---

## User Progress Terms

**XP (Experience Points)**  
Points earned for completing episodes, passing quizzes, and maintaining streaks. Used for gamification and level progression.

**Streak**  
Number of consecutive days a user has engaged with learning content. Tracked in `user_progress.current_streak`.

**Mastery Level**  
Vocabulary learning progress from 0 (not seen) to 4 (mastered). Used in spaced repetition system.

**Episode Progress**  
Tracking of individual episode completion status: not_started, in_progress, completed. Includes quiz score and attempts.

---

## Content Terms

**Native Language**  
User's first language, used to display vocabulary translations. Currently supports Spanish (es) and Portuguese (pt).

**Translation**  
Word or phrase converted to user's native language. Stored in `vocabulary.translations` object with language codes as keys.

**Audio File**  
MP3 file containing episode audio. Currently stored in public folder, future: Supabase Storage.

**Asset Co-location**  
Practice of storing related files (JSON, audio, images) in the same folder for easier management.

---

## Database Terms

**UUID**  
Universally Unique Identifier. Used as primary key for all database tables.

**JSONB**  
PostgreSQL data type for storing JSON with indexing support. Used for ContentBlock content and quiz options.

**Foreign Key**  
Database constraint that links records between tables. Example: `episode_id` in `vocabulary` table references `episodes.id`.

**Index**  
Database optimization that speeds up queries on specific columns. Created for frequently queried fields.

**Trigger**  
Automatic database function that executes on specific events. Example: `update_updated_at_column()` on row updates.

---

## Development Terms

**MVP (Minimum Viable Product)**  
Initial version with core features: episodes, vocabulary, quiz, multi-language support. Uses JSON files and localStorage.

**Phase 2**  
Supabase migration phase: database, auth, storage, progress tracking.

**Phase 3**  
Full backend phase: XP system, spaced repetition, advanced features.

**Phase 4**  
Advanced features phase: AI conversation, speech recognition, community features.

**Migration Path**  
Planned transition from JSON files to Supabase database. Documented in schema.md and decision logs.

---

## UI/UX Terms

**Tab Navigation**  
Interface pattern with tabs for different content types: Transcript, Vocabulary, Expressions, Quiz, AI Chat.

**Language Selector**  
UI component allowing users to choose their native language. Located in Profile page.

**Progress Bar**  
Visual indicator showing episode completion or audio playback position.

**Badge**  
Small UI element displaying status (New, Locked, Level, etc.).

**Card**  
Container component for grouping related content with border and shadow.

---

## File Structure Terms

**Public Folder**  
Directory served directly by Vite. Contains episode content, audio files, and images.

**Source Folder (src)**  
Contains application code: components, pages, features, contexts, hooks.

**MCP Folder**  
Model Context Protocol documentation: decisions, architecture, features, database, audits.

**Content Folder**  
`/public/content/episodes/` - Organized by CEFR level, contains episode.json and assets.

---

## Quality Assurance Terms

**Type Safety**  
TypeScript feature ensuring variables have correct types at compile time. All code is type-safe.

**RLS Policy**  
Row Level Security rule defining who can access which database rows. Example: "Users can view own profile".

**Accessibility (a11y)**  
Design practice ensuring app is usable by people with disabilities. WCAG 2.1 AA compliant.

**Audit Report**  
Periodic review of code quality, build health, architecture compliance, and documentation.

---

## Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [Frontend Structure](../architecture/frontend-structure.md)
- [Content Structure](../architecture/content-structure.md)
- [Database Schema](../database/schema.md)
- [Decision Logs](../decisions/)
- [Feature Documentation](../features/)
