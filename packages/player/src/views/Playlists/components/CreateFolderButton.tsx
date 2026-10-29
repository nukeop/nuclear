import { FolderPlus } from 'lucide-react';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../../stores/playlistStore';
import { FolderNameDialog } from './FolderNameDialog';

export const CreateFolderButton: FC = () => {
  const { t } = useTranslation('playlists');
  const createFolder = usePlaylistStore((state) => state.createFolder);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (name: string) => {
    setIsDialogOpen(false);
    await createFolder(name);
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        data-testid="create-folder-button"
      >
        <FolderPlus size={16} />
        {t('folders.create')}
      </Button>
      <FolderNameDialog
        isOpen={isDialogOpen}
        title={t('folders.createTitle')}
        submitLabel={t('create')}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
};
