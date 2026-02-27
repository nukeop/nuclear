import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog, Input } from '@nuclearplayer/ui';

import { useImportFromUrlContext } from '../PlaylistsContext';

export const ImportFromUrlDialog: FC = () => {
  const { t } = useTranslation('playlists');
  const { isUrlDialogOpen, closeUrlDialog, importFromUrl } =
    useImportFromUrlContext();
  const [url, setUrl] = useState('');

  const handleClose = () => {
    closeUrlDialog();
    setUrl('');
  };

  const handleSubmit = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }
    importFromUrl(trimmed);
  };

  return (
    <Dialog.Root isOpen={isUrlDialogOpen} onClose={handleClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <Dialog.Title>{t('importUrlTitle')}</Dialog.Title>
        <div className="mt-4">
          <Input
            placeholder={t('importUrlPlaceholder')}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            data-testid="import-url-input"
            autoFocus
          />
        </div>
        <Dialog.Actions>
          <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
          <Button type="submit" disabled={!url.trim()}>
            {t('importUrl')}
          </Button>
        </Dialog.Actions>
      </form>
    </Dialog.Root>
  );
};
