import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/LyricsTopBar',
  component: NuclearJam.LyricsTopBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="surface-background w-96">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'First Test Track',
    artist: 'Test Artist',
    onBack: fn(),
    labels: { back: 'Back' },
  },
} satisfies Meta<typeof NuclearJam.LyricsTopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    title: 'A Very Long Placeholder Song Title That Does Not Fit on One Line',
  },
};
