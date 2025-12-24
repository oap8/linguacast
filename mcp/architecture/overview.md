# System Overview

LinguaCast is a podcast-based language learning app.

High-level flow:
Frontend (React)
 → API layer (Supabase / FastAPI)
 → PostgreSQL (Supabase)

Core domains:
- Users & auth
- Placement & CEFR levels
- Podcasts & transcripts
- Progress & XP system

Rules:
- Frontend never contains business logic
- XP, levels, streaks are calculated server-side
- CEFR logic is centralized