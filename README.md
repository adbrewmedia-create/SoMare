# Racing Engine

Festival pick'em game engine. One codebase, multiple influencer skins.

## Setup

```bash
npm install
npm run dev
```

Add your Racing API key to `.env.local`:
```
RACING_API_KEY=your_key_here
```

Without a key, the app runs on mock Cheltenham data.

## Adding a new skin

1. Create `src/skins/your-influencer/config.ts`
2. Copy the shape from `src/skins/frankie-dettori/config.ts`
3. Update colours, copy, influencer details, operator URL
4. In `src/app/page.tsx`, swap the skin import

That's it. The engine, scoring, and data layer are skin-agnostic.

## Architecture

```
src/
  types/          — shared TypeScript types
  lib/
    api/          — Racing API adapter (mock + real)
    scoring/      — Points engine + card utilities
  skins/          — One folder per influencer skin
  components/
    card/         — HorseCard component
    competition/  — GamePage + SquadPanel
  app/            — Next.js entry point
```

## Scoring

| Position | Base Points |
|----------|-------------|
| 1st      | 100         |
| 2nd      | 50          |
| 3rd      | 25          |
| 4th      | 10          |

Odds multiplier applied on top:
- Outsider (10/1+): **2×**
- Contender (4/1–9/1): **1.5×**
- Favourite (under 4/1): **1×**

## Adding real race data

Once you have the Racing API key and can see the response shape:
1. Open `src/lib/api/racing.ts`
2. Fill in `normaliseRacecards()` and `normaliseResult()` to map their fields to our types
3. Set `RACING_API_KEY` in `.env.local`
4. Done — mock data switches off automatically

## Day 2 additions

- Second skin (new influencer config)
- Watch-ad-for-energy gate on picks
- Leaderboard with Supabase or Vercel KV
- Live play-along mode (influencer picks lock publicly)
- Matrix widget embed for real-time race data
