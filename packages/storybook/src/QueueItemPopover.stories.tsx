import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { Track } from '@nuclearplayer/model';
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
        source: { provider: 'youtube', id: 'fJ9rUzIMcZQ' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    },
  ],
};

const trackNoCandidates: Track = {
  title: 'Unknown Track',
  artists: [{ name: 'Unknown Artist', roles: ['primary'] }],
  source: { provider: 'test', id: '1' },
};

export const WithCandidates: Story = {
  render: () => (
    <QueueItemPopover track={trackWithCandidates} onSelectCandidate={fn()}>
      <Trigger />
    </QueueItemPopover>
  ),
};
export const WithNoQualityInfo: Story = {
  render: () => (
    <QueueItemPopover track={trackWithNoQualityInfo} onSelectCandidate={fn()}>
      <Trigger />
    </QueueItemPopover>
  ),
};

export const NoCandidates: Story = {
  render: () => (
    <QueueItemPopover track={trackNoCandidates}>
      <Trigger />
    </QueueItemPopover>
  ),
};
