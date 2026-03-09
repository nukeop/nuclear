import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';

import { PlayerBar } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/PlayerBar',
  component: PlayerBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const cover = 'https://picsum.photos/64';

export const Default: Story = {
  render: () => (
    <>
      <PlayerBar.SeekBar
        progress={35}
        elapsedSeconds={97}
        remainingSeconds={1297}
      />
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Song Title"
            artist="Artist Name"
            coverUrl={cover}
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={75} />}
      />
    </>
  ),
};

export const ActiveStates: Story = {
  render: () => (
    <>
      <PlayerBar.SeekBar
        progress={58}
        elapsedSeconds={213}
        remainingSeconds={987}
      />
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Crystalized"
            artist="XX"
            coverUrl={cover}
          />
        }
        center={
          <PlayerBar.Controls isPlaying isShuffleActive repeatMode="all" />
        }
        right={<PlayerBar.Volume defaultValue={60} />}
      />
    </>
  ),
};

export const NoArtwork: Story = {
  render: () => (
    <>
      <PlayerBar.SeekBar
        progress={10}
        elapsedSeconds={37}
        remainingSeconds={154}
      />
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Untitled Track"
            artist="Unknown Artist"
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={30} />}
      />
    </>
  ),
};

export const LongMetadata: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <PlayerBar.SeekBar
        progress={72}
        elapsedSeconds={1234}
        remainingSeconds={321}
      />
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="An Incredibly, Ridiculously Long Song Title That Should Truncate Nicely"
            artist="A Very Long Artist Name Featuring Another Long Artist With Even More Characters"
            coverUrl={cover}
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={50} />}
      />
    </div>
  ),
};

export const SeekOnlyInteractive: Story = {
  render: () => {
    const [progress, setProgress] = useState(30);
    const onSeek = useCallback((p: number) => setProgress(p), []);
    return (
      <div style={{ padding: 16 }}>
        <PlayerBar.SeekBar
          progress={progress}
          elapsedSeconds={Math.floor((progress / 100) * 240)}
          remainingSeconds={240 - Math.floor((progress / 100) * 240)}
          onSeek={onSeek}
        />
      </div>
    );
  },
};

export const SeekLoading: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <PlayerBar.SeekBar
        progress={50}
        elapsedSeconds={120}
        remainingSeconds={120}
        isLoading
      />
    </div>
  ),
};
