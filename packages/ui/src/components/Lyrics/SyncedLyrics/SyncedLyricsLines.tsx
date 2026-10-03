import { FC, RefObject } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import {
  LineSyncedLyricsLine,
  WordSyncedLyricsLine,
} from '../SyncedLyricsLine';
import { flattenLines } from '../utils';

type SyncedLyricsLinesProps = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  positionMs: number;
  activeLineIndex: number;
  activeLineRef: RefObject<HTMLButtonElement>;
  onLineClick: (startMs: number) => void;
};

export const SyncedLyricsLines: FC<SyncedLyricsLinesProps> = ({
  lyrics,
  positionMs,
  activeLineIndex,
  activeLineRef,
  onLineClick,
}) => {
  const refFor = (index: number) =>
    index === activeLineIndex ? activeLineRef : undefined;

  if (lyrics.type === 'wordSynced') {
    return flattenLines(lyrics.sections).map((line, index) => (
      <WordSyncedLyricsLine
        key={index}
        ref={refFor(index)}
        line={line}
        positionMs={positionMs}
        onClick={() => onLineClick(line.startMs)}
      />
    ));
  }

  return flattenLines(lyrics.sections).map((line, index) => (
    <LineSyncedLyricsLine
      key={index}
      ref={refFor(index)}
      line={line}
      positionMs={positionMs}
      onClick={() => onLineClick(line.startMs)}
    />
  ));
};
