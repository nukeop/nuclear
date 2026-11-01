import type { FC } from 'react';

import type { NuclearPluginAPI } from '../api';

export type CustomViewRoute = {
  path: string;
  component: CustomViewComponent;
};

export type CustomViewDefinition = {
  id: string;
  title: string;
  icon: string;
  routes: CustomViewRoute[];
};

export type CustomViewProps = {
  params: Record<string, string>;
  api: NuclearPluginAPI;
};

export type CustomViewComponent = FC<CustomViewProps>;

export type ViewsHost = {
  register(view: CustomViewDefinition): void;
  unregister(id: string): void;
};
