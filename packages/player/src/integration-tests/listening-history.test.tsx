import { waitFor } from '@testing-library/react';

import { initHistoryService } from '../services/historyService';
import { ok } from '../test/utils/commandMocks';
import { SoundWrapper } from './Sound.test-wrapper';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('../services/tauri/bindings', () => commandMocks.moduleFactory());

describe('Listening history', () => {
  let stopHistoryService: () => void;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.parse('2026-07-11T12:00:00Z'));
    commandMocks.reset();
    stopHistoryService = initHistoryService();
  });

  afterEach(() => {
    stopHistoryService();
    vi.useRealTimers();
  });

  it('records a completed play when a track plays to the end', async () => {
    commandMocks.command('historyStartPlay').mockResolvedValue(ok(1));
    commandMocks.command('historyFinalizePlay').mockResolvedValue(ok(null));

    await SoundWrapper.mount();
    await SoundWrapper.seedAndPlay();
    SoundWrapper.fireCanPlay();

    await waitFor(() => {
      expect(commandMocks.command('historyStartPlay')).toHaveBeenCalledWith({
        title: 'Track 1',
        artists: ['Test Artist'],
        albumTitle: null,
        durationMs: null,
        artworkUrl: null,
        provider: 'test',
        providerId: 'track 1',
        startedAt: 1783771200000,
      });
    });

    SoundWrapper.fireEnded();

    await waitFor(() => {
      expect(commandMocks.command('historyFinalizePlay')).toHaveBeenCalledWith({
        playId: 1,
        reason: 'completed',
        at: 1783771200000,
        positionMs: 0,
        msPlayed: 0,
      });
    });

    expect(commandMocks.command('historyRecordEvent')).not.toHaveBeenCalled();
  });

  it.todo(
    'finalizes as skipped with the playback position when the user skips mid-track',
  );

  it.todo('finalizes as replaced when another track starts while one is open');

  it.todo('finalizes as stopped when the user stops playback');

  it.todo('records pause and resume events with their positions');

  it.todo('records seeks with from and to positions');

  it.todo('starts a new play for each repetition on repeat-one');

  it.todo('does not start a new play when the same track rebuffers');

  it.todo('records nothing when listening history is disabled in settings');
});
