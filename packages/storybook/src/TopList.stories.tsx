import { Meta, StoryObj } from '@storybook/react-vite';

import { TopList, TopListEntry } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/TopList',
  component: TopList,
  tags: ['autodocs'],
} satisfies Meta<typeof TopList>;

export default meta;
type Story = StoryObj<typeof TopList>;

const formatMinutes = (value: number) => `${Math.round(value / 60_000)}m`;

const artists: TopListEntry[] = [
  {
    id: 'maus',
    label: 'John Maus',
    imageUrl: 'https://picsum.photos/seed/maus/64',
    value: 27_180_000,
  },
  {
    id: 'pink',
    label: 'Ariel Pink',
    value: 9_420_000,
  },
  {
    id: 'moore',
    label: 'R. Stevie Moore',
    imageUrl: 'https://picsum.photos/seed/moore/64',
    value: 5_100_000,
  },
  {
    id: 'zappa',
    label: 'Frank Zappa',
    imageUrl: 'https://picsum.photos/seed/zappa/64',
    value: 3_660_000,
  },
  {
    id: 'swans',
    label: 'Swans',
    imageUrl: 'https://picsum.photos/seed/swans/64',
    value: 1_320_000,
  },
];

const albums: TopListEntry[] = [
  {
    id: 'pitiless',
    label: 'We Must Become the Pitiless Censors of Ourselves',
    sublabel: 'John Maus',
    imageUrl: 'https://picsum.photos/seed/pitiless/64',
    value: 18_300_000,
  },
  {
    id: 'before-today',
    label: 'Before Today',
    sublabel: 'Ariel Pink',
    value: 7_800_000,
  },
  {
    id: 'hot-rats',
    label: 'Hot Rats',
    sublabel: 'Frank Zappa',
    imageUrl: 'https://picsum.photos/seed/hotrats/64',
    value: 2_940_000,
  },
];

export const Default: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-4">
      <TopList
        title="Top artists"
        entries={artists}
        formatValue={formatMinutes}
      />
      <TopList
        title="Top albums"
        entries={albums}
        formatValue={formatMinutes}
      />
    </div>
  ),
};
