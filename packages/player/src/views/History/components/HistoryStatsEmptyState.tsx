import { ChartColumn } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState } from '@nuclearplayer/ui';

export const HistoryStatsEmptyState: FC = () => {
  const { t } = useTranslation('history');

  return (
    <EmptyState
      data-testid="history-stats-empty"
      icon={<ChartColumn size={48} />}
      title={t('stats.empty')}
      description={t('stats.emptyDescription')}
      className="flex-1"
    />
  );
};
