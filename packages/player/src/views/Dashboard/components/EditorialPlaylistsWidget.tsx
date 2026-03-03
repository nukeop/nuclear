import { FC, useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, PlaylistRef } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import type { CardsRowItem } from '@nuclearplayer/ui';

import { useDashboardEditorialPlaylists } from '../hooks/useDashboardData';
import { useNavigateToPlaylist } from '../hooks/useNavigateToPlaylist';
import { DashboardCardsWidget } from './DashboardCardsWidget';

export const EditorialPlaylistsWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: results, isLoading } = useDashboardEditorialPlaylists();
  const navigateToPlaylist = useNavigateToPlaylist();

  const mapPlaylist = useCallback(
    (
      playlist: PlaylistRef,
      result: AttributedResult<PlaylistRef>,
    ): CardsRowItem => ({
      id: `${result.providerId}-${playlist.source.id}`,
      title: playlist.name,
      imageUrl: pickArtwork(playlist.artwork, 'cover', 300)?.url,
      onClick: playlist.source.url
        ? () => navigateToPlaylist(playlist.source.url!)
        : undefined,
    }),
    [navigateToPlaylist],
  );

  return (
    <DashboardCardsWidget
      data-testid="dashboard-editorial-playlists"
      results={results}
      isLoading={isLoading}
      title={t('editorial-playlists')}
      labels={{
        filterPlaceholder: t('filter-playlists'),
        nothingFound: t('nothing-found'),
      }}
      mapItem={mapPlaylist}
    />
  );
};
