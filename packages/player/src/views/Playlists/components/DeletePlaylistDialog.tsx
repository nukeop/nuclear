import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog } from '@nuclearplayer/ui';

type DeletePlaylistDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeletePlaylistDialog: FC<DeletePlaylistDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose}>
      <Dialog.Title>{t('delete')}</Dialog.Title>
      <Dialog.Description>{t('deleteConfirm')}</Dialog.Description>
      <Dialog.Actions>
        <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
        <Button intent="danger" onClick={onConfirm}>
          {t('common:actions.delete')}
        </Button>
      </Dialog.Actions>
    </Dialog.Root>
  );
};
