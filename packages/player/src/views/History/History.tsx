import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

export const History: FC = () => {
  const { t } = useTranslation('history');

  return (
    <ViewShell data-testid="history-view" title={t('title')}>
      <div className="flex w-full flex-1 flex-col gap-6 pb-6">
        <div className="flex flex-1 flex-col gap-6" />
        <footer className="flex items-center justify-between" />
      </div>
    </ViewShell>
  );
};
