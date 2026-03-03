import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { Card, CardGrid } from '@nuclearplayer/ui';

import { PlaylistArtwork } from '../../PlaylistDetail/components/PlaylistArtwork';

type PlaylistCardGridProps = {
  index: PlaylistIndexEntry[];
  onCardClick: (id: string) => void;
};

export const PlaylistCardGrid: FC<PlaylistCardGridProps> = ({
  index,
  onCardClick,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <CardGrid>
      {index.map((entry) => (
        <Card
          key={entry.id}
          image={
            <PlaylistArtwork name={entry.name} thumbnails={entry.thumbnails} />
          }
          title={entry.name}
          subtitle={t('trackCount', { count: entry.itemCount })}
          onClick={() => onCardClick(entry.id)}
        />
      ))}
    </CardGrid>
  );
};
