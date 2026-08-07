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
  track('Roygbiv', 'Boards of Canada', 149000),
  track('Dayvan Cowboy', 'Boards of Canada', 301000),
  track('Music Is Math', 'Boards of Canada', 322000),
  track('Amo Bishop Roden', 'Boards of Canada', 337000),
  track('Olson', 'Boards of Canada', 91000),
];

const queueItems: QueueItem[] = [
  {
    id: '1',
    track: track('Everything In Its Right Place', 'Radiohead', 251000),
    status: 'success',
    addedAtIso: '2026-05-25T12:00:00Z',
  },
  {
    id: '2',
    track: track('Kid A', 'Radiohead', 277000),
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
          title="Everything In Its Right Place"
          artist="Radiohead"
          coverUrl="https://picsum.photos/208"
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
      initialQuery="boards of canada"
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
      initialQuery="boards of canada"
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
