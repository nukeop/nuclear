import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { NuclearJam } from '@nuclearplayer/ui';

import {
  LINE_DURATION_MS,
  LYRIC_LINES,
  LYRICS_LABELS,
  PLAIN_LYRICS,
  SYNCED_LYRICS,
} from './fixtures/jamLyrics';

const meta = {
  title: 'Remote/NuclearJam/Lyrics',
  component: NuclearJam.Lyrics,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="surface-background flex h-96 flex-col">
        <Story />
      </div>
    ),
  ],
  args: {
    state: { status: 'nothingPlaying' },
    positionMs: 0,
    textSize: 1,
    onSeek: fn(),
    labels: LYRICS_LABELS,
  },
} satisfies Meta<typeof NuclearJam.Lyrics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NothingPlaying: Story = {};

export const Loading: Story = {
  args: { state: { status: 'loading' } },
};

export const NotFound: Story = {
  args: { state: { status: 'notFound' } },
};

export const LoadError: Story = {
  args: { state: { status: 'error' } },
};

export const Instrumental: Story = {
  args: {
    state: {
      status: 'found',
      lyrics: { type: 'instrumental', metadata: {} },
    },
  },
};

export const Plain: Story = {
  args: { state: { status: 'found', lyrics: PLAIN_LYRICS } },
};

export const Synced: Story = {
  args: {
    state: { status: 'found', lyrics: SYNCED_LYRICS },
    positionMs: 6000,
  },
  argTypes: {
    positionMs: {
      control: {
        type: 'range',
        min: 0,
        max: LYRIC_LINES.length * LINE_DURATION_MS,
        step: 100,
      },
    },
    textSize: {
      control: { type: 'range', min: 0, max: 2, step: 1 },
    },
  },
};
