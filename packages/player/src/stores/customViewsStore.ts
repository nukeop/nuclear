import omit from 'lodash-es/omit';
import { create } from 'zustand';

import type {
  CustomViewDefinition,
  NuclearPluginAPI,
} from '@nuclearplayer/plugin-sdk';

export type RegisteredCustomView = {
  pluginId: string;
  view: CustomViewDefinition;
  api: NuclearPluginAPI;
};

type CustomViewsState = {
  views: Record<string, RegisteredCustomView>;
  register: (registered: RegisteredCustomView) => void;
  unregister: (pluginId: string, viewId: string) => void;
};

export const customViewKey = (pluginId: string, viewId: string) =>
  `${pluginId}/${viewId}`;

export const useCustomViewsStore = create<CustomViewsState>((set) => ({
  views: {},
  register: (registered) =>
    set((state) => ({
      views: {
        ...state.views,
        [customViewKey(registered.pluginId, registered.view.id)]: registered,
      },
    })),
  unregister: (pluginId, viewId) =>
    set((state) => ({
      views: omit(state.views, customViewKey(pluginId, viewId)),
    })),
}));
