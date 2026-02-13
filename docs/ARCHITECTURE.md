# Architecture

## System Overview

Phantasy Phish is a Next.js 16 App Router application with Supabase as the backend. The app uses a hybrid data approach: static TypeScript files for read-heavy reference data (songs, shows) and Supabase Postgres for user-generated data (drafts, leagues, profiles).

```
Browser
  |
  v
Next.js App (Vercel)
  |
  ├── Static Data (songs.ts, shows.ts)     <-- read-only, no network
  |
  ├── Supabase Auth (Google OAuth, magic links)
  |
  └── Supabase Postgres (drafts, leagues, profiles)
        └── Row Level Security (RLS)
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Auth | Supabase Auth | via @supabase/ssr 0.8.x |
| Database | Supabase Postgres | via @supabase/supabase-js 2.95.x |
| Hosting | Vercel | auto-deploy from GitHub |

## Directory Structure

```
src/
  app/                         # Next.js App Router pages
    layout.tsx                 # Root layout (AuthProvider, Navigation, donut-bg)
    page.tsx                   # Home — hero, stats, scoring rules, shows, leaderboard preview
    globals.css                # Ocean theme: color tokens, animations, effects
    login/page.tsx             # Auth page (Google, email magic link)
    auth/callback/route.ts     # OAuth callback handler (server route)
    draft/
      page.tsx                 # Song drafting interface (select show, pick 15 songs)
      [id]/page.tsx            # Draft detail — scores, song breakdown, setlist comparison
      share/[code]/page.tsx    # Public shared draft view
    shows/
      page.tsx                 # Shows listing (upcoming + completed)
      [id]/page.tsx            # Show detail with full setlist
    songs/page.tsx             # Full song catalog with search/filter/sort
    leaderboard/page.tsx       # Global rankings — podium, table, per-user show breakdown
    leagues/
      page.tsx                 # Leagues hub — my leagues, create, join via invite code
      [id]/page.tsx            # League detail — members, invite code, league leaderboard
    profile/page.tsx           # User profile — stats, inline name editing, drafts, leagues, sign out
    settings/page.tsx          # Settings — help, scoring, bug report, feature request, about, delete account

  components/
    AuthProvider.tsx            # React context: user, profile, loading, signOut
    Navigation.tsx              # Sticky icon nav with frosted glass, auth state, mobile hamburger menu
    SongCard.tsx                # Song display card (selected/scored/disabled states)
    ShowCard.tsx                # Show display card (venue, date, status badge)

  data/
    songs.ts                   # Song catalog (100+ songs with stats)
    shows.ts                   # Show data with full setlists for completed shows

  lib/
    scoring.ts                 # Scoring engine (points calculation per song)
    storage.ts                 # Supabase CRUD for drafts + leaderboard aggregation
    leagues.ts                 # Supabase CRUD for leagues + membership
    types.ts                   # TypeScript interfaces (Draft, SongScore, League, etc.)
    utils.ts                   # Formatting helpers (formatDate, cn)
    supabase/
      client.ts                # Browser Supabase client (createBrowserClient)
      server.ts                # Server Supabase client (createServerClient)
      middleware.ts             # Session refresh + protected route redirects

  middleware.ts                # Next.js middleware entry point

supabase/
  migrations/
    001_initial_schema.sql     # Full DB schema, triggers, indexes, RLS policies
