import { FC, RefObject } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';
import { SyncedLyrics } from '@nuclearplayer/ui';

import { useSoundStore } from '../../../stores/soundStore';
import { usePlaybackPositionMs } from '../hooks/usePlaybackPositionMs';

type ConnectedSyncedLyricsProps = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  offsetMs: number;
  viewportRef: RefObject<HTMLDivElement>;
  className?: string;
};

export const ConnectedSyncedLyrics: FC<ConnectedSyncedLyricsProps> = ({
  lyrics,
  offsetMs,
  viewportRef,
  className,
}) => {
  const { t } = useTranslation('lyrics');
  const positionMs = usePlaybackPositionMs();
  const seekTo = useSoundStore((state) => state.seekTo);

  return (
    <SyncedLyrics
      data-testid="lyrics-content"
      className={className}
      lyrics={lyrics}
      positionMs={positionMs - offsetMs}
      onSeek={(lineStartMs) => seekTo((lineStartMs + offsetMs) / 1000)}
      labels={{ currentLine: t('currentLine') }}
      viewportRef={viewportRef}
    />
  );
};
