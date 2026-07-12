import { act, waitFor } from '@testing-library/react';

import { initHistoryService } from '../services/history';
import { initPlaybackEventBridge } from '../services/playbackEventBridge';
import { useSettingsStore } from '../stores/settingsStore';
import { createListeningHistoryWrapper } from './ListeningHistory.test-wrapper';
import { PlayerBarWrapper } from './PlayerBar.test-wrapper';
import { QueueWrapper } from './Queue.test-wrapper';
import { SoundWrapper } from './Sound.test-wrapper';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('../services/tauri/bindings', () => commandMocks.moduleFactory());

const Wrapper = createListeningHistoryWrapper(commandMocks);

describe('Listening history', () => {
  let stopHistoryService: () => void;
  let stopPlaybackEventBridge: () => void;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.parse('2026-07-11T12:00:00Z'));
    Wrapper.init();
    stopPlaybackEventBridge = initPlaybackEventBridge();
    stopHistoryService = initHistoryService();
  });

  afterEach(() => {
    stopHistoryService();
    stopPlaybackEventBridge();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('records a completed play when a track plays to the end', async () => {
    await Wrapper.startPlayback();

    expect(Wrapper.events).toEqual([
      {
        playId: '1',
        kind: 'started',
        at: 1_783_771_200_000,
        positionMs: 0,
        seekToMs: null,
        snapshot: {
          title: 'Track 1',
          artists: ['Test Artist'],
          albumTitle: null,
          durationMs: null,
          artworkUrl: null,
          provider: 'test',
          providerId: 'track 1',
        },
      },
    ]);

    vi.setSystemTime(Date.parse('2026-07-11T12:03:00Z'));
    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(2);
    });
    expect(Wrapper.events[1]).toEqual({
      playId: '1',
      kind: 'finished',
      at: 1_783_771_200_000 + 180_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: null,
    });
  });

  it('records a skipped event with the playback position when the user skips mid-track', async () => {
    await Wrapper.startPlayback(180);

    await PlayerBarWrapper.seekBar.clickAtPercent(25);
    await PlayerBarWrapper.nextButton.click();

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(3);
    });
    expect(Wrapper.events[1]).toEqual({
      playId: '1',
      kind: 'seeked',
      at: 1_783_771_200_000,
      positionMs: 0,
      seekToMs: 45_000,
      snapshot: null,
    });
    expect(Wrapper.events[2]).toEqual({
      playId: '1',
      kind: 'skipped',
      at: 1_783_771_200_000,
      positionMs: 45_000,
      seekToMs: null,
      snapshot: null,
    });
  });

  it('records a stopped event when the user stops playback', async () => {
    await Wrapper.startPlayback();

    vi.setSystemTime(Date.parse('2026-07-11T12:00:30Z'));
    await QueueWrapper.clearButton.click();

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(2);
    });
    expect(Wrapper.events[1]).toEqual({
      playId: '1',
      kind: 'stopped',
      at: 1_783_771_200_000 + 30_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: null,
    });
  });

  it('records pause and resume events with their timestamps', async () => {
    await Wrapper.startPlayback();

    vi.setSystemTime(Date.parse('2026-07-11T12:00:10Z'));
    await PlayerBarWrapper.pauseButton.click();

    vi.setSystemTime(Date.parse('2026-07-11T12:00:30Z'));
    await PlayerBarWrapper.playButton.click();

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(3);
    });
    expect(Wrapper.events[1]).toEqual({
      playId: '1',
      kind: 'paused',
      at: 1_783_771_200_000 + 10_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: null,
    });
    expect(Wrapper.events[2]).toEqual({
      playId: '1',
      kind: 'resumed',
      at: 1_783_771_200_000 + 30_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: null,
    });

    vi.setSystemTime(Date.parse('2026-07-11T12:00:35Z'));
    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(4);
    });
    expect(Wrapper.events[3]).toEqual({
      playId: '1',
      kind: 'finished',
      at: 1_783_771_200_000 + 35_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: null,
    });
  });

  it('records seeks with from and to positions', async () => {
    await Wrapper.startPlayback(180);

    await PlayerBarWrapper.seekBar.clickAtPercent(25);
    await PlayerBarWrapper.seekBar.clickAtPercent(75);

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(3);
    });
    expect(Wrapper.events[1]).toEqual({
      playId: '1',
      kind: 'seeked',
      at: 1_783_771_200_000,
      positionMs: 0,
      seekToMs: 45_000,
      snapshot: null,
    });
    expect(Wrapper.events[2]).toEqual({
      playId: '1',
      kind: 'seeked',
      at: 1_783_771_200_000,
      positionMs: 45_000,
      seekToMs: 135_000,
      snapshot: null,
    });
  });

  it('starts a new play for each repetition on repeat-one', async () => {
    await Wrapper.startPlayback();

    await PlayerBarWrapper.repeatButton.click();
    await PlayerBarWrapper.repeatButton.click();

    vi.setSystemTime(Date.parse('2026-07-11T12:03:00Z'));
    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(Wrapper.events).toHaveLength(3);
    });
    expect(Wrapper.events[1]).toEqual({
      playId: '1',
      kind: 'finished',
      at: 1_783_771_200_000 + 180_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: null,
    });
    expect(Wrapper.events[2]).toEqual({
      playId: '2',
      kind: 'started',
      at: 1_783_771_200_000 + 180_000,
      positionMs: 0,
      seekToMs: null,
      snapshot: {
        title: 'Track 1',
        artists: ['Test Artist'],
        albumTitle: null,
        durationMs: null,
        artworkUrl: null,
        provider: 'test',
        providerId: 'track 1',
      },
    });
  });

  it('does not start a new play when the same track rebuffers', async () => {
    await Wrapper.startPlayback();

    SoundWrapper.fireCanPlay();
    await act(() => Promise.resolve());

    expect(Wrapper.events).toHaveLength(1);
  });

  it('records nothing when listening history is disabled in settings', async () => {
    useSettingsStore.setState((state) => ({
      values: { ...state.values, 'core.history.enabled': false },
    }));

    await Wrapper.mountWithoutWaitingForEvents();
    SoundWrapper.fireCanPlay();
    SoundWrapper.fireEnded();
    await act(() => Promise.resolve());

    expect(Wrapper.events).toHaveLength(0);
  });
});
