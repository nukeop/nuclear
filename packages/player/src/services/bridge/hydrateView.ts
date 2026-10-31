import type {
  PluginViewComponent,
  PluginViewDefinition,
} from '@nuclearplayer/plugin-sdk';

import { getEsbuild } from '../plugins/pluginCompiler';
import { evaluateModule } from '../plugins/PluginLoader';

export type RawViewRoute = {
  path: string;
  export?: string;
};

export type RawViewDefinition = {
  id: string;
  title: string;
  icon: string;
  source: string;
  routes: RawViewRoute[];
};

export const hydrateView = async (
  rawView: RawViewDefinition,
): Promise<PluginViewDefinition> => {
  const esbuild = await getEsbuild();
  const { code } = await esbuild.transform(rawView.source, {
    loader: 'tsx',
    format: 'cjs',
    jsx: 'automatic',
  });
  const moduleExports = evaluateModule(code) as Record<
    string,
    PluginViewComponent
  >;

  return {
    id: rawView.id,
    title: rawView.title,
    icon: rawView.icon,
    routes: rawView.routes.map((route) => ({
      path: route.path,
      component: moduleExports[route.export ?? 'default'],
    })),
  };
};
