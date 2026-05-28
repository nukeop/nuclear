import type { Meta } from '@storybook/react-vite';

import { NuclearJam } from '@nuclearplayer/ui';

const meta = {
  title: 'Remote/NuclearJam/Header',
  component: NuclearJam.Header,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Header>;

export default meta;

export const Connecting = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header connectionStatus="connecting" />
    </div>
  ),
};

export const Connected = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header connectionStatus="connected" />
    </div>
  ),
};

export const Reconnecting = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header connectionStatus="reconnecting" />
    </div>
  ),
};

export const Failed = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header connectionStatus="failed" />
    </div>
  ),
};
