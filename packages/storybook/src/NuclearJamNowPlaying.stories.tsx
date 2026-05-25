import type { Meta } from '@storybook/react-vite';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/NowPlaying',
  component: NuclearJam.NowPlaying,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.NowPlaying>;

export default meta;

const cover = 'https://picsum.photos/208';

export const WithCoverArt = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.NowPlaying
        title="Everything In Its Right Place"
        artist="Radiohead"
        coverUrl={cover}
      />
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.NowPlaying
        title="Everything In Its Right Place"
        artist="Radiohead"
        coverUrl={cover}
        isLoading
      />
    </div>
  ),
};

export const NoCoverArt = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.NowPlaying title="No Cover Art" artist="Unknown Artist" />
    </div>
  ),
};
