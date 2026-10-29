import { PlusIcon, ShareIcon, Trash2Icon } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Popover } from '@nuclearplayer/ui';

import { usePlaylistExport } from '../../../hooks/usePlaylistExport';

type PlaylistCardMenuItemsProps = {
  playlistId: string;
  onAddToQueue: () => void;
  onDelete: () => void;
};

export const PlaylistCardMenuItems: FC<PlaylistCardMenuItemsProps> = ({
  playlistId,
  onAddToQueue,
  onDelete,
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
