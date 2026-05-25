import type { Meta } from '@storybook/react-vite';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/Controls',
  component: NuclearJam.Controls,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Controls>;

export default meta;

const noop = () => {};

export const Playing = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        isPlaying
        shuffleActive={false}
        repeatMode="off"
        progress={35}
        elapsedSeconds={88}
        remainingSeconds={163}
        onPlayPause={noop}
        onNext={noop}
        onPrevious={noop}
        onShuffleToggle={noop}
        onRepeatToggle={noop}
        onDiscoveryToggle={noop}
        onSeek={noop}
      />
    </div>
  ),
};

export const TogglesActive = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        isPlaying={false}
        shuffleActive
        repeatMode="all"
        isDiscoveryActive
        progress={62}
        elapsedSeconds={212}
        remainingSeconds={130}
        onPlayPause={noop}
        onNext={noop}
        onPrevious={noop}
        onShuffleToggle={noop}
        onRepeatToggle={noop}
        onDiscoveryToggle={noop}
        onSeek={noop}
      />
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        isPlaying={false}
        isLoading
        shuffleActive={false}
        repeatMode="off"
        progress={0}
        elapsedSeconds={0}
        remainingSeconds={0}
        onPlayPause={noop}
        onNext={noop}
        onPrevious={noop}
        onShuffleToggle={noop}
        onRepeatToggle={noop}
        onDiscoveryToggle={noop}
        onSeek={noop}
      />
    </div>
  ),
};

export const RepeatOne = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        isPlaying
        shuffleActive={false}
        repeatMode="one"
        progress={80}
        elapsedSeconds={247}
        remainingSeconds={62}
        onPlayPause={noop}
        onNext={noop}
        onPrevious={noop}
        onShuffleToggle={noop}
        onRepeatToggle={noop}
        onDiscoveryToggle={noop}
        onSeek={noop}
      />
    </div>
  ),
};
