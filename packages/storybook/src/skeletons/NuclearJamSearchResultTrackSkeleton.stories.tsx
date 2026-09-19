import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { Track } from '@nuclearplayer/model';
import { NuclearJam } from '@nuclearplayer/ui';

const track: Track = {
  title: 'Alberto Balsalm',
  artists: [{ name: 'Aphex Twin', roles: ['main'] }],
  durationMs: 305000,
  artwork: {
    items: [
      {
        url: 'https://picsum.photos/seed/alberto/96',
        width: 96,
        height: 96,
        purpose: 'thumbnail',
      },
    ],
  },
  source: { provider: 'mock', id: 'alberto' },
};

const meta = {
  title: 'Skeletons/NuclearJamSearchResultTrack',
  component: NuclearJam.SearchResultTrack.Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.SearchResultTrack.Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NextToRealRow: Story = {
  render: () => (
    <div className="surface-background">
      <NuclearJam.SearchResultTrack.Skeleton />
      <NuclearJam.SearchResultTrack track={track} onAdd={fn()} />
    </div>
  ),
};
