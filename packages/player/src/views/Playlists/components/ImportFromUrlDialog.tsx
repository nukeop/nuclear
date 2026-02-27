import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Dialog } from '@nuclearplayer/ui';

import { useImportFromUrlContext } from '../PlaylistsContext';

export const ImportFromUrlDialog: FC = () => {
  const { t } = useTranslation('playlists');
  const { isUrlDialogOpen, closeUrlDialog } = useImportFromUrlContext();

  return (
    <Dialog.Root isOpen={isUrlDialogOpen} onClose={closeUrlDialog}>
      <Dialog.Title>{t('importUrlTitle')}</Dialog.Title>
    </Dialog.Root>
  );
};
