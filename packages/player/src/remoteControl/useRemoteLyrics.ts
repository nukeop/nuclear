import { useQuery } from '@tanstack/react-query';
import isNil from 'lodash-es/isNil';

import type { AttributedLyrics } from '@nuclearplayer/plugin-sdk';

import { fetchJSON } from './remoteApi';
import { useRemoteCurrentItem } from './useRemoteCurrentItem';

export type RemoteLyricsResults =
  | { status: 'nothingPlaying' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; results: AttributedLyrics[] };

export const useRemoteLyrics = (): RemoteLyricsResults => {
  const currentItem = useRemoteCurrentItem();

  const { data, isPending, isError } = useQuery({
    queryKey: ['lyrics', currentItem?.id],
    queryFn: () => fetchJSON<AttributedLyrics[]>('/api/lyrics/current'),
    staleTime: Infinity,
    retry: false,
    enabled: !isNil(currentItem),
  });

  if (isNil(currentItem)) {
    return { status: 'nothingPlaying' };
  }
  if (isError) {
    return { status: 'error' };
  }
  if (isPending) {
    return { status: 'loading' };
  }
  return { status: 'loaded', results: data };
};
