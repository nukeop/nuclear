import { waitFor } from '@testing-library/react';

import { initHistoryService } from '../services/historyService';
import { initPlaybackEventBridge } from '../services/playbackEventBridge';
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

  it.todo('records pause and resume events with their positions');

  it.todo('records seeks with from and to positions');

  it.todo('starts a new play for each repetition on repeat-one');

  it.todo('does not start a new play when the same track rebuffers');

  it.todo('records nothing when listening history is disabled in settings');
});
