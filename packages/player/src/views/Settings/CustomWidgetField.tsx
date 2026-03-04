import { FC } from 'react';

import type {
  CustomSettingDefinition,
  SettingValue,
} from '@nuclearplayer/plugin-sdk';

import { widgetRegistry } from '../../services/widgetRegistry';
import { usePluginStore } from '../../stores/pluginStore';

type CustomWidgetFieldProps = {
  definition: CustomSettingDefinition;
  value: SettingValue | undefined;
  setValue: (v: SettingValue) => void;
};

export const CustomWidgetField: FC<CustomWidgetFieldProps> = ({
  definition,
  value,
  setValue,
}) => {
  const pluginId = (definition.source as { pluginId: string }).pluginId;
  const Widget = widgetRegistry.get(pluginId, definition.widgetId);
  const pluginApi = usePluginStore((state) => state.plugins[pluginId]?.api);

  if (!Widget) {
    throw new Error(
      `Custom widget "${definition.widgetId}" not found for plugin "${pluginId}"`,
    );
  }

  return (
    <Widget
      value={value}
      setValue={setValue}
      definition={definition}
      api={pluginApi}
    />
  );
};
