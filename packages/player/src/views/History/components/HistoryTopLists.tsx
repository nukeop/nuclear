import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';

import type { TimeRange } from '../../../services/tauri/bindings';
import { useTopAlbums } from '../hooks/queries/useTopAlbums';
import { useTopArtists } from '../hooks/queries/useTopArtists';
import { useTopTracks } from '../hooks/queries/useTopTracks';
import {
  albumEntries,
  artistEntries,
  trackEntries,
} from '../utils/topListEntries';
import { StatsTopList } from './StatsTopList';

const TOP_LIST_SIZE = 10;

type HistoryTopListsProps = {
  range: TimeRange;
};

export const HistoryTopLists: FC<HistoryTopListsProps> = ({ range }) => {
  const { t } = useTranslation('history');
  const { data: artists } = useTopArtists(range, TOP_LIST_SIZE);
  const { data: albums } = useTopAlbums(range, TOP_LIST_SIZE);
  const { data: tracks } = useTopTracks(range, TOP_LIST_SIZE);

  if (!artists?.length && !albums?.length && !tracks?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      <StatsTopList
        testId="history-top-artists"
        title={t('stats.topArtists')}
        entries={artistEntries(artists ?? [])}
      />
      <StatsTopList
        testId="history-top-albums"
        title={t('stats.topAlbums')}
        entries={albumEntries(albums ?? [])}
      />
      <StatsTopList
        testId="history-top-tracks"
        title={t('stats.topTracks')}
        entries={trackEntries(tracks ?? [])}
      />
    </div>
  );
};
