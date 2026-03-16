import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { MetadataProvider } from '@nuclearplayer/plugin-sdk';
import { Card, CardGrid, Loader } from '@nuclearplayer/ui';

import { useActiveProvider } from '../../../hooks/useActiveProvider';
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
  const navigate = useNavigate();
  const { t } = useTranslation('artist');
  const {
    data: albums,
    isLoading,
    isError,
  } = useArtistAlbums(providerId, artistId);

  const provider = useActiveProvider('metadata') as
    | MetadataProvider
    | undefined;

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-8"
        data-testid={dataTestId}
      >
        <Loader data-testid="artist-albums-loader" />
      </div>
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
        <Card
          key={album.source.id}
          title={album.title}
          subtitle={album.artists?.map((a) => a.name).join(', ')}
          src={pickArtwork(album.artwork, 'cover', 300)?.url}
          onClick={() =>
            navigate({ to: `/album/${provider!.id}/${album.source.id}` })
          }
        />
      ))}
    </CardGrid>
  );
};
