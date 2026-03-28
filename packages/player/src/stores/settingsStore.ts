import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import type {
  SettingDefinition,
  SettingSource,
  SettingValue,
} from '@nuclearplayer/plugin-sdk';

import { reportError } from '../utils/logging';

const SETTINGS_FILE = 'settings.json';
const store = new LazyStore(SETTINGS_FILE);

type Registry = Record<string, SettingDefinition>;
type Values = Record<string, SettingValue>;

type State = {
  definitions: Registry;
  values: Values;
  loaded: boolean;
  loadFromDisk: () => Promise<void>;
  register: (
    definitions: SettingDefinition[],
    source: SettingSource,
  ) => string[];
  getValue: (fullyQualifiedId: string) => SettingValue;
  setValue: (fullyQualifiedId: string, value: SettingValue) => Promise<void>;
};

export const useSettingsStore = create<State>((set, get) => ({
  definitions: {},
  values: {},
  loaded: false,
  loadFromDisk: async () => {
    try {
      const storeEntries = await store.entries();
      const loadedValues: Values = {};
      for (const [key, entryValue] of storeEntries) {
        loadedValues[String(key)] = entryValue as SettingValue;
      }
      set({ values: loadedValues, loaded: true });
    } catch (error) {
      set({ loaded: true });
      reportError('settings', {
        userMessage: 'Failed to load settings from disk',
        error,
      });
    }
  },
  register: (definitions, source) => {
    const fullyQualifiedIds: string[] = [];
    const definitionsMap: Registry = { ...get().definitions };
    for (const definition of definitions) {
      const fullyQualifiedId = normalizeId(source, definition.id);
      const fullDefinition: SettingDefinition = {
        ...definition,
        source,
      };
      definitionsMap[fullyQualifiedId] = fullDefinition;
      fullyQualifiedIds.push(fullyQualifiedId);
    }
    set({ definitions: definitionsMap });
    return fullyQualifiedIds;
  },
  getValue: (fullyQualifiedId) => {
    const { values, definitions } = get();
    const currentValue = values[fullyQualifiedId];
    if (currentValue !== undefined) {
      return currentValue;
    }
    return definitions[fullyQualifiedId]?.default;
  },
  setValue: async (fullyQualifiedId, value) => {
    const nextValues = { ...get().values, [fullyQualifiedId]: value };
    set({ values: nextValues });
    try {
      await store.set(fullyQualifiedId, value as unknown);
      await store.save();
    } catch (error) {
      reportError('settings', {
        userMessage: 'Failed to persist settings to disk',
        error,
      });
    }
  },
}));

const normalizeId = (source: SettingSource, id: string): string => {
  if (source.type === 'plugin') {
    return `plugin.${source.pluginId}.${id}`;
  }
  return `core.${id}`;
};

export const initializeSettingsStore = async (): Promise<void> => {
  await useSettingsStore.getState().loadFromDisk();
};

export const registerCoreSettings = (
  definitions: SettingDefinition[],
): string[] => {
  return useSettingsStore.getState().register(definitions, { type: 'core' });
};

export const getSetting = (fullyQualifiedId: string): SettingValue =>
  useSettingsStore.getState().getValue(fullyQualifiedId);

export const setSetting = async (
  fullyQualifiedId: string,
  value: SettingValue,
): Promise<void> =>
  useSettingsStore.getState().setValue(fullyQualifiedId, value);
