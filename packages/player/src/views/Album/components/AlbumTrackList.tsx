import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Album, Track, TrackRef } from '@nuclearplayer/model';
import { Loader } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../../components/ConnectedTrackTable';
import { useAlbumDetails } from '../hooks/useAlbumDetails';

const mapTrackRefs = (refs: TrackRef[], album: Album): Track[] =>
  refs.map((ref) => ({
    ...ref,
    album: {
      title: album.title,
      artwork: album.artwork,
      source: album.source,
    },
    artwork: ref.artwork ?? album.artwork,
    artists: ref.artists.map((artist) => ({ name: artist.name, roles: [] })),
  }));

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

  const tracks = useMemo(
    () => (album?.tracks ? mapTrackRefs(album.tracks, album) : []),
    [album],
  );

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
    <ConnectedTrackTable
      tracks={tracks}
      features={{ filterable: false, playAll: true, addAllToQueue: true }}
      display={{ displayDuration: albumHasDuration, displayThumbnail: false }}
    />
  );
};
