import type { Meta } from '@storybook/react-vite';
import { fn } from 'storybook/test';

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
    <div className="surface-background">
      <NuclearJam.NowPlaying
        labels={{ lyrics: 'Show lyrics' }}
        title="First Test Track"
        artist="Test Artist"
        coverUrl={cover}
      />
    </div>
  ),
};

export const WithLyricsButton = {
  render: () => (
    <div className="surface-background">
      <NuclearJam.NowPlaying
        labels={{ lyrics: 'Show lyrics' }}
        title="First Test Track"
        artist="Test Artist"
        coverUrl={cover}
        onLyricsClick={fn()}
      />
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="surface-background">
      <NuclearJam.NowPlaying
        labels={{ lyrics: 'Show lyrics' }}
        title="First Test Track"
        artist="Test Artist"
        coverUrl={cover}
        isLoading
      />
    </div>
  ),
};

export const NoCoverArt = {
  render: () => (
    <div className="surface-background">
      <NuclearJam.NowPlaying
        title="No Cover Art"
        artist="Unknown Artist"
        labels={{ lyrics: 'Show lyrics' }}
      />
    </div>
  ),
};
