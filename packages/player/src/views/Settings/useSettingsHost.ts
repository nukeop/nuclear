import { useMemo } from 'react';

import {
  type SettingDefinition,
  type SettingsHost,
} from '@nuclearplayer/plugin-sdk';

import {
  coreSettingsHost,
  createPluginSettingsHost,
} from '../../services/settingsHost';

export const useSettingsHost = (
  definition: SettingDefinition,
): SettingsHost => {
  const source = definition.source;
  return useMemo(() => {
    if (source?.type === 'plugin') {
      return createPluginSettingsHost(source.pluginId, source.pluginName);
    }
    return coreSettingsHost;
  }, [source?.type, source?.type === 'plugin' ? source.pluginId : undefined]);
};
