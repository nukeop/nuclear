import { ListPlus, Play } from 'lucide-react';
import { FC, useCallback, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Track, TrackRef } from '@nuclearplayer/model';
import { Button, Loader } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../../components/ConnectedTrackTable';
import { useQueueActions } from '../../../hooks/useQueueActions';
import { useAlbumDetails } from '../hooks/useAlbumDetails';

const mapTrackRefs = (refs: TrackRef[]): Track[] => {
  return refs.map((ref) => ({
    ...ref,
    artists: ref.artists.map((a) => ({ name: a.name, roles: [] })),
  }));
};

type AlbumTrackListProps = {
  providerId: string;
  albumId: string;
};

export const AlbumTrackList: FC<AlbumTrackListProps> = ({
  providerId,
  albumId,
}) => {
  const { t } = useTranslation('album');
  const { playNow, addToQueue } = useQueueActions();
  const {
    data: album,
    isLoading,
    isError,
  } = useAlbumDetails(providerId, albumId);

  const tracks = useMemo(
    () => (album?.tracks ? mapTrackRefs(album.tracks) : []),
    [album?.tracks],
  );

  const handlePlayAll = useCallback(() => {
    if (tracks.length > 0) {
      playNow(tracks[0]);
      if (tracks.length > 1) {
        addToQueue(tracks.slice(1));
      }
    }
  }, [tracks, playNow, addToQueue]);

  const handleAddAllToQueue = useCallback(() => {
    if (tracks.length > 0) {
      addToQueue(tracks);
    }
  }, [tracks, addToQueue]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader data-testid="album-tracks-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-accent-red p-4">
        {t('errors.failedToLoadTracks')}
      </div>
    );
  }

  if (!album) {
    return null;
  }

  const albumHasDuration = tracks.some(
    (track) => track.durationMs != undefined,
  );

  return (
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
        tracks={tracks}
        features={{ filterable: false }}
        display={{
          displayDuration: albumHasDuration,
          displayThumbnail: false,
          displayQueueControls: true,
          displayPosition: true,
        }}
      />
    </>
  );
};
