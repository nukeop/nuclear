import { Music } from 'lucide-react';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { sortByAddedAtDesc } from '../../utils/sort';

export const FavoriteTracks: FC = () => {
  const { t } = useTranslation('favorites');
  const favorites = useFavoritesStore((state) => state.tracks);

  const sortedTracks = useMemo(
    () => sortByAddedAtDesc(favorites).map((entry) => entry.ref),
    [favorites],
  );

  const hasDuration = sortedTracks.some((track) => track.durationMs != null);

  return (
    <ViewShell data-testid="favorite-tracks-view" title={t('tracks.title')}>
      {sortedTracks.length === 0 ? (
        <EmptyState
          icon={<Music size={48} />}
          title={t('tracks.empty')}
          description={t('tracks.emptyDescription')}
          className="flex-1"
        />
      ) : (
        <ConnectedTrackTable
          tracks={sortedTracks}
          features={{
            header: true,
            filterable: true,
            sortable: true,
            playAll: true,
            addAllToQueue: true,
          }}
          display={{
            displayThumbnail: true,
            displayArtist: true,
            displayDuration: hasDuration,
            displayQueueControls: true,
          }}
        />
      )}
    </ViewShell>
  );
};
