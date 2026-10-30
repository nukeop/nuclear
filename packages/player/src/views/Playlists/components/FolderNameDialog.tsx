import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog, Input } from '@nuclearplayer/ui';

type FolderNameDialogProps = {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  initialName?: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export const FolderNameDialog: FC<FolderNameDialogProps> = ({
  isOpen,
  title,
  submitLabel,
  initialName = '',
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('playlists');
  const [name, setName] = useState(initialName);

  const handleClose = () => {
    onClose();
    setName(initialName);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
    setName(initialName);
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={handleClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <div className="mt-4">
          <Input
            label={t('name')}
            placeholder={t('folders.namePlaceholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-testid="folder-name-input"
            autoFocus
          />
        </div>
        <Dialog.Actions>
          <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
          <Button type="submit">{submitLabel}</Button>
        </Dialog.Actions>
      </form>
    </Dialog.Root>
  );
};
