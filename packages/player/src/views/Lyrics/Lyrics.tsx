import isNil from 'lodash-es/isNil';
import { MicVocalIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, PlainLyrics } from '@nuclearplayer/ui';

import { useCurrentQueueItem } from '../../hooks/useCurrentQueueItem';
import { useLyrics } from './hooks/useLyrics';

export const Lyrics: FC = () => {
  const { t } = useTranslation('lyrics');
  const currentItem = useCurrentQueueItem();
  const { data: results = [] } = useLyrics();
  const [topResult] = results;

  return (
    <div data-testid="lyrics-view" className="flex h-full flex-col">
      {isNil(currentItem) && (
        <EmptyState
          data-testid="lyrics-empty-state"
          icon={<MicVocalIcon size={48} />}
          title={t('nothingPlaying')}
          description={t('nothingPlayingDescription')}
          className="flex-1"
        />
      )}
      {topResult?.lyrics.type === 'plain' && (
        <PlainLyrics
          data-testid="lyrics-content"
          sections={topResult.lyrics.sections}
        />
      )}
    </div>
  );
};
