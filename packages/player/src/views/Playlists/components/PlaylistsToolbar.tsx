import { FilterIcon, Plus } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Input } from '@nuclearplayer/ui';

import type { PlaylistSortBy, SortDirection } from '../hooks/usePlaylistSort';
import { useCreatePlaylistContext } from '../PlaylistsContext';
import { ImportPlaylistMenu } from './ImportPlaylistMenu';
import { PlaylistSortSelect } from './PlaylistSortSelect';

type PlaylistsToolbarProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  hasPlaylists: boolean;
  sortBy: PlaylistSortBy;
  onSortByChange: (sortBy: PlaylistSortBy) => void;
  sortDirection: SortDirection;
  onToggleSortDirection: () => void;
};

export const PlaylistsToolbar: FC<PlaylistsToolbarProps> = ({
  filter,
  onFilterChange,
  hasPlaylists,
  sortBy,
  onSortByChange,
  sortDirection,
  onToggleSortDirection,
}) => {
  const { t } = useTranslation('playlists');
  const { openCreateDialog } = useCreatePlaylistContext();

  return (
    <div className="mb-4 flex items-center gap-2">
      <Button onClick={openCreateDialog} data-testid="create-playlist-button">
        <Plus size={16} />
        {t('create')}
      </Button>
      <ImportPlaylistMenu />
      {hasPlaylists && (
        <div className="ml-auto flex items-center gap-2">
          <PlaylistSortSelect
            sortBy={sortBy}
            onSortByChange={onSortByChange}
            sortDirection={sortDirection}
            onToggleSortDirection={onToggleSortDirection}
          />
          <div className="inline-flex w-full max-w-sm items-stretch">
            <Input
              size="sm"
              value={filter}
              onChange={(event) => onFilterChange(event.target.value)}
              placeholder={t('filterPlaylists')}
              data-testid="filter-playlists-input"
              endAddon={
                <FilterIcon
                  className="h-4 w-4"
                  aria-hidden="true"
                  strokeWidth={3}
                />
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
