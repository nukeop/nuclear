import { useNavigate } from '@tanstack/react-router';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, type AlbumRef } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { useFetchedTracksActions } from '../../../hooks/useFetchedTracksActions';
import { useAlbumTracks } from '../../../queries/albumDetails';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { FavoriteCardMenuItems } from './FavoriteCardMenuItems';

type FavoriteAlbumCardProps = {
  album: AlbumRef;
};

export const FavoriteAlbumCard: FC<FavoriteAlbumCardProps> = ({ album }) => {
  const { t } = useTranslation('favorites');
  const navigate = useNavigate();
  const removeAlbum = useFavoritesStore((state) => state.removeAlbum);
  const { provider, id } = album.source;
  const tracksQuery = useAlbumTracks(provider, id, { enabled: false });

  const fetchTracks = async () => {
    const { data } = await tracksQuery.refetch({ throwOnError: true });
    return data ?? [];
  };

  const { play, enqueue } = useFetchedTracksActions(fetchTracks, {
    scope: 'metadata',
    message: t('album:errors.failedToLoadTracks'),
  });

  return (
    <Card
      title={album.title}
      src={pickArtwork(album.artwork, 'cover', 300)?.url}
      onClick={() => navigate({ to: `/album/${provider}/${id}` })}
      onPlay={play}
      isLoading={tracksQuery.isFetching}
      menuItems={
        <FavoriteCardMenuItems
          onAddToQueue={enqueue}
          onRemove={() => removeAlbum(album.source)}
        />
      }
      labels={{
        play: t('playlists:play'),
        menu: t('common:actions.moreActions'),
      }}
    />
  );
};
