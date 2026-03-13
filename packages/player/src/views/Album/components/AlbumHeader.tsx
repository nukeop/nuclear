import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Loader, StatChip } from '@nuclearplayer/ui';

import { ConnectedFavoriteButton } from '../../../components/ConnectedFavoriteButton';
import { useAlbumDetails } from '../hooks/useAlbumDetails';

type AlbumHeaderProps = {
  providerId: string;
  albumId: string;
};

export const AlbumHeader: FC<AlbumHeaderProps> = ({ providerId, albumId }) => {
  const { t } = useTranslation('album');
  const {
    data: album,
    isLoading,
    isError,
  } = useAlbumDetails(providerId, albumId);

  if (isLoading) {
    return (
      <div className="flex h-100 w-full items-center justify-center">
        <Loader size="xl" data-testid="album-header-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-100 w-full flex-col items-center justify-center gap-3 p-6">
        <div className="text-accent-red">{t('errors.failedToLoadDetails')}</div>
      </div>
    );
  }

  if (!album) {
    return null;
  }

  const cover = pickArtwork(album.artwork, 'cover', 600);
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate.dateIso).getFullYear()
    : undefined;
  const trackCount = album.tracks?.length ?? 0;

  return (
    <div className="border-border bg-primary shadow-shadow relative mx-6 mt-6 flex flex-col gap-6 rounded-md border-(length:--border-width) p-6 md:flex-row">
      <ConnectedFavoriteButton
        type="album"
        source={{ provider: providerId, id: albumId }}
        data={{ title: album.title, artwork: album.artwork }}
        className="bg-background border-border absolute top-4 right-4 z-10 rounded-md border-(length:--border-width)"
        data-testid="album-favorite-button"
      />
      {cover && (
        <img
          src={cover.url}
          alt={album.title}
          className="border-border shadow-shadow h-60 w-60 rounded-md border-(length:--border-width) object-cover select-none"
        />
      )}

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-5xl font-extrabold tracking-tight">
            {album.title}
          </h1>
          <div className="text-text-secondary text-lg">
            by {album.artists.map((a) => a.name).join(', ')}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {album.genres && album.genres.length > 0 && (
            <StatChip value={album.genres.join(', ')} label={t('genre')} />
          )}
          {releaseYear && <StatChip value={releaseYear} label={t('year')} />}
          <StatChip value={trackCount} label={t('tracks')} />
        </div>
      </div>
    </div>
  );
};
