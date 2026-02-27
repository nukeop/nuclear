import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog, Input } from '@nuclearplayer/ui';

import { useCreatePlaylistContext } from '../PlaylistsContext';

export const CreatePlaylistDialog: FC = () => {
  const { t } = useTranslation('playlists');
  const { isCreateDialogOpen, closeCreateDialog, createPlaylist } =
    useCreatePlaylistContext();
  const [name, setName] = useState('');

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    createPlaylist(trimmed);
    setName('');
  };

  const handleClose = () => {
    closeCreateDialog();
    setName('');
  };

  return (
    <Dialog.Root isOpen={isCreateDialogOpen} onClose={handleClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleCreate();
        }}
      >
        <Dialog.Title>{t('createNew')}</Dialog.Title>
        <div className="mt-4">
          <Input
            label={t('name')}
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="playlist-name-input"
            autoFocus
          />
        </div>
        <Dialog.Actions>
          <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
          <Button type="submit">{t('create')}</Button>
        </Dialog.Actions>
      </form>
    </Dialog.Root>
  );
};
