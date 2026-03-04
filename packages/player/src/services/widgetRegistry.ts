import type {
  CustomWidgetComponent,
  WidgetRegistry,
} from '@nuclearplayer/plugin-sdk';

const toKey = (pluginId: string, widgetId: string) =>
  `plugin.${pluginId}.${widgetId}`;

export const createWidgetRegistry = (): WidgetRegistry => {
  const widgets = new Map<string, CustomWidgetComponent>();

  return {
    register(
      pluginId: string,
      widgetId: string,
      component: CustomWidgetComponent,
    ) {
      widgets.set(toKey(pluginId, widgetId), component);
    },

    unregister(pluginId: string, widgetId: string) {
      widgets.delete(toKey(pluginId, widgetId));
    },

    get(pluginId: string, widgetId: string): CustomWidgetComponent | undefined {
      return widgets.get(toKey(pluginId, widgetId));
    },
  };
};

export const widgetRegistry = createWidgetRegistry();
