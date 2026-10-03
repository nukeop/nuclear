import { skipToken, useQuery } from '@tanstack/react-query';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import map from 'lodash-es/map';

import type { QueueItem } from '@nuclearplayer/model';
import type { ProviderDescriptor } from '@nuclearplayer/plugin-sdk';

import { lyricsHost } from '../../../services/lyricsHost';

const fetchLyricsFor = (
  item: QueueItem | undefined,
  providers: ProviderDescriptor<'lyrics'>[],
) => {
  if (isNil(item) || isEmpty(providers)) {
    return skipToken;
  }
  return () => lyricsHost.getLyricsForTrack(item.track);
};

export const useLyrics = (
  item: QueueItem | undefined,
  providers: ProviderDescriptor<'lyrics'>[],
) =>
  useQuery({
    queryKey: ['lyrics', item?.id, map(providers, 'id')],
    queryFn: fetchLyricsFor(item, providers),
  });
