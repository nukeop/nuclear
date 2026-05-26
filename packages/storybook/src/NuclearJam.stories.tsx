import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import type { QueueItem } from '@nuclearplayer/model';
import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam',
  component: NuclearJam,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam>;

export default meta;

const cover = 'https://picsum.photos/208';

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
  {
    id: '7',
    track: {
      title: 'In Limbo',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 193000,
      source: { provider: 'mock', id: '7' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:06:00Z',
  },
  {
    id: '8',
    track: {
      title: 'Idioteque',
      artists: [{ name: 'Radiohead', roles: ['main'] }],
      durationMs: 309000,
      source: { provider: 'mock', id: '8' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:07:00Z',
  },
];

const queueProps = {
  items: mockQueueItems,
  currentItemId: '1',
  labels: {
    title: 'Queue is empty',
    subtitle: 'Add tracks in Nuclear to see them here',
  },
};

export const FullPage = {
  render: () => (
    <NuclearJam>
      <NuclearJam.Header connectionStatus="connected" />
      <NuclearJam.NowPlaying
        title="Everything In Its Right Place"
        artist="Radiohead"
        coverUrl={cover}
      />
      <NuclearJam.Controls
        isPlaying
        shuffleActive={false}
        repeatMode="off"
        progress={35}
        elapsedSeconds={88}
        remainingSeconds={163}
        onPlayPause={fn()}
        onNext={fn()}
        onPrevious={fn()}
        onShuffleToggle={fn()}
        onRepeatToggle={fn()}
        onSeek={fn()}
      />
      <NuclearJam.Queue {...queueProps} />
    </NuclearJam>
  ),
};

export const Interactive = {
  render: () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [shuffleActive, setShuffleActive] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
    const [isDiscoveryActive, setIsDiscoveryActive] = useState(false);
    const [progress, setProgress] = useState(35);

    const cycleRepeat = () => {
      const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
      const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
      setRepeatMode(modes[nextIndex]);
    };

    const totalSeconds = 251;
    const elapsed = Math.floor((progress / 100) * totalSeconds);
    const remaining = totalSeconds - elapsed;

    return (
      <NuclearJam>
        <NuclearJam.Header connectionStatus="connected" />
        <NuclearJam.NowPlaying
          title="Everything In Its Right Place"
          artist="Radiohead"
          coverUrl={cover}
        />
        <NuclearJam.Controls
          isPlaying={isPlaying}
          shuffleActive={shuffleActive}
          repeatMode={repeatMode}
          isDiscoveryActive={isDiscoveryActive}
          progress={progress}
          elapsedSeconds={elapsed}
          remainingSeconds={remaining}
          onPlayPause={() => setIsPlaying((prev) => !prev)}
          onNext={fn()}
          onPrevious={fn()}
          onShuffleToggle={() => setShuffleActive((prev) => !prev)}
          onRepeatToggle={cycleRepeat}
          onDiscoveryToggle={() => setIsDiscoveryActive((prev) => !prev)}
          onSeek={setProgress}
        />
        <NuclearJam.Queue {...queueProps} />
      </NuclearJam>
    );
  },
};
