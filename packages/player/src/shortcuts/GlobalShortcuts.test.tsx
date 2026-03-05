import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { registerBuiltInCoreSettings } from '../services/coreSettings';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsModalStore } from '../stores/settingsModalStore';
import {
  getSetting,
  initializeSettingsStore,
  setSetting,
} from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../test/utils/mockTrack';

const user = userEvent.setup();

describe('Global keyboard shortcuts', () => {
  beforeEach(async () => {
    resetInMemoryTauriStore();
    await initializeSettingsStore();
    registerBuiltInCoreSettings();
    useSoundStore.setState({
      status: 'stopped',
      seek: 0,
      duration: 200,
    });
    useSettingsModalStore.setState({
      isOpen: false,
    });
    render(<App />);
  });

  it('toggles playback when pressing Space', async () => {
    await user.keyboard(' ');

    expect(useSoundStore.getState().status).toBe('playing');

    await user.keyboard(' ');

    expect(useSoundStore.getState().status).toBe('paused');
  });

  it('goes to next track when pressing Ctrl+Right', async () => {
    useQueueStore.setState({
      items: [
        {
          id: '1',
          track: createMockTrack('Track 1'),
          status: 'idle',
          addedAtIso: '',
        },
        {
          id: '2',
          track: createMockTrack('Track 2'),
          status: 'idle',
          addedAtIso: '',
        },
      ],
      currentIndex: 0,
    });

    await user.keyboard('{Control>}{ArrowRight}{/Control}');

    expect(useQueueStore.getState().currentIndex).toBe(1);
  });

  it('goes to previous track when pressing Ctrl+Left', async () => {
    useQueueStore.setState({
      items: [
        {
          id: '1',
          track: createMockTrack('Track 1'),
          status: 'idle',
          addedAtIso: '',
        },
        {
          id: '2',
          track: createMockTrack('Track 2'),
          status: 'idle',
          addedAtIso: '',
        },
      ],
      currentIndex: 1,
    });

    await user.keyboard('{Control>}{ArrowLeft}{/Control}');

    expect(useQueueStore.getState().currentIndex).toBe(0);
  });

  it('seeks forward when pressing Right', async () => {
    useSoundStore.setState({ seek: 50, duration: 200 });

    await user.keyboard('{ArrowRight}');

    expect(useSoundStore.getState().seek).toBe(60);
  });

  it('seeks backward when pressing Left', async () => {
    useSoundStore.setState({ seek: 50, duration: 200 });

    await user.keyboard('{ArrowLeft}');

    expect(useSoundStore.getState().seek).toBe(40);
  });

  it('increases volume when pressing Ctrl+Up', async () => {
    await setSetting('core.playback.volume', 0.5);

    await user.keyboard('{Control>}{ArrowUp}{/Control}');

    expect(getSetting('core.playback.volume')).toBeCloseTo(0.55);
  });

  it('decreases volume when pressing Ctrl+Down', async () => {
    await setSetting('core.playback.volume', 0.5);

    await user.keyboard('{Control>}{ArrowDown}{/Control}');

    expect(getSetting('core.playback.volume')).toBeCloseTo(0.45);
  });

  it('toggles mute when pressing Ctrl+M', async () => {
    await user.keyboard('{Control>}m{/Control}');

    expect(getSetting('core.playback.muted')).toBe(true);

    await user.keyboard('{Control>}m{/Control}');

    expect(getSetting('core.playback.muted')).toBe(false);
  });

  it('toggles settings modal when pressing Ctrl+Comma', async () => {
    await user.keyboard('{Control>},{/Control}');

    expect(useSettingsModalStore.getState().isOpen).toBe(true);

    await user.keyboard('{Control>},{/Control}');

    expect(useSettingsModalStore.getState().isOpen).toBe(false);
  });
});
