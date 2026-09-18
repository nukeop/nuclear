import type { Meta, StoryObj } from '@storybook/react-vite';
import { Users } from 'lucide-react';

import { StatChip } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/StatChip',
  component: StatChip.Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatChip.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NextToRealChip: Story = {
  render: () => (
    <div className="flex gap-3">
      <StatChip.Skeleton />
      <StatChip value="1.2M" label="Followers" icon={<Users size={16} />} />
    </div>
  ),
};
