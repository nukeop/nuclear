import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { isSyncedLyricsType } from '@nuclearplayer/model';
import { NuclearJam, NuclearJamLyricsState } from '@nuclearplayer/ui';

import { usePlaybackPositionMs } from '../hooks/usePlaybackPositionMs';
import { useRemoteStore } from './remoteStore';

type RemoteLyricsProps = {
  state: NuclearJamLyricsState;
  offsetMs: number;
  onSeekToSeconds: (seconds: number) => void;
};

const hasSyncedLyrics = (state: NuclearJamLyricsState) =>
  state.status === 'found' && isSyncedLyricsType(state.lyrics.type);

export const RemoteLyrics: FC<RemoteLyricsProps> = ({
  state,
  offsetMs,
  onSeekToSeconds,
}) => {
  const { t } = useTranslation('lyrics');
  const textSize = useRemoteStore((store) => store.settings.lyricsTextSize);
  const seekSeconds = useRemoteStore((store) => store.playback?.seek ?? 0);
  const isPlaying = useRemoteStore(
    (store) => store.playback?.status === 'playing',
  );
  const positionMs = usePlaybackPositionMs(
    seekSeconds,
    isPlaying && hasSyncedLyrics(state),
  );

  return (
    <NuclearJam.Lyrics
      state={state}
      positionMs={positionMs - offsetMs}
      textSize={textSize}
      onSeek={(lineStartMs) => onSeekToSeconds((lineStartMs + offsetMs) / 1000)}
      labels={{
        nothingPlayingTitle: t('nothingPlaying'),
        nothingPlayingSubtitle: t('nothingPlayingDescription'),
        notFoundTitle: t('noLyrics'),
        notFoundSubtitle: t('noLyricsFromAnyProvider'),
        instrumentalTitle: t('instrumental'),
        instrumentalSubtitle: t('instrumentalDescription'),
        errorTitle: t('loadError'),
        errorSubtitle: t('loadErrorDescription'),
        currentLine: t('currentLine'),
      }}
    />
  );
};
