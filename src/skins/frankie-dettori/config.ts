import { SkinConfig } from '@/types';

const frankieDettoriSkin: SkinConfig = {
  id: 'frankie-dettori',
  influencer: {
    name: 'Frankie Dettori',
    handle: '@frankiedettori',
    avatar: '/skins/frankie-dettori/avatar.jpg',
    tagline: 'Legendary jockey. 3x Champion. Pick like a pro.',
  },
  branding: {
    primaryColor: '#1a1a2e',      // deep navy
    secondaryColor: '#c9a84c',    // racing gold
    accentColor: '#e63946',       // racing red
    backgroundColor: '#0f0f1a',   // near black
    textColor: '#f5f0e8',         // warm white
    fontDisplay: 'Playfair Display',
    fontBody: 'Inter',
  },
  copy: {
    heroHeadline: "Pick Like Frankie",
    heroSubtitle: "Build your Cheltenham squad. Score points on every finish. Compete with Frankie's picks.",
    pickCta: "Add to Squad",
    squadLabel: "My Squad",
    competitionName: "Frankie's Cheltenham Challenge",
  },
  monetisation: {
    operatorName: 'Bet365',
    operatorUrl: 'https://www.bet365.com/?affiliate=KTAG_ID_HERE',
    offerText: 'Bet on today\'s races with Bet365 — New customer offer',
    adEnabled: true,
  },
};

export default frankieDettoriSkin;
