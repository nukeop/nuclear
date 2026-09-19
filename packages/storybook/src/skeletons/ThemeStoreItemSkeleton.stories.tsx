import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeStoreItem } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/ThemeStoreItem',
  component: ThemeStoreItem.Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeStoreItem.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NextToRealItem: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ThemeStoreItem.Skeleton />
      <ThemeStoreItem
        name="Midnight Neon"
        description="A dark theme with neon green and purple accents for late night sessions."
        author="nukeop"
        palette={['#0f0f1a', '#1a1a2e', '#39ff14', '#9d4edd']}
        tags={['dark']}
        onInstall={() => {}}
      />
    </div>
  ),
};
