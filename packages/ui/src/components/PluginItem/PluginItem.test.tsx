import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Music } from 'lucide-react';

import { PluginItem } from './PluginItem';

describe('PluginItem', () => {
  it('(Snapshot) renders with all props', () => {
    const { asFragment } = render(
      <PluginItem
        className="border-accent-red"
        name="YouTube Music"
        author="Nuclear Team"
        description="Stream music directly from YouTube Music with full search and playlist support."
        icon={<Music size={24} />}
        onViewDetails={() => {}}
        loadTimeMs={200}
        warning
        warningText="Loaded with errors"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) renders disabled state', () => {
    const { asFragment } = render(
      <PluginItem
        name="Disabled Plugin"
        author="Nuclear Team"
        description="This plugin is currently disabled."
        icon={<Music size={24} />}
        disabled
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) renders rightAccessory content', () => {
    const { asFragment } = render(
      <PluginItem
        name="Accessory Plugin"
        author="Nuclear Team"
        description="Has accessory on the right."
        rightAccessory={<span>Accessory</span>}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('displays the version', () => {
    const { getByTestId } = render(
      <PluginItem
        name="YouTube Music"
        author="Nuclear Team"
        description="Stream music from YouTube."
        version="1.2.3"
      />,
    );

    expect(getByTestId('plugin-version')).toHaveTextContent('v1.2.3');
  });

  it('displays an update available indicator', () => {
    const { getByTestId } = render(
      <PluginItem
        name="YouTube Music"
        author="Nuclear Team"
        description="Stream music from YouTube."
        version="1.2.3"
        updateAvailable
      />,
    );

    expect(getByTestId('plugin-update-available')).toHaveTextContent(
      'Update available',
    );
  });

  it.each([
    {
      title: 'reloads the plugin when reload button is clicked',
      triggerProp: 'onReload' as const,
      testId: 'plugin-action-reload',
    },
    {
      title: 'removes the plugin when remove button is clicked',
      triggerProp: 'onRemove' as const,
      testId: 'plugin-action-remove',
    },
  ])('$title', async ({ triggerProp, testId }) => {
    const handler = vi.fn();

    const { getByTestId } = render(
      <PluginItem
        name="YouTube Music"
        author="Nuclear Team"
        description="Stream music directly from YouTube Music with full search and playlist support."
        {...{ [triggerProp]: handler }}
      />,
    );

    const actionButton = getByTestId(testId);
    await userEvent.click(actionButton);

    expect(handler).toHaveBeenCalled();
  });
});
