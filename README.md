# Phantasy Phish

A fantasy sports-style web app for Phish concert setlists. Draft songs you think will be played at upcoming shows, score points based on actual setlists, and compete with friends in leagues.

**Live:** [phantasy-phish.vercel.app](https://phantasy-phish.vercel.app)

## Features

- **Song Draft** — Pick 15 songs from a catalog of 100+ real Phish songs
- **Scoring System** — Points for songs played, openers, closers, bust-outs, and covers
- **Leaderboard** — Global rankings across all participants and shows
- **Leagues** — Create private leagues, invite friends via code, league-scoped leaderboards
- **Profile** — View your stats, draft history, and league memberships
- **Settings** — Edit display name, how-to-play guide, scoring rules, report bugs, request features, delete account
- **Show Results** — View actual setlists and see how your draft scored
- **Song Catalog** — Browse the full catalog with stats (times played, gap, debut year)
- **Shareable Drafts** — Share your draft via unique share code URL
- **Auth** — Sign in with Google or email magic link

## Scoring

| Event | Points |
|-------|--------|
| Song played in Set 1 | 10 |
| Song played in Set 2 | 10 |
| Song played in Encore | 15 |
| Song opener (first song) | +20 bonus |
| Song closer (last song of set) | +15 bonus |
| Bust-out (avg gap 50+ shows) | +25 bonus |
| Cover song predicted | +20 bonus |

## Quick Start

```bash
git clone https://github.com/feelgreatfoodie/phantasy-phish.git
cd phantasy-phish
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the migration in your Supabase SQL Editor (`supabase/migrations/001_initial_schema.sql`), then:

```bash
npm run dev
```

## Documentation

| Document | Description |
|----------|-------------|
| [Player Guide](docs/PLAYER_GUIDE.md) | How to play — signing up, drafting, scoring, leagues |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Local setup, project structure, key patterns, deployment |
| [Architecture](docs/ARCHITECTURE.md) | System design, database schema, auth flow, styling system |
| [Roadmap](docs/ROADMAP.md) | Completed phases, current state, future ideas |
| [CLAUDE.md](CLAUDE.md) | AI assistant project instructions |

## Tech Stack

- **Next.js 16** (App Router) / **React 19** / **TypeScript**
- **Tailwind CSS v4** (`@theme inline` for CSS variables)
- **Supabase** — Auth (Google OAuth, email magic link) + Postgres database with RLS
- **Vercel** — Hosting with auto-deploy from GitHub

## Project Structure

```
src/
  app/                          # Pages (App Router)
    page.tsx                    # Home
    login/page.tsx              # Auth
    draft/page.tsx              # Song drafting
    draft/[id]/page.tsx         # Draft results
    draft/share/[code]/page.tsx # Shared draft view
    shows/page.tsx              # Shows listing
    shows/[id]/page.tsx         # Show detail
    songs/page.tsx              # Song catalog
    leaderboard/page.tsx        # Global rankings
    leagues/page.tsx            # Leagues hub
    leagues/[id]/page.tsx       # League detail
    profile/page.tsx            # User profile
    settings/page.tsx           # Settings & account management
  components/                   # Reusable UI (AuthProvider, Navigation, SongCard, ShowCard)
  data/                         # Static data (songs.ts, shows.ts)
  lib/                          # Business logic (scoring, storage, leagues, types, Supabase clients)
supabase/migrations/            # Database schema
docs/                           # Documentation
```

## Database

Supabase Postgres with Row Level Security:

- **profiles** — auto-created on signup via trigger
- **drafts** — user song picks with scores
- **leagues** — private groups with invite codes
- **league_members** — user/league membership

## Design

Ocean-themed aesthetic with deep sea colors, neon glows, and wave animations. Mobile-first responsive design (375px+). Card-based UI with animated score reveals.

## Data

100+ real Phish songs with stats (times played, gap, debut year, cover status). Show data for 2024-2026 tours with full setlists for completed shows.

## License

Private project.
