import { FC } from 'react';

import { SettingsPanel } from '@nuclearplayer/ui';

import { useSettingsModalStore } from '../stores/settingsModalStore';
import { SocialLinks } from './SocialLinks';
import { useSettingsNavigation } from './useSettingsNavigation';
import { VersionString } from './VersionString';

export const ConnectedSettingsModal: FC = () => {
  const { isOpen, close } = useSettingsModalStore();
  const { sections, content } = useSettingsNavigation();

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={close}
      sections={sections}
      navigationFooter={
        <div className="flex flex-col items-center gap-2">
          <SocialLinks />
          <VersionString />
        </div>
      }
    >
      {content}
    </SettingsPanel>
  );
};
