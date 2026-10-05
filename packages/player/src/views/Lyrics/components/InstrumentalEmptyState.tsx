import { AudioLinesIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState } from '@nuclearplayer/ui';

export const InstrumentalEmptyState: FC = () => {
  const { t } = useTranslation('lyrics');

  return (
    <EmptyState
      data-testid="lyrics-empty-state"
      icon={<AudioLinesIcon size={48} />}
      title={t('instrumental')}
      description={t('instrumentalDescription')}
      className="flex-1"
    />
  );
};
