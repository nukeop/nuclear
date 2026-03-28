import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { registerBuiltInCoreSettings } from './services/coreSettings';
import { initializeFavoritesStore } from './stores/favoritesStore';
import { initializePlaylistStore } from './stores/playlistStore';
import { initializeQueueStore } from './stores/queueStore';
import { initializeSettingsStore } from './stores/settingsStore';
import { initializeShortcutsStore } from './stores/shortcutsStore';

import '@nuclearplayer/tailwind-config';
import '@nuclearplayer/themes';
import '@nuclearplayer/i18n';

import { initLogStream } from './hooks/useLogStream';
import { startAdvancedThemeWatcher } from './services/advancedThemeDirService';
import { applyAdvancedThemeFromSettingsIfAny } from './services/advancedThemeService';
import { initDiscoveryService } from './services/discoveryService';
import {
  applyLanguageFromSettings,
  initLanguageWatcher,
} from './services/languageService';
import type { LogScope } from './services/logger';
import { initMcpHandler } from './services/mcp';
import { hydratePluginsFromRegistry } from './services/plugins/pluginBootstrap';
import { ytdlpEnsureInstalled } from './services/tauri/commands';
import { applyThemeFromSettings } from './services/themeBootstrap';
import { useUpdaterStore } from './stores/updaterStore';
import { reportError } from './utils/logging';

const runBootstrapStep = async (
  scope: LogScope,
  step: () => Promise<unknown> | unknown,
) => {
  try {
    await step();
  } catch (error) {
    reportError(scope, {
      userMessage: 'Application bootstrap step failed',
      error,
    });
  }
};

initLogStream();

const bootstrap = async () => {
  await runBootstrapStep('settings', initializeSettingsStore);
  await runBootstrapStep('settings', initializeShortcutsStore);
  await runBootstrapStep('queue', initializeQueueStore);
  await runBootstrapStep('settings', initializeFavoritesStore);
  await runBootstrapStep('playlists', initializePlaylistStore);
  await runBootstrapStep('settings', registerBuiltInCoreSettings);
  await runBootstrapStep('discovery', initDiscoveryService);
  await runBootstrapStep('mcp', initMcpHandler);
  await runBootstrapStep('settings', applyLanguageFromSettings);
  await runBootstrapStep('settings', initLanguageWatcher);
  await runBootstrapStep('themes', startAdvancedThemeWatcher);
  await runBootstrapStep('themes', applyThemeFromSettings);
  await runBootstrapStep('themes', applyAdvancedThemeFromSettingsIfAny);

  void hydratePluginsFromRegistry();
  void useUpdaterStore.getState().checkForUpdate();
  void ytdlpEnsureInstalled();
};

void bootstrap();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
