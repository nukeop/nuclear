import { FC } from 'react';

import { TopBar, TopBarLogo } from '@nuclearplayer/ui';

import { ConnectedThemeController } from './ConnectedThemeController';
import { SearchBox } from './SearchBox';
import { UpdateBadge } from './UpdateBadge';

export const ConnectedTopBar: FC = () => {
  return (
    <TopBar>
      <div className="flex flex-row items-center gap-4">
        <TopBarLogo />
        <UpdateBadge />
      </div>
      <SearchBox />
      <ConnectedThemeController />
    </TopBar>
  );
};
