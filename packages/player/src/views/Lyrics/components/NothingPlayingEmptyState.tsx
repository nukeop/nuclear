import { MicVocalIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState } from '@nuclearplayer/ui';

export const NothingPlayingEmptyState: FC = () => {
  const { t } = useTranslation('lyrics');

  return (
    <EmptyState
      data-testid="lyrics-empty-state"
      icon={<MicVocalIcon size={48} />}
      title={t('nothingPlaying')}
      description={t('nothingPlayingDescription')}
      className="flex-1"
    />
  );
};
