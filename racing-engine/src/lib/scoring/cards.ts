import { Horse, Rarity, HorseCard, Race } from '@/types';

// Rarity based on decimal odds
// Gold = favourite / near-favourite (< 4.0)
// Silver = mid-range (4.0 - 10.0)
// Bronze = outsider (10.0+)
export function getRarity(decimalOdds: number): Rarity {
  if (decimalOdds < 4.0) return 'gold';
  if (decimalOdds < 10.0) return 'silver';
  return 'bronze';
}

export function rarityLabel(rarity: Rarity): string {
  return { gold: 'Favourite', silver: 'Contender', bronze: 'Outsider' }[rarity];
}

export function rarityColor(rarity: Rarity): string {
  return {
    gold: '#c9a84c',
    silver: '#9ca3af',
    bronze: '#cd7f32',
  }[rarity];
}

export function buildHorseCards(races: Race[]): HorseCard[] {
  return races.flatMap(race =>
    race.runners.map(horse => ({
      horse,
      raceId: race.id,
      raceName: race.name,
      raceTime: race.time,
      raceDay: race.day,
    }))
  );
}

// Max picks per day (can be configured per skin/competition)
export const MAX_PICKS_PER_DAY = 2;
export const MAX_SQUAD_SIZE = 8;
