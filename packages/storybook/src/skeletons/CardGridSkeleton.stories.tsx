import type { Meta, StoryObj } from '@storybook/react-vite';

import { CardGrid } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/CardGrid',
  component: CardGrid.Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardGrid.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
