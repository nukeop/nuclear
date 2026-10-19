import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Card, CardGrid } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/CardGrid',
  component: CardGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cover = 'https://picsum.photos/300';

const items = [
  { title: 'Northern Lights', subtitle: 'Aurora' },
  { title: 'Midnight Drive', subtitle: 'Neon City' },
  { title: 'Echoes', subtitle: 'The Wanderers' },
  { title: 'Fragments', subtitle: 'Kite & Co.' },
  { title: 'Citrus Skies', subtitle: 'Mango Groove' },
  { title: 'Binary Love', subtitle: '01100010' },
  { title: 'Crimson Tide', subtitle: 'Harbor' },
  { title: 'Static Bloom', subtitle: 'Flora' },
  { title: 'Sunset Motifs', subtitle: 'Parasol' },
  { title: 'Hologram', subtitle: 'Vapors' },
  { title: 'Sapphire', subtitle: 'Depths' },
  { title: 'Granite', subtitle: 'Cliff' },
];

export const Default: Story = {
  render: () => (
    <div className="w-full">
      <CardGrid>
        {items.map((item, i) => (
          <Card
            key={i}
            src={`${cover}?i=${i}`}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
      </CardGrid>
    </div>
  ),
};

const moveTitle = (titles: string[], fromIndex: number, toIndex: number) => {
  const reordered = [...titles];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  return reordered;
};

const SortableGrid = ({ disabled = false }: { disabled?: boolean }) => {
  const [titles, setTitles] = useState(items.map((item) => item.title));

  return (
    <div className="w-full">
      <CardGrid.Sortable
        itemIds={titles}
        disabled={disabled}
        onReorder={(fromIndex, toIndex) =>
          setTitles((current) => moveTitle(current, fromIndex, toIndex))
        }
      >
        {titles.map((title, index) => (
          <CardGrid.SortableItem key={title} id={title}>
            <Card src={`${cover}?i=${index}`} title={title} />
          </CardGrid.SortableItem>
        ))}
      </CardGrid.Sortable>
    </div>
  );
};

export const Sortable: Story = {
  render: () => <SortableGrid />,
};

export const SortableDisabled: Story = {
  render: () => <SortableGrid disabled />,
};
