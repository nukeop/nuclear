import { useNavigate } from '@tanstack/react-router';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, type ArtistRef } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { CardMenuItems } from '../../../components/CardMenuItems';
import { useFetchedTracksActions } from '../../../hooks/useFetchedTracksActions';
import { useArtistTopTracks } from '../../../queries/artistTopTracks';
import { useFavoritesStore } from '../../../stores/favoritesStore';

type FavoriteArtistCardProps = {
  artist: ArtistRef;
};

export const FavoriteArtistCard: FC<FavoriteArtistCardProps> = ({ artist }) => {
  const { t } = useTranslation('favorites');
  const navigate = useNavigate();
  const isFavorite = useFavoritesStore((state) =>
    state.isArtistFavorite(artist.source),
  );
  const addArtist = useFavoritesStore((state) => state.addArtist);
  const removeArtist = useFavoritesStore((state) => state.removeArtist);
  const { provider, id } = artist.source;

  const toggleFavorite = () => {
    if (isFavorite) {
      removeArtist(artist.source);
      return;
    }
    addArtist(artist);
  };
  const tracksQuery = useArtistTopTracks(provider, id, { enabled: false });

  const fetchTracks = async () => {
    const { data } = await tracksQuery.refetch({ throwOnError: true });
    return data ?? [];
  };

  const { play, enqueue } = useFetchedTracksActions(fetchTracks, {
    scope: 'metadata',
    message: t('artist:errors.failedToLoadPopularTracks'),
  });

  return (
    <Card
      title={artist.name}
      src={pickArtwork(artist.artwork, 'cover', 300)?.url}
      onClick={() => navigate({ to: `/artist/${provider}/${id}` })}
      onPlay={play}
      isLoading={tracksQuery.isFetching}
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
