import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog } from '@nuclearplayer/ui';

type DeleteFolderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteFolderDialog: FC<DeleteFolderDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('playlists');

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose}>
      <Dialog.Title>{t('folders.delete')}</Dialog.Title>
      <Dialog.Description>{t('folders.deleteConfirm')}</Dialog.Description>
      <Dialog.Actions>
        <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
        <Button intent="danger" onClick={onConfirm}>
          {t('common:actions.delete')}
        </Button>
      </Dialog.Actions>
    </Dialog.Root>
  );
};
