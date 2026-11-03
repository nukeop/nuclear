---
description: Open pages in Nuclear, navigate back and forward, and read the current location from a plugin.
---

# Navigation

## Navigation API for plugins

The Navigation API is designed to work like the browser history API. You can open navigate to specified views in Nuclear, go back and forward in the navigation history, and read the location of the current page.

{% hint style="info" %}
Access the Navigation API via `api.Navigation.*` in your plugin's lifecycle hooks.
{% endhint %}

---

## Usage

```typescript
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

const showArtist = async (api: NuclearPluginAPI, providerId: string, artistId: string) => {
  await api.Navigation.navigate(`/artist/${providerId}/${artistId}`);
};

const showSearchResults = async (api: NuclearPluginAPI, query: string) => {
  await api.Navigation.navigate(`/search?q=${encodeURIComponent(query)}`);
};
```

---

## Reference

```typescript
api.Navigation.navigate(path: string): Promise<void>
```

Opens the page at `path`. The path is a route of Nuclear, with a search string if the page needs one. Some examples:

| Path | Page |
|------|------|
| `/dashboard` | Dashboard |
| `/search?q=<query>` | Search results |
| `/artist/<providerId>/<artistId>` | Artist |
| `/album/<providerId>/<albumId>` | Album |
| `/playlists/<playlistId>` | Playlist |
| `/favorites/tracks` | Favorite tracks |

```typescript
api.Navigation.back(): void
api.Navigation.forward(): void
```

Go back or forward one page in the navigation history.

```typescript
api.Navigation.current(): NavigationLocation
```

Returns the location of the current page. At `/search?q=radiohead`, it returns:

```typescript
{
  href: '/search?q=radiohead',
  pathname: '/search',
  search: { q: 'radiohead' },
  hash: '',
}
```

### Types

```typescript
type NavigationLocation = {
  href: string;
  pathname: string;
  search: Record<string, unknown>;
  hash: string;
};

type NavigationHost = {
  navigate(path: string): Promise<void>;
  back(): void;
  forward(): void;
  current(): NavigationLocation;
};
```
