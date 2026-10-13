import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import type { QueueItem } from '@nuclearplayer/model';
import { ConnectionStatusLabels, NuclearJam } from '@nuclearplayer/ui';

import {
  formatOffset,
  LYRICS_LABELS,
  OFFSET_STEP_MS,
  SYNCED_LYRICS,
} from './fixtures/jamLyrics';

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
      title: 'First Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '1' },
    },
    status: 'success',
    addedAtIso: '2026-05-25T12:00:00Z',
  },
  {
    id: '2',
    track: {
      title: 'Second Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '2' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:01:00Z',
  },
  {
    id: '3',
    track: {
      title: 'Third Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '3' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:02:00Z',
  },
  {
    id: '4',
    track: {
      title: 'Fourth Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '4' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:03:00Z',
  },
  {
    id: '5',
    track: {
      title: 'Fifth Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '5' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:04:00Z',
  },
  {
    id: '6',
    track: {
      title: 'Sixth Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '6' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:05:00Z',
  },
  {
    id: '7',
    track: {
      title: 'Seventh Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '7' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:06:00Z',
  },
  {
    id: '8',
    track: {
      title: 'Eighth Test Track',
      artists: [{ name: 'Test Artist', roles: ['main'] }],
      source: { provider: 'mock', id: '8' },
    },
    status: 'idle',
    addedAtIso: '2026-05-25T12:07:00Z',
  },
];

const connectionStatusLabels: ConnectionStatusLabels = {
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  failed: 'Disconnected',
};

const searchBarLabels = {
  placeholder: 'Search for music',
};

const queueProps = {
  items: mockQueueItems,
  currentItemId: '1',
  onRemove: fn(),
  labels: {
    upNext: 'Up next',
    title: 'Queue is empty',
    subtitle: 'Add tracks in Nuclear to see them here',
  },
};

export const FullPage = {
  render: () => (
    <NuclearJam>
      <NuclearJam.Header
        connectionStatus="connected"
        connectionStatusLabels={connectionStatusLabels}
      >
        <NuclearJam.SearchBar
          value=""
          onChange={fn()}
          labels={searchBarLabels}
        />
      </NuclearJam.Header>
      <NuclearJam.NowPlaying
        labels={{ lyrics: 'Show lyrics' }}
        title="First Test Track"
        artist="Test Artist"
        coverUrl={cover}
        onLyricsClick={fn()}
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
    const [searchQuery, setSearchQuery] = useState('');

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
        <NuclearJam.Header
          connectionStatus="connected"
          connectionStatusLabels={connectionStatusLabels}
        >
          <NuclearJam.SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            labels={searchBarLabels}
          />
        </NuclearJam.Header>
        <NuclearJam.NowPlaying
          labels={{ lyrics: 'Show lyrics' }}
          title="First Test Track"
          artist="Test Artist"
          coverUrl={cover}
          onLyricsClick={fn()}
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

export const LyricsPage = {
  render: () => {
    const [offsetMs, setOffsetMs] = useState(0);
    const [positionMs, setPositionMs] = useState(6000);

    return (
      <NuclearJam>
        <NuclearJam.LyricsTopBar
          title="First Test Track"
          artist="Test Artist"
          onBack={fn()}
          labels={{ back: 'Back' }}
        />
        <NuclearJam.LyricsToolbar
          sources={[
            { id: 'synced', name: 'Synced Lyrics', type: 'lineSynced' },
          ]}
          selectedSourceId="synced"
          onSelectSource={fn()}
          offsetValue={formatOffset(offsetMs)}
          onShowEarlier={() => setOffsetMs(offsetMs - OFFSET_STEP_MS)}
          onShowLater={() => setOffsetMs(offsetMs + OFFSET_STEP_MS)}
          labels={{
            types: {
              wordSynced: 'Word synced',
              lineSynced: 'Line synced',
              plain: 'Plain',
            },
            showEarlier: 'Show lyrics earlier',
            showLater: 'Show lyrics later',
          }}
        />
        <NuclearJam.Lyrics
          state={{ status: 'found', lyrics: SYNCED_LYRICS }}
          positionMs={positionMs - offsetMs}
          textSize={1}
          onSeek={setPositionMs}
          labels={LYRICS_LABELS}
        />
      </NuclearJam>
    );
  },
};
