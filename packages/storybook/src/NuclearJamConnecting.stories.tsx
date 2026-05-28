import type { Meta, StoryObj } from '@storybook/react-vite';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/Connecting',
  component: NuclearJam.Connecting,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Connecting>;

export default meta;
type Story = StoryObj<typeof NuclearJam.Connecting>;

export const Default: Story = {
  render: () => (
    <NuclearJam>
      <NuclearJam.Connecting
        labels={{
          title: 'Connecting to Nuclear...',
          subtitle: 'Make sure Nuclear is running and Nuclear Jam is enabled',
        }}
      />
    </NuclearJam>
  ),
};
