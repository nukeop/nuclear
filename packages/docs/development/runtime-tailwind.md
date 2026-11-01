---
description: How Nuclear makes Tailwind CSS for custom views at runtime
---

# Runtime Tailwind

Plugins and MCP clients can add custom views to the player. These views use Tailwind classes. The player builds its CSS only from its own source files. Thus a class that only a custom view uses has no CSS in the player build.

As a solution, the player compiles Tailwind CSS at runtime, only for the open custom view. When a custom view opens, the player collects the classes in the view and compiles them with the Tailwind compiler. An observer monitors the view. When new classes are added to the view, the player compiles again. When the view closes, the player removes the CSS and stops the observer. When no custom view is open, Tailwind does not operate.

The compiler gets its configuration from `packages/tailwind-config/runtime.css`. This file contains only the parts of the player configuration that are safe to apply two times: the theme, the utilities, and the animations. It does not contain the base styles or the theme variables. If the runtime CSS contains them, they override the styles of the player.

This technique allows custom views to use the active theme so they can stay visually consistent with the rest of the player.

The code is in `packages/player/src/views/ViewOutlet/`.

{% hint style="info" %}
Dialogs, popovers, and tooltips render outside the view. Their classes get no runtime CSS.
{% endhint %}
