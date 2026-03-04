import { FC } from 'react';

import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';
import { SectionShell } from '@nuclearplayer/ui';

import { SettingFieldWithHost } from './SettingFieldWithHost';

type SettingsSectionProps = {
  title: string;
  settings: SettingDefinition[];
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
