import {
  FolderInputIcon,
  FolderOutputIcon,
  PlusIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Popover } from '@nuclearplayer/ui';

import { usePlaylistExport } from '../../../hooks/usePlaylistExport';

type PlaylistCardMenuItemsProps = {
  playlistId: string;
  onAddToQueue: () => void;
  onDelete: () => void;
  canMoveToFolder: boolean;
  isInFolder: boolean;
  onMoveToFolder: () => void;
  onRemoveFromFolder: () => void;
};

export const PlaylistCardMenuItems: FC<PlaylistCardMenuItemsProps> = ({
  playlistId,
  onAddToQueue,
  onDelete,
  canMoveToFolder,
  isInFolder,
  onMoveToFolder,
  onRemoveFromFolder,
}) => {
  const { t } = useTranslation('playlists');
  const { exportAsJson } = usePlaylistExport(playlistId);

  return (
    <>
      <Popover.Item
        icon={<PlusIcon size={16} />}
        onClick={onAddToQueue}
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
      {canMoveToFolder && (
        <Popover.Item
          icon={<FolderInputIcon size={16} />}
          onClick={onMoveToFolder}
          data-testid="move-to-folder-action"
        >
          {t('folders.moveTo')}
        </Popover.Item>
      )}
      {isInFolder && (
        <Popover.Item
          icon={<FolderOutputIcon size={16} />}
          onClick={onRemoveFromFolder}
          data-testid="remove-from-folder-action"
        >
          {t('folders.removeFrom')}
        </Popover.Item>
      )}
      <Popover.Item
        intent="danger"
        icon={<Trash2Icon size={16} />}
        onClick={onDelete}
        data-testid="delete-playlist-action"
      >
        {t('delete')}
      </Popover.Item>
    </>
  );
};
