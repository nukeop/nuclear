import { FolderIcon } from 'lucide-react';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistFolder } from '@nuclearplayer/model';
import { Card } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../../stores/playlistStore';
import { DeleteFolderDialog } from './DeleteFolderDialog';
import { FolderCardMenuItems } from './FolderCardMenuItems';
import { FolderNameDialog } from './FolderNameDialog';

type FolderCardProps = {
  folder: PlaylistFolder;
  onClick: () => void;
};

type OpenDialog = 'rename' | 'delete' | null;

export const FolderCard: FC<FolderCardProps> = ({ folder, onClick }) => {
  const { t } = useTranslation('playlists');
  const renameFolder = usePlaylistStore((state) => state.renameFolder);
  const deleteFolder = usePlaylistStore((state) => state.deleteFolder);
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const closeDialog = () => setOpenDialog(null);

  const handleRename = async (name: string) => {
    closeDialog();
    await renameFolder(folder.id, name);
  };

  const handleDelete = async () => {
    closeDialog();
    await deleteFolder(folder.id);
  };

  return (
    <div data-testid="folder-card">
      <Card
        image={
          <FolderIcon size={96} absoluteStrokeWidth className="opacity-20" />
        }
        title={folder.name}
        subtitle={t('folders.playlistCount', {
          count: folder.playlists.length,
        })}
        onClick={onClick}
        menuItems={
          <FolderCardMenuItems
            onRename={() => setOpenDialog('rename')}
            onDelete={() => setOpenDialog('delete')}
          />
        }
        labels={{ menu: t('common:actions.moreActions') }}
      />
      <FolderNameDialog
        key={folder.name}
        isOpen={openDialog === 'rename'}
        title={t('folders.rename')}
        submitLabel={t('common:actions.save')}
        initialName={folder.name}
        onClose={closeDialog}
        onSubmit={handleRename}
      />
      <DeleteFolderDialog
        isOpen={openDialog === 'delete'}
        onClose={closeDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
};
