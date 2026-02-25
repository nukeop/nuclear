import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

import { dashboardHost } from '../../services/dashboardHost';
import { favoritesHost } from '../../services/favoritesHost';
import { httpHost } from '../../services/httpHost';
import { createLoggerHost } from '../../services/loggerHost';
import { metadataHost } from '../../services/metadataHost';
import { providersHost } from '../../services/providersHost';
import { queueHost } from '../../services/queueHost';
import { createPluginSettingsHost } from '../../services/settingsHost';
import { streamingHost } from '../../services/streamingHost';
import { ytdlpHost } from '../../services/ytdlpHost';

export const createPluginAPI = (
  pluginId: string,
  displayName: string,
): NuclearPluginAPI => {
  return new NuclearPluginAPI({
    settingsHost: createPluginSettingsHost(pluginId, displayName),
    queueHost,
    providersHost,
    streamingHost,
    metadataHost,
    httpHost,
    ytdlpHost,
    favoritesHost,
    dashboardHost,
    loggerHost: createLoggerHost(pluginId),
  });
};
