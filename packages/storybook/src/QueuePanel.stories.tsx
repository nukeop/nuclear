import type { Meta, StoryObj } from '@storybook/react-vite';

import type { QueueItem } from '@nuclearplayer/model';
import { QueuePanel } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/QueuePanel',
  component: QueuePanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isCollapsed: { control: 'boolean' },
    reorderable: { control: 'boolean' },
    onReorder: { action: 'reordered' },
    onSelectItem: { action: 'item selected' },
    onRemoveItem: { action: 'item removed' },
  },
} satisfies Meta<typeof QueuePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockItem = (
  id: string,
  title: string,
  artist: string,
  durationMs?: number,
  status: 'idle' | 'loading' | 'error' = 'idle',
): QueueItem => ({
  id,
  track: {
    title,
    artists: [{ name: artist, roles: ['primary'] }],
    durationMs,
    source: { provider: 'test', id },
    artwork: {
      items: [
        {
          url: `https://picsum.photos/seed/${id}/300`,
          width: 300,
          height: 300,
          purpose: 'thumbnail',
        },
      ],
    },
  },
  status,
  addedAtIso: new Date().toISOString(),
});

const mockItems: QueueItem[] = [
  createMockItem('1', 'Bohemian Rhapsody', 'Queen', 354000),
  createMockItem('2', 'Stairway to Heaven', 'Led Zeppelin', 482000),
  createMockItem('3', 'Hotel California', 'Eagles', 391000, 'loading'),
  createMockItem('4', 'Comfortably Numb', 'Pink Floyd', 382000),
  createMockItem('5', 'November Rain', "Guns N' Roses", 537000),
  createMockItem('6', 'Smells Like Teen Spirit', 'Nirvana', 301000),
  createMockItem('7', 'Under Pressure', 'Queen & David Bowie', 248000),
  createMockItem('8', 'Killer Queen', 'Queen', 181000),
];

const mockItemsWithError: QueueItem[] = [
  ...mockItems.slice(0, 4),
  {
    ...createMockItem('5', 'Broken Track', 'Unknown', 0, 'error'),
    error: 'Stream unavailable',
  },
  ...mockItems.slice(5),
];

export const Default: Story = {
  args: {
    items: mockItems,
    currentItemId: '3',
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const EmptyCustomLabels: Story = {
  args: {
    items: [],
    labels: {
      emptyTitle: 'Nothing to play',
      emptySubtitle: 'Search for music and add it here',
    },
  },
};

export const WithError: Story = {
  args: {
    items: mockItemsWithError,
    currentItemId: '3',
  },
};

export const SingleItem: Story = {
  args: {
    items: [mockItems[0]],
    currentItemId: '1',
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      ...mockItems,
      ...mockItems.map((item, i) => ({
        ...item,
        id: `${item.id}-${i + 10}`,
      })),
      ...mockItems.map((item, i) => ({
        ...item,
        id: `${item.id}-${i + 20}`,
      })),
    ],
    currentItemId: '15',
  },
};

export const NotReorderable: Story = {
  args: {
    items: mockItems,
    currentItemId: '2',
    reorderable: false,
  },
};

export const Collapsed: Story = {
  args: {
    items: mockItems,
    currentItemId: '4',
    isCollapsed: true,
  },
};

export const CollapsedWithError: Story = {
  args: {
    items: mockItemsWithError,
    currentItemId: '6',
    isCollapsed: true,
  },
};

export const InSidebarWidth: Story = {
  render: (args) => (
    <div className="h-screen w-80">
      <QueuePanel {...args} />
    </div>
  ),
  args: {
    items: mockItems,
    currentItemId: '2',
  },
};

export const InNarrowSidebarCollapsed: Story = {
  render: (args) => (
    <div className="h-screen w-[54px] p-2">
      <QueuePanel {...args} />
    </div>
  ),
  args: {
    items: mockItems,
    currentItemId: '3',
    isCollapsed: true,
  },
};
