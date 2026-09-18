import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Card, CardGrid } from '@nuclearplayer/ui';

import { useNavigateToPlaylist } from '../../../hooks/useNavigateToPlaylist';
import { useArtistPlaylists } from '../hooks/useArtistPlaylists';

type ArtistPlaylistsGridProps = {
  providerId: string;
  artistId: string;
  'data-testid'?: string;
};

export const ArtistPlaylistsGrid: FC<ArtistPlaylistsGridProps> = ({
  providerId,
  artistId,
  'data-testid': dataTestId,
}) => {
  const { t } = useTranslation('artist');
  const navigateToPlaylist = useNavigateToPlaylist();
  const {
    data: playlists,
    isLoading,
    isError,
  } = useArtistPlaylists(providerId, artistId);

  if (isLoading) {
    return (
      <CardGrid
        data-testid={dataTestId ?? 'artist-playlists-skeleton'}
        className="px-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <Card.Skeleton key={index} />
        ))}
      </CardGrid>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-start gap-3 p-8"
        data-testid={dataTestId}
      >
        <div className="text-accent-red">
          {t('errors.failedToLoadPlaylists')}
        </div>
      </div>
    );
  }

  return (
    <CardGrid data-testid={dataTestId} className="px-4">
      {playlists?.map((playlist) => (
        <Card
          key={playlist.source.id}
          title={playlist.name}
          src={pickArtwork(playlist.artwork, 'cover', 300)?.url}
          onClick={
            playlist.source.url
              ? () => navigateToPlaylist(playlist.source.url!)
              : undefined
          }
        />
      ))}
    </CardGrid>
  );
};
