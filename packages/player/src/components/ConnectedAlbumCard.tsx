import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, type AlbumRef } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { useFetchedTracksActions } from '../hooks/useFetchedTracksActions';
import { albumDetailsQuery, albumToTracks } from '../queries/albumDetails';
import { useFavoritesStore } from '../stores/favoritesStore';
import { CardMenuItems } from './CardMenuItems';

type ConnectedAlbumCardProps = {
  album: AlbumRef;
};

export const ConnectedAlbumCard: FC<ConnectedAlbumCardProps> = ({ album }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { provider, id } = album.source;
  const isFavorite = useFavoritesStore((state) =>
    state.isAlbumFavorite(album.source),
  );
  const addAlbum = useFavoritesStore((state) => state.addAlbum);
  const removeAlbum = useFavoritesStore((state) => state.removeAlbum);
  const queryClient = useQueryClient();

  const fetchTracks = async () => {
    const albumDetails = await queryClient.fetchQuery(
      albumDetailsQuery(provider, id),
    );
    return albumToTracks(albumDetails);
  };

  const { play, enqueue, isLoading } = useFetchedTracksActions(fetchTracks, {
    scope: 'metadata',
    message: t('album:errors.failedToLoadTracks'),
  });

  const toggleFavorite = () => {
    if (isFavorite) {
      removeAlbum(album.source);
      return;
    }
    addAlbum(album);
  };

  return (
    <Card
      title={album.title}
      subtitle={album.artists?.map((artist) => artist.name).join(', ')}
      src={pickArtwork(album.artwork, 'cover', 300)?.url}
      onClick={() => navigate({ to: `/album/${provider}/${id}` })}
      onPlay={play}
      isLoading={isLoading}
      menuItems={
        <CardMenuItems
          isFavorite={isFavorite}
          onAddToQueue={enqueue}
          onToggleFavorite={toggleFavorite}
        />
      }
      labels={{
        play: t('playlists:play'),
        menu: t('common:actions.moreActions'),
      }}
    />
  );
};
