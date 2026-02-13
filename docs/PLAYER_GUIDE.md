# Player Guide

How to play Phantasy Phish — the fantasy sports game for Phish setlists.

## What Is It?

Phish plays different songs at every concert. Phantasy Phish lets you predict the setlist before the show happens. Pick 15 songs you think they'll play, then see how many you got right and earn points based on what actually happened.

## Getting Started

### Sign Up

1. Go to [phantasy-phish.vercel.app](https://phantasy-phish.vercel.app)
2. Click **Sign In** in the navigation bar
3. Choose one:
   - **Sign in with Google** — fastest, uses your Google account
   - **Email magic link** — enter your email, click the link sent to your inbox
4. Your profile is created automatically with your name and avatar from your account

### Your First Draft

1. Click **Draft** in the navigation bar
2. **Select a show** from the dropdown (upcoming shows and past shows are listed)
3. **Browse the song catalog** below — search, filter by type (originals, covers, bust-outs), or sort by different criteria
4. **Click songs to add them** to your draft (you need exactly 15)
5. Your selected songs appear in the "Your Draft" panel at the top
6. Click a selected song again to remove it
7. When you have your 15 picks and a show selected, click **Save Draft**

### Tips for Picking

- **Staples** (high times-played count) are safe picks — they get played often
- **Bust-outs** (songs with a gap of 50+ shows) are risky but worth 25 bonus points
- **Covers** earn a 20-point bonus if played
- Think about **openers and closers** — a correct opener call is worth an extra 20 points

## Scoring

After a show happens and the setlist is entered, your draft gets scored automatically.

| What Happened | Points |
|--------------|--------|
| Your song was played in Set 1 | 10 |
| Your song was played in Set 2 | 10 |
| Your song was played in the Encore | 15 |
| Your song opened a set | +20 bonus |
| Your song closed a set | +15 bonus |
| Your song was a bust-out (50+ show gap) | +25 bonus |
| Your song was a cover | +20 bonus |

Bonuses stack. Example: if you pick a cover that opens Set 1, you'd get 10 (Set 1) + 20 (opener) + 20 (cover) = **50 points** for that one song.

### Viewing Your Results

After scoring, go to your draft detail page to see:
- Your total score
- How many songs you hit vs. missed
- A per-song breakdown showing exactly which bonuses applied
- The actual setlist with annotations showing which songs you drafted

## Leaderboard

The **Leaders** page shows global rankings across all players and all shows. You'll see:
- A **podium** for the top 3 players
- A **full ranking table** with total points, shows played, average per show, and best show
- A **per-player breakdown** showing individual show scores

## Leagues

Leagues let you create a private competition with friends.

### Creating a League

1. Go to **Leagues** in the navigation
2. Click **Create League**
3. Enter a name and optional description
4. You'll be taken to your new league's page with a unique **invite code**

### Joining a League

1. Get an invite code from a friend
2. Go to **Leagues**
3. Enter the code in the "Join a League" field and click **Join**
4. You'll be taken to the league page

### League Features

Each league has its own:
- **Members list** — see who's in the league
- **Invite code** — share it to invite more friends (click Copy)
- **League leaderboard** — rankings scoped to just your league's members and their drafts

### Leaving a League

On the league detail page, click **Leave** to remove yourself. League owners cannot leave (they created it).

## Profile

Your **profile page** shows:
- Your display name and avatar — click the pencil icon next to your name to edit it inline
- Stats: total drafts, total points, shows scored, best single-show score
- Your leagues with quick links
- Your recent drafts with scores (or "Pending" if the show hasn't been scored yet)
- **Sign Out** link at the bottom of the page

## Settings

Access settings from the gear icon in the nav (desktop) or the hamburger menu (mobile). From here you can:

- **How to Play** — expandable in-app guide covering drafting, scoring, and creating/joining leagues
- **Scoring Rules** — quick reference table of all point values
- **Report a Bug** — opens a GitHub issue on the project repo
- **Request a Feature** — suggest improvements via a GitHub issue
- **Privacy Policy** — what data is collected, how it's used, your rights
- **About** — app version, source code link, tech stack
- **Delete Account** — permanently remove all your drafts, league memberships, and profile data

## Sharing Drafts

Every draft gets a unique share code. On your draft detail page, click **Share** to copy a link. Anyone with the link can view your draft and scores — no sign-in required.

## Song Catalog

The **Songs** page lets you browse all 100+ songs in the catalog. Each song shows:
- **Times Played** — how often the song has been performed
- **Gap** — average number of shows between plays
- **Debut** — when the song was first played
- **Cover** badge — if it's a cover song
- **Bust-out** badge — if it has a gap of 50+ shows

## Shows

The **Shows** page lists all tracked shows:
- **Upcoming shows** — draft for these before they happen
- **Completed shows** — view actual setlists and see how drafts scored
- Click any show to see its full setlist details
