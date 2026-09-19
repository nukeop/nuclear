import type { Meta, StoryObj } from '@storybook/react-vite';

import { CardsRow } from '@nuclearplayer/ui';

const meta = {
  title: 'Skeletons/CardsRow',
  component: CardsRow.Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardsRow.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  filterPlaceholder: 'Filter albums...',
  nothingFound: 'No albums match your filter',
};

const items = Array.from({ length: 6 }, (_, index) => ({
  id: String(index),
  title: `Album ${index + 1}`,
  subtitle: `Artist ${index + 1}`,
  imageUrl: `https://picsum.photos/300?random=${index}`,
}));

export const WithTitleAndBadge: Story = {
  args: {
    title: 'Top Albums',
    badge: 'Acme Music',
  },
};

export const WithoutTitle: Story = {};

export const AboveRealRow: Story = {
  args: {
    title: 'Top Albums',
    badge: 'Acme Music',
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <CardsRow.Skeleton {...args} />
      <CardsRow
        title="Top Albums"
        badge="Acme Music"
        items={items}
        labels={labels}
      />
    </div>
  ),
};
