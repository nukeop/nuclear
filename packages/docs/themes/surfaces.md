---
description: Surfaces available in v2 themes
---

# Surfaces

These surfaces are available in Nuclear's v2 themes.

| Surface | Foreground |
| --- | --- |
| `background` | `foreground` |
| `muted` | `muted-foreground` |
| `card` | `card-foreground` |
| `popover` | `popover-foreground` |
| `input` | `input-foreground` |
| `primary` | `primary-foreground` |
| `accent-green` .. `accent-red` | `accent-*-foreground` |

Sidebars, top bar, and bottom bar can be overridden separately. These variables are optional, and without them they use `muted`.

| Surface | Foreground |
| --- | --- |
| `topbar` | `topbar-foreground` |
| `bottombar` | `bottombar-foreground` |
| `sidebar-left` | `sidebar-left-foreground` |
| `sidebar-right` | `sidebar-right-foreground` |

The seek bar has its own optional surfaces. If not set, it will use `primary` for the fill, and `muted` for the track.

| Surface | Foreground |
| --- | --- |
| `seekbar` | `seekbar-foreground` |
| `seekbar-track` | `seekbar-track-foreground` |
