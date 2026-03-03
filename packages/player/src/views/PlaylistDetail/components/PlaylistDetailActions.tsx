import { useNavigate } from '@tanstack/react-router';
import { ShareIcon, Trash2Icon } from 'lucide-react';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { Button, Dialog, Popover } from '@nuclearplayer/ui';

import { usePlaylistExport } from '../../../hooks/usePlaylistExport';
import { usePlaylistStore } from '../../../stores/playlistStore';
import { PlaylistActions } from '../../Playlists/components/PlaylistActions';

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
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { exportAsJson } = usePlaylistExport(playlistId);

  const handleDelete = async () => {
    await deletePlaylist(playlistId);
    setIsDeleteDialogOpen(false);
    navigate({ to: '/playlists' });
  };

  return (
    <>
      <PlaylistActions
        tracks={tracks}
        menuItems={
          <>
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
          </>
        }
      />
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
