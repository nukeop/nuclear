import { ListPlus, Music, Play } from 'lucide-react';
import { useCallback, useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, EmptyState, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { useQueueActions } from '../../hooks/useQueueActions';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { sortByAddedAtDesc } from '../../utils/sort';

export const FavoriteTracks: FC = () => {
  const { t } = useTranslation('favorites');
  const favorites = useFavoritesStore((state) => state.tracks);
  const { playNow, addToQueue } = useQueueActions();

  const sortedTracks = useMemo(
    () => sortByAddedAtDesc(favorites).map((entry) => entry.ref),
    [favorites],
  );

  const hasDuration = sortedTracks.some((track) => track.durationMs != null);

  const handlePlayAll = useCallback(() => {
    if (sortedTracks.length > 0) {
      playNow(sortedTracks[0]);
      if (sortedTracks.length > 1) {
        addToQueue(sortedTracks.slice(1));
      }
    }
  }, [sortedTracks, playNow, addToQueue]);

  const handleAddAllToQueue = useCallback(() => {
    if (sortedTracks.length > 0) {
      addToQueue(sortedTracks);
    }
  }, [sortedTracks, addToQueue]);

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
        <>
          <div className="mb-3 flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handlePlayAll}
              data-testid="play-all-button"
            >
              <Play size={14} />
              Play All
            </Button>
            <Button
              variant="text"
              size="sm"
              onClick={handleAddAllToQueue}
              data-testid="add-all-to-queue-button"
            >
              <ListPlus size={14} />
              Add All to Queue
            </Button>
          </div>
          <ConnectedTrackTable
            tracks={sortedTracks}
            features={{
              header: true,
              filterable: true,
              sortable: true,
            }}
            display={{
              displayThumbnail: true,
              displayArtist: true,
              displayDuration: hasDuration,
              displayQueueControls: true,
            }}
          />
        </>
      )}
    </ViewShell>
  );
};
