import { FC, Fragment, RefObject } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { InstrumentalBreak } from '../InstrumentalBreak';
import {
  LineSyncedLyricsLine,
  WordSyncedLyricsLine,
} from '../SyncedLyricsLine';
import { flattenLines, getBreakBefore } from '../utils';

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

  const breakBefore = (index: number) => {
    const instrumentalBreak = getBreakBefore(
      flattenLines(lyrics.sections),
      index,
    );
    return (
      instrumentalBreak && (
        <InstrumentalBreak {...instrumentalBreak} positionMs={positionMs} />
      )
    );
  };

  if (lyrics.type === 'wordSynced') {
    return flattenLines(lyrics.sections).map((line, index) => (
      <Fragment key={index}>
        {breakBefore(index)}
        <WordSyncedLyricsLine
          ref={refFor(index)}
          line={line}
          positionMs={positionMs}
          onClick={() => onLineClick(line.startMs)}
        />
      </Fragment>
    ));
  }

  return flattenLines(lyrics.sections).map((line, index) => (
    <Fragment key={index}>
      {breakBefore(index)}
      <LineSyncedLyricsLine
        ref={refFor(index)}
        line={line}
        positionMs={positionMs}
        onClick={() => onLineClick(line.startMs)}
      />
    </Fragment>
  ));
};
