import type { Meta } from '@storybook/react-vite';
import {
  Clock,
  Disc3,
  Download,
  Folder,
  Heart,
  Home,
  Library,
  Mic2,
  Music,
  Radio,
  Search,
  Settings,
  Star,
  TrendingUp,
} from 'lucide-react';

import {
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
} from '@nuclearplayer/ui';

const meta = {
  title: 'Navigation/SidebarNavigation',
  component: SidebarNavigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarNavigation>;

export default meta;

export const WithCollapsibleSections = () => (
  <div className="bg-background-secondary border-border h-96 w-64 border-2 p-4">
    <SidebarNavigation>
      <SidebarNavigationCollapsible
        title="Your Music"
        icon={<Music size={16} />}
      >
        <SidebarNavigationItem
          icon={<Home size={16} />}
          label="Home"
          isSelected
        />
        <SidebarNavigationItem icon={<Search size={16} />} label="Search" />
        <SidebarNavigationItem icon={<Heart size={16} />} label="Liked Songs" />
        <SidebarNavigationItem
          icon={<Clock size={16} />}
          label="Recently Played"
        />
        <SidebarNavigationItem
          icon={<Download size={16} />}
          label="Downloaded"
        />
      </SidebarNavigationCollapsible>

      <SidebarNavigationCollapsible
        title="Browse"
        icon={<TrendingUp size={16} />}
      >
        <SidebarNavigationItem icon={<Disc3 size={16} />} label="Albums" />
        <SidebarNavigationItem icon={<Mic2 size={16} />} label="Artists" />
        <SidebarNavigationItem icon={<Radio size={16} />} label="Radio" />
      </SidebarNavigationCollapsible>
    </SidebarNavigation>
  </div>
);

export const CompactMode = () => (
  <div className="bg-background-secondary border-border flex h-[600px] w-14 flex-col items-center border-2 py-4">
    <SidebarNavigation isCompact>
      <SidebarNavigationCollapsible
        title="Your Music"
        icon={<Music size={16} />}
      >
        <SidebarNavigationItem icon={<Heart size={16} />} label="Liked Songs" />
        <SidebarNavigationItem
          icon={<Clock size={16} />}
          label="Recently Played"
        />
        <SidebarNavigationItem
          icon={<Download size={16} />}
          label="Downloaded"
        />
      </SidebarNavigationCollapsible>

      <SidebarNavigationCollapsible
        title="Browse"
        icon={<TrendingUp size={16} />}
      >
        <SidebarNavigationItem icon={<Disc3 size={16} />} label="Albums" />
        <SidebarNavigationItem icon={<Mic2 size={16} />} label="Artists" />
        <SidebarNavigationItem icon={<Radio size={16} />} label="Radio" />
      </SidebarNavigationCollapsible>

      <SidebarNavigationCollapsible
        title="Local Files"
        icon={<Folder size={16} />}
      >
        <SidebarNavigationItem
          icon={<Folder size={16} />}
          label="Music Folder"
        />
        <SidebarNavigationItem
          icon={<Download size={16} />}
          label="Downloads"
        />
      </SidebarNavigationCollapsible>
    </SidebarNavigation>
  </div>
);

export const FullNavigationExample = () => (
  <div className="bg-background-secondary border-border h-[600px] w-64 overflow-auto border-2 p-4">
    <SidebarNavigation>
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

      <SidebarNavigationCollapsible
        title="Your Music"
        icon={<Music size={16} />}
      >
        <SidebarNavigationItem icon={<Heart size={16} />} label="Liked Songs" />
        <SidebarNavigationItem
          icon={<Clock size={16} />}
          label="Recently Played"
          isSelected
        />
        <SidebarNavigationItem
          icon={<Download size={16} />}
          label="Downloaded"
        />
        <SidebarNavigationItem icon={<Star size={16} />} label="Favorites" />
      </SidebarNavigationCollapsible>

      <SidebarNavigationCollapsible
        title="Browse"
        icon={<TrendingUp size={16} />}
      >
        <SidebarNavigationItem icon={<Disc3 size={16} />} label="Albums" />
        <SidebarNavigationItem icon={<Mic2 size={16} />} label="Artists" />
        <SidebarNavigationItem icon={<Radio size={16} />} label="Radio" />
        <SidebarNavigationItem icon={<TrendingUp size={16} />} label="Charts" />
      </SidebarNavigationCollapsible>

      <SidebarNavigationCollapsible
        title="Local Files"
        icon={<Folder size={16} />}
      >
        <SidebarNavigationItem
          icon={<Folder size={16} />}
          label="Music Folder"
        />
        <SidebarNavigationItem
          icon={<Download size={16} />}
          label="Downloads"
        />
      </SidebarNavigationCollapsible>

      <SidebarNavigationItem icon={<Settings size={16} />} label="Settings" />
    </SidebarNavigation>
  </div>
);
