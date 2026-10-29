import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { TrackTable } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../../components/ConnectedTrackTable';
import { albumToTracks, useAlbumDetails } from '../../../queries/albumDetails';

type AlbumTrackListProps = {
  providerId: string;
  albumId: string;
};

export const AlbumTrackList: FC<AlbumTrackListProps> = ({
  providerId,
  albumId,
}) => {
  const { t } = useTranslation('album');
  const {
    data: album,
    isLoading,
    isError,
  } = useAlbumDetails(providerId, albumId);

  const tracks = useMemo(() => (album ? albumToTracks(album) : []), [album]);

  if (isLoading) {
    return (
      <TrackTable.Skeleton
        display={{ displayThumbnail: false }}
        data-testid="album-tracks-skeleton"
      />
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
    <ConnectedTrackTable
      tracks={tracks}
      features={{ filterable: false, playAll: true, addAllToQueue: true }}
      display={{ displayDuration: albumHasDuration, displayThumbnail: false }}
    />
  );
};
