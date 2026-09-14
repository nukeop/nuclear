import { useMemo, useRef } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { SettingsSection } from './SettingsSection';
import { useSettingsGroups } from './useSettingsGroups';
import { useSettingsScrollSpy } from './useSettingsScrollSpy';

export const Settings = () => {
  const { t } = useTranslation('preferences');
  const groups = useSettingsGroups();
  const categories = useMemo(() => groups.map((group) => group.name), [groups]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { registerSection } = useSettingsScrollSpy({
    categories,
    viewportRef,
  });

  return (
    <ViewShell title={t('general.title')}>
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <ScrollableArea
          className="max-w-[696px] min-w-[300px] flex-1 overflow-hidden"
          viewportRef={viewportRef}
        >
          <div className="px-2">
            {groups.map((group) => (
              <div
                key={group.name}
                data-testid={`settings-section-${group.name}`}
                ref={registerSection(group.name)}
              >
                <SettingsSection
                  title={t(`${group.name}.title`, group.name)}
                  settings={group.settings}
                />
              </div>
            ))}
          </div>
        </ScrollableArea>
      </div>
    </ViewShell>
  );
};
