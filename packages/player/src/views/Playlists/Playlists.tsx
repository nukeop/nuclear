import { useNavigate } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { ListMusic, SearchX } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { PlaylistCardGrid } from './components/PlaylistCardGrid';
import { PlaylistsToolbar } from './components/PlaylistsToolbar';
import { usePlaylistFilter } from './hooks/usePlaylistFilter';
import { usePlaylistSort } from './hooks/usePlaylistSort';
import { PlaylistsProvider } from './PlaylistsContext';

const PlaylistsContent: FC = () => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const index = usePlaylistStore((state) => state.index);
  const { filter, setFilter, filteredIndex, hasFilter } =
    usePlaylistFilter(index);
  const { sortBy, setSortBy } = usePlaylistSort();
  const hasPlaylists = !isEmpty(index);
  const hasResults = !isEmpty(filteredIndex);

  return (
    <ViewShell data-testid="playlists-view" title={t('title')}>
      <PlaylistsToolbar
        filter={filter}
        onFilterChange={setFilter}
        hasPlaylists={hasPlaylists}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {!hasPlaylists && (
        <EmptyState
          icon={<ListMusic size={48} />}
          title={t('empty')}
          description={t('emptyDescription')}
          className="flex-1"
        />
      )}

      {hasPlaylists && hasFilter && !hasResults && (
        <EmptyState
          icon={<SearchX size={48} />}
          title={t('filterNoResults')}
          description={t('filterNoResultsDescription')}
          className="flex-1"
          data-testid="filter-empty-state"
        />
      )}

      {hasPlaylists && hasResults && (
        <ScrollableArea className="flex-1 overflow-hidden">
          <PlaylistCardGrid
            index={filteredIndex}
            onCardClick={(id) =>
              navigate({
                to: '/playlists/$playlistId',
                params: { playlistId: id },
              })
            }
          />
        </ScrollableArea>
      )}

      <CreatePlaylistDialog />
    </ViewShell>
  );
};

export const Playlists: FC = () => (
  <PlaylistsProvider>
    <PlaylistsContent />
  </PlaylistsProvider>
);
