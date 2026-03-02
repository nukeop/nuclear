import { useNavigate } from '@tanstack/react-router';
import {
  EllipsisVerticalIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { Button, Dialog, Popover } from '@nuclearplayer/ui';

import { usePlaylistExport } from '../../../hooks/usePlaylistExport';
import { useQueueActions } from '../../../hooks/useQueueActions';
import { usePlaylistStore } from '../../../stores/playlistStore';
import { useSoundStore } from '../../../stores/soundStore';

type PlaylistDetailActionsProps = {
  playlistId: string;
  tracks: Track[];
};

export const PlaylistDetailActions: FC<PlaylistDetailActionsProps> = ({
  playlistId,
  tracks,
}) => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const { addToQueue, clearQueue } = useQueueActions();
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { exportAsJson } = usePlaylistExport(playlistId);

  const handlePlayAll = () => {
    clearQueue();
    addToQueue(tracks);
    useSoundStore.getState().play();
  };

  const handleAddToQueue = () => {
    addToQueue(tracks);
  };

  const handleDelete = async () => {
    await deletePlaylist(playlistId);
    setIsDeleteDialogOpen(false);
    navigate({ to: '/playlists' });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={handlePlayAll}
          data-testid="play-all-button"
        >
          <PlayIcon size={16} />
          {t('play')}
        </Button>
        <Popover
          className="relative"
          panelClassName="bg-background px-0 py-0"
          trigger={
            <Button
              variant="secondary"
              size="icon"
              data-testid="playlist-actions-button"
            >
              <EllipsisVerticalIcon size={16} />
            </Button>
          }
          anchor="bottom start"
        >
          <Popover.Menu>
            <Popover.Item
              icon={<PlusIcon size={16} />}
              onClick={handleAddToQueue}
              data-testid="add-to-queue-action"
            >
              {t('addToQueue')}
            </Popover.Item>
            <Popover.Item
              icon={<ShareIcon size={16} />}
              onClick={exportAsJson}
              data-testid="export-json-action"
            >
              {t('exportJson')}
            </Popover.Item>
            <Popover.Item
              intent="danger"
              icon={<Trash2Icon size={16} />}
              onClick={() => setIsDeleteDialogOpen(true)}
              data-testid="delete-playlist-action"
            >
              {t('delete')}
            </Popover.Item>
          </Popover.Menu>
        </Popover>
      </div>
      <Dialog.Root
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <Dialog.Title>{t('delete')}</Dialog.Title>
        <Dialog.Description>{t('deleteConfirm')}</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
          <Button intent="danger" onClick={handleDelete}>
            {t('common:actions.delete')}
          </Button>
        </Dialog.Actions>
      </Dialog.Root>
    </>
  );
};
