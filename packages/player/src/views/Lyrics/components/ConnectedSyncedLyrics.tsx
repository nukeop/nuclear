import { FC, RefObject } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';
import { SyncedLyrics } from '@nuclearplayer/ui';

import { useCoreSetting } from '../../../hooks/useCoreSetting';
import { usePlaybackPositionMs } from '../../../hooks/usePlaybackPositionMs';
import { useSoundStore } from '../../../stores/soundStore';

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
  const seekSeconds = useSoundStore((state) => state.seek);
  const isPlaying = useSoundStore((state) => state.status === 'playing');
  const positionMs = usePlaybackPositionMs(seekSeconds, isPlaying);
  const seekTo = useSoundStore((state) => state.seekTo);
  const [autoScroll] = useCoreSetting<boolean>('lyrics.autoScroll');

  return (
    <SyncedLyrics
      data-testid="lyrics-content"
      className={className}
      lyrics={lyrics}
      positionMs={positionMs - offsetMs}
      onSeek={(lineStartMs) => seekTo((lineStartMs + offsetMs) / 1000)}
      labels={{ currentLine: t('currentLine') }}
      viewportRef={viewportRef}
      autoScroll={Boolean(autoScroll)}
    />
  );
};
