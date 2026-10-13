import {
  AudioLinesIcon,
  CloudOffIcon,
  MicOffIcon,
  MicVocalIcon,
} from 'lucide-react';
import { FC, RefObject } from 'react';

import { LyricsSkeleton, PlainLyrics, SyncedLyrics } from '../Lyrics';
import type {
  NuclearJamLyricsLabels,
  NuclearJamLyricsState,
} from './NuclearJamLyrics';
import { NuclearJamLyricsEmpty } from './NuclearJamLyricsEmpty';

type NuclearJamLyricsContentProps = {
  state: NuclearJamLyricsState;
  positionMs: number;
  onSeek: (lineStartMs: number) => void;
  labels: NuclearJamLyricsLabels;
  textClassName: string;
  viewportRef: RefObject<HTMLDivElement>;
};

export const NuclearJamLyricsContent: FC<NuclearJamLyricsContentProps> = ({
  state,
  positionMs,
  onSeek,
  labels,
  textClassName,
  viewportRef,
}) => {
  if (state.status === 'nothingPlaying') {
    return (
      <NuclearJamLyricsEmpty
        icon={<MicVocalIcon size={48} />}
        title={labels.nothingPlayingTitle}
        subtitle={labels.nothingPlayingSubtitle}
      />
    );
  }
  if (state.status === 'loading') {
    return <LyricsSkeleton />;
  }
  if (state.status === 'notFound') {
    return (
      <NuclearJamLyricsEmpty
        icon={<MicOffIcon size={48} />}
        title={labels.notFoundTitle}
        subtitle={labels.notFoundSubtitle}
      />
    );
  }
  if (state.status === 'error') {
    return (
      <NuclearJamLyricsEmpty
        icon={<CloudOffIcon size={48} />}
        title={labels.errorTitle}
        subtitle={labels.errorSubtitle}
      />
    );
  }
  if (state.lyrics.type === 'instrumental') {
    return (
      <NuclearJamLyricsEmpty
        icon={<AudioLinesIcon size={48} />}
        title={labels.instrumentalTitle}
        subtitle={labels.instrumentalSubtitle}
      />
    );
  }
  if (state.lyrics.type === 'plain') {
    return (
      <PlainLyrics
        className={textClassName}
        sections={state.lyrics.sections}
        vocalists={state.lyrics.metadata.vocalists}
      />
    );
  }
  return (
    <SyncedLyrics
      className={textClassName}
      lyrics={state.lyrics}
      positionMs={positionMs}
      onSeek={onSeek}
      labels={{ currentLine: labels.currentLine }}
      viewportRef={viewportRef}
      autoScroll
    />
  );
};
