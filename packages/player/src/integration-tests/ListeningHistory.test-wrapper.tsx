import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { registerBuiltInCoreSettings } from '../services/coreSettings';
import { useHistoryStore } from '../stores/historyStore';
import { setSetting } from '../stores/settingsStore';
import type { TauriCommandMocks } from '../test/utils/commandMocks';
import { ok } from '../test/utils/commandMocks';
import { QueueWrapper } from './Queue.test-wrapper';
import { SoundWrapper } from './Sound.test-wrapper';

export const createListeningHistoryWrapper = (
  commandMocks: TauriCommandMocks,
) => ({
  async init() {
    commandMocks.reset();
    commandMocks.command('historyRecordEvent').mockResolvedValue(ok(null));
    useHistoryStore.setState({ currentPlayId: null });
    registerBuiltInCoreSettings();
    await setSetting('core.history.enabled', true);

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

  historyToggle: {
    async toggle() {
      await userEvent.click(
        await screen.findByRole('button', { name: 'Preferences' }),
      );
      await userEvent.click(
        await screen.findByRole('button', { name: 'General' }),
      );
      await userEvent.click(
        await screen.findByRole('switch', {
          name: 'Record listening history',
        }),
      );
    },
  },
});
