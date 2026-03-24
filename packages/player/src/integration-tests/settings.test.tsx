import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { NuclearAPI } from '@nuclearplayer/plugin-sdk';

import App from '../App';
import { useCoreSetting } from '../hooks/useCoreSetting';
import { registerBuiltInCoreSettings } from '../services/coreSettings';
import {
  coreSettingsHost,
  createPluginSettingsHost,
} from '../services/settingsHost';
import {
  initializeSettingsStore,
  useSettingsStore,
} from '../stores/settingsStore';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';

const TestCoreSettingText: FC<{ id: string; testId: string }> = ({
  id,
  testId,
}) => {
  const [value] = useCoreSetting(id);
  return <div data-testid={testId}>{String(value)}</div>;
};

describe('Settings integration', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
    document.documentElement.removeAttribute('data-theme');
  });

  it('mounts app, loads a fake plugin, and registers plugin settings', async () => {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    render(<App />);

    const pluginHost = createPluginSettingsHost(
      'itest',
      'Integration Test Plugin',
    );
    const api = new NuclearAPI({ settingsHost: pluginHost });

    await api.Settings.register([
      {
        id: 'example.enabled',
        category: 'Example',
        title: 'Enabled',
        kind: 'boolean',
        default: true,
      },
    ]);

    const definitions = useSettingsStore.getState().definitions;
    expect(definitions['plugin.itest.example.enabled']).toBeTruthy();
  });

  it('plugin reads default values and updates settings via NuclearAPI.Settings', async () => {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    const pluginHost = createPluginSettingsHost(
      'itest',
      'Integration Test Plugin',
    );
    const api = new NuclearAPI({ settingsHost: pluginHost });

    await api.Settings.register([
      {
        id: 'example.enabled',
        category: 'Example',
        title: 'Enabled',
        kind: 'boolean',
        default: false,
      },
    ]);

    const initial = await api.Settings.get<boolean>('example.enabled');
    expect(initial).toBe(false);

    await api.Settings.set('example.enabled', true);
    const updated = useSettingsStore
      .getState()
      .getValue('plugin.itest.example.enabled');
    expect(updated).toBe(true);
  });

  it('core sees updated values via core host and hook', async () => {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    render(<TestCoreSettingText id={'general.language'} testId="lang" />);

    const coreApi = new NuclearAPI({ settingsHost: coreSettingsHost });
    await coreApi.Settings.set('general.language', 'fr');

    await waitFor(async () => {
      const node = await screen.findByTestId('lang');
      expect(node).toHaveTextContent('fr');
    });
  });

  it('values persist across reload via Tauri store mock', async () => {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    const coreApi = new NuclearAPI({ settingsHost: coreSettingsHost });
    await coreApi.Settings.set('general.language', 'fr');

    useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    const persisted = await coreApi.Settings.get<string>('general.language');
    expect(persisted).toBe('fr');
  });

  it('dark mode toggle persists across restarts', async () => {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    render(<App />);

    const toggle = await screen.findByRole('switch', { name: 'Toggle theme' });
    await userEvent.click(toggle);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Simulate player restart
    cleanup();
    useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
    await initializeSettingsStore();
    registerBuiltInCoreSettings();

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('switch', { name: 'Toggle theme' }),
      ).toHaveAttribute('aria-checked', 'true');
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
