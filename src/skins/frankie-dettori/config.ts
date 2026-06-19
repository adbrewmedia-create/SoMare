import { SkinConfig } from '@/types';

const frankieDettoriSkin: SkinConfig = {
  id: 'frankie-dettori',
  influencer: {
    name: 'Frankie Dettori',
    handle: '@frankiedettori',
    tagline: 'Legendary jockey. 3x Champion. Pick like a pro.',
    avatar: '/frankie.jpg',
  },
  branding: {
    primaryColor: '#12111a',
    secondaryColor: '#c9a84c',
    accentColor: '#e63946',
    backgroundColor: '#0a0910',
    cardBackground: '#16151f',
    textColor: '#f0ece0',
    subtleText: '#6b6880',
    fontDisplay: 'Georgia, "Times New Roman", serif',
    fontBody: 'system-ui, -apple-system, sans-serif',
  },
  copy: {
    heroHeadline: "Pick Like Frankie",
    heroSubtitle: "Choose your horse, jockey and trainer for each day. Crown your captain. Compete on the leaderboard.",
    competitionName: "Frankie's Cheltenham Challenge",
  },
  monetisation: {
    operatorName: 'Bet365',
    operatorUrl: 'https://www.bet365.com',
    offerText: 'Bet on today\'s races — New customer offer',
  },
};

export default frankieDettoriSkin;
