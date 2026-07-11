import { act, waitFor } from '@testing-library/react';

import { initHistoryService } from '../services/historyService';
import { initPlaybackEventBridge } from '../services/playbackEventBridge';
import { useSettingsStore } from '../stores/settingsStore';
import { ok } from '../test/utils/commandMocks';
import { PlayerBarWrapper } from './PlayerBar.test-wrapper';
import { QueueWrapper } from './Queue.test-wrapper';
import { SoundWrapper } from './Sound.test-wrapper';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('../services/tauri/bindings', () => commandMocks.moduleFactory());

describe('Listening history', () => {
  let stopHistoryService: () => void;
  let stopPlaybackEventBridge: () => void;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.parse('2026-07-11T12:00:00Z'));
    commandMocks.reset();
    stopPlaybackEventBridge = initPlaybackEventBridge();
    stopHistoryService = initHistoryService();
  });

  afterEach(() => {
    stopHistoryService();
    stopPlaybackEventBridge();
    vi.useRealTimers();
  });

  const startPlayback = async (durationSeconds?: number) => {
    await QueueWrapper.mount();
    await SoundWrapper.seedAndPlay();
    SoundWrapper.fireCanPlay(durationSeconds);

    await waitFor(() => {
      expect(commandMocks.command('historyStartPlay')).toHaveBeenCalledTimes(1);
    });
  };

  it('records a completed play when a track plays to the end', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));
    commandMocks.command('historyFinalizePlay').mockResolvedValue(ok(null));

    await startPlayback();

    expect(commandMocks.command('historyStartPlay')).toHaveBeenCalledWith({
      title: 'Track 1',
      artists: ['Test Artist'],
      albumTitle: null,
      durationMs: null,
      artworkUrl: null,
      provider: 'test',
      providerId: 'track 1',
      startedAt: 1_783_771_200_000,
    });

    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledWith({
        playId: 1,
        reason: 'completed',
        at: 1_783_771_200_000,
        positionMs: 0,
        msPlayed: 0,
      });
    });

    expect(commandMocks.command('historyRecordEvent')).not.toHaveBeenCalled();
  });

  it('finalizes as skipped with the playback position when the user skips mid-track', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));
    commandMocks.command('historyRecordEvent').mockResolvedValue(ok(null));
    commandMocks.command('historyFinalizePlay').mockResolvedValue(ok(null));

    await startPlayback(180);

    await PlayerBarWrapper.seekBar.clickAtPercent(25);
    await PlayerBarWrapper.nextButton.click();

    await waitFor(() => {
      expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledWith({
        playId: 1,
        reason: 'skipped',
        at: 1_783_771_200_000,
        positionMs: 45_000,
        msPlayed: 0,
      });
    });

    expect(
      commandMocks.command('historyRecordEvent'),
    ).toHaveBeenCalledExactlyOnceWith({
      playId: 1,
      kind: 'seeked',
      at: 1_783_771_200_000,
      positionMs: 0,
      seekToMs: 45_000,
    });
    expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledTimes(
      1,
    );
  });

  it('finalizes as stopped when the user stops playback', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));
    commandMocks.command('historyFinalizePlay').mockResolvedValue(ok(null));

    await startPlayback();

    vi.setSystemTime(Date.parse('2026-07-11T12:00:30Z'));
    await QueueWrapper.clearButton.click();

    await waitFor(() => {
      expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledWith({
        playId: 1,
        reason: 'stopped',
        at: 1_783_771_200_000 + 30_000,
        positionMs: 0,
        msPlayed: 30_000,
      });
    });

    expect(commandMocks.command('historyRecordEvent')).not.toHaveBeenCalled();
  });

  it('records pause and resume events and excludes paused time from msPlayed', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));
    commandMocks.command('historyRecordEvent').mockResolvedValue(ok(null));
    commandMocks.command('historyFinalizePlay').mockResolvedValue(ok(null));

    await startPlayback();

    vi.setSystemTime(Date.parse('2026-07-11T12:00:10Z'));
    await PlayerBarWrapper.pauseButton.click();

    vi.setSystemTime(Date.parse('2026-07-11T12:00:30Z'));
    await PlayerBarWrapper.playButton.click();

    await waitFor(() => {
      expect(commandMocks.command('historyRecordEvent')).toHaveBeenCalledTimes(
        2,
      );
    });
    expect(commandMocks.command('historyRecordEvent')).toHaveBeenNthCalledWith(
      1,
      {
        playId: 1,
        kind: 'paused',
        at: 1_783_771_200_000 + 10_000,
        positionMs: 0,
        seekToMs: null,
      },
    );
    expect(commandMocks.command('historyRecordEvent')).toHaveBeenNthCalledWith(
      2,
      {
        playId: 1,
        kind: 'resumed',
        at: 1_783_771_200_000 + 30_000,
        positionMs: 0,
        seekToMs: null,
      },
    );

    vi.setSystemTime(Date.parse('2026-07-11T12:00:35Z'));
    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledWith({
        playId: 1,
        reason: 'completed',
        at: 1_783_771_200_000 + 35_000,
        positionMs: 0,
        msPlayed: 15_000,
      });
    });
  });

  it('records seeks with from and to positions', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));
    commandMocks.command('historyRecordEvent').mockResolvedValue(ok(null));

    await startPlayback(180);

    await PlayerBarWrapper.seekBar.clickAtPercent(25);
    await PlayerBarWrapper.seekBar.clickAtPercent(75);

    await waitFor(() => {
      expect(commandMocks.command('historyRecordEvent')).toHaveBeenCalledTimes(
        2,
      );
    });
    expect(commandMocks.command('historyRecordEvent')).toHaveBeenNthCalledWith(
      1,
      {
        playId: 1,
        kind: 'seeked',
        at: 1_783_771_200_000,
        positionMs: 0,
        seekToMs: 45_000,
      },
    );
    expect(commandMocks.command('historyRecordEvent')).toHaveBeenNthCalledWith(
      2,
      {
        playId: 1,
        kind: 'seeked',
        at: 1_783_771_200_000,
        positionMs: 45_000,
        seekToMs: 135_000,
      },
    );
  });

  it('starts a new play for each repetition on repeat-one', async () => {
    commandMocks
      .command('historyStartPlay')
      .mockResolvedValueOnce(ok(1))
      .mockResolvedValueOnce(ok(2));
    commandMocks.command('historyFinalizePlay').mockResolvedValue(ok(null));

    await startPlayback();

    await PlayerBarWrapper.repeatButton.click();
    await PlayerBarWrapper.repeatButton.click();

    vi.setSystemTime(Date.parse('2026-07-11T12:03:00Z'));
    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledWith({
        playId: 1,
        reason: 'completed',
        at: 1_783_771_200_000 + 180_000,
        positionMs: 0,
        msPlayed: 180_000,
      });
    });

    await waitFor(() => {
      expect(commandMocks.command('historyStartPlay')).toHaveBeenCalledTimes(2);
    });
    expect(commandMocks.command('historyStartPlay')).toHaveBeenLastCalledWith({
      title: 'Track 1',
      artists: ['Test Artist'],
      albumTitle: null,
      durationMs: null,
      artworkUrl: null,
      provider: 'test',
      providerId: 'track 1',
      startedAt: 1_783_771_200_000 + 180_000,
    });
    expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledTimes(
      1,
    );
    expect(commandMocks.command('historyRecordEvent')).not.toHaveBeenCalled();
  });

  it('does not start a new play when the same track rebuffers', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));

    await startPlayback();

    SoundWrapper.fireCanPlay();
    await act(() => Promise.resolve());

    expect(commandMocks.command('historyStartPlay')).toHaveBeenCalledTimes(1);
    expect(commandMocks.command('historyFinalizePlay')).not.toHaveBeenCalled();
  });

  it('records nothing when listening history is disabled in settings', async () => {
    useSettingsStore.setState((state) => ({
      values: { ...state.values, 'core.history.enabled': false },
    }));

    await QueueWrapper.mount();
    await SoundWrapper.seedAndPlay();
    SoundWrapper.fireCanPlay();
    SoundWrapper.fireEnded();
    await act(() => Promise.resolve());

    expect(commandMocks.command('historyStartPlay')).not.toHaveBeenCalled();
    expect(commandMocks.command('historyRecordEvent')).not.toHaveBeenCalled();
    expect(commandMocks.command('historyFinalizePlay')).not.toHaveBeenCalled();
  });
});
