import type {
  SettingDefinition,
  SettingsHost,
  SettingSource,
  SettingValue,
} from '@nuclearplayer/plugin-sdk';

import { useSettingsStore } from '../stores/settingsStore';

const normalizeId = (source: SettingSource, id: string): string => {
  if (source.type === 'plugin') {
    return `plugin.${source.pluginId}.${id}`;
  }
  return `core.${id}`;
};

const getGlobalSetting = async <T extends SettingValue = SettingValue>(
  id: string,
): Promise<T | undefined> => {
  return useSettingsStore.getState().getValue(id) as T | undefined;
};

const setGlobalSetting = async (
  id: string,
  value: SettingValue,
): Promise<void> => {
  await useSettingsStore.getState().setValue(id, value);
};

export const createPluginSettingsHost = (
  pluginId: string,
  pluginName?: string,
): SettingsHost => {
  const pluginSource: SettingSource = { type: 'plugin', pluginId, pluginName };
  return {
    register: async (definitions: SettingDefinition[]) => {
      const registeredIds = useSettingsStore
        .getState()
        .register(definitions, pluginSource);
      return { registered: registeredIds };
    },
    get: async <T extends SettingValue = SettingValue>(id: string) => {
      const fullyQualifiedId = normalizeId(pluginSource, id);
      const currentValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId);
      return currentValue as T | undefined;
    },
    set: async (id: string, value: SettingValue) => {
      const fullyQualifiedId = normalizeId(pluginSource, id);
      await useSettingsStore.getState().setValue(fullyQualifiedId, value);
    },
    getGlobal: getGlobalSetting,
    setGlobal: setGlobalSetting,
    subscribe: <T extends SettingValue = SettingValue>(
      id: string,
      listener: (value: T | undefined) => void,
    ) => {
      const fullyQualifiedId = normalizeId(pluginSource, id);
      let previousValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId) as T | undefined;
      const unsubscribe = useSettingsStore.subscribe((state) => {
        const nextValue = state.getValue(fullyQualifiedId) as T | undefined;
        if (nextValue !== previousValue) {
          previousValue = nextValue;
          listener(nextValue);
        }
      });
      return unsubscribe;
    },
  };
};

export const createCoreSettingsHost = (): SettingsHost => {
  const coreSource: SettingSource = { type: 'core' };
  return {
    register: async (definitions: SettingDefinition[]) => {
      const registeredIds = useSettingsStore
        .getState()
        .register(definitions, coreSource);
      return { registered: registeredIds };
    },
    get: async <T extends SettingValue = SettingValue>(id: string) => {
      const fullyQualifiedId = normalizeId(coreSource, id);
      const currentValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId);
      return currentValue as T | undefined;
    },
    set: async (id: string, value: SettingValue) => {
      const fullyQualifiedId = normalizeId(coreSource, id);
      await useSettingsStore.getState().setValue(fullyQualifiedId, value);
    },
    getGlobal: getGlobalSetting,
    setGlobal: setGlobalSetting,
    subscribe: <T extends SettingValue = SettingValue>(
      id: string,
      listener: (value: T | undefined) => void,
    ) => {
      const fullyQualifiedId = normalizeId(coreSource, id);
      let previousValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId) as T | undefined;
      const unsubscribe = useSettingsStore.subscribe((state) => {
        const nextValue = state.getValue(fullyQualifiedId) as T | undefined;
        if (nextValue !== previousValue) {
          previousValue = nextValue;
          listener(nextValue);
        }
      });
      return unsubscribe;
    },
  };
};

export const coreSettingsHost: SettingsHost = createCoreSettingsHost();
