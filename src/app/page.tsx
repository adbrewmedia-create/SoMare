import { GamePage } from '@/components/GamePage';
import { MOCK_CHELTENHAM } from '@/lib/mock-data';
import frankieSkin from '@/skins/frankie-dettori/config';

export default function Page() {
  return <GamePage festival={MOCK_CHELTENHAM} skin={frankieSkin} />;
}
