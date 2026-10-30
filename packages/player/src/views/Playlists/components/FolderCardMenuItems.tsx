import { PencilIcon, Trash2Icon } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Popover } from '@nuclearplayer/ui';

type FolderCardMenuItemsProps = {
  onRename: () => void;
  onDelete: () => void;
};

export const FolderCardMenuItems: FC<FolderCardMenuItemsProps> = ({
  onRename,
  onDelete,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <>
      <Popover.Item
        icon={<PencilIcon size={16} />}
        onClick={onRename}
        data-testid="rename-folder-action"
      >
        {t('folders.rename')}
      </Popover.Item>
      <Popover.Item
        intent="danger"
        icon={<Trash2Icon size={16} />}
        onClick={onDelete}
        data-testid="delete-folder-action"
      >
        {t('folders.delete')}
      </Popover.Item>
    </>
  );
};
