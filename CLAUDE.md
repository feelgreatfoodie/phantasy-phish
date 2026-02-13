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
- [x] Phase 3: League System (types, lib, leagues hub, league detail with leaderboard)
- [x] Phase 4: Profile page (stats, draft history, leagues, protected route)
- [x] Phase 5: Settings & mobile UX (hamburger menu, settings page, help, delete account)
- [x] Phase 6: Icon nav & UX cleanup (icon nav, inline profile name editing, sign out on profile)
- [x] Phase 7: Security & scalability hardening (security headers, open redirect fix, error boundaries, Postgres views, CI/CD, privacy policy)

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
| `src/lib/utils.ts` | Formatting helpers, avatar URL sanitization |
| `src/middleware.ts` | Next.js middleware entry point (protected routes only) |
| `supabase/migrations/001_initial_schema.sql` | Full DB schema |
| `supabase/migrations/002_security_hardening.sql` | Security fixes, views, indexes, constraints |
| `next.config.ts` | Security headers (HSTS, X-Frame-Options, etc.) |
| `.github/workflows/ci.yml` | CI pipeline: lint, type-check, build |

### Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Home — hero, stats, scoring rules, shows, leaderboard preview |
| `/login` | `src/app/login/page.tsx` | Auth (Google, email magic link) |
| `/draft` | `src/app/draft/page.tsx` | Song drafting interface |
| `/draft/[id]` | `src/app/draft/[id]/page.tsx` | Draft detail / results |
| `/draft/share/[code]` | `src/app/draft/share/[code]/page.tsx` | Public shared draft |
| `/shows` | `src/app/shows/page.tsx` | Shows listing |
| `/shows/[id]` | `src/app/shows/[id]/page.tsx` | Show detail with setlist |
| `/songs` | `src/app/songs/page.tsx` | Full song catalog |
| `/leaderboard` | `src/app/leaderboard/page.tsx` | Global rankings |
| `/leagues` | `src/app/leagues/page.tsx` | Leagues hub (list, create, join) |
| `/leagues/[id]` | `src/app/leagues/[id]/page.tsx` | League detail (members, leaderboard) |
| `/profile` | `src/app/profile/page.tsx` | User profile (inline name editing, stats, drafts, leagues, sign out) |
| `/settings` | `src/app/settings/page.tsx` | Settings (help, scoring, bug report, feature request, privacy policy, about, delete account) |
| `/privacy` | `src/app/privacy/page.tsx` | Privacy policy |

## Database Schema

- **profiles** — auto-created via trigger on auth.users insert
- **drafts** — user_id, show_id, song_ids[], scored, total_score, song_scores (JSONB), share_code, league_id
- **leagues** — name, description, invite_code, created_by
- **league_members** — league_id, user_id, role (owner/member)

All tables have RLS: publicly readable, writes restricted to authenticated owner.

**Views:** `leaderboard_stats`, `league_leaderboard_stats`, `draft_counts_by_show`
**Constraints:** display_name <= 40 chars, league name <= 50 chars, description <= 200 chars

## Auth Flow

1. User clicks Google or enters email on `/login`
2. Supabase handles OAuth/magic link redirect
3. `/auth/callback` exchanges code for session
4. `AuthProvider` fetches profile from `profiles` table
5. Middleware protects `/draft`, `/leagues`, `/profile`, and `/settings` routes (redirects to `/login`)

## Documentation

- `docs/ARCHITECTURE.md` — System design, DB schema, auth flow, styling system
- `docs/ROADMAP.md` — Completed phases, current state, future ideas
- `docs/PLAYER_GUIDE.md` — End-user guide (signing up, drafting, scoring, leagues)
- `docs/DEVELOPER_GUIDE.md` — Dev setup, project structure, key patterns, deployment

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
