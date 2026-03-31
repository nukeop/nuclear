import { ScrollableArea } from '@nuclearplayer/ui';

import { AdvancedThemeSelect } from './AdvancedThemeSelect';
import { BasicThemes } from './BasicThemes';
import { MarketplaceThemeSelect } from './MarketplaceThemeSelect';

export const MyThemes = () => {
  return (
    <ScrollableArea className="overflow-hidden">
      <BasicThemes />
      <div className="flex gap-4">
        <AdvancedThemeSelect />
        <MarketplaceThemeSelect />
      </div>
    </ScrollableArea>
  );
};
