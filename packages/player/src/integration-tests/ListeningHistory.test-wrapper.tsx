import { waitFor } from '@testing-library/react';

import { useHistoryStore } from '../stores/historyStore';
import type { TauriCommandMocks } from '../test/utils/commandMocks';
import { ok } from '../test/utils/commandMocks';
import { QueueWrapper } from './Queue.test-wrapper';
import { SoundWrapper } from './Sound.test-wrapper';

export const createListeningHistoryWrapper = (
  commandMocks: TauriCommandMocks,
) => ({
  init() {
    commandMocks.reset();
    commandMocks.command('historyRecordEvent').mockResolvedValue(ok(null));
    useHistoryStore.setState({ currentPlayId: null });

    let uuidSequence = 0;
    vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(
      () => String(++uuidSequence) as ReturnType<Crypto['randomUUID']>,
    );
  },

  get events() {
    return commandMocks
      .command('historyRecordEvent')
      .mock.calls.map(([event]) => event);
  },

  async startPlayback(durationSeconds?: number) {
    await QueueWrapper.mount();
    await SoundWrapper.seedAndPlay();
    SoundWrapper.fireCanPlay(durationSeconds);

    await waitFor(() => {
      expect(this.events).toHaveLength(1);
    });
  },

  async mountWithoutWaitingForEvents() {
    await QueueWrapper.mount();
    await SoundWrapper.seedAndPlay();
  },
});
