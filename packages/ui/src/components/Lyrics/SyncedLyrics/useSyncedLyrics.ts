import findLastIndex from 'lodash-es/findLastIndex';
import { RefObject, useEffect, useRef, useState } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { flattenLines } from '../utils';

const ANCHOR_RATIO = 0.3;

type Options = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  positionMs: number;
  onSeek: (positionMs: number) => void;
  viewportRef: RefObject<HTMLDivElement>;
};

export const useSyncedLyrics = ({
  lyrics,
  positionMs,
  onSeek,
  viewportRef,
}: Options) => {
  const activeLineRef = useRef<HTMLButtonElement>(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const activeLineIndex = findLastIndex(
    flattenLines(lyrics.sections),
    (line) => line.startMs <= positionMs,
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const activeLine = activeLineRef.current;
    if (!isFollowing || !viewport || !activeLine) {
      return;
    }
    const lineTop =
      activeLine.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top;
    viewport.scrollTop =
      viewport.scrollTop + lineTop - viewport.clientHeight * ANCHOR_RATIO;
  }, [isFollowing, activeLineIndex, viewportRef]);

  return {
    activeLineRef,
    activeLineIndex,
    isFollowing,
    stopFollowing: () => setIsFollowing(false),
    resumeFollowing: () => setIsFollowing(true),
    seekToLine: (startMs: number) => {
      onSeek(startMs);
      setIsFollowing(true);
    },
  };
};
