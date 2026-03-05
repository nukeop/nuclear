---
description: Default keyboard shortcuts and how to customize them
---

# Key shortcuts

Nuclear comes with built-in keyboard shortcuts for common actions. You can customize any shortcut from the settings.

## Default shortcuts

### Playback

| Action          | macOS            | Windows / Linux  |
| --------------- | ---------------- | ---------------- |
| Play / Pause    | `Space`          | `Space`          |
| Next track      | `⌘` `→`         | `Ctrl` `→`       |
| Previous track  | `⌘` `←`         | `Ctrl` `←`       |
| Seek forward    | `→`              | `→`              |
| Seek backward   | `←`              | `←`              |
| Volume up       | `⌘` `↑`         | `Ctrl` `↑`       |
| Volume down     | `⌘` `↓`         | `Ctrl` `↓`       |
| Mute / Unmute   | `⌘` `M`         | `Ctrl` `M`       |

### General

| Action          | macOS            | Windows / Linux  |
| --------------- | ---------------- | ---------------- |
| Open settings   | `⌘` `,`         | `Ctrl` `,`       |

Seek forward and backward skip by the number of seconds configured in the Playback settings (default: 5 seconds). Volume changes in steps of 5%.

## Customizing shortcuts

1. Open settings (`⌘`/`Ctrl` + `,`)
2. Click the **Key Shortcuts** tab (keyboard icon)
3. Click any keybinding to enter recording mode
4. Press the new key combination you want to use
5. Press `Escape` to cancel recording without saving

If the key combination you record is already used by another command, Nuclear will show an error and keep the previous binding.

To restore a single shortcut to its default, click the **Reset** button next to it. To restore all shortcuts at once, click **Reset all to defaults** at the bottom of the page.

Custom shortcuts are saved to `shortcuts.json` in your Nuclear config directory and persist across restarts.