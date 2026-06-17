export type Rarity = 'gold' | 'silver' | 'bronze';

export interface Horse {
  id: string;
  name: string;
  jockey: string;
  trainer: string;
  odds: number; // decimal odds e.g. 3.5
  oddsDisplay: string; // e.g. "5/2"
  rarity: Rarity;
  form: string; // e.g. "1-2-1-3"
  number: number; // race number
  silk?: string; // jockey silk image url
}

export interface Race {
  id: string;
  name: string;
  time: string; // ISO string
  course: string;
  day: number; // festival day 1-4
  distance: string; // e.g. "2m4f"
  grade: string; // e.g. "Grade 1"
  runners: Horse[];
  result?: RaceResult;
}

export interface RaceResult {
  raceId: string;
  positions: {
    horseId: string;
    position: number;
  }[];
  settledAt: string;
}

export interface Festival {
  id: string;
  name: string;
  course: string;
  startDate: string;
  endDate: string;
  days: number;
  races: Race[];
}

export interface HorseCard {
  horse: Horse;
  raceId: string;
  raceName: string;
  raceTime: string;
  raceDay: number;
}

export interface Squad {
  userId: string;
  festivalId: string;
  picks: SquadPick[]; // max 6 horses, one per race day slot
}

export interface SquadPick {
  card: HorseCard;
  lockedAt: string;
}

export interface Score {
  userId: string;
  festivalId: string;
  totalPoints: number;
  breakdown: ScoreBreakdown[];
}

export interface ScoreBreakdown {
  raceId: string;
  raceName: string;
  horseId: string;
  horseName: string;
  finishPosition: number;
  oddsMultiplier: number;
  points: number;
}

export interface SkinConfig {
  id: string;
  influencer: {
    name: string;
    handle: string;
    avatar: string;
    tagline: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontDisplay: string;
    fontBody: string;
    logo?: string;
  };
  copy: {
    heroHeadline: string;
    heroSubtitle: string;
    pickCta: string;
    squadLabel: string;
    competitionName: string;
  };
  monetisation: {
    operatorName: string;
    operatorUrl: string; // KTAG tracking URL
    offerText: string;
    adEnabled: boolean;
  };
}
