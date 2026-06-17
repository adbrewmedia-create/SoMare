import { GamePage } from '@/components/competition/GamePage';
import { getFestival } from '@/lib/api/racing';
import frankieSkin from '@/skins/frankie-dettori/config';

// Swap skin import per influencer deployment
// e.g. import tomGarrattSkin from '@/skins/tom-garratt/config';
const ACTIVE_SKIN = frankieSkin;
const FESTIVAL_ID = 'cheltenham-2025';

export default async function Page() {
  const festival = await getFestival(FESTIVAL_ID);

  return <GamePage festival={festival} skin={ACTIVE_SKIN} />;
}
