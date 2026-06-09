import type { Meta, StoryObj } from '@storybook/react-vite';
import { FC, useState } from 'react';

import type { StreamCandidate, Track } from '@nuclearplayer/model';
import { QueueItemPopover } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/QueueItemPopover',
  component: QueueItemPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QueueItemPopover>;

export default meta;
type Story = StoryObj<Meta<typeof QueueItemPopover>>;

const Trigger = () => (
  <div className="bg-primary border-border text-foreground rounded-md border-2 px-4 py-2">
    Right-click me
  </div>
);

const StatefulPopover: FC<{ track: Track }> = ({ track }) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  return (
    <QueueItemPopover
      track={track}
      selectedCandidateId={selectedId}
      onSelectCandidate={setSelectedId}
    >
      <Trigger />
    </QueueItemPopover>
  );
};

const trackWithCandidates: Track = {
  title: 'Bohemian Rhapsody',
  artists: [{ name: 'Queen', roles: ['primary'] }],
  durationMs: 354000,
  source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
  streamCandidates: [
    {
      id: '1',
      title: 'Queen - Bohemian Rhapsody (Official Video)',
      durationMs: 354000,
      thumbnail: 'https://picsum.photos/seed/queen-yt/288/144',
      source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
      failed: false,
      stream: {
        url: 'https://example.com/stream',
        protocol: 'https',
        bitrateKbps: 128,
        codec: 'opus',
        qualityLabel: 'medium',
        source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
      },
    },
    {
      id: '2',
      title: 'Bohemian Rhapsody (Remastered 2011)',
      durationMs: 355000,
      thumbnail: 'https://picsum.photos/seed/queen-yt2/288/144',
      source: { provider: 'youtube', id: 'abc123' },
      failed: false,
    },
    {
      id: '3',
      title: 'Queen Bohemian Rhapsody lyrics',
      durationMs: 340000,
      thumbnail: 'https://picsum.photos/seed/queen-yt3/288/144',
      source: { provider: 'youtube', id: 'def456' },
      failed: true,
    },
  ],
};

const manyCandidates: StreamCandidate[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `${index + 1}`,
    title: `Bohemian Rhapsody (Upload ${index + 1})`,
    durationMs: 354000 + index * 1000,
    thumbnail: `https://picsum.photos/seed/queen-${index}/288/144`,
    source: { provider: 'youtube', id: `video-${index}` },
    failed: index === 4,
  }),
);

const trackWithManyCandidates: Track = {
  ...trackWithCandidates,
  streamCandidates: manyCandidates,
};

const trackWithNoQualityInfo: Track = {
  title: 'Bohemian Rhapsody',
  artists: [{ name: 'Queen', roles: ['primary'] }],
  durationMs: 354000,
  source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
  streamCandidates: [
    {
      id: '1',
      title: 'Queen - Bohemian Rhapsody (Official Video)',
      durationMs: 354000,
      thumbnail: 'https://picsum.photos/seed/queen-yt/288/144',
      source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
      failed: false,
      stream: {
        url: 'https://example.com/stream',
        protocol: 'https',
        source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
      },
    },
  ],
};

const trackNoCandidates: Track = {
  title: 'Unknown Track',
  artists: [{ name: 'Unknown Artist', roles: ['primary'] }],
  source: { provider: 'test', id: '1' },
};

export const WithCandidates: Story = {
  render: () => <StatefulPopover track={trackWithCandidates} />,
};

export const ManyCandidates: Story = {
  render: () => <StatefulPopover track={trackWithManyCandidates} />,
};

export const WithNoQualityInfo: Story = {
  render: () => <StatefulPopover track={trackWithNoQualityInfo} />,
};

export const NoCandidates: Story = {
  render: () => (
    <QueueItemPopover track={trackNoCandidates}>
      <Trigger />
    </QueueItemPopover>
  ),
};
