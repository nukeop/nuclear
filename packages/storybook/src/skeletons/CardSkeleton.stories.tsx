import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/Card',
  component: Card.Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NextToRealCard: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card.Skeleton />
      <Card
        src="https://picsum.photos/300"
        title="Random Album"
        subtitle="Some Artist"
      />
    </div>
  ),
};
