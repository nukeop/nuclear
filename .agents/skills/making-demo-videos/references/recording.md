# Preparing and driving the app

## Prepare the demo profile

The user starts Nuclear with the demo profile. The profile needs plugins for search, streaming, and the dashboard. It also needs Nuclear Jam, because Nuclear Jam starts the HTTP API. If they are missing, ask the user to install the plugins and to turn on Nuclear Jam in Settings, Integrations.

Before each take, set the profile to a known state. Remove the playlists, favorites, and queue items that the take creates. Use the HTTP API or the UI.

## Set up the window

The recording must be 16:9. Set up the window as follows:

1. Turn on the frameless window. This removes the native title bar:

   ```sh
   curl -X POST localhost:4120/api/settings/core.appearance.framelessWindow \
     -H 'Content-Type: application/json' -d 'true'
   ```

2. Bring the window to the current workspace. Make sure that it is not in full screen.
3. Set the window size to 1440×810 points. On a Retina display, this is 2880×1620 pixels:

   ```sh
   osascript -e 'tell application "System Events" to tell process "player"' \
     -e 'set frontmost to true' -e 'delay 1' \
     -e 'set position of window 1 to {0, 45}' -e 'set size of window 1 to {1440, 810}' \
     -e 'end tell'
   ```

The process name of the dev build is `player`. A restart of Nuclear resets the window size. Set the size again at the start of each take.

## Add the WebDriver plugin

WebDriver gives the screen position of each element. The plugin is for local use only. Add it before the take and remove it after the take:

```sh
bun .agents/skills/making-demo-videos/scripts/webdriver-plugin.ts add
bun .agents/skills/making-demo-videos/scripts/webdriver-plugin.ts remove
```

After `add`, the running dev build compiles again and restarts. Wait until `curl -s 127.0.0.1:4445/status` shows `"ready": true`.

## Drive the app

Use `scripts/webdriver.ts` to find elements. Use `scripts/input.ts` to move the cursor, click, scroll, and type. The input script sends real macOS events, so OpenScreen records the cursor movement and the clicks.

```ts
import { Page } from './scripts/webdriver.ts';
import { focusProcess, keyboard, Mouse } from './scripts/input.ts';

const page = await Page.connect();
const mouse = new Mouse({ x: 720, y: 450 });
await focusProcess('player');

const playlists = await page.find('[data-testid=sidebar-navigation-item]', 'Playlists');
await mouse.click(playlists.center, 0.8);
await keyboard.type('Late Night Drive');
```

- Bring Nuclear to the front with `focusProcess('player')` before the first input. The input goes to the front app.
- `Mouse` does not read the cursor position. Create it with a start point before the recording starts. It moves the cursor to that point.
- `mouse.click` and `mouse.rightClick` stop the cursor on the target before they click.
- `mouse.scroll` moves the cursor to a point and scrolls the element below it. Use it for lists in popovers.
- `page.testIds()` gives the test ids on the current view. Use it to write the selectors for each view.
- Menu items and dialog buttons have no test ids. Use `page.findText(text, selector)`. It gives the smallest visible element that contains the text.
- `find` and `findText` wait until the element is visible. An element is visible when it is on top at its center point. Use them after each navigation step.
- Some views stay in the DOM behind the current view. For example, the dashboard stays behind a playlist view. Start each selector with the test id of the current view.
- Clear the search box with its clear button before you type a new query.
- To close a popover, click an empty area outside it. The Escape key does not close popovers.
- `page.reload()` reloads the app. It resets state that is kept only in memory, for example recent searches. After a reload, wait some seconds and connect a new `Page`.

## Write the scenario

Write the scenario as a list of steps. Each step starts when the step before it ends. Record the time of each click, voice line, and important event in an event log. Use the event log to put zooms, captions, and voice lines in position later.

Let the viewer read each change. Wait a short time after each navigation step. Move the cursor with easing and at a speed that the viewer can follow. After a click on a button, move the cursor away, so that the viewer can see the result.

Make each pause longer than the voice line for that step. Measure the voice lines before you set the pauses.

Run the scenario without recording until it runs correctly. Then record it.

## Control the player

Use the HTTP API for player state: search, queue, playback, volume, favorites, and playlists. The routes are in `packages/docs/integrations/http-api.md`.

Load each track that the take plays before you record. Play each track once at volume 0, then pause. A track loads much faster the second time.

After a track change, wait until the audio plays. The audio plays when `GET <api-url>/playback` shows `"status": "playing"`, a new `duration`, and a `seek` value more than 0.3.

To change tracks, do these steps:

1. Move the cursor to the next track.
2. Fade the volume to 0.
3. Click the track.
4. Wait until the audio plays.
5. If the track has a long intro, seek to the start of the song.
6. Fade the volume back.

Let each track play for 5 to 9 seconds, so that the viewer can recognize it. Fade out the last track before the take ends.