```

## Database Schema

Four tables in Supabase Postgres, all with Row Level Security enabled.

### profiles
Auto-created via a database trigger when a user signs up through Supabase Auth.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | References auth.users |
| display_name | TEXT | From OAuth full_name or email prefix |
| avatar_url | TEXT | From OAuth provider |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### leagues

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| name | TEXT | |
| description | TEXT | Optional |
| invite_code | TEXT (UNIQUE) | 8-char random, auto-generated |
| created_by | UUID (FK) | References profiles |
| created_at | TIMESTAMPTZ | |

### league_members

| Column | Type | Notes |
|--------|------|-------|
| league_id | UUID (FK, PK) | References leagues |
| user_id | UUID (FK, PK) | References profiles |
| role | TEXT | 'owner' or 'member' |
| joined_at | TIMESTAMPTZ | |

### drafts

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK) | References profiles |
| league_id | UUID (FK) | Optional, references leagues |
| show_id | TEXT | Matches static show data ID |
| song_ids | TEXT[] | Array of song IDs (15 songs) |
| scored | BOOLEAN | false until show completes |
| total_score | INTEGER | Sum of all song points |
| song_scores | JSONB | Detailed per-song scoring breakdown |
| share_code | TEXT (UNIQUE) | 12-char random, auto-generated |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### RLS Policies

All tables are publicly **readable** (SELECT). Write operations are restricted:

- **profiles**: Users can only UPDATE their own row
- **leagues**: Only the creator can UPDATE/DELETE; any auth user can INSERT (with their own ID)
- **league_members**: Users can INSERT/DELETE only their own membership
- **drafts**: Users can INSERT/UPDATE/DELETE only their own drafts

### Entity Relationships

```
auth.users  1---1  profiles
profiles    1---*  drafts
profiles    1---*  leagues (created_by)
profiles    *---*  leagues (via league_members)
leagues     1---*  drafts (optional association)
```

## Auth Flow

1. User visits `/login` and clicks Google OAuth or enters email
2. Supabase Auth handles the OAuth redirect or sends magic link email
3. User is redirected to `/auth/callback` which exchanges the auth code for a session
4. `AuthProvider` (React context) detects the new session and fetches the user's profile
5. Middleware protects `/draft`, `/leagues`, `/profile`, and `/settings` — unauthenticated users are redirected to `/login?redirect={path}`

### Supabase Client Architecture

- **Browser client** (`lib/supabase/client.ts`): Used in all client components for CRUD operations. Created via `createBrowserClient()`.
- **Server client** (`lib/supabase/server.ts`): Used in server routes (auth callback). Created via `createServerClient()` with cookie access.
- **Middleware client** (`lib/supabase/middleware.ts`): Refreshes expired sessions and enforces route protection.

## Data Flow

### Static Data (Songs & Shows)
Song and show data live in TypeScript files (`src/data/`). This data is bundled at build time — no network requests needed. Helper functions (`getUpcomingShows()`, `getCompletedShows()`, `getSongById()`) filter and query the data.

### User Data (Drafts, Leagues, Profiles)
All user-generated data flows through Supabase. The library files (`storage.ts`, `leagues.ts`) handle:
- DB field mapping (snake_case DB columns to camelCase TypeScript)
- Profile joins (drafts and league_members select associated profile data)
- Aggregation (leaderboard computation groups drafts by user)

## Scoring Engine

The scoring engine (`lib/scoring.ts`) runs client-side. When a show's setlist is available, it compares each drafted song against the actual setlist:

| Condition | Points |
|-----------|--------|
| Song played in Set 1 | +10 |
| Song played in Set 2 | +10 |
| Song played in Encore | +15 |
| Song was opener (first in set) | +20 bonus |
| Song was closer (last in set) | +15 bonus |
| Song is a bust-out (avgGap >= 50) | +25 bonus |
| Song is a cover | +20 bonus |

Bonuses stack. A bust-out cover that opens Set 1 would score: 10 + 20 + 25 + 20 = 75 points.

## Styling System

### Color Tokens (CSS Custom Properties)

Defined in `globals.css` via Tailwind's `@theme inline`:

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | #060e1a | Page background |
| `foreground` | #e4f0fb | Primary text |
| `surface` | #0c1a2e | Card backgrounds |
| `surface-light` | #132b4a | Hover/secondary surfaces |
| `surface-lighter` | #1a3a5e | Active surfaces |
| `border` | #1e3d6b | Card/section borders |
| `ocean-blue` | #00a8ff | Primary accent, CTAs |
| `deep-sea` | #1565c0 | Secondary accent |
| `coral-red` | #ff4757 | Danger, errors, #2 rank |
| `seafoam` | #4dd0b8 | Tertiary accent |
| `sandy-gold` | #f0b429 | Awards, top ranks |
| `text-muted` | #6b8db5 | Secondary text |
| `text-dim` | #4a6d8c | Tertiary text |

### Animation Classes

| Class | Effect |
|-------|--------|
| `.donut-bg` | Animated radial gradient background |
| `.ocean-text` | Gradient text (coral > blue > cyan > seafoam > gold) |
| `.neon-glow` | Ocean-blue text shadow glow |
| `.neon-glow-coral` | Coral-red text shadow glow |
| `.score-reveal` | Bouncy scale + rotate animation for scores |
| `.slide-up` | Slide from below with fade |
| `.fade-in` | Simple opacity fade |
| `.song-card` | Hover lift + ocean glow |
| `.border-pulse` | Pulsing border for selected states |
| `.breathe` | Breathing opacity for loading states |
| `.wave-divider` | Animated gradient line (nav divider) |

### Component Patterns

- **Cards**: `bg-surface rounded-xl border border-border p-4 sm:p-6`
- **Hover**: `hover:bg-surface-light hover:border-deep-sea hover:shadow-lg hover:shadow-ocean-blue/20 transition-all`
- **Primary button**: `bg-ocean-blue text-background font-bold rounded-xl hover:bg-ocean-blue-dark`
- **Danger button**: `border border-danger/30 text-danger hover:bg-danger/10`
- **Inputs**: `bg-surface-light border border-border rounded-xl text-foreground focus:border-ocean-blue`
- **Responsive grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3`
