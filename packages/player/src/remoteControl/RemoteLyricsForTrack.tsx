import find from 'lodash-es/find';
import head from 'lodash-es/head';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import { FC, useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { AttributedLyrics } from '@nuclearplayer/plugin-sdk';
import { NuclearJam, NuclearJamLyricsState } from '@nuclearplayer/ui';

import { useLyricsOffset } from '../hooks/useLyricsOffset';
import { formatLyricsOffset, toLyricsSources } from '../utils/lyrics';
import { RemoteLyrics } from './RemoteLyrics';
import { RemoteLyricsResults } from './useRemoteLyrics';

type RemoteLyricsForTrackProps = {
  lyrics: RemoteLyricsResults;
  onSeekToSeconds: (seconds: number) => void;
};

const toLyricsState = (
  lyrics: RemoteLyricsResults,
  selectedResult: AttributedLyrics | undefined,
): NuclearJamLyricsState => {
  if (lyrics.status === 'nothingPlaying') {
    return { status: 'nothingPlaying' };
  }
  if (lyrics.status === 'loading') {
    return { status: 'loading' };
  }
  if (lyrics.status === 'error') {
    return { status: 'error' };
  }
  if (isNil(selectedResult)) {
    return { status: 'notFound' };
  }
  return { status: 'found', lyrics: selectedResult.lyrics };
};

export const RemoteLyricsForTrack: FC<RemoteLyricsForTrackProps> = ({
  lyrics,
  onSeekToSeconds,
}) => {
  const { t } = useTranslation('lyrics');
  const [selectedProviderId, setSelectedProviderId] = useState<string>();
  const { offsetMs, showEarlier, showLater } = useLyricsOffset();
  const results = lyrics.status === 'loaded' ? lyrics.results : [];
  const selectedResult =
    find(results, { providerId: selectedProviderId }) ?? head(results);
  const sources = results.flatMap(toLyricsSources);

  return (
    <>
      {!isNil(selectedResult) && !isEmpty(sources) && (
        <NuclearJam.LyricsToolbar
          sources={sources}
          selectedSourceId={selectedResult.providerId}
          onSelectSource={setSelectedProviderId}
          offsetValue={formatLyricsOffset(t, offsetMs)}
          onShowEarlier={showEarlier}
          onShowLater={showLater}
          labels={{
            types: {
              wordSynced: t('types.wordSynced'),
              lineSynced: t('types.lineSynced'),
              plain: t('types.plain'),
            },
            showEarlier: t('showEarlier'),
            showLater: t('showLater'),
          }}
        />
      )}
      <RemoteLyrics
        state={toLyricsState(lyrics, selectedResult)}
        offsetMs={offsetMs}
        onSeekToSeconds={onSeekToSeconds}
      />
    </>
  );
};
