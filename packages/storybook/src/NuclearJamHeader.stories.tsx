import type { Meta } from '@storybook/react-vite';

import { ConnectionStatusLabels, NuclearJam } from '@nuclearplayer/ui';

const connectionStatusLabels: ConnectionStatusLabels = {
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  failed: 'Disconnected',
};

const meta = {
  title: 'Remote/NuclearJam/Header',
  component: NuclearJam.Header,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.Header>;

export default meta;

export const Connecting = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header
        connectionStatus="connecting"
        connectionStatusLabels={connectionStatusLabels}
      />
    </div>
  ),
};

export const Connected = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header
        connectionStatus="connected"
        connectionStatusLabels={connectionStatusLabels}
      />
    </div>
  ),
};

export const Reconnecting = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header
        connectionStatus="reconnecting"
        connectionStatusLabels={connectionStatusLabels}
      />
    </div>
  ),
};

export const Failed = {
  render: () => (
    <div className="bg-background">
      <NuclearJam.Header
        connectionStatus="failed"
        connectionStatusLabels={connectionStatusLabels}
      />
    </div>
  ),
};
