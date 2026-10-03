import { FC, RefObject } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';
import { SyncedLyrics } from '@nuclearplayer/ui';

import { useSoundStore } from '../../../stores/soundStore';
import { secondsToMs } from '../../../utils/time';

type ConnectedSyncedLyricsProps = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  offsetMs: number;
  viewportRef: RefObject<HTMLDivElement>;
};

export const ConnectedSyncedLyrics: FC<ConnectedSyncedLyricsProps> = ({
  lyrics,
  offsetMs,
  viewportRef,
}) => {
  const { t } = useTranslation('lyrics');
  const positionSeconds = useSoundStore((state) => state.seek);
  const seekTo = useSoundStore((state) => state.seekTo);

  return (
    <SyncedLyrics
      data-testid="lyrics-content"
      lyrics={lyrics}
      positionMs={secondsToMs(positionSeconds) - offsetMs}
      onSeek={(positionMs) => seekTo((positionMs + offsetMs) / 1000)}
      labels={{ currentLine: t('currentLine') }}
      viewportRef={viewportRef}
    />
  );
};
