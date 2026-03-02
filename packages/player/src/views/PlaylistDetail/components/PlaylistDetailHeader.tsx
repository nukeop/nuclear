import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Playlist, Track } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import { Badge, EditableText, Tooltip } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../../stores/playlistStore';
import { PlaylistDetailActions } from './PlaylistDetailActions';

type PlaylistDetailHeaderProps = {
  playlist: Playlist;
  playlistId: string;
  tracks: Track[];
};

const getCoverUrl = (playlist: Playlist): string | undefined => {
  const playlistCover = pickArtwork(playlist.artwork, 'cover', 600);
  if (playlistCover) {
    return playlistCover.url;
  }

  const firstTrackArt = playlist.items[0]?.track.artwork;
  return pickArtwork(firstTrackArt, 'cover', 600)?.url;
};

export const PlaylistDetailHeader: FC<PlaylistDetailHeaderProps> = ({
  playlist,
  playlistId,
  tracks,
}) => {
  const { t } = useTranslation('playlists');
  const updatePlaylist = usePlaylistStore((state) => state.updatePlaylist);

  const coverUrl = getCoverUrl(playlist);

  return (
    <div className="border-border bg-primary shadow-shadow relative flex flex-col gap-6 rounded-md border-2 p-6 md:flex-row">
      {playlist.isReadOnly && playlist.origin && (
        <div className="absolute top-4 right-4 z-10">
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
      {coverUrl && (
        <img
          src={coverUrl}
          alt={playlist.name}
          data-testid="playlist-artwork"
          className="border-border shadow-shadow h-60 w-60 rounded-md border-2 object-cover select-none"
        />
      )}

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <EditableText
            value={playlist.name}
            onSave={(newName) => updatePlaylist(playlist.id, { name: newName })}
            disabled={playlist.isReadOnly}
            textClassName="font-heading text-5xl font-extrabold tracking-tight"
            data-testid="playlist-detail-title"
          />
          <EditableText
            value={playlist.description ?? ''}
            variant="textarea"
            onSave={(newDescription) =>
              updatePlaylist(playlist.id, {
                description: newDescription || undefined,
              })
            }
            disabled={playlist.isReadOnly}
            textClassName="text-text-secondary text-lg"
            placeholder={t('descriptionPlaceholder')}
            data-testid="playlist-detail-description"
          />
        </div>

        <PlaylistDetailActions playlistId={playlistId} tracks={tracks} />
      </div>
    </div>
  );
};
