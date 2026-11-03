---
description: Add your own pages to the left sidebar of Nuclear from a plugin.
---

# Views

## Views API for plugins

Use the Views API to add your own pages to Nuclear. Each view has a button in the left sidebar. A view can have one page or more, and each page has its own route.

{% hint style="info" %}
Access the Views API via `api.Views.*` in your plugin's lifecycle hooks.
{% endhint %}

---

## Usage

This example adds a "Podcasts" view with two pages: a list of episodes and an episode page. The plugin ID is `acme-podcasts`.

```tsx
import type {
  NuclearPlugin,
  NuclearPluginAPI,
  CustomViewComponent,
} from '@nuclearplayer/plugin-sdk';

const EpisodeList: CustomViewComponent = ({ api }) => (
  <button
    onClick={() =>
      api.Navigation.navigate('/plugin/acme-podcasts/podcasts/episode/42')
    }
  >
    Episode 42
  </button>
);

const Episode: CustomViewComponent = ({ params }) => (
  <h1>Episode {params.episodeId}</h1>
);

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Views.register({
      id: 'podcasts',
      title: 'Podcasts',
      icon: 'Podcast',
      routes: [
        { path: '/', component: EpisodeList },
        { path: '/episode/$episodeId', component: Episode },
      ],
    });
  },
  onDisable(api: NuclearPluginAPI) {
    api.Views.unregister('podcasts');
  },
};

export default plugin;
```

### Routes and params

The view can be seen at `/plugin/<pluginId>/<viewId>`. The path of each route comes after this prefix. In the example, the episode page opens at `/plugin/acme-podcasts/podcasts/episode/42`.

A path segment that starts with `$` is a param. This is the same syntax as the routes of Nuclear. Nuclear gives the value of each param to the component in `params`. At `/episode/42`, `params` is `{ episodeId: '42' }`.

Nuclear compares the routes in the order of the `routes` array. The first route that matches shows.

To go to a different page in your view or to a page of Nuclear, use [`api.Navigation`](navigation.md).

### Icons

The `icon` field is the name of a [Lucide](https://lucide.dev/icons/) icon, for example `Podcast` or `Radio`. Nuclear shows the icon in the left sidebar.

### Remove a view

Nuclear does not remove your views when the user disables or unloads your plugin. To remove a view, call `unregister` in `onDisable` or `onUnload`.

Nuclear does not save views. Register your views again each time your plugin starts.

---

## Reference

```typescript
api.Views.register(view: CustomViewDefinition): void
```

Adds the view to the left sidebar. To replace a view, call `register` again with the same `id`. If the view is open, the new version shows.

```typescript
api.Views.unregister(id: string): void
```

Removes the view with this `id`. If the view is open, Nuclear opens the dashboard.

### Types

```typescript
type CustomViewDefinition = {
  id: string;
  title: string;
  icon: string;
  routes: CustomViewRoute[];
};

type CustomViewRoute = {
  path: string;
  component: CustomViewComponent;
};

type CustomViewProps = {
  params: Record<string, string>;
  api: NuclearPluginAPI;
};

type CustomViewComponent = FC<CustomViewProps>;

type ViewsHost = {
  register(view: CustomViewDefinition): void;
  unregister(id: string): void;
};
```

MCP and HTTP clients send views as TSX source. They use this type:

```typescript
type RawViewDefinition = {
  id: string;
  title: string;
  icon: string;
  source: string;
  routes: { path: string; export?: string }[];
};
```

For more information, see [MCP server](../integrations/mcp-server.md#views-from-mcp-clients).
