import { act, render, waitFor } from '@testing-library/react';

import type { Track } from '@nuclearplayer/model';
import { NuclearAPI } from '@nuclearplayer/plugin-sdk';

import App from '../App';
import { eventBus } from '../services/eventBus';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';

const testTrack: Track = {
  title: 'Idioteque',
  artists: [{ name: 'Radiohead', roles: [] }],
  source: { provider: 'test', id: 'track-1' },
};

describe('Plugin events integration', () => {
  beforeEach(() => {
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      repeatMode: 'off',
      shuffleEnabled: false,
      isLoading: false,
      isReady: true,
    });
    useSoundStore.setState({
      src: null,
      status: 'stopped',
      seek: 0,
      duration: 0,
      crossfadeMs: 0,
      preload: 'auto',
      crossOrigin: '',
    });
  });

  it('notifies a plugin when a track finishes playing', async () => {
    const api = new NuclearAPI({ eventsHost: eventBus });
    const listener = vi.fn();
    api.Events.on('trackFinished', listener);

    useQueueStore.getState().addToQueue([testTrack]);
    useSoundStore.getState().setSrc({ url: '/track.mp3', protocol: 'http' });
    useSoundStore.getState().play();

    render(<App />);

    await waitFor(() => {
      expect(document.querySelector('audio')).toBeTruthy();
    });

    act(() => {
      const audio = document.querySelector('audio');
      audio?.dispatchEvent(new Event('ended', { bubbles: false }));
    });

    expect(listener).toHaveBeenCalledWith(testTrack);
  });
});
