# System Overview

LinguaCast is a podcast-based English language learning app that uses CEFR-aligned audio content with rich interactive transcripts, vocabulary, and practice exercises.

## High-Level Architecture

```
User
  ↓
Frontend (React + TypeScript)
  ↓
Content Layer (JSON files) → [Future: Supabase API]
  ↓
Data Storage (localStorage) → [Future: PostgreSQL]
```

### Current State (MVP)
- **Frontend**: React 18 + TypeScript + Vite
- **Content**: JSON files in public folder
- **State**: React Context + localStorage
- **Auth**: Mock service (localStorage-based)

### Future State (Post-MVP)
- **Backend**: Supabase (Auth, Database, Storage)
- **API Layer**: FastAPI (complex business logic)
- **Database**: PostgreSQL via Supabase
- **Storage**: Supabase Storage (audio, images)

## Core Domains

### 1. Users & Authentication
- User profiles with CEFR level
- Progress tracking (XP, streak, episodes completed)
- Language preference (native language)
- Mock auth service → Future: Supabase Auth

### 2. Placement & CEFR Levels
- Placement quiz for level assessment
- 4 CEFR levels: A1, A2, B1, B2
- Level-based content filtering
- Progress-based level advancement

### 3. Episodes & Content
- **Rich transcripts**: Text, images, dialogue, practice prompts
- **Multi-language vocabulary**: Spanish + Portuguese (extensible)
- **Expressions**: Idioms and phrases with context
- **Quiz**: Comprehension questions with explanations
- **AI Conversation**: Practice prompts for speaking

### 4. Progress & Gamification
- XP system (future implementation)
- Streak tracking
- Episode completion tracking
- Learning time statistics

### 5. Multi-Language Support
- User selects native language (Spanish/Portuguese)
- Vocabulary translations in user's language
- Easy to extend to more languages
- Stored in localStorage, future: Supabase

## Data Flow

### Episode Loading
```
User navigates to episode
  → EpisodeDetail component
    → loadEpisodeData(episodeId)
      → Fetch /content/episodes/{level}/{folder}/episode.json
        → Parse JSON
          → Render content with RichTranscript
            → Display vocabulary in user's language
```

### User Authentication
```
User logs in
  → authService.login()
    → Validate credentials (mock)
      → Store user in localStorage
        → Update AuthContext
          → Redirect to Dashboard
```

### Language Preference
```
User selects language
  → LanguageContext.setLanguage()
    → Update localStorage
      → Re-render VocabularyList
        → Display translations in new language
```

## Architecture Rules

### Frontend
- Components are presentational only
- No business logic in components
- Hooks handle data fetching
- Context for global state
- Type-safe with TypeScript
- No direct database queries

### Content
- Stored in structured JSON files
- Organized by CEFR level
- Assets co-located with content
- Versioned in Git
- No hardcoded content in code

### State Management
- Local state for UI
- Context for global state (auth, language)
- localStorage for persistence
- Future: Server state with React Query
- No prop drilling

### Business Logic
- Centralized in service layer
- XP calculations server-side (future)
- CEFR logic centralized
- Validation at data boundaries
- No logic duplication

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Routing**: React Router v6
- **Icons**: Lucide React

### State & Data
- **Global State**: React Context
- **Persistence**: localStorage
- **Future**: React Query + Supabase

### Content
- **Format**: JSON
- **Storage**: Public folder
- **Assets**: Images (WebP/PNG), Audio (MP3)
- **Future**: Supabase Storage

### Backend (Future)
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: FastAPI (when needed)

## Key Features Implemented

### Episode System
- Rich transcript with ContentBlock types
- HTML5 audio player with controls
- Multi-tab interface (transcript, vocabulary, expressions, quiz, AI)
- Dynamic content loading from JSON

### Multi-Language Support
- Spanish and Portuguese vocabulary translations
- User language preference selector
- Context-based language switching
- Extensible to more languages

### User Dashboard
- Level-based episode filtering
- Progress statistics
- Continue learning feature
- Episode grid with lock/unlock states

### Library
- Completed episodes history
- Search functionality
- Statistics (episodes, time, quizzes)

### Profile
- User information display
- Language preference selector
- Progress statistics
- Account settings

## Migration Path

### Phase 1: MVP (Current)
- Frontend with mock data
- JSON-based content
- localStorage persistence
- Multi-language vocabulary

### Phase 2: Supabase Integration
- Supabase Auth
- User profiles in database
- Progress tracking in database
- Episode metadata in database

### Phase 3: Full Backend
- Content in database
- Assets in Supabase Storage
- XP system implementation
- Spaced repetition system

### Phase 4: Advanced Features
- AI conversation practice
- Speech recognition
- Community features
- FastAPI for complex logic

## Performance Considerations

- Lazy load episode content
- Optimize images (WebP format)
- Code splitting by route
- Virtual scrolling for long lists
- Memoize expensive computations

## Security Considerations

- No sensitive data in localStorage (MVP)
- Future: Supabase RLS policies
- Input validation on all forms
- XSS prevention (React default)
- CORS configuration for API

## Scalability Considerations

- Content CDN for global reach
- Database indexing for queries
- Caching strategy for episodes
- Horizontal scaling with Supabase
- Edge functions for low latency

## Related Documentation

- [Frontend Structure](./frontend-structure.md)
- [Content Structure](./content-structure.md)
- [Database Schema](../database/schema.md)
- [Decision 001: Supabase First](../decisions/001-supabase-first.md)
- [Decision 002: Multi-Language Vocabulary](../decisions/002-multi-language-vocabulary.md)
- [Decision 003: Episode JSON Structure](../decisions/003-episode-json-structure.md)
- [Decision 004: Rich Transcript ContentBlock](../decisions/004-rich-transcript-contentblock.md)