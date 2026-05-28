import { describe, expect, it } from 'vitest';

import { NuclearAPI } from '.';
import { InMemorySettingsHost } from '../test/utils/inMemorySettingsHost';
import type { SettingDefinition } from '../types/settings';

describe('Settings (SDK)', () => {
  it('exposes register/get/set/subscribe methods', async () => {
    const host = new InMemorySettingsHost({ type: 'plugin', pluginId: 'p1' });
    const api = new NuclearAPI({ settingsHost: host });

    const definitions: SettingDefinition[] = [
      {
        id: 'feature.enabled',
        title: 'Enabled',
        category: 'Example',
        kind: 'boolean',
        default: false,
      },
    ];

    const res = await api.Settings.register(definitions);
    expect(res.registered).toContain('plugin.p1.feature.enabled');

    const initial = await api.Settings.get<boolean>('feature.enabled');
    expect(initial).toBe(false);

    const values: Array<boolean | undefined> = [];
    const unsubscribe = api.Settings.subscribe<boolean>(
      'feature.enabled',
      (value) => {
        values.push(value);
      },
    );

    await api.Settings.set('feature.enabled', true);
    unsubscribe();

    expect(values.at(-1)).toBe(true);
    const updated = await api.Settings.get<boolean>('feature.enabled');
    expect(updated).toBe(true);
  });

  it('getGlobal/setGlobal bypasses namespace scoping', async () => {
    const host = new InMemorySettingsHost({ type: 'plugin', pluginId: 'p1' });
    const api = new NuclearAPI({ settingsHost: host });

    await api.Settings.setGlobal('core.theme.dark', true);

    const inaccessible = await api.Settings.get('core.theme.dark');
    expect(inaccessible).toBeUndefined();

    const accessible = await api.Settings.getGlobal('core.theme.dark');
    expect(accessible).toBe(true);

    await api.Settings.setGlobal('core.theme.dark', false);
    const updated = await api.Settings.getGlobal('core.theme.dark');
    expect(updated).toBe(false);
  });

  it('throws clearly when host is missing', async () => {
    const api = new NuclearAPI();
    expect(() => api.Settings.get('x')).toThrow('Settings host not available');
    expect(() => api.Settings.set('x', 'y')).toThrow(
      'Settings host not available',
    );
    expect(() => api.Settings.getGlobal('x')).toThrow(
      'Settings host not available',
    );
    expect(() => api.Settings.setGlobal('x', 'y')).toThrow(
      'Settings host not available',
    );
    expect(() => api.Settings.register([])).toThrow(
      'Settings host not available',
    );
    expect(() => api.Settings.subscribe('x', () => {})).toThrow(
      'Settings host not available',
    );
  });
});
