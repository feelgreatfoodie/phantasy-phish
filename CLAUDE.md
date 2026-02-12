# Phantasy Phish - Project Instructions

## Overview

Fantasy sports-style web app for Phish concert setlists. Users draft 15 songs per show, get scored against actual setlists, and compete on leaderboards (global and per-league).

**Live:** https://phantasy-phish.vercel.app
**Repo:** https://github.com/feelgreatfoodie/phantasy-phish

## Current State

- Auth: Supabase Auth with Google OAuth + email magic links
- Data: Supabase Postgres for drafts, leaderboard, leagues; static TypeScript for songs/shows
- Theme: Ocean color scheme (deep sea blues, coral, sandy gold)
- Deployed on Vercel with GitHub auto-deploy

### Implementation Progress

- [x] Phase 1: Auth Foundation (Supabase client/server, middleware, AuthProvider, login page)
- [x] Phase 2: Draft Migration (localStorage → Supabase Postgres, all pages updated)
- [ ] Phase 3: League System (types + lib done, UI pages not yet built)
- [ ] Phase 4: Profile page + polish

## Commit Conventions

- All commits authored by `feelgreatfoodie` — use `--author="feelgreatfoodie <feelgreatfoodie@users.noreply.github.com>"`
- NEVER add `Co-Authored-By:` lines
- Use conventional commits format

## Tech Stack

- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS v4 (`@theme inline` for CSS variables)
- Supabase (Auth + Postgres with RLS)
- Vercel for hosting

## Key Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Ocean theme: colors, animations, wave effects |
| `src/data/songs.ts` | Song catalog (100+ songs with stats) |
| `src/data/shows.ts` | Show data with setlists |
| `src/lib/scoring.ts` | Scoring engine |
| `src/lib/storage.ts` | Supabase CRUD for drafts + leaderboard |
| `src/lib/leagues.ts` | Supabase CRUD for leagues |
| `src/lib/types.ts` | TypeScript interfaces (Draft, SongScore, LeaderboardEntry, League, LeagueMember) |
| `src/lib/supabase/client.ts` | Browser Supabase client (`createBrowserClient`) |
| `src/lib/supabase/server.ts` | Server Supabase client (`createServerClient`) |
| `src/lib/supabase/middleware.ts` | Session refresh + protected route redirects |
| `src/components/AuthProvider.tsx` | Auth context: user, profile, loading, signOut |
| `src/middleware.ts` | Next.js middleware entry point |
| `supabase/migrations/001_initial_schema.sql` | Full DB schema |

## Database Schema

- **profiles** — auto-created via trigger on auth.users insert
- **drafts** — user_id, show_id, song_ids[], scored, total_score, song_scores (JSONB), share_code, league_id
- **leagues** — name, description, invite_code, created_by
- **league_members** — league_id, user_id, role (owner/member)

All tables have RLS: publicly readable, writes restricted to authenticated owner.

## Auth Flow

1. User clicks Google or enters email on `/login`
2. Supabase handles OAuth/magic link redirect
3. `/auth/callback` exchanges code for session
4. `AuthProvider` fetches profile from `profiles` table
5. Middleware protects `/draft` and `/leagues` routes (redirects to `/login`)

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
