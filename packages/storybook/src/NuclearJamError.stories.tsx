import type { Meta, StoryObj } from '@storybook/react-vite';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/Error',
  component: NuclearJam.Error,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Error>;

export default meta;
type Story = StoryObj<typeof NuclearJam.Error>;

export const Default: Story = {
  render: () => (
    <NuclearJam>
      <NuclearJam.Error
        labels={{
          title: 'Could not connect to Nuclear',
          subtitle:
            'Make sure Nuclear is running and Nuclear Jam is enabled in Settings',
        }}
      />
    </NuclearJam>
  ),
};
