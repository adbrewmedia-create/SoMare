import { Race, HorseCard, JockeyCard, TrainerCard, Rarity } from '@/types';

export function getRarity(decimalOdds: number): Rarity {
  if (decimalOdds < 4.0) return 'gold';
  if (decimalOdds < 10.0) return 'silver';
  return 'bronze';
}

export function rarityLabel(rarity: Rarity): string {
  return { gold: 'Favourite', silver: 'Contender', bronze: 'Outsider' }[rarity];
}

export function rarityGlow(rarity: Rarity): string {
  return {
    gold: '0 0 20px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.2)',
    silver: '0 0 20px rgba(156,163,175,0.4), 0 0 40px rgba(156,163,175,0.15)',
    bronze: '0 0 20px rgba(205,127,50,0.4), 0 0 40px rgba(205,127,50,0.15)',
  }[rarity];
}

export function rarityColor(rarity: Rarity): string {
  return { gold: '#c9a84c', silver: '#9ca3af', bronze: '#cd7f32' }[rarity];
}

export function rarityGradient(rarity: Rarity): string {
  return {
    gold: 'linear-gradient(135deg, #1a1506 0%, #2d2410 40%, #1a1506 100%)',
    silver: 'linear-gradient(135deg, #111318 0%, #1e2128 40%, #111318 100%)',
    bronze: 'linear-gradient(135deg, #150e06 0%, #261a0a 40%, #150e06 100%)',
  }[rarity];
}

export function buildHorseCards(races: Race[]): HorseCard[] {
  return races.flatMap(race =>
    race.runners.map(runner => ({
      id: `horse-${runner.id}`,
      type: 'horse' as const,
      name: runner.horseName,
      rarity: getRarity(runner.odds),
      raceId: race.id,
      raceName: race.name,
      raceTime: race.time,
      raceDay: race.day,
      form: runner.form,
      number: runner.number,
      odds: runner.odds,
      oddsDisplay: runner.oddsDisplay,
      jockeyName: runner.jockeyName,
      trainerName: runner.trainerName,
    }))
  );
}

export function buildJockeyCards(races: Race[]): JockeyCard[] {
  const cards: JockeyCard[] = [];
  for (const race of races) {
    const jockeyMap = new Map<string, string[]>();
    for (const runner of race.runners) {
      const existing = jockeyMap.get(runner.jockeyName) ?? [];
      jockeyMap.set(runner.jockeyName, [...existing, runner.horseName]);
    }
    let i = 0;
    for (const [jockeyName, horses] of jockeyMap.entries()) {
      // Jockey rarity based on the best horse they ride
      const bestOdds = Math.min(
        ...race.runners
          .filter(r => r.jockeyName === jockeyName)
          .map(r => r.odds)
      );
      cards.push({
        id: `jockey-${race.id}-${jockeyName.replace(/\s+/g, '-')}`,
        type: 'jockey',
        name: jockeyName,
        rarity: getRarity(bestOdds),
        raceId: race.id,
        raceName: race.name,
        raceTime: race.time,
        raceDay: race.day,
        form: '-',
        horseNames: horses,
        winRate7d: '—',
      });
      i++;
    }
  }
  return cards;
}

export function buildTrainerCards(races: Race[]): TrainerCard[] {
  const cards: TrainerCard[] = [];
  for (const race of races) {
    const trainerMap = new Map<string, string[]>();
    for (const runner of race.runners) {
      const existing = trainerMap.get(runner.trainerName) ?? [];
      trainerMap.set(runner.trainerName, [...existing, runner.horseName]);
    }
    for (const [trainerName, horses] of trainerMap.entries()) {
      const bestOdds = Math.min(
        ...race.runners
          .filter(r => r.trainerName === trainerName)
          .map(r => r.odds)
      );
      cards.push({
        id: `trainer-${race.id}-${trainerName.replace(/\s+/g, '-')}`,
        type: 'trainer',
        name: trainerName,
        rarity: getRarity(bestOdds),
        raceId: race.id,
        raceName: race.name,
        raceTime: race.time,
        raceDay: race.day,
        form: '-',
        horseNames: horses,
        winRate7d: '—',
      });
    }
  }
  return cards;
}

export function decimalToFractional(decimal: number): string {
  if (decimal <= 2.0) return 'Evs';
  const numerator = Math.round((decimal - 1) * 10);
  const denominator = 10;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(numerator, denominator);
  return `${numerator / g}/${denominator / g}`;
}
