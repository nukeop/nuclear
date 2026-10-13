import type { Meta } from '@storybook/react-vite';
import { ReactNode, useState } from 'react';
import { fn } from 'storybook/test';

import type { QueueItem, Track } from '@nuclearplayer/model';
import { ConnectionStatusLabels, NuclearJam } from '@nuclearplayer/ui';

const connectionStatusLabels: ConnectionStatusLabels = {
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  failed: 'Disconnected',
};

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

const results: Track[] = [
  track('First Search Result', 'Search Test Artist', 149000),
  track('Second Search Result', 'Search Test Artist', 301000),
  track('Third Search Result', 'Search Test Artist', 322000),
  track('Fourth Search Result', 'Search Test Artist', 337000),
  track('Fifth Search Result', 'Search Test Artist', 91000),
  track(
    'Sixth Search Result With a Longer Placeholder Title',
    'Search Test Artist',
    302000,
  ),
  track('Seventh Search Result', 'Search Test Artist', 311000),
  track('Eighth Search Result', 'Search Test Artist', 322000),
  track('Ninth Search Result', 'Search Test Artist', 326000),
  track('Tenth Search Result', 'Search Test Artist', 358000),
];

const queueItems: QueueItem[] = [
  {
    id: '1',
    track: track('First Test Track', 'Test Artist', 251000),
    status: 'success',
    addedAtIso: '2026-05-25T12:00:00Z',
  },
  {
    id: '2',
    track: track('Second Test Track', 'Test Artist', 277000),
    status: 'idle',
    addedAtIso: '2026-05-25T12:01:00Z',
  },
];

const queueLabels = {
  upNext: 'Up next',
  title: 'Queue is empty',
  subtitle: 'Add tracks in Nuclear to see them here',
};

const JamFrame = ({
  drawer,
  initialQuery,
}: {
  drawer: ReactNode;
  initialQuery: string;
}) => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <NuclearJam>
      <NuclearJam.Header
        connectionStatus="connected"
        connectionStatusLabels={connectionStatusLabels}
      >
        <NuclearJam.SearchBar
          value={query}
          onChange={setQuery}
          labels={{ placeholder: 'Search for music' }}
        />
      </NuclearJam.Header>
      <NuclearJam.Content>
        <NuclearJam.NowPlaying
          title="First Test Track"
          artist="Test Artist"
          coverUrl="https://picsum.photos/208"
          labels={{ lyrics: 'Show lyrics' }}
        />
        <NuclearJam.Queue
          items={queueItems}
          currentItemId="1"
          labels={queueLabels}
        />
        <NuclearJam.SearchDrawer
          open={query.length > 0}
          onBackdropClick={() => setQuery('')}
        >
          {drawer}
        </NuclearJam.SearchDrawer>
      </NuclearJam.Content>
    </NuclearJam>
  );
};

const meta = {
  title: 'Remote/NuclearJam/SearchDrawer',
  component: NuclearJam.SearchDrawer,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.SearchDrawer>;

export default meta;

export const OpenAndClose = {
  render: () => (
    <JamFrame
      initialQuery=""
      drawer={
        <NuclearJam.SearchDrawer.Results>
          {results.map((resultTrack) => (
            <NuclearJam.SearchResultTrack
              key={resultTrack.source.id}
              track={resultTrack}
              onAdd={fn()}
            />
          ))}
        </NuclearJam.SearchDrawer.Results>
      }
    />
  ),
};

export const Empty = {
  render: () => (
    <JamFrame
      initialQuery="search result"
      drawer={
        <NuclearJam.SearchDrawer.Empty
          labels={{
            title: 'No results',
            description: 'Try a different search',
          }}
        />
      }
    />
  ),
};

export const Error = {
  render: () => (
    <JamFrame
      initialQuery="search result"
      drawer={
        <NuclearJam.SearchDrawer.Error
          labels={{
            title: 'Search failed',
            description: 'Check the player and try again',
          }}
        />
      }
    />
  ),
};
