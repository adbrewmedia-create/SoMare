import { RaceResult, Squad, Score, ScoreBreakdown, Race } from '@/types';

// Points by finish position
const POSITION_POINTS: Record<number, number> = {
  1: 100,
  2: 50,
  3: 25,
  4: 10,
};

// Odds multiplier — rewards picking outsiders
// Odds > 10.0 (9/1+) = 2x, Odds 4.0-10.0 = 1.5x, below = 1x
export function getOddsMultiplier(decimalOdds: number): number {
  if (decimalOdds >= 10) return 2.0;
  if (decimalOdds >= 4) return 1.5;
  return 1.0;
}

export function getBasePoints(position: number): number {
  return POSITION_POINTS[position] ?? 0;
}

export function calculateScore(
  squad: Squad,
  results: RaceResult[],
  races: Race[]
): Score {
  const breakdown: ScoreBreakdown[] = [];

  for (const pick of squad.picks) {
    const result = results.find(r => r.raceId === pick.card.raceId);
    if (!result) continue;

    const race = races.find(r => r.id === pick.card.raceId);
    if (!race) continue;

    const horseResult = result.positions.find(p => p.horseId === pick.card.horse.id);
    if (!horseResult) continue;

    const basePoints = getBasePoints(horseResult.position);
    const multiplier = getOddsMultiplier(pick.card.horse.odds);
    const points = Math.round(basePoints * multiplier);

    breakdown.push({
      raceId: pick.card.raceId,
      raceName: pick.card.raceName,
      horseId: pick.card.horse.id,
      horseName: pick.card.horse.name,
      finishPosition: horseResult.position,
      oddsMultiplier: multiplier,
      points,
    });
  }

  const totalPoints = breakdown.reduce((sum, b) => sum + b.points, 0);

  return {
    userId: squad.userId,
    festivalId: squad.festivalId,
    totalPoints,
    breakdown,
  };
}
