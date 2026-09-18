import type { Meta, StoryObj } from '@storybook/react-vite';

import { PluginStoreItem } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/PluginStoreItem',
  component: PluginStoreItem.Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PluginStoreItem.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NextToRealItem: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <PluginStoreItem.Skeleton />
      <PluginStoreItem
        name="SoundCloud"
        description="Stream tracks from SoundCloud. Search, browse, and play any public track."
        author="nukeop"
        version="1.2.0"
        categories={['streaming']}
        onInstall={() => {}}
      />
    </div>
  ),
};
