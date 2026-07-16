---
description: A local record of everything you play
---

# Listening history

Nuclear can keep a history of the tracks you play. You can browse your listening history from the **History** view in the left sidebar.

Your history is stored in a local database on your computer.

## The History view

Tracks are grouped by day, newest first. Recent days are labeled **Today** and **Yesterday**; older ones show the full date. Each entry shows the track's artwork, artist, title, and the time it was played.

History entries are interactive:

- Click the heart to add the track to your favorite tracks (or remove it)
- Click the track title to play it again
- Hover over an entry and click the **+** button to add it to the queue

Once your history grows past a single page, pagination controls appear at the bottom. Use the page size selector to show 10, 25, or 50 entries per page.

## Turning it off

History is on by default. To disable it, go to settings and switch off **Record listening history**. Nuclear stops recording new plays immediately; anything already in your history stays there.

## Data

Nuclear keeps track of more info than just the tracks that have been played. Scrobbling services like last.fm or libre.fm typically only record whether a track was played and when. That leads to a problem: if you like artists that release 30-minute long tracks, one play is still one play. If you play a punk album next that's also 30 minutes long but it's all 3 minute tracks, you get 10 plays, but it doesn't mean you like that band 10 times more than the one that released the 30-minute track.

To solve this, Nuclear also records when:

- The track was started
- You skipped the track
- You skipped around in the track
- It was paused and resumed
- It was stopped
- It was played to the end

This lets the history reflect your preferences much more accurately. This makes it possible to identify which parts of a track you like the most, the tracks you skip the most frequently, or the ones that you spend the most time listening to.

## Database

The listening history is an unencrypted database stored in the appdata folder. See this article to learn where to find it on your platform: [Platform specific paths](../misc/platform-specific.md#paths).

It's under `./databases/history.db`. You can browse it with any SQLite database viewer.
