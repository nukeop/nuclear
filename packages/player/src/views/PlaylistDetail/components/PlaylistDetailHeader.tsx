import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Playlist } from '@nuclearplayer/model';
import { Badge, Tooltip } from '@nuclearplayer/ui';

type PlaylistDetailHeaderProps = {
  playlist: Playlist;
};

export const PlaylistDetailHeader: FC<PlaylistDetailHeaderProps> = ({
  playlist,
}) => {
  const { t } = useTranslation('playlists');

  const artworkUrl = playlist.artwork?.items[0]?.url;

  return (
    <div className="relative">
      {artworkUrl && (
        <img
          src={artworkUrl}
          alt=""
          data-testid="playlist-artwork"
          className="size-24 rounded-lg object-cover"
        />
      )}
      <span data-testid="playlist-detail-title">{playlist.name}</span>
      <div className="mb-4 flex items-center gap-3">
        <span
          data-testid="playlist-detail-track-count"
          className="text-foreground-secondary text-sm"
        >
          {t('trackCount', { count: playlist.items.length })}
        </span>
      </div>
      {playlist.isReadOnly && playlist.origin && (
        <div className="absolute top-0 right-0">
          <Tooltip
            content={t('readOnlyTooltip', { source: playlist.origin.provider })}
            side="bottom"
          >
            <Badge variant="pill" color="cyan" data-testid="read-only-badge">
              {t('readOnlyBadge', { source: playlist.origin.provider })}
            </Badge>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
