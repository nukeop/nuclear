import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC } from 'react';

import type {
  CustomSettingDefinition,
  CustomWidgetProps,
} from '@nuclearplayer/plugin-sdk';

import { CustomWidgetField } from './CustomWidgetField';

const PLUGIN_ID = 'lastfm';

const makeDefinition = (
  overrides?: Partial<CustomSettingDefinition>,
): CustomSettingDefinition => ({
  id: 'auth-session',
  title: 'Last.fm Account',
  category: 'integrations',
  kind: 'custom',
  widgetId: 'auth',
  source: { type: 'plugin', pluginId: PLUGIN_ID },
  ...overrides,
});

vi.mock('../../services/widgetRegistry', async () => {
  const { createWidgetRegistry } = await vi.importActual<
    typeof import('../../services/widgetRegistry')
  >('../../services/widgetRegistry');

  const testRegistry = createWidgetRegistry();
  return {
    createWidgetRegistry,
    widgetRegistry: testRegistry,
  };
});

const getTestRegistry = async () => {
  const { widgetRegistry } = await import('../../services/widgetRegistry');
  return widgetRegistry;
};

describe('CustomWidgetField', () => {
  beforeEach(async () => {
    const registry = await getTestRegistry();
    registry.unregister(PLUGIN_ID, 'auth');
  });

  it('renders a widget that displays its value', async () => {
    const AuthWidget: FC<CustomWidgetProps> = ({ value }) => {
      const session = value as { username: string } | undefined;
      return session ? (
        <span data-testid="auth-status">Connected as {session.username}</span>
      ) : (
        <span data-testid="auth-status">Not connected</span>
      );
    };

    const registry = await getTestRegistry();
    registry.register(PLUGIN_ID, 'auth', AuthWidget);

    const { rerender } = render(
      <CustomWidgetField
        definition={makeDefinition()}
        value={undefined}
        setValue={vi.fn()}
      />,
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'Not connected',
    );

    rerender(
      <CustomWidgetField
        definition={makeDefinition()}
        value={{ username: 'testuser' }}
        setValue={vi.fn()}
      />,
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent(
      'Connected as testuser',
    );
  });

  it('allows the widget to call setValue', async () => {
    const SetValueWidget: FC<CustomWidgetProps> = ({ setValue }) => (
      <button
        data-testid="connect-button"
        onClick={() => setValue({ sessionKey: 'new-key' })}
      >
        Connect
      </button>
    );

    const registry = await getTestRegistry();
    registry.register(PLUGIN_ID, 'auth', SetValueWidget);

    const setValue = vi.fn();
    render(
      <CustomWidgetField
        definition={makeDefinition()}
        value={undefined}
        setValue={setValue}
      />,
    );

    await userEvent.click(screen.getByTestId('connect-button'));

    expect(setValue).toHaveBeenCalledWith({ sessionKey: 'new-key' });
  });

  it('throws when the widget is not registered', async () => {
    expect(() =>
      render(
        <CustomWidgetField
          definition={makeDefinition()}
          value={undefined}
          setValue={vi.fn()}
        />,
      ),
    ).toThrow('Custom widget "auth" not found for plugin "lastfm"');
  });
});
