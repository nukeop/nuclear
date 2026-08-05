import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Select } from '@nuclearplayer/ui';

import type { PlaylistSortBy, SortDirection } from '../hooks/usePlaylistSort';

type PlaylistSortSelectProps = {
  sortBy: PlaylistSortBy;
  onSortByChange: (sortBy: PlaylistSortBy) => void;
  sortDirection: SortDirection;
  onToggleSortDirection: () => void;
};

export const PlaylistSortSelect: FC<PlaylistSortSelectProps> = ({
  sortBy,
  onSortByChange,
  sortDirection,
  onToggleSortDirection,
}) => {
  const { t } = useTranslation('playlists');

  const options = [
    { id: 'name', label: t('sortBy.name') },
    { id: 'dateAdded', label: t('sortBy.dateAdded') },
    { id: 'dateModified', label: t('sortBy.dateModified') },
    { id: 'trackCount', label: t('sortBy.trackCount') },
    { id: 'duration', label: t('sortBy.duration') },
  ];

  return (
    <div className="border-border inline-flex items-stretch overflow-hidden rounded-md border-(length:--border-width)">
      <div className="w-48" data-testid="sort-playlists">
        <Select
          className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          options={options}
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as PlaylistSortBy)}
        />
      </div>
      <Button
        variant="noShadow"
        size="flexible"
        onClick={onToggleSortDirection}
        data-testid="sort-direction-button"
        className="border-border justify-center rounded-none border-0 border-l-(length:--border-width) px-3"
      >
        {sortDirection === 'asc' && (
          <ArrowUpNarrowWide size={16} absoluteStrokeWidth />
        )}
        {sortDirection === 'desc' && (
          <ArrowDownWideNarrow size={16} absoluteStrokeWidth />
        )}
      </Button>
    </div>
  );
};
