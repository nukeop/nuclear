---
description: How plugins define, read, and update persisted settings in Nuclear.
---

# Settings

## Settings API for Plugins

Persist user preferences, secrets, and configuration with a single API. This guide shows how to define settings, read/write values, and react to changes.

{% hint style="info" %}
Access settings via the API object (api.Settings.\*) or the React hook described below.
{% endhint %}

### Core concepts

* Namespace: the app automatically prefixes setting IDs.
  * Core settings: `core.<id>`
  * Plugin settings: `plugin.<pluginId>.<id>`
  * In your plugin, pass only the bare `id` (e.g. `theme`), skip the prefix.
* Types: boolean | number | string for built-in kinds. Custom widgets can store any JSON-serializable value (objects, arrays, null).
* Defaults: used until the user sets a value; only user-chosen values are persisted.
* Categories: free-form strings used to group settings in the UI.
* Hidden: settings with `hidden: true` are stored but not shown in standard UI. This is used for settings that are controlled elsewhere, such as the volume slider.
* Persistence: values are saved to disk via Tauri's Store plugin.

### Usage

{% tabs %}
{% tab title="Register settings" %}
```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
    await api.Settings.register([
      {
        id: 'theme',
        title: 'Theme',
        description: 'Choose your preferred theme',
        category: 'Appearance',
        kind: 'enum',
        options: [
          { value: 'system', label: 'System' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
        default: 'system',
      },
      {
        id: 'scrobbleEnabled',
        title: 'Enable scrobbling',
        category: 'Integrations',
        kind: 'boolean',
        default: false,
        widget: { type: 'toggle' },
      },
    ]);
  },
};
```
{% endtab %}

{% tab title="Read and write" %}
```typescript
// Read a value (string | number | boolean | undefined)
const theme = await api.Settings.get<string>('theme');

// Update a value
await api.Settings.set('theme', 'dark');

// Subscribe to changes
const unsubscribe = api.Settings.subscribe<string>('theme', (value) => {
  console.log('Theme changed to', value);
});

// Later
unsubscribe();
```
{% endtab %}
{% endtabs %}

### Setting definitions

```typescript
type SettingCategory = string;

type BooleanSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'boolean';
  default?: boolean;
  hidden?: boolean;
  widget?: { type: 'toggle' };
};

type NumberSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'number';
  default?: number;
  hidden?: boolean;
  widget?:
    | { type: 'slider'; min?: number; max?: number; step?: number; unit?: string }
    | { type: 'number-input'; min?: number; max?: number; step?: number; unit?: string };
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

type StringSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'string';
  default?: string;
  hidden?: boolean;
  widget?:
    | { type: 'text'; placeholder?: string }
    | { type: 'password'; placeholder?: string }
    | { type: 'textarea'; placeholder?: string; rows?: number };
  format?: 'text' | 'url' | 'path' | 'token' | 'language';
  pattern?: string; // regex
  minLength?: number;
  maxLength?: number;
};

type EnumSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'enum';
  options: { value: string; label: string }[];
  default?: string;
  hidden?: boolean;
  widget?: { type: 'select' } | { type: 'radio' };
};
```

#### Custom settings

For settings that need a richer UI than the built-in widgets (OAuth flows, multi-field forms, live previews), use `kind: 'custom'` with a registered React component.

```typescript
type CustomSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'custom';
  widgetId: string;
  default?: SettingValue;
  hidden?: boolean;
};
```

The `widgetId` references a React component registered via `api.Settings.registerWidget()`. The component receives the current value, a setter, and the setting definition as props.

{% tabs %}
{% tab title="Register a custom widget" %}
```typescript
import type { NuclearPluginAPI, CustomWidgetProps } from '@nuclearplayer/plugin-sdk';
import { FC } from 'react';

const AuthWidget: FC<CustomWidgetProps> = ({ value, setValue }) => {
  const session = value as { username: string } | undefined;

  if (session) {
    return <span>Connected as {session.username}</span>;
  }

  return (
    <button onClick={() => setValue({ username: 'testuser' })}>
      Connect
    </button>
  );
};

export default {
  async onEnable(api: NuclearPluginAPI) {
    api.Settings.registerWidget('auth', AuthWidget);

    await api.Settings.register([{
      id: 'session',
      title: 'Account',
      category: 'Integrations',
      kind: 'custom',
      widgetId: 'auth',
    }]);
  },

  async onDisable(api: NuclearPluginAPI) {
    api.Settings.unregisterWidget('auth');
  },
};
```
{% endtab %}
{% endtabs %}

Widget IDs are namespaced by plugin ID automatically. Two plugins can both register a widget called `'auth'` without conflict.

The `CustomWidgetProps` type:

```typescript
type CustomWidgetProps<API = unknown> = {
  value: SettingValue | undefined;
  setValue: (value: SettingValue) => void;
  definition: CustomSettingDefinition;
  api: API;
};
```

`SettingValue` accepts any JSON-serializable value (strings, numbers, booleans, objects, arrays, null), so custom widgets can store structured data like `{ sessionKey: string, username: string }`.

{% hint style="warning" %}
Always unregister your widget in `onDisable`. If a custom setting references a widget that isn't registered, the settings UI will throw an error.
{% endhint %}

#### Categories

* Any string. Use i18n strings, or sentence case, e.g. `General`, `Appearance`, `Integrations`.

#### Defaults and persistence

* If the user hasn’t set a value, `get(id)` resolves to the definition’s `default` or `undefined`.
* When a user sets a value, it’s persisted to disk and takes precedence over `default` on the next run.
* `get(id)` returns `undefined` if neither a user value nor a default exists.

### End-to-end example

```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
    await api.Settings.register([
      { id: 'apiKey', title: 'API Key', category: 'Account', kind: 'string', widget: { type: 'password' }, format: 'token' },
      { id: 'language', title: 'Language', category: 'General', kind: 'enum', options: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
      ], default: 'en' },
      { id: 'debug', title: 'Enable debug logs', category: 'Advanced', kind: 'boolean', default: false, hidden: true },
    ]);

    const lang = await api.Settings.get<string>('language');
    if (lang === 'fr') {
      // initialize French resources...
    }

    api.Settings.subscribe<string>('language', (next) => {
      // switch translations live
    });
  },

  async onEnable(api: NuclearPluginAPI) {
    const scrobbling = await api.Settings.get<boolean>('scrobbleEnabled');
    if (scrobbling) {
      // start scrobbling service
    }
  },
};
```

### Reference

```typescript
// Settings management
api.Settings.register(defs: SettingDefinition[]): Promise<{ registered: string[] }>
api.Settings.get<T extends SettingValue>(id: string): Promise<T | undefined>
api.Settings.set<T extends SettingValue>(id: string, value: T): Promise<void>
api.Settings.subscribe<T extends SettingValue>(id: string, cb: (v: T | undefined) => void): () => void

// Custom widgets
api.Settings.registerWidget(widgetId: string, component: CustomWidgetComponent): void
api.Settings.unregisterWidget(widgetId: string): void

// Types
type SettingValue = JsonSerializable | undefined;
type JsonSerializable = string | number | boolean | null | JsonSerializable[] | { [key: string]: JsonSerializable };
type SettingDefinition = BooleanSettingDefinition | NumberSettingDefinition | StringSettingDefinition | EnumSettingDefinition | CustomSettingDefinition;
type CustomWidgetComponent<API = unknown> = FC<CustomWidgetProps<API>>;
```