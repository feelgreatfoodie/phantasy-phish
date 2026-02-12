# Phantasy Phish - Project Instructions

## Overview

Fantasy sports-style web app for Phish concert setlists. Users draft 15 songs per show, get scored against actual setlists, and compete on a leaderboard.

**Live:** https://phantasy-phish.vercel.app
**Repo:** https://github.com/feelgreatfoodie/phantasy-phish

## Current State: MVP Prototype (v0.1.0)

- All features functional: draft, scoring, leaderboard, song catalog, show detail
- Psychedelic theme with animated gradients, neon glows, frosted glass nav
- Mobile-responsive down to iPhone 7 (375px)
- Data: localStorage for drafts, static JSON for songs/shows
- Deployed on Vercel with GitHub auto-deploy

## Commit Conventions

- All commits authored by `feelgreatfoodie` — use `--author="feelgreatfoodie <feelgreatfoodie@users.noreply.github.com>"`
- NEVER add `Co-Authored-By:` lines
- Use conventional commits format

## Tech Stack

- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS v4 (`@theme inline` for CSS variables)
- localStorage for persistence (no database)
- Vercel for hosting

## Key Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Full theme: colors, animations, psychedelic effects |
| `src/data/songs.ts` | Song catalog (100+ songs with stats) |
| `src/data/shows.ts` | Show data with setlists |
| `src/lib/scoring.ts` | Scoring engine |
| `src/lib/storage.ts` | localStorage CRUD (key: `phantasy-phish-drafts`) |
| `src/lib/types.ts` | TypeScript interfaces (Draft, SongScore, LeaderboardEntry) |

---

## Review Roadmap (Next Session)

When we return to this project, run the following reviews before building new features.

### 1. Engineering Review

- [ ] Audit component structure — extract repeated patterns into shared components
- [ ] Review state management — identify unnecessary re-renders, consider memoization
- [ ] Audit `useEffect` dependencies — check for missing deps or stale closures
- [ ] Review error boundaries — no error handling exists currently
- [ ] Audit TypeScript strictness — check for `as` casts, `any` types, missing types
- [ ] Review data flow — songs/shows are imported synchronously at module level
- [ ] Check accessibility (a11y) — ARIA labels, keyboard navigation, color contrast
- [ ] Verify SEO metadata — page titles, descriptions, Open Graph tags

### 2. Security Review

- [ ] Audit localStorage usage — no validation on read, potential XSS via crafted share URLs
- [ ] Review `encodeDraftForShare` / share URL parsing — injection risk
- [ ] Check for exposed secrets in `.env.example` or committed files
- [ ] Review CSP headers — none configured currently
- [ ] Audit `dangerouslySetInnerHTML` usage (should be none, verify)
- [ ] Review Next.js security headers configuration
- [ ] Check dependency vulnerabilities — `npm audit`

### 3. Scalability Review

- [ ] Evaluate localStorage limits (~5MB) — plan migration path to database
- [ ] Assess static song/show data approach — plan API integration (Phish.net API?)
- [ ] Consider server-side rendering vs client-side for data-heavy pages
- [ ] Plan multi-user support — authentication, shared leaderboards
- [ ] Evaluate real-time features — live scoring during shows
- [ ] Plan data sync — what happens when localStorage is cleared
- [ ] Consider pagination for song catalog (currently renders 100+ cards)

### 4. Code Simplification

- [ ] Deduplicate `SetlistSection` / `SetlistDisplay` components (exist in both `shows/[id]` and `draft/[id]`)
- [ ] Extract common table styles into reusable component or utility classes
- [ ] Consolidate filter/sort logic between `draft/page.tsx` and `songs/page.tsx`
- [ ] Review CSS — remove unused classes, consolidate animation definitions
- [ ] Simplify scoring engine — verify edge cases, add unit tests
- [ ] Extract magic numbers (DRAFT_SIZE=15, bust-out threshold=50) into config

### 5. Testing

- [ ] Add unit tests for scoring engine (`scoring.ts`)
- [ ] Add unit tests for storage utilities (`storage.ts`)
- [ ] Add component tests for critical flows (draft creation, score display)
- [ ] Add E2E tests for happy path (create draft → view results)
- [ ] Set up CI pipeline (GitHub Actions) with lint + typecheck + test

### 6. Performance

- [ ] Audit bundle size — check for unnecessary dependencies
- [ ] Add `loading.tsx` skeletons for dynamic routes
- [ ] Consider `React.lazy` / dynamic imports for heavy pages
- [ ] Profile CSS animations — check for layout thrashing on mobile
- [ ] Add image optimization if images are added later
- [ ] Review Lighthouse scores (performance, accessibility, best practices)

### 7. Feature Roadmap (Post-Review)

- [ ] Phish.net API integration for live setlist data
- [ ] User authentication (clerk/auth.js)
- [ ] Database migration (Supabase/Planetscale)
- [ ] Social features — leagues, head-to-head, comments
- [ ] Push notifications for live show scoring
- [ ] Historical stats and trends
- [ ] PWA support for mobile home screen install
