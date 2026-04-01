import { useLayoutStore } from '../stores/layoutStore';
import { usePluginStore } from '../stores/pluginStore';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import { useThemeStore } from '../stores/themeStore';
import { registerZustandStore } from './zustandRegistry';

export const registerZustandStores = (): void => {
  registerZustandStore({
    name: 'Queue',
    getState: useQueueStore.getState,
    subscribe: useQueueStore.subscribe,
  });

  registerZustandStore({
    name: 'Settings',
    getState: useSettingsStore.getState,
    subscribe: useSettingsStore.subscribe,
  });

  registerZustandStore({
    name: 'Sound',
    getState: useSoundStore.getState,
    subscribe: useSoundStore.subscribe,
  });

  registerZustandStore({
    name: 'Plugins',
    getState: usePluginStore.getState,
    subscribe: usePluginStore.subscribe,
  });

  registerZustandStore({
    name: 'Layout',
    getState: useLayoutStore.getState,
    subscribe: useLayoutStore.subscribe,
  });

  registerZustandStore({
    name: 'Themes',
    getState: useThemeStore.getState,
    subscribe: useThemeStore.subscribe,
  });

  registerZustandStore({
    name: 'Startup',
    getState: useStartupStore.getState,
    subscribe: useStartupStore.subscribe,
  });
};
