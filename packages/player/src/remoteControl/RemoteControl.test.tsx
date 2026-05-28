import { waitFor } from '@testing-library/react';

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
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    expect(RemoteControlWrapper.header.statusText).toBe('Connected');
    expect(RemoteControlWrapper.nowPlaying.title).toBe(
      'Everything In Its Right Place',
    );
    expect(RemoteControlWrapper.nowPlaying.artist).toBe('Test Artist');
    expect(
      RemoteControlWrapper.controls.playPauseButton.element,
    ).toBeInTheDocument();
    expect(RemoteControlWrapper.queue.header).toBeInTheDocument();
    expect(RemoteControlWrapper.queue.items).toHaveLength(2);
  });

  it('shows empty queue state when synced with no tracks', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection({ emptyQueue: true });

    expect(RemoteControlWrapper.queue.emptyState).toBeInTheDocument();
  });

  it('play/pause button sends POST to /api/playback/toggle', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    await RemoteControlWrapper.controls.playPauseButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/toggle', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('next button sends POST to /api/playback/next', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    await RemoteControlWrapper.controls.nextButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/next', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('previous button sends POST to /api/playback/previous', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    await RemoteControlWrapper.controls.previousButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/previous', {
      method: 'POST',
      headers: undefined,
      body: undefined,
    });
  });

  it('shuffle toggle sends POST with inverted state', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    await RemoteControlWrapper.controls.shuffleButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/shuffle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    });
  });

  it('repeat toggle cycles from off to all', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    await RemoteControlWrapper.controls.repeatButton.click();

    expect(global.fetch).toHaveBeenCalledWith('/api/playback/repeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'all' }),
    });
  });

  it('updates queue items via SSE event', async () => {
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

    expect(RemoteControlWrapper.queue.items).toHaveLength(2);

    RemoteControlWrapper.sendQueueUpdate({
      currentIndex: 0,
      items: [
        {
          id: 'sse-item-1',
          track: {
            title: 'How to Disappear Completely',
            artists: [{ name: 'Radiohead', roles: ['main'] }],
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
    await RemoteControlWrapper.mount();
    await RemoteControlWrapper.simulateConnection();

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
});
