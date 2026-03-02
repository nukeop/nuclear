import { PencilIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Playlist, Track } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import { Badge, Button, Input, Tooltip } from '@nuclearplayer/ui';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editDescription, setEditDescription] = useState(
    playlist.description ?? '',
  );

  const coverUrl = getCoverUrl(playlist);
  const headerButtonClassName = 'bg-white text-black';

  const handleSave = () => {
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();

    if (trimmedName && trimmedName !== playlist.name) {
      updatePlaylist(playlist.id, { name: trimmedName });
    }
    if (trimmedDescription !== (playlist.description ?? '')) {
      updatePlaylist(playlist.id, {
        description: trimmedDescription || undefined,
      });
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description ?? '');
    setIsEditing(false);
  };

  return (
    <div className="border-border bg-primary shadow-shadow relative flex flex-col gap-6 rounded-md border-2 p-6 md:flex-row">
      {!playlist.isReadOnly && !isEditing && (
        <Button
          size="icon-sm"
          className={`absolute top-4 right-4 z-10 ${headerButtonClassName}`}
          onClick={() => setIsEditing(true)}
          data-testid="edit-playlist-button"
        >
          <PencilIcon size={14} />
        </Button>
      )}
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
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Input
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              data-testid="playlist-detail-title-input"
              className="font-heading text-3xl font-extrabold"
            />
            <textarea
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              placeholder={t('descriptionPlaceholder')}
              data-testid="playlist-detail-description-input"
              className="border-border bg-background-input text-foreground placeholder:text-foreground-secondary min-h-[4rem] w-full resize-y rounded-md border-2 px-3 py-2 text-lg focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                data-testid="save-edit-button"
                className={headerButtonClassName}
              >
                {t('common:actions.save')}
              </Button>
              <Button
                onClick={handleCancel}
                data-testid="cancel-edit-button"
                className={headerButtonClassName}
              >
                {t('common:actions.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h1
              className="font-heading text-5xl font-extrabold tracking-tight"
              data-testid="playlist-detail-title"
            >
              {playlist.name}
            </h1>
            {playlist.description && (
              <p
                className="text-text-secondary text-lg"
                data-testid="playlist-detail-description"
              >
                {playlist.description}
              </p>
            )}
          </div>
        )}

        <PlaylistDetailActions playlistId={playlistId} tracks={tracks} />
      </div>
    </div>
  );
};
