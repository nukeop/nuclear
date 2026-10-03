import { skipToken, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import map from 'lodash-es/map';

import type { Track } from '@nuclearplayer/model';
import type { ProviderDescriptor } from '@nuclearplayer/plugin-sdk';

import { useCurrentQueueItem } from '../../../hooks/useCurrentQueueItem';
import { useProviders } from '../../../hooks/useProviders';
import { lyricsHost } from '../../../services/lyricsHost';

const fetchLyricsFor = (
  track: Track | undefined,
  providers: ProviderDescriptor<'lyrics'>[],
) => {
  if (isNil(track) || isEmpty(providers)) {
    return skipToken;
  }
  return () => lyricsHost.getLyricsForTrack(track);
};

export const useLyrics = () => {
  const currentItem = useCurrentQueueItem();
  const providers = useProviders('lyrics');

  return useQuery({
    queryKey: ['lyrics', currentItem?.id, map(providers, 'id')],
    queryFn: fetchLyricsFor(currentItem?.track, providers),
  });
};
