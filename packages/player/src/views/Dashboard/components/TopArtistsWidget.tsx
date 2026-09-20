import { FC, useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ArtistRef, pickArtwork } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import type { CardsRowItem } from '@nuclearplayer/ui';

import { useDashboardTopArtists } from '../hooks/useDashboardData';
import { useNavigateToEntity } from '../hooks/useNavigateToEntity';
import { DashboardCardsWidget } from './DashboardCardsWidget';

export const TopArtistsWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: results, isLoading } = useDashboardTopArtists();
  const navigateToEntity = useNavigateToEntity();

  const mapArtist = useCallback(
    (artist: ArtistRef, result: AttributedResult<ArtistRef>): CardsRowItem => ({
      id: `${result.providerId}-${artist.source.id}`,
      title: artist.name,
      imageUrl: pickArtwork(artist.artwork, 'thumbnail', 300)?.url,
      onClick: () =>
        navigateToEntity(
          { name: artist.name, sourceId: artist.source.id },
          result,
          'artist',
        ),
    }),
    [navigateToEntity],
  );

  return (
    <DashboardCardsWidget
      data-testid="dashboard-top-artists"
      results={results}
      isLoading={isLoading}
      title={t('top-artists')}
      labels={{
        filterPlaceholder: t('filter-artists'),
        nothingFound: t('nothing-found'),
      }}
      mapItem={mapArtist}
    />
  );
};
