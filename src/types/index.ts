export type Rarity = 'gold' | 'silver' | 'bronze';
export type CardType = 'horse' | 'jockey' | 'trainer';

export interface BaseCard {
  id: string;
  name: string;
  rarity: Rarity;
  type: CardType;
  raceId: string;
  raceName: string;
  raceTime: string;
  raceDay: number;
  form: string;
}

export interface HorseCard extends BaseCard {
  type: 'horse';
  number: number;
  odds: number;
  oddsDisplay: string;
  jockeyName: string;
  trainerName: string;
}

export interface JockeyCard extends BaseCard {
  type: 'jockey';
  horseNames: string[]; // horses they ride in this race
  winRate7d: string;
}

export interface TrainerCard extends BaseCard {
  type: 'trainer';
  horseNames: string[]; // horses they train in this race
  winRate7d: string;
}

export type AnyCard = HorseCard | JockeyCard | TrainerCard;

export interface DaySquad {
  day: number;
  horse: HorseCard | null;
  jockey: JockeyCard | null;
  trainer: TrainerCard | null;
  captainType: 'jockey' | null; // captain can only be placed on jockey
}

export interface Race {
  id: string;
  name: string;
  time: string;
  course: string;
  day: number;
  distance: string;
  grade: string;
  runners: Runner[];
}

export interface Runner {
  id: string;
  horseName: string;
  jockeyName: string;
  trainerName: string;
  odds: number;
  oddsDisplay: string;
  form: string;
  number: number;
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

export interface SkinConfig {
  id: string;
  influencer: {
    name: string;
    handle: string;
    tagline: string;
    avatar: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    cardBackground: string;
    textColor: string;
    subtleText: string;
    fontDisplay: string;
    fontBody: string;
  };
  copy: {
    heroHeadline: string;
    heroSubtitle: string;
    competitionName: string;
  };
  monetisation: {
    operatorName: string;
    operatorUrl: string;
    offerText: string;
  };
}

export interface ScoreBreakdown {
  day: number;
  raceName: string;
  horsePoints: number;
  jockeyPoints: number;
  trainerPoints: number;
  captainBonus: number;
  total: number;
}
