import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';

import {
  ConnectionStatusLabels,
  NuclearJam,
  NuclearJamSearchBarLabels,
} from '@nuclearplayer/ui';

const labels: NuclearJamSearchBarLabels = {
  placeholder: 'Search for music',
};

const connectionStatusLabels: ConnectionStatusLabels = {
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  failed: 'Disconnected',
};

const meta = {
  title: 'Remote/NuclearJam/SearchBar',
  component: NuclearJam.SearchBar,
  tags: ['autodocs'],
} satisfies Meta<typeof NuclearJam.SearchBar>;

export default meta;

export const InHeader = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="surface-background">
        <NuclearJam.Header
          connectionStatus="connected"
          connectionStatusLabels={connectionStatusLabels}
        >
          <NuclearJam.SearchBar
            value={value}
            onChange={setValue}
            labels={labels}
          />
        </NuclearJam.Header>
      </div>
    );
  },
};

export const InHeaderWithValue = {
  render: () => {
    const [value, setValue] = useState('King Gizzard');

    return (
      <div className="surface-background">
        <NuclearJam.Header
          connectionStatus="connected"
          connectionStatusLabels={connectionStatusLabels}
        >
          <NuclearJam.SearchBar
            value={value}
            onChange={setValue}
            labels={labels}
          />
        </NuclearJam.Header>
      </div>
    );
  },
};
