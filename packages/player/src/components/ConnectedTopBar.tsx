import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import { TopBar, TopBarLogo, TopBarNavigation } from '@nuclearplayer/ui';

import { useCanGoForward } from '../hooks/useCanGoForward';
import { ConnectedThemeController } from './ConnectedThemeController';
import { SearchBox } from './SearchBox';
import { UpdateBadge } from './UpdateBadge';

export const ConnectedTopBar: FC = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const canGoForward = useCanGoForward();

  return (
    <TopBar>
      <div className="flex flex-row items-center gap-4">
        <TopBarLogo />
        <TopBarNavigation
          onBack={() => router.history.back()}
          onForward={() => router.history.forward()}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
        <UpdateBadge />
      </div>
      <SearchBox />
      <ConnectedThemeController />
    </TopBar>
  );
};
