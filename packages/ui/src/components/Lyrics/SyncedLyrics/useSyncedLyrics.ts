import findLastIndex from 'lodash-es/findLastIndex';
import { useEffect, useRef, useState } from 'react';

import type { LineSyncedLyrics, WordSyncedLyrics } from '@nuclearplayer/model';

import { flattenLines } from '../utils';

const ANCHOR_RATIO = 0.3;

type Options = {
  lyrics: LineSyncedLyrics | WordSyncedLyrics;
  positionMs: number;
  onSeek: (positionMs: number) => void;
};

export const useSyncedLyrics = ({ lyrics, positionMs, onSeek }: Options) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
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
    viewport.scrollTop =
      activeLine.offsetTop - viewport.clientHeight * ANCHOR_RATIO;
  }, [isFollowing, activeLineIndex]);

  return {
    viewportRef,
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
