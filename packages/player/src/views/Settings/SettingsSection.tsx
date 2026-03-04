import { FC, useMemo } from 'react';

import {
  useSetting,
  type SettingDefinition,
  type SettingsHost,
} from '@nuclearplayer/plugin-sdk';
import { SectionShell } from '@nuclearplayer/ui';

import {
  coreSettingsHost,
  createPluginSettingsHost,
} from '../../services/settingsHost';
import { SettingField } from './SettingField';

type SettingsSectionProps = {
  title: string;
  settings: SettingDefinition[];
};

const useSettingsHost = (definition: SettingDefinition): SettingsHost => {
  const source = definition.source;
  return useMemo(() => {
    if (source?.type === 'plugin') {
      return createPluginSettingsHost(source.pluginId, source.pluginName);
    }
    return coreSettingsHost;
  }, [source?.type, source?.type === 'plugin' ? source.pluginId : undefined]);
};

const SettingFieldWithHost: FC<{ definition: SettingDefinition }> = ({
  definition,
}) => {
  const host = useSettingsHost(definition);
  const [value, setValue] = useSetting(host, definition.id);
  return (
    <SettingField definition={definition} value={value} setValue={setValue} />
  );
};

export const SettingsSection: FC<SettingsSectionProps> = ({
  title,
  settings,
}) => (
  <SectionShell title={title}>
    <div className="flex flex-col gap-6">
      {settings.map((definition) => (
        <SettingFieldWithHost key={definition.id} definition={definition} />
      ))}
    </div>
  </SectionShell>
);
