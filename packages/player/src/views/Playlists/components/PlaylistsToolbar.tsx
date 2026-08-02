import { FilterIcon, Plus } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Input } from '@nuclearplayer/ui';

import { useCreatePlaylistContext } from '../PlaylistsContext';
import { ImportPlaylistMenu } from './ImportPlaylistMenu';

type PlaylistsToolbarProps = {
  filter: string;
  onFilterChange: (value: string) => void;
  isFilterVisible: boolean;
};

export const PlaylistsToolbar: FC<PlaylistsToolbarProps> = ({
  filter,
  onFilterChange,
  isFilterVisible,
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
      {isFilterVisible && (
        <div className="ml-auto inline-flex w-full max-w-sm items-stretch">
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
      )}
    </div>
  );
};
