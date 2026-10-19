import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { Card, CardGrid } from '@nuclearplayer/ui';

import { PlaylistArtwork } from './PlaylistArtwork';

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
  const { t } = useTranslation('playlists');

  return (
    <CardGrid.Sortable
      itemIds={playlists.map((playlist) => playlist.id)}
      onReorder={onReorder}
      disabled={!isReorderable}
    >
      {playlists.map((playlist) => (
        <CardGrid.SortableItem key={playlist.id} id={playlist.id}>
          <Card
            image={
              <PlaylistArtwork
                name={playlist.name}
                thumbnails={playlist.thumbnails}
              />
            }
            title={playlist.name}
            subtitle={t('trackCount', { count: playlist.itemCount })}
            onClick={() => onCardClick(playlist.id)}
          />
        </CardGrid.SortableItem>
      ))}
    </CardGrid.Sortable>
  );
};
