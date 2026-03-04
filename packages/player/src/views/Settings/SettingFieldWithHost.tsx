import { FC } from 'react';

import { useSetting, type SettingDefinition } from '@nuclearplayer/plugin-sdk';

import { SettingField } from './SettingField';
import { useSettingsHost } from './useSettingsHost';

export const SettingFieldWithHost: FC<{ definition: SettingDefinition }> = ({
  definition,
}) => {
  const host = useSettingsHost(definition);
  const [value, setValue] = useSetting(host, definition.id);
  return (
    <SettingField definition={definition} value={value} setValue={setValue} />
  );
};
