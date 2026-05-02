import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { PluginItem, Toggle } from '@nuclearplayer/ui';

import { PluginIconComponent } from '../../components/PluginIcon';
import { PluginState, usePluginStore } from '../../stores/pluginStore';
import { useStartupStore } from '../../stores/startupStore';

type ConnectedPluginItemProps = {
  plugin: PluginState;
};

export const ConnectedPluginItem: FC<ConnectedPluginItemProps> = ({
  plugin,
}) => {
  const { t } = useTranslation('plugins');
  const store = usePluginStore();
  const startupStore = useStartupStore();

  const handleReload = async () => {
    if (plugin.installationMethod === 'dev') {
      await store.reloadPlugin(plugin.metadata.id);
    }
  };

  const handleRemove = async () => {
    await store.removePlugin(plugin.metadata.id);
  };

  const handleToggle = (checked: boolean) =>
    checked
      ? store.enablePlugin(plugin.metadata.id)
      : store.disablePlugin(plugin.metadata.id);

  return (
    <PluginItem
      icon={<PluginIconComponent icon={plugin.metadata.icon} />}
      name={plugin.metadata.displayName}
      author={plugin.metadata.author}
      description={plugin.metadata.description}
      disabled={!plugin.enabled}
      warning={plugin.warning}
      warningText={plugin.warnings.length > 0 ? plugin.warnings[0] : undefined}
      isLoading={plugin.isLoading}
      onReload={handleReload}
      onRemove={handleRemove}
      rightAccessory={
        <Toggle
          data-testid={`toggle-enable-plugin-${plugin.metadata.id}`}
          data-enabled={plugin.enabled}
          checked={plugin.enabled}
          onChange={handleToggle}
          aria-label={`Toggle ${plugin.metadata.displayName}`}
        />
      }
      loadTimeMs={startupStore.pluginDurations[plugin.metadata.id]}
      labels={{
        by: t('installed.by'),
        updateAvailable: t('installed.update-available'),
      }}
    />
  );
};
