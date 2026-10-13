import { waitFor } from '@testing-library/react';

import {
  REMOTE_INSTRUMENTAL_LYRICS,
  REMOTE_LYRICS_FOR_NEXT_TRACK,
  REMOTE_LYRICS_FROM_TWO_SOURCES,
  REMOTE_PLAIN_LYRICS,
  REMOTE_QUEUE,
  REMOTE_SEARCH_TRACKS,
  REMOTE_SYNCED_LYRICS,
} from '../test/fixtures/remoteControl';
import { RemoteControlWrapper } from './RemoteControl.test-wrapper';

vi.mock('@nuclearplayer/themes', () => ({
  setThemeId: vi.fn(),
  DEFAULT_THEME_ID: 'nuclear:default',
}));

describe('RemoteControl', () => {
  beforeEach(() => {
    RemoteControlWrapper.reset();
  });

  it('shows connecting state initially', async () => {
    await RemoteControlWrapper.mount();

    expect(RemoteControlWrapper.connectingState).toBeInTheDocument();
    expect(RemoteControlWrapper.connectingState).toHaveTextContent(
      'Connecting to Nuclear...',
    );
  });

  it('shows error state when connection fails', async () => {
    await RemoteControlWrapper.mount();
    RemoteControlWrapper.simulateConnectionFailure();

    await waitFor(() => {
      expect(RemoteControlWrapper.errorState).toBeInTheDocument();
    });
    expect(RemoteControlWrapper.errorState).toHaveTextContent(
      'Could not connect to Nuclear',
    );
  });

  it('shows connected UI after successful sync', async () => {
    await RemoteControlWrapper.mountConnected();

    expect(RemoteControlWrapper.header.statusText).toBe('Connected');
    expect(RemoteControlWrapper.nowPlaying.title).toBe('First Test Track');
    expect(RemoteControlWrapper.nowPlaying.artist).toBe('Test Artist');
    expect(
      RemoteControlWrapper.controls.playPauseButton.element,
    ).toBeInTheDocument();
    expect(RemoteControlWrapper.queue.header).toEqual({
      label: 'Up next',
      count: '2',
    });
    expect(RemoteControlWrapper.queue.items).toHaveLength(2);
  });

  it('shows reconnecting when the connection drops', async () => {
    await RemoteControlWrapper.mountConnected();
    expect(RemoteControlWrapper.header.statusText).toBe('Connected');

    RemoteControlWrapper.simulateConnectionDrop();

    expect(RemoteControlWrapper.header.statusText).toBe('Reconnecting');
  });

  it('shows empty queue state when synced with no tracks', async () => {
    await RemoteControlWrapper.mountConnected({ emptyQueue: true });

    expect(RemoteControlWrapper.queue.emptyState).toBeInTheDocument();
  });

  it('play/pause button sends POST to /api/playback/toggle', async () => {
    await RemoteControlWrapper.mountConnected();

    await RemoteControlWrapper.controls.playPauseButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/toggle', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('next button sends POST to /api/playback/next', async () => {
    await RemoteControlWrapper.mountConnected();

    await RemoteControlWrapper.controls.nextButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/next', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('previous button sends POST to /api/playback/previous', async () => {
    await RemoteControlWrapper.mountConnected();

    await RemoteControlWrapper.controls.previousButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/previous', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('shuffle toggle sends POST with inverted state', async () => {
    await RemoteControlWrapper.mountConnected();

    await RemoteControlWrapper.controls.shuffleButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/shuffle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    });
  });

  it('repeat toggle cycles from off to all', async () => {
    await RemoteControlWrapper.mountConnected();

    await RemoteControlWrapper.controls.repeatButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/repeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'all' }),
    });
  });

  it('updates queue items via SSE event', async () => {
    await RemoteControlWrapper.mountConnected();

    expect(RemoteControlWrapper.queue.items).toHaveLength(2);

    RemoteControlWrapper.sendQueueUpdate({
      currentIndex: 0,
      items: [
        {
          id: 'sse-item-1',
          track: {
            title: 'Third Test Track',
            artists: [{ name: 'Test Artist', roles: ['main'] }],
            source: { provider: 'test', id: 'sse-track-1' },
          },
          status: 'success',
          addedAtIso: '2026-01-01T00:00:00Z',
        },
      ],
    });

    await waitFor(() => {
      expect(RemoteControlWrapper.queue.items).toHaveLength(1);
    });
  });

  it('updates play/pause button via SSE playback event', async () => {
    await RemoteControlWrapper.mountConnected();

    expect(
      RemoteControlWrapper.controls.playPauseButton.element,
    ).toHaveAttribute('data-testid', 'jam-pause-button');

    RemoteControlWrapper.sendPlaybackUpdate({
      status: 'paused',
      seek: 45,
      duration: 240,
    });

    await waitFor(() => {
      expect(
        RemoteControlWrapper.controls.playPauseButton.element,
      ).toHaveAttribute('data-testid', 'jam-play-button');
    });
  });

  it('removing a queue item sends its id to /api/queue/remove', async () => {
    await RemoteControlWrapper.mountConnected();

    await RemoteControlWrapper.queue.removeTrack('Second Test Track');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/queue/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [REMOTE_QUEUE.items[1].id] }),
      });
    });
  });

  it('typing a query searches for tracks and shows results in the drawer', async () => {
    await RemoteControlWrapper.mountConnected();
    RemoteControlWrapper.search.mockResults(REMOTE_SEARCH_TRACKS);

    await RemoteControlWrapper.search.input.type('search result');

    await waitFor(() => {
      expect(RemoteControlWrapper.search.results).toHaveLength(2);
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/search',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'search result',
          types: ['tracks'],
          limit: 10,
        }),
      }),
    );
    expect(RemoteControlWrapper.search.results[0]).toHaveTextContent(
      'First Search Result',
    );
    expect(RemoteControlWrapper.search.results[1]).toHaveTextContent(
      'Second Search Result',
    );
  });

  it('shows empty state when the search returns no results', async () => {
    await RemoteControlWrapper.mountConnected();
    RemoteControlWrapper.search.mockResults([]);

    await RemoteControlWrapper.search.input.type('zzzzz');

    await waitFor(() => {
      expect(RemoteControlWrapper.search.emptyState).toBeInTheDocument();
    });
    expect(RemoteControlWrapper.search.emptyState).toHaveTextContent(
      'No results',
    );
  });

  it('shows error state when the search fails', async () => {
    await RemoteControlWrapper.mountConnected();
    RemoteControlWrapper.search.mockError();

    await RemoteControlWrapper.search.input.type('search result');

    await waitFor(() => {
      expect(RemoteControlWrapper.search.errorState).toBeInTheDocument();
    });
    expect(RemoteControlWrapper.search.errorState).toHaveTextContent(
      'Search failed',
    );
  });

  it('clearing the query closes the drawer', async () => {
    await RemoteControlWrapper.mountConnected();
    RemoteControlWrapper.search.mockResults(REMOTE_SEARCH_TRACKS);

    await RemoteControlWrapper.search.input.type('search result');
    await waitFor(() => {
      expect(RemoteControlWrapper.search.drawer).toBeInTheDocument();
    });

    await RemoteControlWrapper.search.clearButton.click();

    await waitFor(() => {
      expect(RemoteControlWrapper.search.drawer).not.toBeInTheDocument();
    });
  });

  it('clicking a result closes the drawer', async () => {
    await RemoteControlWrapper.mountConnected();
    RemoteControlWrapper.search.mockResults(REMOTE_SEARCH_TRACKS);

    await RemoteControlWrapper.search.input.type('search result');
    await waitFor(() => {
      expect(RemoteControlWrapper.search.results).toHaveLength(2);
    });

    await RemoteControlWrapper.search.addTrack('First Search Result');

    await waitFor(() => {
      expect(RemoteControlWrapper.search.drawer).not.toBeInTheDocument();
    });
  });

  it('clicking a result adds the track to the queue', async () => {
    await RemoteControlWrapper.mountConnected();
    RemoteControlWrapper.search.mockResults(REMOTE_SEARCH_TRACKS);

    await RemoteControlWrapper.search.input.type('search result');
    await waitFor(() => {
      expect(RemoteControlWrapper.search.results).toHaveLength(2);
    });

    await RemoteControlWrapper.search.addTrack('First Search Result');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/queue/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: [REMOTE_SEARCH_TRACKS[0]] }),
      });
    });
    expect(global.fetch).not.toHaveBeenCalledWith(
      '/api/playback/play',
      expect.anything(),
    );
  });

  it('clicking a result starts playback when the queue was empty', async () => {
    await RemoteControlWrapper.mountConnected({ emptyQueue: true });
    RemoteControlWrapper.search.mockResults(REMOTE_SEARCH_TRACKS);

    await RemoteControlWrapper.search.input.type('search result');
    await waitFor(() => {
      expect(RemoteControlWrapper.search.results).toHaveLength(2);
    });

    await RemoteControlWrapper.search.addTrack('First Search Result');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/playback/play', {
        method: 'POST',
        headers: undefined,
        body: undefined,
      });
    });
  });

  describe('lyrics page', () => {
    it('opens the lyrics page from the now playing card', async () => {
      await RemoteControlWrapper.mountConnected();
      RemoteControlWrapper.lyrics.mockCurrent(REMOTE_SYNCED_LYRICS);
      expect(RemoteControlWrapper.queuePage).toBeInTheDocument();

      await RemoteControlWrapper.nowPlaying.lyricsButton.click();

      expect(RemoteControlWrapper.lyricsPage.element).toBeInTheDocument();
    });

    it('goes back to the queue from the lyrics page', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);

      await RemoteControlWrapper.lyricsPage.backButton.click();

      expect(RemoteControlWrapper.queuePage).toBeInTheDocument();
    });

    it('opens the lyrics page directly at /lyrics', async () => {
      await RemoteControlWrapper.mountConnected({
        path: '/lyrics',
        lyrics: REMOTE_SYNCED_LYRICS,
      });

      expect(RemoteControlWrapper.lyricsPage.element).toBeInTheDocument();
    });

    it('shows the title and artist of the current track on the lyrics page', async () => {
      await RemoteControlWrapper.mountConnected();

      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);

      expect(RemoteControlWrapper.lyricsPage.track).toEqual({
        title: 'First Test Track',
        artist: 'Test Artist',
      });
    });

    it('goes to the queue from a lyrics page that was opened directly', async () => {
      await RemoteControlWrapper.mountConnected({
        path: '/lyrics',
        lyrics: REMOTE_SYNCED_LYRICS,
      });

      await RemoteControlWrapper.lyricsPage.backButton.click();

      expect(RemoteControlWrapper.queuePage).toBeInTheDocument();
    });
  });

  describe('lyrics', () => {
    it('does not request lyrics until the lyrics page is opened', async () => {
      await RemoteControlWrapper.mountConnected();

      expect(RemoteControlWrapper.lyrics.requests).toEqual([]);

      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();

      expect(RemoteControlWrapper.lyrics.requests).toEqual([
        ['/api/lyrics/current'],
      ]);
    });

    it('does not request lyrics again when the lyrics page is reopened', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();

      await RemoteControlWrapper.lyricsPage.backButton.click();
      await RemoteControlWrapper.nowPlaying.lyricsButton.click();
      await RemoteControlWrapper.lyrics.findLines();

      expect(RemoteControlWrapper.lyrics.requests).toEqual([
        ['/api/lyrics/current'],
      ]);
    });

    it('shows synced lyrics for the current track when the lyrics page is opened', async () => {
      await RemoteControlWrapper.mountConnected();

      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);

      expect(await RemoteControlWrapper.lyrics.findLines()).toEqual([
        { text: 'Neon rain on the overpass', isActive: true },
        { text: 'Counting static in the glass', isActive: false },
        { text: 'Every signal fades too fast', isActive: false },
      ]);
    });

    it('moves the highlight when a playback update arrives', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();

      RemoteControlWrapper.sendPlaybackUpdate({
        status: 'paused',
        seek: 55,
        duration: 240,
      });

      expect(RemoteControlWrapper.lyrics.lines).toEqual([
        { text: 'Neon rain on the overpass', isActive: false },
        { text: 'Counting static in the glass', isActive: true },
        { text: 'Every signal fades too fast', isActive: false },
      ]);

      RemoteControlWrapper.sendPlaybackUpdate({
        status: 'paused',
        seek: 65,
        duration: 240,
      });

      expect(RemoteControlWrapper.lyrics.lines).toEqual([
        { text: 'Neon rain on the overpass', isActive: false },
        { text: 'Counting static in the glass', isActive: false },
        { text: 'Every signal fades too fast', isActive: true },
      ]);
    });

    describe('while playing', () => {
      beforeEach(() => {
        vi.useFakeTimers({
          toFake: [
            'requestAnimationFrame',
            'cancelAnimationFrame',
            'performance',
          ],
        });
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('keeps moving the highlight between playback updates while playing', async () => {
        await RemoteControlWrapper.mountConnected();
        await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
        await RemoteControlWrapper.lyrics.findLines();

        RemoteControlWrapper.sendPlaybackUpdate({
          status: 'playing',
          seek: 49.9,
          duration: 240,
        });
        expect(RemoteControlWrapper.lyrics.lines).toEqual([
          { text: 'Neon rain on the overpass', isActive: true },
          { text: 'Counting static in the glass', isActive: false },
          { text: 'Every signal fades too fast', isActive: false },
        ]);

        await RemoteControlWrapper.advanceTime(200);

        expect(RemoteControlWrapper.lyrics.lines).toEqual([
          { text: 'Neon rain on the overpass', isActive: false },
          { text: 'Counting static in the glass', isActive: true },
          { text: 'Every signal fades too fast', isActive: false },
        ]);
      });
    });

    it('seeks to the start of a line when the line is tapped', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();

      await RemoteControlWrapper.lyrics.tapLine('Every signal fades too fast');

      expect(global.fetch).toHaveBeenCalledWith('/api/playback/seek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seconds: 60 }),
      });
    });

    it('shows plain lyrics as text', async () => {
      await RemoteControlWrapper.mountConnected();

      await RemoteControlWrapper.openLyrics(REMOTE_PLAIN_LYRICS);

      expect(await RemoteControlWrapper.lyrics.findLines()).toEqual([
        { text: 'Paper boats in a parking lot', isActive: false },
        { text: 'Sinking slow in the summer heat', isActive: false },
      ]);
    });

    it('shows the no lyrics state when no provider has lyrics for the track', async () => {
      await RemoteControlWrapper.mountConnected();

      await RemoteControlWrapper.openLyrics([]);
      await RemoteControlWrapper.lyrics.emptyState.find();

      expect(RemoteControlWrapper.lyrics.emptyState.title).toBe(
        'No lyrics for this track',
      );
      expect(RemoteControlWrapper.lyrics.emptyState.subtitle).toBe(
        'No lyrics provider returned results.',
      );
    });

    it('shows the error state when the lyrics request fails', async () => {
      await RemoteControlWrapper.mountConnected();
      RemoteControlWrapper.lyrics.mockError();

      await RemoteControlWrapper.nowPlaying.lyricsButton.click();
      await RemoteControlWrapper.lyrics.emptyState.find();

      expect(RemoteControlWrapper.lyrics.emptyState.title).toBe(
        'Could not load lyrics',
      );
      expect(RemoteControlWrapper.lyrics.emptyState.subtitle).toBe(
        'Check the connection to Nuclear and try again.',
      );
    });

    it('shows the instrumental state for instrumental tracks', async () => {
      await RemoteControlWrapper.mountConnected();

      await RemoteControlWrapper.openLyrics(REMOTE_INSTRUMENTAL_LYRICS);
      await RemoteControlWrapper.lyrics.emptyState.find();

      expect(RemoteControlWrapper.lyrics.emptyState.title).toBe('Instrumental');
      expect(RemoteControlWrapper.lyrics.emptyState.subtitle).toBe(
        'This track has no lyrics.',
      );
    });

    it('shows the nothing playing state without requesting lyrics when the queue is empty', async () => {
      await RemoteControlWrapper.mountConnected({
        path: '/lyrics',
        emptyQueue: true,
        lyrics: REMOTE_SYNCED_LYRICS,
      });
      await RemoteControlWrapper.lyrics.emptyState.find();

      expect(RemoteControlWrapper.lyrics.emptyState.title).toBe(
        'Nothing is playing',
      );
      expect(RemoteControlWrapper.lyrics.emptyState.subtitle).toBe(
        'Play a track to see its lyrics here.',
      );
      expect(RemoteControlWrapper.lyrics.requests).toEqual([]);
    });

    it('shows the lyrics of the new track when the current track changes', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      expect(await RemoteControlWrapper.lyrics.findLines()).toEqual([
        { text: 'Neon rain on the overpass', isActive: true },
        { text: 'Counting static in the glass', isActive: false },
        { text: 'Every signal fades too fast', isActive: false },
      ]);

      RemoteControlWrapper.lyrics.mockCurrent(REMOTE_LYRICS_FOR_NEXT_TRACK);
      RemoteControlWrapper.sendQueueUpdate({
        ...REMOTE_QUEUE,
        currentIndex: 1,
      });
      RemoteControlWrapper.sendPlaybackUpdate({
        status: 'paused',
        seek: 10,
        duration: 240,
      });

      expect(await RemoteControlWrapper.lyrics.findLines()).toEqual([
        { text: 'Wake me when the tape runs out', isActive: true },
        { text: 'Hum the chorus, skip the doubt', isActive: false },
      ]);
    });

    it('shows the lyrics of the source picked on the remote', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_LYRICS_FROM_TWO_SOURCES);
      await RemoteControlWrapper.lyrics.findLines();

      await RemoteControlWrapper.lyricsPage.sourcePicker.select('Other Lyrics');

      expect(RemoteControlWrapper.lyricsPage.sourcePicker.selected()).toBe(
        'Other Lyrics',
      );
      expect(RemoteControlWrapper.lyrics.lines).toEqual([
        { text: 'Paper boats in a parking lot', isActive: false },
        { text: 'Sinking slow in the summer heat', isActive: false },
      ]);
    });

    it('goes back to the first source when the current track changes', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_LYRICS_FROM_TWO_SOURCES);
      await RemoteControlWrapper.lyrics.findLines();
      await RemoteControlWrapper.lyricsPage.sourcePicker.select('Other Lyrics');

      RemoteControlWrapper.sendQueueUpdate({
        ...REMOTE_QUEUE,
        currentIndex: 1,
      });

      expect(await RemoteControlWrapper.lyrics.findLines()).toEqual([
        { text: 'Neon rain on the overpass', isActive: true },
        { text: 'Counting static in the glass', isActive: false },
        { text: 'Every signal fades too fast', isActive: false },
      ]);
      expect(RemoteControlWrapper.lyricsPage.sourcePicker.selected()).toBe(
        'Test Lyrics',
      );
    });

    it('moves the highlight to an earlier line when the offset moves the lyrics later', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();
      RemoteControlWrapper.sendPlaybackUpdate({
        status: 'paused',
        seek: 50.05,
        duration: 240,
      });
      expect(RemoteControlWrapper.lyrics.lines).toEqual([
        { text: 'Neon rain on the overpass', isActive: false },
        { text: 'Counting static in the glass', isActive: true },
        { text: 'Every signal fades too fast', isActive: false },
      ]);

      await RemoteControlWrapper.lyricsPage.offset.later();

      expect(RemoteControlWrapper.lyrics.lines).toEqual([
        { text: 'Neon rain on the overpass', isActive: true },
        { text: 'Counting static in the glass', isActive: false },
        { text: 'Every signal fades too fast', isActive: false },
      ]);
    });

    it('seeks with the offset applied when a line is tapped', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();
      await RemoteControlWrapper.lyricsPage.offset.later();
      await RemoteControlWrapper.lyricsPage.offset.later();

      await RemoteControlWrapper.lyrics.tapLine('Every signal fades too fast');

      expect(global.fetch).toHaveBeenCalledWith('/api/playback/seek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seconds: 60.2 }),
      });
    });

    it('resets the offset when the current track changes', async () => {
      await RemoteControlWrapper.mountConnected();
      await RemoteControlWrapper.openLyrics(REMOTE_SYNCED_LYRICS);
      await RemoteControlWrapper.lyrics.findLines();
      await RemoteControlWrapper.lyricsPage.offset.earlier();
      expect(RemoteControlWrapper.lyricsPage.offset.value).toBe('-0.1 s');

      RemoteControlWrapper.lyrics.mockCurrent(REMOTE_LYRICS_FOR_NEXT_TRACK);
      RemoteControlWrapper.sendQueueUpdate({
        ...REMOTE_QUEUE,
        currentIndex: 1,
      });
      await RemoteControlWrapper.lyrics.findLines();

      expect(RemoteControlWrapper.lyricsPage.offset.value).toBe('0.0 s');
    });
  });
});
