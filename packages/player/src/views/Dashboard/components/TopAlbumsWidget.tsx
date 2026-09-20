import { FC, useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { AlbumRef, pickArtwork } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import type { CardsRowItem } from '@nuclearplayer/ui';

import { useDashboardTopAlbums } from '../hooks/useDashboardData';
import { useNavigateToEntity } from '../hooks/useNavigateToEntity';
import { DashboardCardsWidget } from './DashboardCardsWidget';

export const TopAlbumsWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: results, isLoading } = useDashboardTopAlbums();
  const navigateToEntity = useNavigateToEntity();

  const mapAlbum = useCallback(
    (album: AlbumRef, result: AttributedResult<AlbumRef>): CardsRowItem => ({
      id: `${result.providerId}-${album.source.id}`,
      title: album.title,
      subtitle: album.artists?.map((artist) => artist.name).join(', '),
      imageUrl: pickArtwork(album.artwork, 'thumbnail', 300)?.url,
      onClick: () =>
        navigateToEntity(
          {
            name: album.artists?.length
              ? `${album.artists.map((artist) => artist.name).join(', ')} ${album.title}`
              : album.title,
            sourceId: album.source.id,
          },
          result,
          'album',
        ),
    }),
    [navigateToEntity],
  );

  return (
    <DashboardCardsWidget
      data-testid="dashboard-top-albums"
      results={results}
      isLoading={isLoading}
      title={t('top-albums')}
      labels={{
        filterPlaceholder: t('filter-albums'),
        nothingFound: t('nothing-found'),
      }}
      mapItem={mapAlbum}
    />
  );
};
