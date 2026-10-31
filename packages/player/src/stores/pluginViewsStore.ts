import omit from 'lodash-es/omit';
import { create } from 'zustand';

import type {
  NuclearPluginAPI,
  PluginViewDefinition,
} from '@nuclearplayer/plugin-sdk';

export type RegisteredPluginView = {
  pluginId: string;
  view: PluginViewDefinition;
  api: NuclearPluginAPI;
};

type PluginViewsState = {
  views: Record<string, RegisteredPluginView>;
  register: (registered: RegisteredPluginView) => void;
  unregister: (pluginId: string, viewId: string) => void;
};

export const pluginViewKey = (pluginId: string, viewId: string) =>
  `${pluginId}/${viewId}`;

export const usePluginViewsStore = create<PluginViewsState>((set) => ({
  views: {},
  register: (registered) =>
    set((state) => ({
      views: {
        ...state.views,
        [pluginViewKey(registered.pluginId, registered.view.id)]: registered,
      },
    })),
  unregister: (pluginId, viewId) =>
    set((state) => ({
      views: omit(state.views, pluginViewKey(pluginId, viewId)),
    })),
}));
