import type { FC } from 'react';

export type SettingSource =
  | { type: 'core' }
  | { type: 'plugin'; pluginId: string; pluginName?: string };

export type SettingCategory = string;

export type BooleanWidget = { type: 'toggle' };
export type NumberWidget =
  | { type: 'slider'; min?: number; max?: number; step?: number; unit?: string }
  | {
      type: 'number-input';
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
    };
export type StringWidget =
  | { type: 'text'; placeholder?: string }
  | { type: 'password'; placeholder?: string }
  | { type: 'textarea'; placeholder?: string; rows?: number }
  | { type: 'info' };
export type EnumWidget = { type: 'select' } | { type: 'radio' };

export type BooleanSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'boolean';
  default?: boolean;
  hidden?: boolean;
  source?: SettingSource;
  widget?: BooleanWidget;
};

export type NumberSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'number';
  default?: number;
  hidden?: boolean;
  source?: SettingSource;
  widget?: NumberWidget;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

export type StringFormat = 'text' | 'url' | 'path' | 'token' | 'language';

export type StringSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'string';
  default?: string;
  hidden?: boolean;
  source?: SettingSource;
  widget?: StringWidget;
  format?: StringFormat;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

export type EnumOption = { value: string; label: string };

export type EnumSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'enum';
  options: EnumOption[];
  default?: string;
  hidden?: boolean;
  source?: SettingSource;
  widget?: EnumWidget;
};

export type CustomSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'custom';
  widgetId: string;
  default?: SettingValue;
  hidden?: boolean;
  source?: SettingSource;
};

export type SettingDefinition =
  | BooleanSettingDefinition
  | NumberSettingDefinition
  | StringSettingDefinition
  | EnumSettingDefinition
  | CustomSettingDefinition;

export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable };

export type SettingValue = JsonSerializable | undefined;

export type CustomWidgetProps<API = unknown> = {
  value: SettingValue | undefined;
  setValue: (value: SettingValue) => void;
  definition: CustomSettingDefinition;
  api: API;
};

export type CustomWidgetComponent<API = unknown> = FC<CustomWidgetProps<API>>;

export type SettingsRegistration = {
  settings: SettingDefinition[];
};

export type SettingsRegistrationResult = {
  registered: string[];
};

export type SettingsHost = {
  register(defs: SettingDefinition[]): Promise<SettingsRegistrationResult>;
  get<T extends SettingValue = SettingValue>(
    id: string,
  ): Promise<T | undefined>;
  set<T extends SettingValue = SettingValue>(
    id: string,
    value: T,
  ): Promise<void>;
  subscribe<T extends SettingValue = SettingValue>(
    id: string,
    listener: (value: T | undefined) => void,
  ): () => void;
};
