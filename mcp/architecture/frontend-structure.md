# Frontend Structure

## Stack
- **Build Tool**: Vite
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State**: React Context + localStorage

## Principles
- Components are presentational (dumb)
- Hooks handle data fetching and business logic
- No direct Supabase queries inside UI components
- Feature-based organization
- Type-safe with TypeScript
- Context for global state (auth, language)

## Current Structure

```
/src
  /components          # Reusable UI components
    AudioPlayer.tsx
    LanguageSelector.tsx
    Navbar.tsx
    RichTranscript.tsx
    StatsCard.tsx
    VocabularyList.tsx
    /ui                # shadcn/ui components
      badge.tsx
      button.tsx
      card.tsx
      ...
  
  /contexts            # React Context providers
    LanguageContext.tsx
  
  /features            # Feature-based modules
    /auth
      context.tsx
      hooks.ts
      service.ts
    /episodes
      data.ts          # Episode metadata
      loader.ts        # Episode JSON loading
      types.ts         # Episode type definitions
    /placement
      service.ts
    /xp
      logic.ts
  
  /hooks               # Custom React hooks
    use-toast.ts
  
  /lib                 # Utilities and helpers
    mockData.ts
    utils.ts
  
  /pages               # Route components
    Dashboard.tsx
    EpisodeDetail.tsx
    Index.tsx
    Library.tsx
    Login.tsx
    NotFound.tsx
    PlacementQuiz.tsx
    Profile.tsx
    Signup.tsx
  
  /types               # Shared TypeScript types
  
  App.tsx              # Root component with providers
  main.tsx             # Entry point

/public
  /content             # Episode content (JSON, audio, images)
    /episodes
      /a1              # Beginner level
        /01-morning-coffee
          episode.json
          audio_01.mp3
          /images
      /a2              # Elementary level
      /b1              # Intermediate level
      /b2              # Upper-intermediate level
```

## Key Components

### Global Providers
- **LanguageProvider** - User's native language preference (es/pt)
- **QueryClientProvider** - React Query for data fetching
- **TooltipProvider** - shadcn/ui tooltips

### Page Components
- **Dashboard** - User's learning path and stats
- **EpisodeDetail** - Episode player with tabs (transcript, vocabulary, expressions, quiz, AI chat)
- **Library** - Completed episodes history
- **Profile** - User settings and language preference
- **PlacementQuiz** - CEFR level assessment

### Feature Components
- **AudioPlayer** - HTML5 audio player with controls
- **RichTranscript** - Renders ContentBlock arrays
- **VocabularyList** - Language-aware vocabulary display
- **LanguageSelector** - Native language picker

## Data Flow

```
User Action
  → Page Component
    → Feature Hook (useAuth, useEpisode)
      → Service Layer (authService, loadEpisodeData)
        → Data Source (localStorage, JSON files, future: Supabase)
          → Context/State Update
            → UI Re-render
```

## State Management

### Local State
- Component-level: `useState`, `useReducer`
- Form state: Controlled components

### Global State
- **Auth**: `authService` + `useAuth` hook
- **Language**: `LanguageContext` + `useLanguage` hook
- **Toast**: `useToast` hook

### Persistent State
- **localStorage**: User auth, language preference
- **Future**: Supabase for user data, progress

## Routing

```typescript
/ (Index)
/login
/signup
/placement
/dashboard
/library
/episode/:id
/profile
```

## Type Safety

All data structures are typed:
- `EpisodeMeta` - Episode metadata
- `EpisodeData` - Full episode content
- `ContentBlock` - Transcript content types
- `User` - User profile and progress
- `SupportedLanguage` - 'es' | 'pt'

## Component Guidelines

### Do's ✅
- Keep components small and focused
- Use TypeScript for all props
- Extract reusable logic to hooks
- Use Context for global state
- Co-locate related files in features

### Don'ts ❌
- Don't put business logic in components
- Don't make direct API calls from components
- Don't use any type
- Don't duplicate code across components
- Don't ignore accessibility

## Future Enhancements

1. **State Management**: Consider Zustand/Jotai if Context becomes complex
2. **Data Fetching**: Migrate to React Query for server state
3. **Code Splitting**: Lazy load routes and heavy components
4. **Testing**: Add Jest + React Testing Library
5. **Storybook**: Component documentation and testing
