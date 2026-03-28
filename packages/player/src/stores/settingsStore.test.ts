import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

import {
  createCoreSettingsHost,
  createPluginSettingsHost,
} from '../services/settingsHost';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import {
  getSetting,
  initializeSettingsStore,
  registerCoreSettings,
  setSetting,
  useSettingsStore,
} from './settingsStore';

const { mockReportError, mockEntries, mockSet, mockSave } = vi.hoisted(() => ({
  mockReportError: vi.fn(),
  mockEntries: vi.fn(),
  mockSet: vi.fn(),
  mockSave: vi.fn(),
}));

vi.mock('../utils/logging', () => ({
  reportError: mockReportError,
}));

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../test/utils/inMemoryTauriStore');

  return {
    LazyStore: class MockLazyStore extends mod.LazyStore {
      async entries() {
        const mockResult = mockEntries();
        if (mockResult !== undefined) {
          return mockResult;
        }
        return super.entries();
      }
      async set(key: string, value: unknown) {
        const mockResult = mockSet(key, value);
        if (mockResult !== undefined) {
          return mockResult;
        }
        return super.set(key, value);
      }
      async save() {
        const mockResult = mockSave();
        if (mockResult !== undefined) {
          return mockResult;
        }
        return super.save();
      }
    },
  };
});

describe('useSettingsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetInMemoryTauriStore();
    useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
  });

  describe('initial state', () => {
    it('starts with empty definitions and values, not loaded', async () => {
      const state = useSettingsStore.getState();
      expect(state.definitions).toEqual({});
      expect(state.values).toEqual({});
      expect(state.loaded).toBe(false);
    });
  });

  describe('core settings', () => {
    it('registerCoreSettings registers definitions and exposes defaults', async () => {
      const defs: SettingDefinition[] = [
        {
          id: 'general.language',
          title: 'Language',
          category: 'general',
          kind: 'string',
          default: 'en',
        },
      ];
      const registered = registerCoreSettings(defs);
      expect(registered).toContain('core.general.language');
      const value = useSettingsStore
        .getState()
        .getValue('core.general.language');
      expect(value).toBe('en');
    });

    it('createCoreSettingsHost get/set persists values via store', async () => {
      const host = createCoreSettingsHost();
      await host.set('general.language', 'fr');
      const stored = getSetting('core.general.language');
      expect(stored).toBe('fr');
      const readBack = await host.get<string>('general.language');
      expect(readBack).toBe('fr');
    });

    it('subscribe notifies listeners on value changes', async () => {
      const host = createCoreSettingsHost();
      const seen: Array<string | undefined> = [];
      const unsubscribe = host.subscribe<string>(
        'general.language',
        (value) => {
          seen.push(value);
        },
      );
      await host.set('general.language', 'fr');
      unsubscribe();
      expect(seen[0]).toBe('fr');
    });
  });

  describe('plugin settings', () => {
    it('createPluginSettingsHost prefixes ids and isolates per plugin', async () => {
      const hostA = createPluginSettingsHost('p1', 'Plugin One');
      const hostB = createPluginSettingsHost('p2', 'Plugin Two');

      await hostA.register([
        {
          id: 'feature.enabled',
          title: 'Enabled',
          category: 'Example',
          kind: 'boolean',
          default: false,
        },
      ]);

      await hostB.register([
        {
          id: 'feature.enabled',
          title: 'Enabled',
          category: 'Example',
          kind: 'boolean',
          default: true,
        },
      ]);

      expect(
        useSettingsStore.getState().definitions['plugin.p1.feature.enabled'],
      ).toBeTruthy();
      expect(
        useSettingsStore.getState().definitions['plugin.p2.feature.enabled'],
      ).toBeTruthy();

      await hostA.set('feature.enabled', true);
      const aValue = useSettingsStore
        .getState()
        .getValue('plugin.p1.feature.enabled');
      const bValue = useSettingsStore
        .getState()
        .getValue('plugin.p2.feature.enabled');
      expect(aValue).toBe(true);
      expect(await hostA.get<string>('feature.enabled')).toBe(true);
      expect(bValue).toBe(true);
      expect(await hostB.get<string>('feature.enabled')).toBe(true);

      await hostB.set('feature.enabled', false);
      const aValue2 = useSettingsStore
        .getState()
        .getValue('plugin.p1.feature.enabled');
      const bValue2 = useSettingsStore
        .getState()
        .getValue('plugin.p2.feature.enabled');
      expect(aValue2).toBe(true);
      expect(await hostA.get<string>('feature.enabled')).toBe(true);
      expect(bValue2).toBe(false);
      expect(await hostB.get<string>('feature.enabled')).toBe(false);
    });
  });

  describe('persistence', () => {
    it('initializeSettingsStore loads values from disk using Tauri store', async () => {
      await setSetting('core.general.language', 'fr');
      useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
      await initializeSettingsStore();
      const loaded = getSetting('core.general.language');
      expect(loaded).toBe('fr');
    });

    it('initializeSettingsStore marks loaded and reports error when store read fails', async () => {
      mockEntries.mockImplementationOnce(() =>
        Promise.reject(new Error('store read failed')),
      );

      await initializeSettingsStore();

      expect(useSettingsStore.getState().loaded).toBe(true);
      expect(mockReportError).toHaveBeenCalledWith(
        'settings',
        expect.objectContaining({
          userMessage: 'Failed to load settings from disk',
        }),
      );
    });

    it('setSetting keeps in-memory value and reports error when store save fails', async () => {
      mockSave.mockImplementationOnce(() =>
        Promise.reject(new Error('store save failed')),
      );

      await setSetting('core.general.language', 'he_IL');

      expect(getSetting('core.general.language')).toBe('he_IL');
      expect(mockReportError).toHaveBeenCalledWith(
        'settings',
        expect.objectContaining({
          userMessage: 'Failed to persist settings to disk',
        }),
      );
    });

    it('setSetting keeps in-memory value and reports error when store set fails', async () => {
      mockSet.mockImplementationOnce(() =>
        Promise.reject(new Error('store set failed')),
      );

      await setSetting('core.general.language', 'he_IL');

      expect(getSetting('core.general.language')).toBe('he_IL');
      expect(mockReportError).toHaveBeenCalledWith(
        'settings',
        expect.objectContaining({
          userMessage: 'Failed to persist settings to disk',
        }),
      );
    });
  });
});
