import { Link } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';

import { useArtistRelatedArtists } from '../hooks/useArtistRelatedArtists';
import { ArtistSimilarArtistsSkeleton } from './ArtistSimilarArtistsSkeleton';

type ArtistSimilarArtistsProps = {
  providerId: string;
  artistId: string;
};

export const ArtistSimilarArtists: FC<ArtistSimilarArtistsProps> = ({
  providerId,
  artistId,
}) => {
  const { t } = useTranslation('artist');
  const {
    data: artists,
    isLoading,
    isError,
  } = useArtistRelatedArtists(providerId, artistId);

  if (isLoading) {
    return <ArtistSimilarArtistsSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-accent-red p-4">
        {t('errors.failedToLoadSimilarArtists')}
      </div>
    );
  }

  return (
    !isEmpty(artists) && (
      <div className="flex flex-col">
        <h2 className="mb-2 text-lg font-semibold">{t('similar')}</h2>
        <ul className="divide-border surface-card border-border divide-y-(length:--border-width) border border-(length:--border-width)">
          {artists!.slice(0, 5).map((artist) => {
            const thumb = pickArtwork(artist.artwork, 'thumbnail', 64);
            const avatar = thumb ?? pickArtwork(artist.artwork, 'avatar', 64);
            return (
              <li key={artist.source.id}>
                <Link
                  to="/artist/$providerId/$artistId"
                  params={{ providerId, artistId: artist.source.id }}
                  className="flex items-center gap-3"
                >
                  {avatar && (
                    <img
                      src={avatar.url}
                      alt={artist.name}
                      className="h-10 w-10 object-cover"
                    />
                  )}
                  {!avatar && <div className="h-10 w-10" />}
                  <span className="truncate">{artist.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};
