import { type FC } from 'react';

import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { CardGrid } from '@nuclearplayer/ui';

import { PlaylistCard } from './PlaylistCard';

type PlaylistCardGridProps = {
  playlists: PlaylistIndexEntry[];
  onCardClick: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isReorderable: boolean;
};

export const PlaylistCardGrid: FC<PlaylistCardGridProps> = ({
  playlists,
  onCardClick,
  onReorder,
  isReorderable,
}) => {
  return (
    <CardGrid.Sortable
      itemIds={playlists.map((playlist) => playlist.id)}
      onReorder={onReorder}
      disabled={!isReorderable}
    >
      {playlists.map((playlist) => (
        <CardGrid.SortableItem key={playlist.id} id={playlist.id}>
          <PlaylistCard
            playlist={playlist}
            onClick={() => onCardClick(playlist.id)}
          />
        </CardGrid.SortableItem>
      ))}
    </CardGrid.Sortable>
  );
};
