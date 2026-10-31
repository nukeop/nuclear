import type { NuclearPluginAPI, ViewsHost } from '@nuclearplayer/plugin-sdk';

import { usePluginViewsStore } from '../stores/pluginViewsStore';
import { navigationHost } from './navigationHost';

export const pluginViewPath = (pluginId: string, viewId: string) =>
  `/plugin/${pluginId}/${viewId}`;

const isOpen = (viewPath: string) => {
  const { pathname } = navigationHost.current();
  return pathname === viewPath || pathname.startsWith(`${viewPath}/`);
};

export const createViewsHost = (
  pluginId: string,
  getApi: () => NuclearPluginAPI,
): ViewsHost => ({
  register(view) {
    usePluginViewsStore.getState().register({ pluginId, view, api: getApi() });
  },
  unregister(id) {
    const wasOpen = isOpen(pluginViewPath(pluginId, id));
    usePluginViewsStore.getState().unregister(pluginId, id);
    if (wasOpen) {
      void navigationHost.navigate('/dashboard');
    }
  },
});
