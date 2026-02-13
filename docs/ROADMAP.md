# Roadmap

## Completed

### Phase 1: Auth Foundation
- Supabase Auth integration (Google OAuth + email magic links)
- Browser and server Supabase clients
- Middleware for session refresh and route protection
- AuthProvider React context (user, profile, loading, signOut)
- Login page with multiple sign-in methods
- OAuth callback handler
- Profile auto-creation via database trigger

### Phase 2: Draft Migration
- Migrated draft storage from localStorage to Supabase Postgres
- All pages updated to use Supabase CRUD operations
- Shareable drafts via unique share codes
- Global leaderboard aggregation from Postgres data

### Phase 3: League System
- Database schema for leagues and league_members with RLS
- League CRUD library (create, join, leave, invite code lookup)
- Leagues hub page (list my leagues, create new, join via invite code)
- League detail page (members, invite code sharing, league-scoped leaderboard)
- League leaderboard with podium, table, and per-player show breakdown

### Phase 4: Profile Page
- User profile with avatar, display name, email
- Stats summary (total drafts, total points, shows scored, best show)
- My Leagues overview with links
- Recent drafts list with scores
- Protected route (middleware redirect for unauthenticated users)

### Phase 5: Settings & Mobile UX
- Mobile hamburger menu (replaces horizontal link row with dropdown overlay)
- Settings page accessible from nav and profile
- Edit display name with save
- How to Play expandable guide
- Scoring Rules expandable reference table
- Report a Bug link (opens GitHub issue)
- Request a Feature link (opens GitHub issue)
- About section (version, source, tech stack)
- Sign Out (moved from nav to settings)
- Delete Account with confirmation (clears drafts, league memberships, signs out)

## Current State

All five core phases are complete. The app is fully functional with:
- Song drafting for upcoming and past shows
- Automated scoring against real setlists
- Global and league-scoped leaderboards
- League creation, joining via invite code, and member management
- User profiles with stats and draft history
- Auth via Google and email magic links
- Settings page with profile editing, help, and account management
- Mobile-optimized hamburger menu navigation

## Future Ideas

These are potential enhancements — not committed work. Ordered roughly by impact.

### Near-term
- **League drafts**: Associate a draft with a specific league when creating it (show league selector on draft page)
- **Draft editing**: Allow editing a draft before the show starts
- **Draft deletion**: Allow users to delete their own drafts
- **Profile editing**: Let users update their display name and avatar
- **Show notifications**: Alert users when a new show's setlist is available for scoring

### Medium-term
- **Live scoring**: Auto-score drafts when setlist data becomes available (currently requires page visit)
- **Phish.net API integration**: Pull song/show data from Phish.net instead of static files
- **Season standings**: Aggregate scores across a tour run (e.g., Summer 2026)
- **Draft history comparison**: Side-by-side view of how your picks compared to actual setlists over time
- **Social sharing**: Generate shareable images (OG cards) for draft results

### Long-term
- **Real-time updates**: WebSocket or SSE for live leaderboard updates during shows
- **Mobile app**: React Native or PWA wrapper
- **Advanced stats**: Win rate, song pick accuracy, most/least picked songs
- **Trade/auction draft mode**: Leagues with timed picks where members take turns
- **Achievements/badges**: Milestones like "called 10+ songs in one show" or "predicted a bust-out"
