import { open } from '@tauri-apps/plugin-dialog';
import isString from 'lodash-es/isString';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, ScrollableArea } from '@nuclearplayer/ui';

import { PluginState, usePluginStore } from '../../stores/pluginStore';
import { ConnectedPluginItem } from './ConnectedPluginItem';
import { InstalledPluginsEmptyState } from './InstalledPluginsEmptyState';

type InstalledPluginsProps = {
  onGoToStore: () => void;
};

const InstalledPluginsContent: FC<{
  plugins: PluginState[];
  onGoToStore: () => void;
}> = ({ plugins, onGoToStore }) => {
  if (plugins.length === 0) {
    return <InstalledPluginsEmptyState onGoToStore={onGoToStore} />;
  }

  return (
    <ScrollableArea className="flex-1 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-visible px-2 py-2">
        {plugins.map((plugin) => (
          <ConnectedPluginItem key={plugin.metadata.id} plugin={plugin} />
        ))}
      </div>
    </ScrollableArea>
  );
};

export const InstalledPlugins: FC<InstalledPluginsProps> = ({
  onGoToStore,
}) => {
  const { t } = useTranslation('plugins');
  const store = usePluginStore();
  const plugins = store.getAllPlugins();

  const handleAdd = async () => {
    const path = await open({ directory: true, multiple: false });
    if (isString(path)) {
      await store.loadPluginFromPath(path);
    }
  };

  return (
    <div className="relative flex w-full flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center">
        <Button onClick={handleAdd} size="sm">
          {t('addPlugin')}
        </Button>
      </div>
      <InstalledPluginsContent plugins={plugins} onGoToStore={onGoToStore} />
    </div>
  );
};
