import { Festival, Race, RaceResult } from '@/types';
import { getRarity } from '@/lib/scoring/cards';
import { MOCK_CHELTENHAM } from './mock-data';

const RACING_API_BASE = 'https://api.theracing-api.com/v1';
const API_KEY = process.env.RACING_API_KEY;

// Set to true once you have a Racing API key
const USE_REAL_API = !!API_KEY;

// ─── Real API ─────────────────────────────────────────────────────────────────

async function fetchRacecards(date: string): Promise<Race[]> {
  const res = await fetch(`${RACING_API_BASE}/racecards?date=${date}`, {
    headers: { 'x-api-key': API_KEY! },
    next: { revalidate: 300 }, // 5 min cache
  });
  if (!res.ok) throw new Error(`Racing API error: ${res.status}`);
  const data = await res.json();
  return normaliseRacecards(data);
}

async function fetchResults(raceId: string): Promise<RaceResult | null> {
  const res = await fetch(`${RACING_API_BASE}/results/${raceId}`, {
    headers: { 'x-api-key': API_KEY! },
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return normaliseResult(data);
}

// ─── Normalisers (map Racing API shape → our types) ───────────────────────────

function normaliseRacecards(data: any): Race[] {
  // TODO: map actual Racing API response once we have a sample
  // Shape TBC — update when API key arrives
  return [];
}

function normaliseResult(data: any): RaceResult {
  // TODO: map actual Racing API result response
  return {
    raceId: data.race_id,
    positions: data.runners.map((r: any) => ({
      horseId: r.horse_id,
      position: r.position,
    })),
    settledAt: data.settled_at,
  };
}

// ─── Public interface ─────────────────────────────────────────────────────────

export async function getFestival(festivalId: string): Promise<Festival> {
  if (!USE_REAL_API) {
    // Return mock data — swap when API is ready
    return MOCK_CHELTENHAM;
  }
  // TODO: build multi-day festival from racecards
  throw new Error('Real API not yet implemented');
}

export async function getRaceResult(raceId: string): Promise<RaceResult | null> {
  if (!USE_REAL_API) {
    return null; // no mock results
  }
  return fetchResults(raceId);
}
