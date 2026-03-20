import { Search } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, EmptyState } from '@nuclearplayer/ui';

import { useSettingsModalStore } from '../../stores/settingsModalStore';

export const SearchEmptyState: FC = () => {
  const { t } = useTranslation('search');

  return (
    <EmptyState
      data-testid="search-empty-state"
      icon={<Search size={48} />}
      title={t('empty-state')}
      description={t('empty-state-description')}
      className="flex-1"
      action={
        <Button
          data-testid="search-empty-state-action"
          onClick={() => useSettingsModalStore.getState().open('plugins')}
        >
          {t('empty-state-action')}
        </Button>
      }
    />
  );
};
