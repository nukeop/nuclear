import type { Meta } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { Track } from '@nuclearplayer/model';
import { NuclearJam } from '@nuclearplayer/ui';

const track = (title: string, artist: string, durationMs: number): Track => ({
  title,
  artists: [{ name: artist, roles: ['main'] }],
  durationMs,
  artwork: {
    items: [
      {
        url: `https://picsum.photos/seed/${encodeURIComponent(title)}/96`,
        width: 96,
        height: 96,
        purpose: 'thumbnail',
      },
    ],
  },
  source: { provider: 'mock', id: title },
});

const noArtworkTrack: Track = {
  title: 'Some Bootleg Recording',
  artists: [{ name: 'Unknown Artist', roles: ['main'] }],
  source: { provider: 'mock', id: 'bootleg' },
};

const meta = {
  title: 'Remote/NuclearJam/SearchResultTrack',
  component: NuclearJam.SearchResultTrack,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.SearchResultTrack>;

export default meta;

export const ResultList = {
  render: () => (
    <div className="surface-background">
      <NuclearJam.SearchResultTrack
        track={track('Alberto Balsalm', 'Aphex Twin', 305000)}
        onAdd={fn()}
      />
      <NuclearJam.SearchResultTrack
        track={track('Xtal', 'Aphex Twin', 294000)}
        onAdd={fn()}
      />
      <NuclearJam.SearchResultTrack
        track={track(
          'Stone in Focus (with a very long title that should truncate)',
          'Aphex Twin featuring a Very Long Artist Name That Truncates',
          599000,
        )}
        onAdd={fn()}
      />
      <NuclearJam.SearchResultTrack track={noArtworkTrack} onAdd={fn()} />
    </div>
  ),
};
