import { useNavigate } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { FolderOpen, ListMusic, SearchX } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type {
  PlaylistFolder,
  PlaylistIndexEntry,
  PlaylistIndexNode,
} from '@nuclearplayer/model';
import { EmptyState, ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { PlaylistCardGrid } from './components/PlaylistCardGrid';
import { PlaylistsToolbar } from './components/PlaylistsToolbar';
import { usePlaylistFilter } from './hooks/usePlaylistFilter';
import { usePlaylistLevel } from './hooks/usePlaylistLevel';
import { usePlaylistSort } from './hooks/usePlaylistSort';
import { PlaylistsProvider } from './PlaylistsContext';

type PlaylistsContentProps = {
  folder: PlaylistFolder | undefined;
  entries: PlaylistIndexNode[];
  searchablePlaylists: PlaylistIndexEntry[];
};

const PlaylistsContent: FC<PlaylistsContentProps> = ({
  folder,
  entries,
  searchablePlaylists,
}) => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const moveEntry = usePlaylistStore((state) => state.moveEntry);
  const movePlaylistToFolder = usePlaylistStore(
    (state) => state.movePlaylistToFolder,
  );
  const { filter, setFilter, filteredEntries, hasFilter } = usePlaylistFilter(
    entries,
    searchablePlaylists,
  );
  const {
    sortBy,
    setSortBy,
    sortDirection,
    toggleSortDirection,
    sortedEntries,
  } = usePlaylistSort(filteredEntries);
  const hasEntries = !isEmpty(entries);
  const hasResults = !isEmpty(filteredEntries);

  const openFolder = (folderId: string) =>
    navigate({ to: '/playlists', search: { folder: folderId } });

  const showAllPlaylists = () => navigate({ to: '/playlists' });

  return (
    <ViewShell data-testid="playlists-view" title={folder?.name ?? t('title')}>
      <PlaylistsToolbar
        isInFolder={Boolean(folder)}
        onBack={showAllPlaylists}
        filter={filter}
        onFilterChange={setFilter}
        hasEntries={hasEntries}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onToggleSortDirection={toggleSortDirection}
      />

      {!hasEntries && !folder && (
        <EmptyState
          icon={<ListMusic size={48} />}
          title={t('empty')}
          description={t('emptyDescription')}
          className="flex-1"
        />
      )}

      {!hasEntries && folder && (
        <EmptyState
          icon={<FolderOpen size={48} />}
          title={t('folders.empty')}
          description={t('folders.emptyDescription')}
          className="flex-1"
        />
      )}

      {hasEntries && hasFilter && !hasResults && (
        <EmptyState
          icon={<SearchX size={48} />}
          title={t('filterNoResults')}
          description={t('filterNoResultsDescription')}
          className="flex-1"
          data-testid="filter-empty-state"
        />
      )}

      {hasEntries && hasResults && (
        <ScrollableArea className="flex-1 overflow-hidden">
          <PlaylistCardGrid
            entries={sortedEntries}
            onPlaylistClick={(id) =>
              navigate({
                to: '/playlists/$playlistId',
                params: { playlistId: id },
              })
            }
            onFolderClick={openFolder}
            onReorder={(fromIndex, toIndex) =>
              moveEntry(fromIndex, toIndex, folder?.id)
            }
            onMoveIntoFolder={movePlaylistToFolder}
            isReorderable={sortBy === 'custom' && !hasFilter}
          />
        </ScrollableArea>
      )}

      <CreatePlaylistDialog />
    </ViewShell>
  );
};

export const Playlists: FC = () => {
  const { folder, entries, searchablePlaylists } = usePlaylistLevel();

  return (
    <PlaylistsProvider folderId={folder?.id}>
      <PlaylistsContent
        key={folder?.id}
        folder={folder}
        entries={entries}
        searchablePlaylists={searchablePlaylists}
      />
    </PlaylistsProvider>
  );
};
