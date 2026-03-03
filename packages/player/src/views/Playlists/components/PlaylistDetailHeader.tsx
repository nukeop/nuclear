import { PencilIcon } from 'lucide-react';
import type { FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Playlist } from '@nuclearplayer/model';
import { Badge, Button, cn, Input, Textarea, Tooltip } from '@nuclearplayer/ui';

import { PlaylistArtwork } from './PlaylistArtwork';
import { usePlaylistDetailHeader } from './usePlaylistDetailHeader';

type PlaylistDetailHeaderProps = {
  playlist: Playlist;
  thumbnails?: string[];
  className?: string;
  children?: ReactNode;
};

export const PlaylistDetailHeader: FC<PlaylistDetailHeaderProps> = ({
  playlist,
  thumbnails,
  className,
  children,
}) => {
  const { t } = useTranslation('playlists');
  const {
    isEditing,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    startEditing,
    save,
    cancel,
  } = usePlaylistDetailHeader(playlist);

  return (
    <div
      className={cn(
        'border-border bg-primary shadow-shadow relative flex flex-col gap-6 rounded-md border-2 p-6 md:flex-row',
        className,
      )}
    >
      {!playlist.isReadOnly && !isEditing && (
        <Button
          variant="secondary"
          size="icon-sm"
          className="absolute top-4 right-4 z-10"
          onClick={startEditing}
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
      <div className="border-border shadow-shadow h-60 w-60 shrink-0 overflow-hidden rounded-md border-2 select-none">
        <PlaylistArtwork name={playlist.name} thumbnails={thumbnails} />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Input
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              data-testid="playlist-detail-title-input"
              className="font-heading text-3xl font-extrabold"
            />
            <Textarea
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              placeholder={t('descriptionPlaceholder')}
              data-testid="playlist-detail-description-input"
              className="min-h-[4rem] text-lg"
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={save}
                data-testid="save-edit-button"
              >
                {t('common:actions.save')}
              </Button>
              <Button
                variant="secondary"
                onClick={cancel}
                data-testid="cancel-edit-button"
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

        {children}
      </div>
    </div>
  );
};
