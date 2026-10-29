import { useNavigate } from '@tanstack/react-router';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, type ArtistRef } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { useFetchedTracksActions } from '../../../hooks/useFetchedTracksActions';
import { useArtistTopTracks } from '../../../queries/artistTopTracks';
import { useFavoritesStore } from '../../../stores/favoritesStore';
import { FavoriteCardMenuItems } from './FavoriteCardMenuItems';

type FavoriteArtistCardProps = {
  artist: ArtistRef;
};

export const FavoriteArtistCard: FC<FavoriteArtistCardProps> = ({ artist }) => {
  const { t } = useTranslation('favorites');
  const navigate = useNavigate();
  const removeArtist = useFavoritesStore((state) => state.removeArtist);
  const { provider, id } = artist.source;
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
        <FavoriteCardMenuItems
          onAddToQueue={enqueue}
          onRemove={() => removeArtist(artist.source)}
        />
      }
      labels={{
        play: t('playlists:play'),
        menu: t('common:actions.moreActions'),
      }}
    />
  );
};
