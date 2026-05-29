import type {
  SettingDefinition,
  SettingsHost,
  SettingSource,
  SettingValue,
} from '../../types/settings';

export class InMemorySettingsHost implements SettingsHost {
  private definitions = new Map<string, SettingDefinition>();
  private values = new Map<string, SettingValue>();
  private listeners = new Map<
    string,
    Set<(value: SettingValue | undefined) => void>
  >();
  private readonly source: SettingSource;

  constructor(source: SettingSource) {
    this.source = source;
  }

  private fullyQualified(id: string) {
    if (this.source.type === 'plugin') {
      return `plugin.${this.source.pluginId}.${id}`;
    }
    return `core.${id}`;
  }

  async register(definitions: SettingDefinition[]) {
    const registered: string[] = [];
    for (const definition of definitions) {
      const fullyQualifiedId = this.fullyQualified(definition.id);
      const resolved: SettingDefinition = {
        ...definition,
        id: fullyQualifiedId,
        source: this.source,
      };
      this.definitions.set(fullyQualifiedId, resolved);
      if (
        definition.default !== undefined &&
        !this.values.has(fullyQualifiedId)
      ) {
        this.values.set(fullyQualifiedId, definition.default);
      }
      registered.push(fullyQualifiedId);
    }
    return { registered };
  }

  async get<T extends SettingValue = SettingValue>(id: string) {
    const fullyQualifiedId = this.fullyQualified(id);
    return this.values.get(fullyQualifiedId) as T | undefined;
  }

  async set<T extends SettingValue = SettingValue>(id: string, value: T) {
    const fullyQualifiedId = this.fullyQualified(id);
    this.values.set(fullyQualifiedId, value);
    const listenerFunctions = this.listeners.get(fullyQualifiedId);
    if (listenerFunctions) {
      for (const fn of listenerFunctions) {
        fn(value);
      }
    }
  }

  async getGlobal<T extends SettingValue = SettingValue>(id: string) {
    return this.values.get(id) as T | undefined;
  }

  async setGlobal<T extends SettingValue = SettingValue>(id: string, value: T) {
    this.values.set(id, value);
    const listenerFunctions = this.listeners.get(id);
    if (listenerFunctions) {
      for (const fn of listenerFunctions) {
        fn(value);
      }
    }
  }

  subscribe<T extends SettingValue = SettingValue>(
    id: string,
    listener: (value: T | undefined) => void,
  ) {
    const fullyQualifiedId = this.fullyQualified(id);
    let listenerSet = this.listeners.get(fullyQualifiedId);
    if (!listenerSet) {
      listenerSet = new Set();
      this.listeners.set(fullyQualifiedId, listenerSet);
    }
    const wrapped = (value: SettingValue | undefined) =>
      listener(value as T | undefined);
    listenerSet.add(wrapped);
    return () => {
      const current = this.listeners.get(fullyQualifiedId);
      if (!current) {
        return;
      }
      current.delete(wrapped);
    };
  }
}
