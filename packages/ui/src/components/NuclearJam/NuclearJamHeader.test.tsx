import { render, screen } from '@testing-library/react';

import { NuclearJamHeader } from './NuclearJamHeader';

const labels = {
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  failed: 'Disconnected',
};

describe('NuclearJamHeader', () => {
  it('(Snapshot) renders the connected header', () => {
    const { container } = render(
      <NuclearJamHeader
        connectionStatus="connected"
        connectionStatusLabels={labels}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('shows the label for the current connection status', () => {
    render(
      <NuclearJamHeader
        connectionStatus="reconnecting"
        connectionStatusLabels={labels}
      />,
    );

    expect(screen.getByTestId('connection-status-badge')).toHaveTextContent(
      'Reconnecting',
    );
  });

  it('shows the failed label when disconnected', () => {
    render(
      <NuclearJamHeader
        connectionStatus="failed"
        connectionStatusLabels={labels}
      />,
    );

    expect(screen.getByTestId('connection-status-badge')).toHaveTextContent(
      'Disconnected',
    );
  });
});
