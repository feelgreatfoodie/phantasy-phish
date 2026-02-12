# Phantasy Phish

A fantasy sports-style web app for Phish concert setlists. Draft songs you think will be played at upcoming shows, score points based on actual setlists, and compete with friends in leagues.

**Live:** [phantasy-phish.vercel.app](https://phantasy-phish.vercel.app)

## Features

- **Song Draft** - Pick 15 songs from a catalog of 100+ real Phish songs
- **Scoring System** - Points for songs played, openers, closers, bust-outs, and covers
- **Leaderboard** - Global rankings across all participants and shows
- **Leagues** - Create private leagues, invite friends via code, per-league leaderboards (in progress)
- **Show Results** - View actual setlists and see how your draft scored
- **Song Catalog** - Browse the full catalog with stats (times played, gap, debut year)
- **Shareable Drafts** - Share your draft via unique share code URL
- **Auth** - Sign in with Google or email magic link

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

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (for auth and data persistence)

### Installation

```bash
git clone https://github.com/feelgreatfoodie/phantasy-phish.git
cd phantasy-phish
npm install
```

Create `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the database migration in your Supabase SQL Editor:

```bash
# Copy contents of supabase/migrations/001_initial_schema.sql
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (`@theme inline` for CSS variables)
- **Supabase** for auth (Google OAuth, email magic link) and Postgres database
- **Static TypeScript** for song catalog and show data
- **Vercel** for deployment

## Project Structure

```
src/
  app/
    page.tsx              # Home page
    layout.tsx            # Root layout with AuthProvider
    globals.css           # Ocean theme and animations
    login/page.tsx        # Sign in (Google, magic link)
    auth/callback/route.ts # OAuth callback handler
    draft/
      page.tsx            # Song drafting interface
      [id]/page.tsx       # Draft detail / results view
      share/[code]/page.tsx # Public shared draft view
    shows/
      page.tsx            # Shows listing
      [id]/page.tsx       # Show detail with setlist
    leaderboard/
      page.tsx            # Rankings and stats
    songs/
      page.tsx            # Full song catalog
  components/
    AuthProvider.tsx       # Auth context (user, profile, signOut)
    Navigation.tsx        # Frosted glass nav with auth state
    SongCard.tsx          # Reusable song display card
    ShowCard.tsx          # Reusable show display card
  data/
    songs.ts              # Phish song catalog (100+ songs)
    shows.ts              # Show data with setlists
  lib/
    scoring.ts            # Scoring engine
    storage.ts            # Supabase CRUD for drafts + leaderboard
    leagues.ts            # Supabase CRUD for leagues
    types.ts              # TypeScript interfaces
    utils.ts              # Formatting utilities
    supabase/
      client.ts           # Browser Supabase client
      server.ts           # Server Supabase client
      middleware.ts        # Session refresh + route protection
  middleware.ts           # Next.js middleware entry point
supabase/
  migrations/
    001_initial_schema.sql # Full DB schema (profiles, drafts, leagues)
```

## Design

- Ocean-themed aesthetic with deep sea colors, neon glows, and wave animations
- Color palette: ocean blue (#00d4ff), deep sea (#0a3d62), coral red (#ff6b6b), sandy gold (#f4a261), seafoam (#2ed8a3)
- Frosted glass navigation with ocean gradient divider
- Mobile-first responsive design (iPhone 7 / 375px and up)
- Card-based UI with animated score reveals

## Database

Supabase Postgres with Row Level Security:
- **profiles** — auto-created on signup via trigger
- **drafts** — user drafts with song picks and scores
- **leagues** — private groups with invite codes
- **league_members** — many-to-many user/league membership

All tables publicly readable, writes restricted to authenticated owner.

## Data

The song catalog includes 100+ real Phish songs with:
- Times played, debut year, last played date
- Average show gap between plays
- Cover song identification with original artist
- Bust-out status (songs with 50+ show gap)

Show data includes 2024-2026 tour dates with full setlists for completed shows.
