import { Festival, Race, RaceResult, Horse } from '@/types';
import { getRarity } from '@/lib/scoring/cards';
import { MOCK_CHELTENHAM } from './mock-data';

// RapidAPI - Horse Racing API
const RAPIDAPI_BASE = 'https://horse-racing.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const USE_REAL_API = !!RAPIDAPI_KEY;

const RAPIDAPI_HEADERS = {
  'x-rapidapi-host': 'horse-racing.p.rapidapi.com',
  'x-rapidapi-key': RAPIDAPI_KEY ?? '',
};

// ─── Decimal odds → fractional display string ─────────────────────────────────
// e.g. 6.0 → "5/1", 3.5 → "5/2", 2.0 → "Evs"
export function decimalToFractional(decimal: number): string {
  if (decimal <= 2.0) return 'Evs';
  const numerator = Math.round((decimal - 1) * 10);
  const denominator = 10;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(numerator, denominator);
  return `${numerator / g}/${denominator / g}`;
}

// ─── Fetch races for a date ───────────────────────────────────────────────────
async function fetchRacesByDate(date: string): Promise<any[]> {
  // date format: YYYY-MM-DD
  const res = await fetch(`${RAPIDAPI_BASE}/races?date=${date}`, {
    headers: RAPIDAPI_HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`RapidAPI races error: ${res.status}`);
  return res.json();
}

// ─── Fetch runners for a race ─────────────────────────────────────────────────
async function fetchRaceRunners(raceId: string): Promise<any> {
  const res = await fetch(`${RAPIDAPI_BASE}/race?id_race=${raceId}`, {
    headers: RAPIDAPI_HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`RapidAPI runners error: ${res.status}`);
  return res.json();
}

// ─── Normalisers ──────────────────────────────────────────────────────────────

function normaliseHorse(raw: any, index: number): Horse {
  // Use Bet365 odds (first bookie) or fall back to 10.0
  const decimalOdds = parseFloat(raw.odds?.[0]?.odd ?? '10');

  return {
    id: String(raw.id_horse),
    name: raw.horse,
    jockey: raw.jockey ?? 'Unknown',
    trainer: raw.trainer ?? 'Unknown',
    odds: decimalOdds,
    oddsDisplay: decimalToFractional(decimalOdds),
    rarity: getRarity(decimalOdds),
    form: raw.form ?? '-',
    number: parseInt(raw.number ?? String(index + 1)),
  };
}

function normaliseRace(rawRace: any, rawRunners: any[], day: number): Race {
  const runners = rawRunners
    .filter((h: any) => h.non_runner === '0' || h.non_runner === 0)
    .map((h: any, i: number) => normaliseHorse(h, i));

  return {
    id: String(rawRace.id_race),
    name: rawRace.title,
    time: rawRace.date, // already ISO-like: "2021-09-02 20:35:00"
    course: rawRace.course,
    day,
    distance: rawRace.distance ?? '',
    grade: extractGrade(rawRace.title),
    runners,
  };
}

function extractGrade(title: string): string {
  const match = title.match(/Grade \d+/i);
  return match ? match[0] : 'Listed';
}

function normaliseResult(raceId: string, horses: any[]): RaceResult {
  const positions = horses
    .filter((h: any) => h.position && h.position !== '')
    .map((h: any) => ({
      horseId: String(h.id_horse),
      position: parseInt(h.position),
    }))
    .sort((a, b) => a.position - b.position);

  return {
    raceId,
    positions,
    settledAt: new Date().toISOString(),
  };
}

// ─── Build a festival from multiple days of races ─────────────────────────────

async function buildFestivalFromDates(
  festivalId: string,
  name: string,
  course: string,
  dates: string[] // one per festival day
): Promise<Festival> {
  const allRaces: Race[] = [];

  for (let i = 0; i < dates.length; i++) {
    const day = i + 1;
    const rawRaces = await fetchRacesByDate(dates[i]);

    // Filter to the target course only
    const courseRaces = rawRaces.filter(
      (r: any) => r.course?.toLowerCase() === course.toLowerCase() && r.canceled === '0'
    );

    // Fetch runners for each race
    for (const rawRace of courseRaces) {
      try {
        const raceDetail = await fetchRaceRunners(String(rawRace.id_race));
        const horses: any[] = Object.values(raceDetail.horses ?? {});
        const race = normaliseRace(rawRace, horses, day);
        if (race.runners.length > 0) allRaces.push(race);
      } catch (e) {
        console.error(`Failed to fetch runners for race ${rawRace.id_race}`, e);
      }
    }
  }

  return {
    id: festivalId,
    name,
    course,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    days: dates.length,
    races: allRaces,
  };
}

// ─── Festival configs ─────────────────────────────────────────────────────────

const FESTIVAL_CONFIGS: Record<string, {
  name: string;
  course: string;
  dates: string[];
}> = {
  'cheltenham-2026': {
    name: 'Cheltenham Festival 2026',
    course: 'Cheltenham',
    dates: ['2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13'],
  },
  // Add more festivals here:
  // 'grand-national-2026': { name: 'Grand National 2026', course: 'Aintree', dates: [...] }
};

// ─── Public interface ─────────────────────────────────────────────────────────

export async function getFestival(festivalId: string): Promise<Festival> {
  if (!USE_REAL_API) {
    return MOCK_CHELTENHAM;
  }

  const config = FESTIVAL_CONFIGS[festivalId];
  if (!config) throw new Error(`Unknown festival: ${festivalId}`);

  return buildFestivalFromDates(festivalId, config.name, config.course, config.dates);
}

export async function getRaceResult(raceId: string): Promise<RaceResult | null> {
  if (!USE_REAL_API) return null;

  try {
    const data = await fetchRaceRunners(raceId);
    const horses: any[] = Object.values(data.horses ?? {});
    const hasResults = horses.some((h: any) => h.position && h.position !== '');
    if (!hasResults) return null;
    return normaliseResult(raceId, horses);
  } catch {
    return null;
  }
}
