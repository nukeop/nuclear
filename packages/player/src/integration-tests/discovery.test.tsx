import { screen, waitFor } from '@testing-library/react';

import type { Track } from '@nuclearplayer/model';

import { initDiscoveryService } from '../services/discoveryService';
import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { DiscoveryProviderBuilder } from '../test/builders/DiscoveryProviderBuilder';
import { SoundWrapper } from './Sound.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: { error: (...args: unknown[]) => toastError(...args) },
}));

const recommendedTrack: Track = {
  title: 'Recommended Track',
  artists: [{ name: 'Recommended Artist', roles: ['primary'] }],
  source: { provider: 'test', id: 'recommended-track' },
};

const getRecommendations = vi.fn().mockResolvedValue([recommendedTrack]);

describe('Discovery', () => {
  let cleanup: () => void;

  beforeEach(() => {
    cleanup = initDiscoveryService();
    providersHost.clear();
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      isReady: true,
      isLoading: false,
    });
    useSettingsStore.setState({ values: {} });
    getRecommendations.mockClear();
    toastError.mockClear();

    providersHost.register(
      new DiscoveryProviderBuilder()
        .withGetRecommendations(getRecommendations)
        .build(),
    );
  });

  afterEach(() => {
    cleanup();
  });

  it.each<{
    enabled: boolean;
    lastTrack: boolean;
    shouldAddTrack: boolean;
  }>([
    { enabled: false, lastTrack: false, shouldAddTrack: false },
    { enabled: false, lastTrack: true, shouldAddTrack: false },
    { enabled: true, lastTrack: false, shouldAddTrack: false },
    { enabled: true, lastTrack: true, shouldAddTrack: true },
  ])(
    'enabled: $enabled, last track: $lastTrack → adds track: $shouldAddTrack',
    async ({ enabled, lastTrack, shouldAddTrack }) => {
      useSettingsStore.setState({
        values: { 'core.playback.discovery': enabled },
      });

      await SoundWrapper.mount();
      await SoundWrapper.seedAndPlay(lastTrack ? 2 : 0);
      SoundWrapper.fireCanPlay();

      await waitFor(() => {
        expect(useQueueStore.getState().items).toHaveLength(
          shouldAddTrack ? 4 : 3,
        );
      });
    },
  );

  describe('when enabled', () => {
    beforeEach(() => {
      useSettingsStore.setState({
        values: { 'core.playback.discovery': true },
      });
    });

    it('does not show the discovery button and does not add tracks when no discovery provider is registered', async () => {
      providersHost.clear();

      await SoundWrapper.mount();
      await SoundWrapper.seedAndPlay(2);
      SoundWrapper.fireCanPlay();

      expect(
        screen.queryByTestId('player-discovery-button'),
      ).not.toBeInTheDocument();
      expect(useQueueStore.getState().items).toHaveLength(3);
    });

    it('shows an error toast when the discovery provider returns an error', async () => {
      getRecommendations.mockRejectedValueOnce(
        new Error('Provider API is down'),
      );

      await SoundWrapper.mount();
      await SoundWrapper.seedAndPlay(2);
      SoundWrapper.fireCanPlay();

      await waitFor(() => {
        expect(toastError).toHaveBeenCalled();
      });
      expect(useQueueStore.getState().items).toHaveLength(3);
    });
  });
});
