import { type FC } from 'react';

import type { PlaylistIndexNode } from '@nuclearplayer/model';
import { CardGrid } from '@nuclearplayer/ui';

import { FolderCard } from './FolderCard';
import { PlaylistCard } from './PlaylistCard';

type PlaylistCardGridProps = {
  entries: PlaylistIndexNode[];
  onPlaylistClick: (id: string) => void;
  onFolderClick: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isReorderable: boolean;
};

export const PlaylistCardGrid: FC<PlaylistCardGridProps> = ({
  entries,
  onPlaylistClick,
  onFolderClick,
  onReorder,
  isReorderable,
}) => (
  <CardGrid.Sortable
    itemIds={entries.map((entry) => entry.id)}
    onReorder={onReorder}
    disabled={!isReorderable}
  >
    {entries.map((entry) => (
      <CardGrid.SortableItem key={entry.id} id={entry.id}>
        {entry.kind === 'folder' && (
          <FolderCard folder={entry} onClick={() => onFolderClick(entry.id)} />
        )}
        {entry.kind === 'playlist' && (
          <PlaylistCard
            playlist={entry}
            onClick={() => onPlaylistClick(entry.id)}
          />
        )}
      </CardGrid.SortableItem>
    ))}
  </CardGrid.Sortable>
);
