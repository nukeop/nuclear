import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Playlist } from '@nuclearplayer/model';
import { Badge } from '@nuclearplayer/ui';

type PlaylistDetailHeaderProps = {
  playlist: Playlist;
};

export const PlaylistDetailHeader: FC<PlaylistDetailHeaderProps> = ({
  playlist,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <>
      <span data-testid="playlist-detail-title">{playlist.name}</span>
      <div className="mb-4 flex items-center gap-3">
        <span
          data-testid="playlist-detail-track-count"
          className="text-foreground-secondary text-sm"
        >
          {t('trackCount', { count: playlist.items.length })}
        </span>
        {playlist.isReadOnly && playlist.origin && (
          <Badge variant="pill" color="cyan" data-testid="read-only-badge">
            {t('readOnlyBadge', { source: playlist.origin.provider })}
          </Badge>
        )}
      </div>
    </>
  );
};
