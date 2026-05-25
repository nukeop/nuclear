import type { Meta } from '@storybook/react-vite';
import { ComponentProps } from 'react';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/Controls',
  component: NuclearJam.Controls,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Controls>;

export default meta;

const noop = () => {};

const defaultProps: ComponentProps<typeof NuclearJam.Controls> = {
  isPlaying: false,
  shuffleActive: false,
  repeatMode: 'off',
  progress: 35,
  elapsedSeconds: 88,
  remainingSeconds: 163,
  onPlayPause: noop,
  onNext: noop,
  onPrevious: noop,
  onShuffleToggle: noop,
  onRepeatToggle: noop,
  onDiscoveryToggle: noop,
  onSeek: noop,
};

export const Playing = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls {...defaultProps} isPlaying />
    </div>
  ),
};

export const TogglesActive = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        {...defaultProps}
        shuffleActive
        repeatMode="all"
        isDiscoveryActive
      />
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        {...defaultProps}
        isLoading
        progress={0}
        elapsedSeconds={0}
        remainingSeconds={0}
      />
    </div>
  ),
};

export const RepeatOne = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Controls
        {...defaultProps}
        isPlaying
        repeatMode="one"
        progress={80}
        elapsedSeconds={247}
        remainingSeconds={62}
      />
    </div>
  ),
};
