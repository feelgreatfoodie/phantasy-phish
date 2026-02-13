# Developer Guide

Everything you need to set up, run, and contribute to Phantasy Phish.

## Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)
- A **Supabase** project (free tier works fine)

## Local Setup

### 1. Clone and Install

```bash
git clone https://github.com/feelgreatfoodie/phantasy-phish.git
cd phantasy-phish
npm install
```

### 2. Configure Supabase

Create a Supabase project at [supabase.com](https://supabase.com) if you don't have one.

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in your Supabase dashboard under **Settings > API**.

### 3. Run Database Migrations

Open the **SQL Editor** in your Supabase dashboard and run these migrations in order:

1. **`supabase/migrations/001_initial_schema.sql`** — Creates all tables (profiles, drafts, leagues, league_members), triggers, indexes, and RLS policies.
2. **`supabase/migrations/002_security_hardening.sql`** — Adds CHECK constraints, composite indexes, Postgres views (leaderboard_stats, league_leaderboard_stats, draft_counts_by_show), and profile DELETE policy.

### 4. Configure Auth Providers

In your Supabase dashboard under **Auth > URL Configuration**:

- **Site URL**: Set to your production URL (e.g., `https://phantasy-phish.vercel.app`)
- **Redirect URLs**: Add both `http://localhost:3000/auth/callback` and `https://your-production-domain.vercel.app/auth/callback`

Under **Auth > Providers**:

- **Google OAuth**: Enable and add your Google OAuth client ID and secret.
- **Email (magic link)**: Enabled by default. Emails will be sent via Supabase's built-in email service.

### 5. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full directory tree and explanations. Key things to know:

### Pages

All pages are client components (`"use client"`) in `src/app/`. Each page manages its own data fetching in `useEffect` hooks.

### Data Layer

- **Static data** (`src/data/songs.ts`, `src/data/shows.ts`): Song catalog and show data. Bundled at build time, no API calls.
- **Supabase data** (`src/lib/storage.ts`, `src/lib/leagues.ts`): CRUD operations for user-generated data. All functions use the browser Supabase client.

### Auth

- `AuthProvider` wraps the entire app and provides `useAuth()` hook
- Middleware at `src/lib/supabase/middleware.ts` refreshes expired sessions and protects routes
- Protected routes: `/draft`, `/leagues`, `/profile`, `/settings` — unauthenticated users redirect to `/login`

### Styling

Tailwind CSS v4 with custom color tokens defined in `src/app/globals.css` via `@theme inline`. All colors are accessible as Tailwind classes (e.g., `bg-ocean-blue`, `text-coral-red`, `border-deep-sea`).

See [ARCHITECTURE.md](./ARCHITECTURE.md#styling-system) for the full color token and animation reference.

## Key Patterns

### Database Field Mapping

Supabase uses snake_case columns. TypeScript uses camelCase. The lib files (`storage.ts`, `leagues.ts`) define `Db*` interfaces for raw database rows and `map*` functions to convert them:

```typescript
// Database row (snake_case)
interface DbDraft {
  user_id: string;
  show_id: string;
  song_ids: string[];
  // ...
}

// App interface (camelCase)
interface Draft {
  userId: string;
  showId: string;
  songIds: string[];
  // ...
}

// Mapping function
function mapDbDraft(row: DbDraft): Draft { ... }
```

### Profile Joins

Drafts and league members are always fetched with associated profile data via Supabase's join syntax:

```typescript
const DRAFT_SELECT = "*, profiles(display_name, avatar_url)";
```

This gives each draft the display name and avatar of its creator.

### Loading State Pattern

Every page follows the same pattern:

```typescript
const [data, setData] = useState<Type[]>([]);
const [mounted, setMounted] = useState(false);

useEffect(() => {
  async function load() {
    const result = await fetchData();
    setData(result);
    setMounted(true);
  }
  load();
}, []);

if (!mounted) {
  return <div className="text-text-muted">Loading...</div>;
}
```

### Responsive Design

Mobile-first with Tailwind breakpoints:
- Default: mobile (375px+)
- `sm:` — tablet (640px+)
- `lg:` — desktop (1024px+)

Common responsive patterns:
- Text size: `text-sm sm:text-base`
- Padding: `p-3 sm:p-4 lg:p-6`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

## Adding New Shows

1. Open `src/data/shows.ts`
2. Add a new show object to the `shows` array:

```typescript
{
  id: "2026-07-04",
  date: "2026-07-04",
  venue: "Madison Square Garden",
  city: "New York",
  state: "NY",
  status: "upcoming",
  set1: [],
  set2: [],
  encore: [],
}
```

3. After the show happens, update `status` to `"completed"` and fill in the setlists:

```typescript
set1: [
  { songId: "tweezer", isOpener: true, isCloser: false },
  { songId: "bathtub-gin", isOpener: false, isCloser: false },
  // ...
  { songId: "divided-sky", isOpener: false, isCloser: true },
],
```

Song IDs must match entries in `src/data/songs.ts`.

## Adding New Songs

1. Open `src/data/songs.ts`
2. Add a new song object:

```typescript
{
  id: "new-song-id",
  name: "New Song Name",
  timesPlayed: 0,
  debut: "2026-01-01",
  lastPlayed: null,
  avgGap: 0,
  isCover: false,
  originalArtist: null,
}
```

## Deployment

The app auto-deploys to Vercel on push to the `master` branch. A GitHub Actions CI pipeline (`.github/workflows/ci.yml`) runs lint, type-check, and build on every push and PR.

### Vercel Environment Variables

These **must** be set in the Vercel project settings (Settings > Environment Variables) for both Production and Preview:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The Supabase client files use fallback placeholder values so the build doesn't crash during static prerendering, but the app won't function without real values at runtime.

### Deploy Steps

```bash
npm run lint     # Ensure no ESLint errors (warnings are OK)
npm run build    # Verify build succeeds locally
git push         # Triggers Vercel auto-deploy
```

## Commit Conventions

- Use [conventional commits](https://www.conventionalcommits.org/) format: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- All commits authored by `feelgreatfoodie`:
  ```bash
  git commit --author="feelgreatfoodie <feelgreatfoodie@users.noreply.github.com>"
  ```
- Do **not** add `Co-Authored-By:` lines
