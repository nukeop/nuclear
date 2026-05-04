import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PluginStoreItem } from './PluginStoreItem';

describe('PluginStoreItem', () => {
  const defaultProps = {
    name: 'YouTube Music',
    description:
      'Stream music directly from YouTube Music with full search and playlist support.',
    author: 'Nuclear Team',
    categories: ['Streaming', 'Metadata'],
    onInstall: vi.fn(),
  };

  it('(Snapshot) renders default state', () => {
    const { container } = render(<PluginStoreItem {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders installed state', () => {
    const { container } = render(
      <PluginStoreItem {...defaultProps} isInstalled />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders installing state', () => {
    const { container } = render(
      <PluginStoreItem {...defaultProps} isInstalling />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with custom labels', () => {
    const { container } = render(
      <PluginStoreItem
        {...defaultProps}
        labels={{
          install: 'Get',
          installing: 'Getting...',
          installed: 'Got it',
          by: 'from',
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with long description', () => {
    const { container } = render(
      <PluginStoreItem
        {...defaultProps}
        description="This is a very long description that should be truncated after two lines. It contains a lot of text that explains what the plugin does in great detail, including all the features and capabilities it provides to users."
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onInstall when install button is clicked', async () => {
    const user = userEvent.setup();
    const handleInstall = vi.fn();

    const { getByRole } = render(
      <PluginStoreItem {...defaultProps} onInstall={handleInstall} />,
    );

    await user.click(getByRole('button', { name: /install/i }));

    expect(handleInstall).toHaveBeenCalledTimes(1);
  });

  it('does not call onInstall when already installed', () => {
    const handleInstall = vi.fn();

    const { getByRole } = render(
      <PluginStoreItem
        {...defaultProps}
        isInstalled
        onInstall={handleInstall}
      />,
    );

    const button = getByRole('button', { name: /installed/i });
    expect(button).toBeDisabled();
  });

  it('does not call onInstall when installing', async () => {
    const handleInstall = vi.fn();

    const { getByRole } = render(
      <PluginStoreItem
        {...defaultProps}
        isInstalling
        onInstall={handleInstall}
      />,
    );

    const button = getByRole('button', { name: /installing/i });
    expect(button).toBeDisabled();
  });

  it('displays category badges', () => {
    const { getByText } = render(
      <PluginStoreItem
        {...defaultProps}
        categories={['Metadata', 'Streaming']}
      />,
    );

    expect(getByText('Metadata')).toBeInTheDocument();
    expect(getByText('Streaming')).toBeInTheDocument();
  });

  it('displays a badge from the legacy category prop', () => {
    const { getByText } = render(
      <PluginStoreItem
        {...defaultProps}
        categories={undefined}
        category="Lyrics"
      />,
    );

    expect(getByText('Lyrics')).toBeInTheDocument();
  });

  it('displays the latest version', () => {
    const { getByTestId } = render(
      <PluginStoreItem {...defaultProps} version="2.1.0" />,
    );

    expect(getByTestId('plugin-store-item-version')).toHaveTextContent(
      'v2.1.0',
    );
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <PluginStoreItem {...defaultProps} className="custom-class" />,
    );

    expect(getByTestId('plugin-store-item')).toHaveClass('custom-class');
  });
});
