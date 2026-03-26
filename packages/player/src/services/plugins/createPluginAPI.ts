import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

import { dashboardHost } from '../../services/dashboardHost';
import { discoveryHost } from '../../services/discoveryHost';
import { eventBus } from '../../services/eventBus';
import { favoritesHost } from '../../services/favoritesHost';
import { httpHost } from '../../services/httpHost';
import { createLoggerHost } from '../../services/loggerHost';
import { metadataHost } from '../../services/metadataHost';
import { playbackHost } from '../../services/playbackHost';
import { playlistsHost } from '../../services/playlistsHost';
import { providersHost } from '../../services/providersHost';
import { queueHost } from '../../services/queueHost';
import { createPluginSettingsHost } from '../../services/settingsHost';
import { shellHost } from '../../services/shellHost';
import { streamingHost } from '../../services/streamingHost';
import { widgetRegistry } from '../../services/widgetRegistry';
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
    playbackHost,
    playlistsHost,
    dashboardHost,
    discoveryHost,
    eventsHost: eventBus,
    shellHost,
    widgetRegistry,
    pluginId,
    loggerHost: createLoggerHost(pluginId),
  });
};
