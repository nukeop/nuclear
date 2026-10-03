import { MicOffIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState } from '@nuclearplayer/ui';

type NoLyricsEmptyStateProps = {
  providerNames: string[];
};

export const NoLyricsEmptyState: FC<NoLyricsEmptyStateProps> = ({
  providerNames,
}) => {
  const { t } = useTranslation('lyrics');

  return (
    <EmptyState
      data-testid="lyrics-empty-state"
      icon={<MicOffIcon size={48} />}
      title={t('noLyrics')}
      description={t('noLyricsDescription', { providers: providerNames })}
      className="flex-1"
    />
  );
};
