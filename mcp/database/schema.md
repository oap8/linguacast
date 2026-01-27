# Database Schema – Source of Truth

**Database**: PostgreSQL (Supabase)  
**Status**: Planning (MVP uses JSON files + localStorage)  
**Migration**: Planned for Phase 2

## Overview

This document defines the database schema for LinguaCast when migrating from JSON files to Supabase. The schema is designed to support:
- User authentication and profiles
- Episode content and metadata
- Multi-language vocabulary
- Progress tracking and gamification
- Spaced repetition system

## Schema Rules

- ✅ All tables use UUID primary keys
- ✅ Timestamps for created_at and updated_at
- ✅ Foreign keys with ON DELETE CASCADE where appropriate
- ✅ Indexes on frequently queried columns
- ✅ Row Level Security (RLS) policies for all tables
- ✅ No frontend assumptions in schema design
- ✅ All schema changes must be documented

---

## Core Tables

### 1. users
**Purpose**: User authentication (managed by Supabase Auth)

```sql
-- Managed by Supabase Auth
-- Contains: id, email, encrypted_password, email_confirmed_at, etc.
```

**Note**: This table is automatically managed by Supabase Auth. Do not modify directly.

---

### 2. profiles
**Purpose**: User profile information and preferences

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  level VARCHAR(10) NOT NULL DEFAULT 'beginner',
  native_language VARCHAR(2) NOT NULL DEFAULT 'es',
  has_completed_placement BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_level ON profiles(level);
CREATE INDEX idx_profiles_language ON profiles(native_language);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Columns:**
- `id` - User ID (references auth.users)
- `email` - User email
- `name` - Display name
- `avatar_url` - Profile picture URL (Supabase Storage)
- `level` - CEFR level (beginner, intermediate, advanced, master)
- `native_language` - Language code (es, pt, zh, hi, ar, fr)
- `has_completed_placement` - Placement quiz completion flag
- `created_at` - Account creation timestamp
- `updated_at` - Last profile update timestamp

---

### 3. user_progress
**Purpose**: Track user learning progress and statistics

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episodes_completed INT DEFAULT 0,
  total_minutes INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_xp ON user_progress(total_xp DESC);

-- RLS Policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

**Columns:**
- `episodes_completed` - Total episodes completed
- `total_minutes` - Total learning time in minutes
- `current_streak` - Current consecutive days streak
- `longest_streak` - Longest streak achieved
- `total_xp` - Total experience points earned
- `last_activity_date` - Last learning activity date

---

### 4. episodes
**Purpose**: Episode metadata and information

```sql
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(10) NOT NULL,
  order_index INT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  duration INT NOT NULL,
  category VARCHAR(50),
  is_locked BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(level, order_index)
);

-- Indexes
CREATE INDEX idx_episodes_level ON episodes(level);
CREATE INDEX idx_episodes_order ON episodes(level, order_index);
CREATE INDEX idx_episodes_category ON episodes(category);

-- RLS Policies
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Episodes are viewable by everyone"
  ON episodes FOR SELECT
  USING (true);
```

**Columns:**
- `level` - CEFR level (a1, a2, b1, b2)
- `order_index` - Episode number within level
- `title` - Episode title
- `subtitle` - Short description
- `description` - Full description
- `duration` - Duration in seconds
- `category` - Category/topic
- `is_locked` - Access control flag
- `is_new` - New badge flag
- `audio_url` - Audio file URL (Supabase Storage)
- `thumbnail_url` - Thumbnail image URL

---

### 5. episode_content
**Purpose**: Rich transcript ContentBlocks

```sql
CREATE TABLE episode_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  block_type VARCHAR(20) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(episode_id, order_index)
);

-- Indexes
CREATE INDEX idx_episode_content_episode ON episode_content(episode_id);
CREATE INDEX idx_episode_content_order ON episode_content(episode_id, order_index);
CREATE INDEX idx_episode_content_type ON episode_content(block_type);

-- RLS Policies
ALTER TABLE episode_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Episode content is viewable by everyone"
  ON episode_content FOR SELECT
  USING (true);
```

**Block Types:**
- `heading` - Section headings
- `text` - Paragraph text
- `image` - Images with captions
- `dialogue` - Speaker conversations
- `practice` - Practice prompts
- `audio-cue` - Audio timestamps
- `section` - Nested sections

**Content JSONB Structure:**
```json
{
  "text": "...",
  "level": 1,
  "src": "...",
  "alt": "...",
  "speaker": "...",
  "timestamp": 45
}
```

---

### 6. vocabulary
**Purpose**: Vocabulary words with multi-language translations

```sql
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  part_of_speech VARCHAR(20),
  example TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vocabulary_episode ON vocabulary(episode_id);
CREATE INDEX idx_vocabulary_word ON vocabulary(word);

-- RLS Policies
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vocabulary is viewable by everyone"
  ON vocabulary FOR SELECT
  USING (true);
```

---

### 7. vocabulary_translations
**Purpose**: Multi-language translations for vocabulary

```sql
CREATE TABLE vocabulary_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vocabulary_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  language_code VARCHAR(2) NOT NULL,
  translation TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  translator_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vocabulary_id, language_code)
);

-- Indexes
CREATE INDEX idx_vocab_trans_vocab ON vocabulary_translations(vocabulary_id);
CREATE INDEX idx_vocab_trans_lang ON vocabulary_translations(language_code);
CREATE INDEX idx_vocab_trans_lookup ON vocabulary_translations(vocabulary_id, language_code);

-- RLS Policies
ALTER TABLE vocabulary_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations are viewable by everyone"
  ON vocabulary_translations FOR SELECT
  USING (true);
```

