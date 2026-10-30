import { FolderIcon } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistFolder } from '@nuclearplayer/model';
import { Button, Dialog } from '@nuclearplayer/ui';

type MoveToFolderDialogProps = {
  isOpen: boolean;
  folders: PlaylistFolder[];
  onClose: () => void;
  onSelect: (folderId: string) => void;
};

export const MoveToFolderDialog: FC<MoveToFolderDialogProps> = ({
  isOpen,
  folders,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose}>
      <Dialog.Title>{t('folders.moveTo')}</Dialog.Title>
      <div className="mt-4 flex flex-col gap-2">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            className="justify-start"
            onClick={() => onSelect(folder.id)}
          >
            <FolderIcon size={16} />
            {folder.name}
          </Button>
        ))}
      </div>
      <Dialog.Actions>
        <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
      </Dialog.Actions>
    </Dialog.Root>
  );
};
