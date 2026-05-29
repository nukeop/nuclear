import type { Meta } from '@storybook/react-vite';

import type { QueueItem } from '@nuclearplayer/model';
import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/Queue',
  component: NuclearJam.Queue,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Queue>;

export default meta;

const queueLabels = {
  upNext: 'Up next',
  title: 'Queue is empty',
  subtitle: 'Add tracks in Nuclear to see them here',
};

const mockQueueItems: QueueItem[] = [
  {
    id: '1',
    track: {
      title: 'Everything In Its Right Place',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 251000,
      source: { provider: 'mock', id: '1' },
    },
    status: 'success',
    addedAtIso: '2026-05-25T12:00:00Z',
  },
  {
    id: '2',
    track: {
      title: 'Kid A',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 277000,
      source: { provider: 'mock', id: '2' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:01:00Z',
  },
  {
    id: '3',
    track: {
      title: 'The National Anthem',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 350000,
      source: { provider: 'mock', id: '3' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:02:00Z',
  },
  {
    id: '4',
    track: {
      title: 'How to Disappear Completely',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 342000,
      source: { provider: 'mock', id: '4' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:03:00Z',
  },
  {
    id: '5',
    track: {
      title: 'Treefingers',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 223000,
      source: { provider: 'mock', id: '5' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:04:00Z',
  },
  {
    id: '6',
    track: {
      title: 'Optimistic',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 307000,
      source: { provider: 'mock', id: '6' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:05:00Z',
  },
];

export const Default = {
  render: () => (
    <div className="bg-background h-80">
      <NuclearJam.Queue
        items={mockQueueItems}
        currentItemId="3"
        labels={queueLabels}
      />
    </div>
  ),
};

export const Empty = {
  render: () => (
    <div className="bg-background h-80">
      <NuclearJam.Queue items={[]} labels={queueLabels} />
    </div>
  ),
};
