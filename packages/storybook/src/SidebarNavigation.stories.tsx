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
  Radio,
  Search,
  Settings,
  Star,
  TrendingUp,
} from 'lucide-react';

import { SidebarNavigation, SidebarNavigationItem } from '@nuclearplayer/ui';

const meta = {
  title: 'Navigation/SidebarNavigation',
  component: SidebarNavigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarNavigation>;

export default meta;

export const FlatList = () => (
  <div className="bg-background-secondary border-border h-96 w-64 border-(length:--border-width) p-2">
    <SidebarNavigation>
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
      <SidebarNavigationItem icon={<Download size={16} />} label="Downloaded" />
      <SidebarNavigationItem icon={<Settings size={16} />} label="Settings" />
    </SidebarNavigation>
  </div>
);

export const CompactMode = () => (
  <div className="bg-background-secondary border-border flex h-[600px] w-[54px] flex-col border-(length:--border-width) p-2">
    <SidebarNavigation isCompact>
      <SidebarNavigationItem icon={<Home size={16} />} label="Home" />
      <SidebarNavigationItem icon={<Search size={16} />} label="Search" />
      <SidebarNavigationItem icon={<Heart size={16} />} label="Liked Songs" />
      <SidebarNavigationItem
        icon={<Clock size={16} />}
        label="Recently Played"
      />
      <SidebarNavigationItem icon={<Download size={16} />} label="Downloaded" />
      <SidebarNavigationItem icon={<Settings size={16} />} label="Settings" />
    </SidebarNavigation>
  </div>
);

export const FullNavigationExample = () => (
  <div className="bg-background-secondary border-border h-[600px] w-64 overflow-auto border-(length:--border-width) p-2">
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
      <SidebarNavigationItem icon={<Heart size={16} />} label="Liked Songs" />
      <SidebarNavigationItem
        icon={<Clock size={16} />}
        label="Recently Played"
      />
      <SidebarNavigationItem icon={<Download size={16} />} label="Downloaded" />
      <SidebarNavigationItem icon={<Star size={16} />} label="Favorites" />
      <SidebarNavigationItem icon={<Disc3 size={16} />} label="Albums" />
      <SidebarNavigationItem icon={<Mic2 size={16} />} label="Artists" />
      <SidebarNavigationItem icon={<Radio size={16} />} label="Radio" />
      <SidebarNavigationItem icon={<TrendingUp size={16} />} label="Charts" />
      <SidebarNavigationItem icon={<Folder size={16} />} label="Music Folder" />
      <SidebarNavigationItem icon={<Settings size={16} />} label="Settings" />
    </SidebarNavigation>
  </div>
);
