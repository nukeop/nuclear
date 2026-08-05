import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { Card, CardGrid } from '@nuclearplayer/ui';

import { PlaylistArtwork } from './PlaylistArtwork';

type PlaylistCardGridProps = {
  playlists: PlaylistIndexEntry[];
  onCardClick: (id: string) => void;
};

export const PlaylistCardGrid: FC<PlaylistCardGridProps> = ({
  playlists,
  onCardClick,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <CardGrid>
      {playlists.map((playlist) => (
        <Card
          key={playlist.id}
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
      ))}
    </CardGrid>
  );
};
