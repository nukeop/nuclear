import { createRootRoute } from '@tanstack/react-router';
import {
  BlocksIcon,
  CompassIcon,
  DiscIcon,
  GaugeIcon,
  LibraryIcon,
  ListMusicIcon,
  MusicIcon,
  PaletteIcon,
  ScrollTextIcon,
  Settings2Icon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  PlayerShell,
  PlayerWorkspace,
  RouteTransition,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  Toaster,
} from '@nuclearplayer/ui';

import { ConnectedPlayerBar } from '../components/ConnectedPlayerBar';
import {
  ConnectedQueuePanel,
  QueueHeaderActions,
} from '../components/ConnectedQueuePanel';
import { ConnectedTopBar } from '../components/ConnectedTopBar';
import { DevTools } from '../components/DevTools';
import { FlatpakWarningBanner } from '../components/FlatpakWarningBanner';
import { SoundProvider } from '../components/SoundProvider';
import { useAppVersion } from '../hooks/useAppVersion';
import { useLayoutStore } from '../stores/layoutStore';

const RootComponent = () => {
  const { t } = useTranslation('navigation');
  const { t: tPrefs } = useTranslation('preferences');
  const { version: appVersion, commitHash } = useAppVersion();
  const {
    leftSidebar,
    rightSidebar,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarWidth,
    setRightSidebarWidth,
  } = useLayoutStore();

  const versionString = appVersion
    ? `v${appVersion}${commitHash ? ` (${commitHash})` : ''}`
    : null;

  return (
    <PlayerShell>
      <div>
        <FlatpakWarningBanner />
        <ConnectedTopBar />
      </div>
      <SoundProvider>
        <PlayerWorkspace>
          <PlayerWorkspace.LeftSidebar
            width={leftSidebar.width}
            isCollapsed={leftSidebar.isCollapsed}
            onWidthChange={setLeftSidebarWidth}
            onToggle={toggleLeftSidebar}
            footer={
              versionString && (
                <span className="text-muted-foreground cursor-text px-2 py-1 text-xs select-all">
                  {versionString}
                </span>
              )
            }
          >
            <SidebarNavigation>
              <SidebarNavigationCollapsible
                title={t('explore')}
                icon={<CompassIcon />}
              >
                <SidebarNavigationItem
                  to="/dashboard"
                  icon={<GaugeIcon />}
                  label={t('dashboard')}
                />
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={tPrefs('title')}
                icon={<SettingsIcon />}
              >
                <SidebarNavigationItem
                  to="/settings"
                  icon={<Settings2Icon />}
                  label={tPrefs('general.title')}
                />
                <SidebarNavigationItem
                  to="/plugins"
                  icon={<BlocksIcon />}
                  label={tPrefs('plugins.title')}
                />
                <SidebarNavigationItem
                  to="/themes"
                  icon={<PaletteIcon />}
                  label={tPrefs('themes.title')}
                />
                <SidebarNavigationItem
                  to="/logs"
                  icon={<ScrollTextIcon />}
                  label={tPrefs('logs.title')}
                />
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={t('collection')}
                icon={<LibraryIcon />}
              >
                <SidebarNavigationItem
                  to="/favorites/albums"
                  icon={<DiscIcon />}
                  label={t('favoriteAlbums')}
                />
                <SidebarNavigationItem
                  to="/favorites/tracks"
                  icon={<MusicIcon />}
                  label={t('favoriteTracks')}
                />
                <SidebarNavigationItem
                  to="/favorites/artists"
                  icon={<UserIcon />}
                  label={t('favoriteArtists')}
                />
                <SidebarNavigationItem
                  to="/playlists"
                  icon={<ListMusicIcon />}
                  label={t('playlists')}
                />
              </SidebarNavigationCollapsible>
            </SidebarNavigation>
          </PlayerWorkspace.LeftSidebar>

          <PlayerWorkspace.Main>
            <RouteTransition />
          </PlayerWorkspace.Main>

          <PlayerWorkspace.RightSidebar
            width={rightSidebar.width}
            isCollapsed={rightSidebar.isCollapsed}
            onWidthChange={setRightSidebarWidth}
            onToggle={toggleRightSidebar}
            headerActions={<QueueHeaderActions />}
          >
            <ConnectedQueuePanel isCollapsed={rightSidebar.isCollapsed} />
          </PlayerWorkspace.RightSidebar>
        </PlayerWorkspace>
      </SoundProvider>

      <ConnectedPlayerBar />
      <Toaster />
      <DevTools />
    </PlayerShell>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
