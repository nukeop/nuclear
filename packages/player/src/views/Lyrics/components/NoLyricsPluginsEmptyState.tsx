import { BlocksIcon } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, EmptyState } from '@nuclearplayer/ui';

import { useSettingsModalStore } from '../../../stores/settingsModalStore';

export const NoLyricsPluginsEmptyState: FC = () => {
  const { t } = useTranslation('lyrics');
  const openPluginStore = useSettingsModalStore(
    (state) => state.openPluginStore,
  );

  return (
    <EmptyState
      data-testid="lyrics-empty-state"
      icon={<BlocksIcon size={48} />}
      title={t('noPlugins')}
      description={t('noPluginsDescription')}
      className="flex-1"
      action={
        <Button
          data-testid="lyrics-empty-state-action"
          onClick={openPluginStore}
        >
          {t('browsePlugins')}
        </Button>
      }
    />
  );
};
