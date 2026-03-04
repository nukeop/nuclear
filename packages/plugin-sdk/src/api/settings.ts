import type {
  CustomWidgetComponent,
  SettingDefinition,
  SettingsHost,
  SettingValue,
  WidgetRegistry,
} from '../types/settings';

export class Settings {
  #host?: SettingsHost;
  #widgetRegistry?: WidgetRegistry;
  #pluginId?: string;

  constructor(
    host?: SettingsHost,
    widgetRegistry?: WidgetRegistry,
    pluginId?: string,
  ) {
    this.#host = host;
    this.#widgetRegistry = widgetRegistry;
    this.#pluginId = pluginId;
  }

  #withHost<T>(fn: (host: SettingsHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Settings host not available');
    }
    return fn(host);
  }

  register(defs: SettingDefinition[]) {
    return this.#withHost((h) => h.register(defs));
  }

  get<T extends SettingValue = SettingValue>(id: string) {
    return this.#withHost((h) => h.get<T>(id));
  }

  set<T extends SettingValue = SettingValue>(id: string, value: T) {
    return this.#withHost((h) => h.set<T>(id, value));
  }

  subscribe<T extends SettingValue = SettingValue>(
    id: string,
    listener: (value: T | undefined) => void,
  ) {
    return this.#withHost((h) => h.subscribe<T>(id, listener));
  }

  registerWidget(widgetId: string, component: CustomWidgetComponent) {
    if (!this.#widgetRegistry || !this.#pluginId) {
      throw new Error('Widget registry not available');
    }
    this.#widgetRegistry.register(this.#pluginId, widgetId, component);
  }

  unregisterWidget(widgetId: string) {
    if (!this.#widgetRegistry || !this.#pluginId) {
      throw new Error('Widget registry not available');
    }
    this.#widgetRegistry.unregister(this.#pluginId, widgetId);
  }
}
