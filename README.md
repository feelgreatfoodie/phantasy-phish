# Phantasy Phish

A fantasy sports-style web app for Phish concert setlists. Draft songs you think will be played at upcoming shows, score points based on actual setlists, and compete with friends.

**Live:** [phantasy-phish.vercel.app](https://phantasy-phish.vercel.app)

## Features

- **Song Draft** - Pick 15 songs from a catalog of 100+ real Phish songs
- **Scoring System** - Points for songs played, openers, closers, bust-outs, and covers
- **Leaderboard** - Rankings across all participants and shows
- **Show Results** - View actual setlists and see how your draft scored
- **Song Catalog** - Browse the full catalog with stats (times played, gap, debut year)
- **Shareable Drafts** - Share your draft via URL encoding

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

### Installation

```bash
git clone https://github.com/feelgreatfoodie/phantasy-phish.git
cd phantasy-phish
npm install
cp .env.example .env.local
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
- **Tailwind CSS v4**
- **Local Storage** for draft persistence (no database needed for MVP)
- **Static JSON** for song catalog and show data
- **Vercel** for deployment

## Project Structure

```
src/
  app/
    page.tsx              # Home page
    layout.tsx            # Root layout with navigation
    globals.css           # Psychedelic theme and animations
    draft/
      page.tsx            # Song drafting interface
      [id]/page.tsx       # Draft detail / results view
    shows/
      page.tsx            # Shows listing
      [id]/page.tsx       # Show detail with setlist
    leaderboard/
      page.tsx            # Rankings and stats
    songs/
      page.tsx            # Full song catalog
  components/
    Navigation.tsx        # Frosted glass nav with PP logo
    SongCard.tsx          # Reusable song display card
    ShowCard.tsx          # Reusable show display card
  data/
    songs.ts              # Phish song catalog (100+ songs)
    shows.ts              # Show data with setlists
  lib/
    scoring.ts            # Scoring engine
    storage.ts            # localStorage persistence
    types.ts              # TypeScript interfaces
    utils.ts              # Formatting utilities
```

## Design

- Psychedelic concert poster aesthetic with animated gradient text and neon glows
- Color palette: electric teal (#00ffcc), hot pink (#ff0080), deep purple (#7b2ff7), acid green (#39ff14), golden (#ffaa00)
- Frosted glass navigation with rainbow divider
- Mobile-first responsive design (iPhone 7 / 375px and up)
- Card-based UI with animated score reveals
- Animated background with layered radial gradients

## Data

The song catalog includes 100+ real Phish songs with:
- Times played, debut year, last played date
- Average show gap between plays
- Cover song identification with original artist
- Bust-out status (songs with 50+ show gap)

Sample show data includes 4 completed MSG NYE 2024 shows and 1 upcoming show.
