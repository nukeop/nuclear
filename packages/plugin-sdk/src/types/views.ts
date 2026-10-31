import type { FC } from 'react';

import type { NuclearPluginAPI } from '../api';

export type PluginViewRoute = {
  path: string;
  component: PluginViewComponent;
};

export type PluginViewDefinition = {
  id: string;
  title: string;
  icon: string;
  routes: PluginViewRoute[];
};

export type PluginViewProps = {
  params: Record<string, string>;
  api: NuclearPluginAPI;
};

export type PluginViewComponent = FC<PluginViewProps>;

export type ViewsHost = {
  register(view: PluginViewDefinition): void;
  unregister(id: string): void;
};
