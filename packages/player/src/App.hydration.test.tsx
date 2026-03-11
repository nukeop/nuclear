import './test/mocks/plugin-fs';

import { hydratePluginsFromRegistry } from './services/plugins/pluginBootstrap';
import { usePluginStore } from './stores/pluginStore';
import { useStartupStore } from './stores/startupStore';
import { PluginFsMock } from './test/mocks/plugin-fs';
import { resetInMemoryTauriStore } from './test/utils/inMemoryTauriStore';
import { seedRegistryEntry } from './test/utils/seedPluginRegistry';
import { createPluginFolder } from './test/utils/testPluginFolder';
import { PluginsWrapper } from './views/Plugins/Plugins.test-wrapper';

// These tests check what happens on program startup, when we're loading plugins from the managed dir
describe('App plugin hydration', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePluginStore.setState({ plugins: {} });
    PluginFsMock.reset();
  });

  it('(Hydration) loads a disabled plugin from registry and shows it disabled', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/plain/1.0.0',
      { id: 'plain', version: '1.0.0' },
    );

    await seedRegistryEntry({ id: 'plain', version: '1.0.0', enabled: false });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins).toHaveLength(1);
    expect(plugins[0].enabled).toBe(false);
  });

  it('(Hydration) loads an enabled plugin from registry and enables it', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/enabled/1.0.0',
      { id: 'enabled', version: '1.0.0' },
    );
    await seedRegistryEntry({ id: 'enabled', enabled: true });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins.map((p) => ({ name: p.name, enabled: p.enabled })))
      .toMatchInlineSnapshot(`
      [
        {
          "enabled": true,
          "name": "enabled",
        },
      ]
    `);
    expect(plugins[0].enabled).toBe(true);
  });

  it('(Hydration) loads multiple plugins in installedAt ascending order', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/second/1.0.0',
      { id: 'second', version: '1.0.0' },
    );
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/first/1.0.0',
      { id: 'first', version: '1.0.0' },
    );

    await seedRegistryEntry({
      id: 'second',
      installedAt: '2025-01-02T00:00:00.000Z',
      lastUpdatedAt: '2025-01-02T00:00:00.000Z',
    });
    await seedRegistryEntry({
      id: 'first',
      installedAt: '2025-01-01T00:00:00.000Z',
      lastUpdatedAt: '2025-01-01T00:00:00.000Z',
    });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins.map((p) => ({ name: p.name, enabled: p.enabled })))
      .toMatchInlineSnapshot(`
      [
        {
          "enabled": false,
          "name": "first",
        },
        {
          "enabled": false,
          "name": "second",
        },
      ]
    `);
    // Should be in installedAt ascending order: 'first' then 'second'
    expect(plugins.map((p) => p.name)).toEqual(['first', 'second']);
  });

  it('(Hydration) ignores plugins outside the managed directory', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/managed/1.0.0',
      { id: 'managed', version: '1.0.0' },
    );
    await seedRegistryEntry({
      id: 'managed',
      enabled: false,
    });

    await seedRegistryEntry({
      id: 'bundled',
      path: '/opt/nuclear/plugins/bundled/1.0.0',
    });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(
      plugins.map((plugin) => ({
        name: plugin.name,
        enabled: plugin.enabled,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "enabled": false,
          "name": "managed",
        },
      ]
    `);
  });

  it('(Hydration) logs and persists warnings for failed plugin load but keeps the registry entry', async () => {
    // Seed a broken plugin (no files created under managed dir)
    await seedRegistryEntry({ id: 'broken', version: '1.0.0', enabled: false });

    await hydratePluginsFromRegistry();

    // Should not appear in UI
    await PluginsWrapper.mount();
    expect(PluginsWrapper.getPlugins()).toHaveLength(0);

    // But the registry entry remains and contains warnings
    const { getRegistryEntry } =
      await import('./services/plugins/pluginRegistry');
    const entry = await getRegistryEntry('broken');
    expect(entry).toBeDefined();
    expect(entry?.warnings && entry.warnings.length).toBeGreaterThan(0);
    expect(entry?.warnings?.[0]).toBe('"undefined" is not valid JSON');
  });

  it('(Hydration) exposes status flags and timings (total duration and per-plugin durations)', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/first/1.0.0',
      { id: 'first', version: '1.0.0' },
    );
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/second/1.0.0',
      { id: 'second', version: '1.0.0' },
    );
    await seedRegistryEntry({ id: 'first', version: '1.0.0' });
    await seedRegistryEntry({ id: 'second', version: '1.0.0' });

    const seq = [1000, 1000, 1200, 1200, 1500, 1500];
    const spy = vi
      .spyOn(Date, 'now')
      .mockImplementation(() => (seq.length ? (seq.shift() as number) : 1500));

    useStartupStore.setState({
      isStartingUp: false,
      startupFinishedAt: undefined,
      totalStartupTimeMs: undefined,
      pluginDurations: {},
    });

    await hydratePluginsFromRegistry();

    const startupStoreState = useStartupStore.getState();
    expect(startupStoreState.isStartingUp).toBe(false);
    expect(startupStoreState.totalStartupTimeMs).toBe(500); // 1500 - 1000
    expect(startupStoreState.pluginDurations.first).toBe(200); // 1200 - 1000
    expect(startupStoreState.pluginDurations.second).toBe(300); // 1500 - 1200
    expect(typeof startupStoreState.startupFinishedAt).toBe('string');

    spy.mockRestore();
  });

  it.todo(
    '(Hydration) toggling enable/disable persists to registry and is respected on next startup',
  );
});