**Supported Languages:**
- `es` - Spanish
- `pt` - Portuguese
- `zh` - Mandarin (future)
- `hi` - Hindi (future)
- `ar` - Arabic (future)
- `fr` - French (future)

---

### 8. expressions
**Purpose**: Idioms and expressions with context

```sql
CREATE TABLE expressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  expression TEXT NOT NULL,
  meaning TEXT NOT NULL,
  usage TEXT,
  example TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_expressions_episode ON expressions(episode_id);

-- RLS Policies
ALTER TABLE expressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expressions are viewable by everyone"
  ON expressions FOR SELECT
  USING (true);
```

---

### 9. quiz_questions
**Purpose**: Comprehension quiz questions

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(episode_id, order_index)
);

-- Indexes
CREATE INDEX idx_quiz_episode ON quiz_questions(episode_id);

-- RLS Policies
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions FOR SELECT
  USING (true);
```

**Options JSONB:**
```json
["Option 1", "Option 2", "Option 3"]
```

---

### 10. user_episode_progress
**Purpose**: Track individual episode completion and progress

```sql
CREATE TABLE user_episode_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started',
  progress_percent INT DEFAULT 0,
  last_position INT DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_score INT,
  quiz_attempts INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

-- Indexes
CREATE INDEX idx_user_ep_progress_user ON user_episode_progress(user_id);
CREATE INDEX idx_user_ep_progress_episode ON user_episode_progress(episode_id);
CREATE INDEX idx_user_ep_progress_status ON user_episode_progress(user_id, status);

-- RLS Policies
ALTER TABLE user_episode_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own episode progress"
  ON user_episode_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own episode progress"
  ON user_episode_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own episode progress"
  ON user_episode_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Status Values:**
- `not_started` - Episode not yet started
- `in_progress` - Currently learning
- `completed` - Finished episode

---

### 11. xp_events
**Purpose**: Track XP earning events for gamification

```sql
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  xp_amount INT NOT NULL,
  episode_id UUID REFERENCES episodes(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_xp_events_user ON xp_events(user_id);
CREATE INDEX idx_xp_events_type ON xp_events(event_type);
CREATE INDEX idx_xp_events_date ON xp_events(created_at DESC);

-- RLS Policies
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP events"
  ON xp_events FOR SELECT
  USING (auth.uid() = user_id);
```

**Event Types:**
- `episode_completed` - Completed an episode
- `quiz_passed` - Passed quiz with 80%+
- `daily_streak` - Maintained daily streak
- `vocabulary_mastered` - Mastered vocabulary word
- `level_up` - Advanced to next level

---

### 12. user_vocabulary_progress
**Purpose**: Spaced repetition system for vocabulary

```sql
CREATE TABLE user_vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vocabulary_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  mastery_level INT DEFAULT 0,
  next_review_date DATE,
  review_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- Indexes
CREATE INDEX idx_user_vocab_user ON user_vocabulary_progress(user_id);
CREATE INDEX idx_user_vocab_review ON user_vocabulary_progress(user_id, next_review_date);
CREATE INDEX idx_user_vocab_mastery ON user_vocabulary_progress(user_id, mastery_level);

-- RLS Policies
ALTER TABLE user_vocabulary_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary progress"
  ON user_vocabulary_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own vocabulary progress"
  ON user_vocabulary_progress FOR ALL
  USING (auth.uid() = user_id);
```

**Mastery Levels:**
- `0` - Not seen
- `1` - Introduced
- `2` - Familiar
- `3` - Comfortable
- `4` - Mastered

---

### 13. user_favorites
**Purpose**: User's favorited episodes

```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

-- Indexes
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_episode ON user_favorites(episode_id);

-- RLS Policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id);
```

---

## Migration Strategy

### Phase 1: User Data
1. Create `profiles` table
2. Create `user_progress` table
3. Create `user_favorites` table
4. Migrate localStorage data to database

### Phase 2: Content
1. Create `episodes` table
2. Create `episode_content` table
3. Create `vocabulary` and `vocabulary_translations` tables
4. Create `expressions` table
5. Create `quiz_questions` table
6. Parse JSON files and insert into database

### Phase 3: Progress Tracking
1. Create `user_episode_progress` table
2. Create `xp_events` table
3. Create `user_vocabulary_progress` table
4. Implement progress tracking logic

### Phase 4: Storage
1. Upload audio files to Supabase Storage
2. Upload images to Supabase Storage
3. Update URLs in database

---

## Storage Buckets

### audio_files
**Purpose**: Episode audio files

```sql
-- Bucket configuration
{
  "public": true,
  "file_size_limit": 10485760,
  "allowed_mime_types": ["audio/mpeg", "audio/mp3"]
}
```

**Path Structure:**
```
/audio_files/{level}/{episode_id}/audio.mp3
```

### images
**Purpose**: Episode images and user avatars

```sql
-- Bucket configuration
{
  "public": true,
  "file_size_limit": 2097152,
  "allowed_mime_types": ["image/png", "image/jpeg", "image/webp"]
}
```

**Path Structure:**
```
/images/episodes/{level}/{episode_id}/{filename}
/images/avatars/{user_id}/{filename}
```

---

## Functions & Triggers

### update_updated_at_column()
**Purpose**: Automatically update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

### calculate_streak()
**Purpose**: Calculate and update user streak

```sql
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  v_current_streak INT;
BEGIN
  -- Logic to calculate streak based on last_activity_date
  -- Returns current streak value
END;
$$ LANGUAGE plpgsql;
```

---

## Related Documentation

- [Decision 001: Supabase First](../decisions/001-supabase-first.md)
- [Decision 003: Episode JSON Structure](../decisions/003-episode-json-structure.md)
- [Architecture Overview](../architecture/overview.md)
- [RLS Policies](./rls.md)
