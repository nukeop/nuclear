import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { CardGrid } from '@nuclearplayer/ui';

import { ConnectedAlbumCard } from '../../../components/ConnectedAlbumCard';
import { useArtistAlbums } from '../hooks/useArtistAlbums';

type ArtistAlbumsGridProps = {
  providerId: string;
  artistId: string;
  'data-testid'?: string;
};

export const ArtistAlbumsGrid: FC<ArtistAlbumsGridProps> = ({
  providerId,
  artistId,
  'data-testid': dataTestId,
}) => {
  const { t } = useTranslation('artist');
  const {
    data: albums,
    isLoading,
    isError,
  } = useArtistAlbums(providerId, artistId);

  if (isLoading) {
    return (
      <CardGrid.Skeleton
        data-testid={dataTestId ?? 'artist-albums-skeleton'}
        className="mx-4"
      />
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-start gap-3 p-8"
        data-testid={dataTestId}
      >
        <div className="text-accent-red">{t('errors.failedToLoadAlbums')}</div>
      </div>
    );
  }

  return (
    <CardGrid data-testid={dataTestId} className="mx-4">
      {albums?.map((album) => (
        <ConnectedAlbumCard key={album.source.id} album={album} />
      ))}
    </CardGrid>
  );
};
