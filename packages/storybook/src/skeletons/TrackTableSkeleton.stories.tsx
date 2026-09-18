import type { Meta, StoryObj } from '@storybook/react-vite';

import { TrackTable } from '@nuclearplayer/ui';

import { labels, tracks } from '../TrackTable.stories.data';

const meta = {
  title: 'Skeletons/TrackTable',
  component: TrackTable.Skeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TrackTable.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const display = {
  displayPosition: true,
  displayAlbum: true,
};

export const Default: Story = {};

export const AboveRealTable: Story = {
  args: {
    display,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <TrackTable.Skeleton {...args} />
      <TrackTable
        tracks={tracks}
        labels={labels}
        features={{ filterable: false }}
        display={display}
        actions={{}}
      />
    </div>
  ),
};
