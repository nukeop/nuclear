import type { Meta } from '@storybook/react-vite';
import {
  Clock,
  Disc3,
  Download,
  Filter,
  Grid3X3,
  Heart,
  Home,
  Library,
  List,
  Mic2,
  MoreHorizontal,
  Play,
  Radio,
  Repeat,
  Search,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  Star,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';

import {
  BottomBar,
  Button,
  PlayerWorkspace,
  SidebarNavigation,
  SidebarNavigationItem,
  TopBar,
} from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/PlayerWorkspace',
  component: PlayerWorkspace,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerWorkspace>;

export default meta;

const MockTrackList = () => (
  <div className="p-6">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-foreground text-2xl font-bold">Your Library</h1>
      <div className="flex gap-2">
        <Button size="sm" variant="text">
          <Filter size={16} />
        </Button>
        <Button size="sm" variant="text">
          <Grid3X3 size={16} />
        </Button>
        <Button size="sm" variant="text">
          <List size={16} />
        </Button>
      </div>
    </div>

    <div className="space-y-2">
      {[
        {
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          album: 'A Night at the Opera',
          duration: '5:55',
        },
        {
          title: 'Stairway to Heaven',
          artist: 'Led Zeppelin',
          album: 'Led Zeppelin IV',
          duration: '8:02',
        },
        {
          title: 'Hotel California',
          artist: 'Eagles',
          album: 'Hotel California',
          duration: '6:30',
        },
        {
          title: "Sweet Child O' Mine",
          artist: "Guns N' Roses",
          album: 'Appetite for Destruction',
          duration: '5:03',
        },
        {
          title: 'Imagine',
          artist: 'John Lennon',
          album: 'Imagine',
          duration: '3:07',
        },
        {
          title: 'Billie Jean',
          artist: 'Michael Jackson',
          album: 'Thriller',
          duration: '4:54',
        },
        {
          title: 'Like a Rolling Stone',
          artist: 'Bob Dylan',
          album: 'Highway 61 Revisited',
          duration: '6:13',
        },
        {
          title: 'Smells Like Teen Spirit',
          artist: 'Nirvana',
          album: 'Nevermind',
          duration: '5:01',
        },
      ].map((track, index) => (
        <div
          key={index}
          className="hover:bg-background hover:border-border flex items-center justify-between rounded-md border border-transparent p-3 transition-all"
        >
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="text"
              className="opacity-0 group-hover:opacity-100"
            >
              <Play size={14} />
            </Button>
            <div>
              <div className="text-foreground font-medium">{track.title}</div>
              <div className="text-foreground-secondary text-sm">
                {track.artist} • {track.album}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-foreground-secondary text-sm">
              {track.duration}
            </span>
            <Button size="icon" variant="text">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MockQueueSidebar = () => (
  <div className="p-4">
    <h3 className="text-foreground mb-4 font-bold">Queue</h3>
    <div className="space-y-3">
      <div className="text-sm">
        <div className="text-foreground font-medium">Now Playing</div>
        <div className="text-foreground-secondary">
          Bohemian Rhapsody - Queen
        </div>
      </div>
      <div className="border-border border-t pt-3">
        <div className="text-foreground mb-2 text-sm font-medium">Up Next</div>
        {[
          'Stairway to Heaven - Led Zeppelin',
          'Hotel California - Eagles',
          "Sweet Child O' Mine - Guns N' Roses",
        ].map((track, index) => (
          <div
            key={index}
            className="text-foreground-secondary hover:text-foreground cursor-pointer py-1 text-sm"
          >
            {track}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const BasicLayout = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(320);

  return (
    <div className="flex h-screen flex-col">
      <TopBar>
        <div className="ml-4 flex items-center gap-4">
          <span className="text-foreground text-sm">Nuclear Music Player</span>
        </div>
      </TopBar>

      <PlayerWorkspace className="flex-1">
        <PlayerWorkspace.LeftSidebar
          isCollapsed={leftCollapsed}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          onToggle={() => setLeftCollapsed(!leftCollapsed)}
        >
          <SidebarNavigation isCompact={leftCollapsed}>
            <SidebarNavigationItem
              icon={<Home size={16} />}
              label="Home"
              isSelected
            />
            <SidebarNavigationItem icon={<Search size={16} />} label="Search" />
            <SidebarNavigationItem
              icon={<Library size={16} />}
              label="Your Library"
            />
          </SidebarNavigation>
        </PlayerWorkspace.LeftSidebar>

        <PlayerWorkspace.Main>
          <MockTrackList />
        </PlayerWorkspace.Main>

        <PlayerWorkspace.RightSidebar
          isCollapsed={rightCollapsed}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onToggle={() => setRightCollapsed(!rightCollapsed)}
        >
          <MockQueueSidebar />
        </PlayerWorkspace.RightSidebar>
      </PlayerWorkspace>

      <BottomBar>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="text">
                <Shuffle size={16} />
              </Button>
              <Button size="icon" variant="text">
                <SkipBack size={16} />
              </Button>
              <Button size="icon">
                <Play size={16} />
              </Button>
              <Button size="icon" variant="text">
                <SkipForward size={16} />
              </Button>
              <Button size="icon" variant="text">
                <Repeat size={16} />
              </Button>
            </div>
          </div>

          <div className="mx-8 flex-1">
            <div className="text-center">
              <div className="text-foreground text-sm font-medium">
                Bohemian Rhapsody
              </div>
              <div className="text-foreground-secondary text-xs">Queen</div>
            </div>
            <div className="bg-background-secondary mt-2 h-1 rounded-full">
              <div className="bg-primary h-1 w-1/3 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="text">
              <Volume2 size={16} />
            </Button>
            <div className="bg-background-secondary h-1 w-20 rounded-full">
              <div className="bg-primary h-1 w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </BottomBar>
    </div>
  );
};

export const FullNavigationLayout = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(280);

  return (
    <div className="flex h-screen flex-col">
      <TopBar>
        <div className="ml-4 flex items-center gap-4">
          <span className="text-foreground text-sm font-medium">
            Nuclear Music Player
          </span>
          <div className="ml-8 flex gap-2">
            <Button size="sm" variant="text">
              File
            </Button>
            <Button size="sm" variant="text">
              Edit
            </Button>
            <Button size="sm" variant="text">
              View
            </Button>
            <Button size="sm" variant="text">
              Help
            </Button>
          </div>
        </div>
      </TopBar>

      <PlayerWorkspace className="flex-1">
        <PlayerWorkspace.LeftSidebar
          isCollapsed={leftCollapsed}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          onToggle={() => setLeftCollapsed(!leftCollapsed)}
        >
          <SidebarNavigation isCompact={leftCollapsed}>
            <SidebarNavigationItem
              icon={<Home size={16} />}
              label="Home"
              isSelected
            />
            <SidebarNavigationItem icon={<Search size={16} />} label="Search" />
            <SidebarNavigationItem
              icon={<Library size={16} />}
              label="Your Library"
            />
            <SidebarNavigationItem
              icon={<Heart size={16} />}
              label="Liked Songs"
            />
            <SidebarNavigationItem
              icon={<Clock size={16} />}
              label="Recently Played"
              isSelected
            />
            <SidebarNavigationItem
              icon={<Download size={16} />}
              label="Downloaded"
            />
            <SidebarNavigationItem
              icon={<Star size={16} />}
              label="Favorites"
            />
            <SidebarNavigationItem icon={<Disc3 size={16} />} label="Albums" />
            <SidebarNavigationItem icon={<Mic2 size={16} />} label="Artists" />
            <SidebarNavigationItem icon={<Radio size={16} />} label="Radio" />
            <SidebarNavigationItem
              icon={<Settings size={16} />}
              label="Settings"
            />
          </SidebarNavigation>
        </PlayerWorkspace.LeftSidebar>

        <PlayerWorkspace.Main>
          <MockTrackList />
        </PlayerWorkspace.Main>

        <PlayerWorkspace.RightSidebar
          isCollapsed={rightCollapsed}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onToggle={() => setRightCollapsed(!rightCollapsed)}
        >
          <MockQueueSidebar />
        </PlayerWorkspace.RightSidebar>
      </PlayerWorkspace>

      <BottomBar>
        <div className="flex w-full items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-foreground">♪ 1,247 tracks</span>
            <span className="text-foreground-secondary">•</span>
            <span className="text-foreground-secondary">3.2 GB</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-foreground-secondary">Ready</span>
          </div>
        </div>
      </BottomBar>
    </div>
  );
};
