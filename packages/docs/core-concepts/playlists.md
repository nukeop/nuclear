---
description: Create, import, export, and manage playlists
---

# Playlists

Playlists let you organize tracks into named collections. Open the **Playlists** view from the left sidebar to see all your playlists.

## Creating a playlist

Click the **+** button at the top of the Playlists view. Enter a name in the dialog and confirm. You can also save your current queue as a playlist from the queue header menu.

## Adding tracks

Use the three-dot menu (&#8942;) on any track and select **Add to playlist**, then pick the target playlist. If you have many playlists, a filter input at the top of the submenu lets you narrow them down.

## Editing a playlist

In the playlist detail view, click the **pencil button** in the top-right corner to enter edit mode. You can change the playlist's name and description, then click **Save** to confirm or **Cancel** to discard changes.

## Playlist detail view

Click a playlist card to open it. The detail view shows the tracklist with the same controls as other track tables (+ button, three-dot menu, favorite toggle). From here you can:

- **Play** all tracks or **Add to queue** via the action buttons at the top
- **Reorder** tracks by dragging them
- **Remove** individual tracks with the delete button on each row
- **Export as JSON** from the three-dot action menu
- **Delete** the playlist from the three-dot action menu (asks for confirmation)

## Importing playlists

Click the import button (next to the + button) to see two options:

- **Import from JSON**: opens a file picker. Nuclear accepts its own JSON export format as well as some legacy formats.
- **Import from URL**: opens a dialog where you paste a URL. Nuclear checks all installed playlists providers to find one that can handle it. If a match is found, you're taken to a preview page where you can save the playlist locally.

Playlists imported from a URL are **read-only**. You can play their tracks and add them to the queue, but you can't reorder or remove tracks.

## Persistence

Playlists save to disk automatically and persist across restarts.
