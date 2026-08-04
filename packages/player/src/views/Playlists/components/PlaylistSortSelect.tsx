import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Select } from '@nuclearplayer/ui';

import type { PlaylistSortBy } from '../hooks/usePlaylistSort';

type PlaylistSortSelectProps = {
  sortBy: PlaylistSortBy;
  onSortByChange: (sortBy: PlaylistSortBy) => void;
};

export const PlaylistSortSelect: FC<PlaylistSortSelectProps> = ({
  sortBy,
  onSortByChange,
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
    <div className="w-44" data-testid="sort-playlists">
      <Select
        options={options}
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as PlaylistSortBy)}
      />
    </div>
  );
};
