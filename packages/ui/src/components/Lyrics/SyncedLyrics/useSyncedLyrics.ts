import findLastIndex from 'lodash-es/findLastIndex';
import { RefObject, useCallback, useEffect, useRef } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { flattenLines } from '../utils';
import { useActiveLineDirection } from './useActiveLineDirection';

const ANCHOR_RATIO = 0.3;

type Options = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  positionMs: number;
  viewportRef: RefObject<HTMLDivElement>;
  autoScroll: boolean;
};

export const useSyncedLyrics = ({
  lyrics,
  positionMs,
  viewportRef,
  autoScroll,
}: Options) => {
  const activeLineRef = useRef<HTMLButtonElement>(null);
  const activeLineIndex = findLastIndex(
    flattenLines(lyrics.sections),
    (line) => line.startMs <= positionMs,
  );
  const activeLineDirection = useActiveLineDirection(
    viewportRef,
    activeLineRef,
    activeLineIndex,
  );

  const scrollToActiveLine = useCallback(() => {
    const viewport = viewportRef.current;
    const activeLine = activeLineRef.current;
    if (!viewport || !activeLine) {
      return;
    }
    const lineTop =
      activeLine.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top;
    viewport.scrollTop =
      viewport.scrollTop + lineTop - viewport.clientHeight * ANCHOR_RATIO;
  }, [viewportRef]);

  useEffect(() => {
    if (autoScroll) {
      scrollToActiveLine();
    }
  }, [autoScroll, activeLineIndex, scrollToActiveLine]);

  return {
    activeLineRef,
    activeLineIndex,
    activeLineDirection,
    scrollToActiveLine,
  };
};
