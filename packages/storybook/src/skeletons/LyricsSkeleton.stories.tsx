import type { Meta, StoryObj } from '@storybook/react-vite';

import { LyricsSkeleton } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/Lyrics',
  component: LyricsSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LyricsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
