import { skipToken, useQuery } from '@tanstack/react-query';
import isNil from 'lodash-es/isNil';

import type { Track } from '@nuclearplayer/model';

import { useCurrentQueueItem } from '../../../hooks/useCurrentQueueItem';
import { lyricsHost } from '../../../services/lyricsHost';

const fetchLyricsFor = (track: Track | undefined) => {
  if (isNil(track)) {
    return skipToken;
  }
  return () => lyricsHost.getLyricsForTrack(track);
};

export const useLyrics = () => {
  const currentItem = useCurrentQueueItem();

  return useQuery({
    queryKey: ['lyrics', currentItem?.id],
    queryFn: fetchLyricsFor(currentItem?.track),
  });
};
