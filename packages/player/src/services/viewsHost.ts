import type { NuclearPluginAPI, ViewsHost } from '@nuclearplayer/plugin-sdk';

import { useCustomViewsStore } from '../stores/customViewsStore';
import { navigationHost } from './navigationHost';

export const customViewPath = (pluginId: string, viewId: string) =>
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
    useCustomViewsStore.getState().register({ pluginId, view, api: getApi() });
  },
  unregister(id) {
    const wasOpen = isOpen(customViewPath(pluginId, id));
    useCustomViewsStore.getState().unregister(pluginId, id);
    if (wasOpen) {
      void navigationHost.navigate('/dashboard');
    }
  },
});
