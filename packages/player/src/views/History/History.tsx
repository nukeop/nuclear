import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

export const History: FC = () => {
  const { t } = useTranslation('history');

  return <ViewShell data-testid="history-view" title={t('title')} />;
};
