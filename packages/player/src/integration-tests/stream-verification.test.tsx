import { openUrl } from '@tauri-apps/plugin-opener';

import { streamVerificationApi } from '../apis/streamVerificationApi';
import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import {
  initializeStreamVerificationStore,
  useStreamVerificationStore,
} from '../stores/streamVerificationStore';
import {
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import {
  CANDIDATES,
  TRACK_WITH_CANDIDATES,
} from '../test/fixtures/streamVerification';
import { FetchMock } from '../test/mocks/fetch';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { QueueWrapper } from './Queue.test-wrapper';
import { StreamResolutionWrapper } from './StreamResolution.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

vi.mock('@tauri-apps/plugin-opener', () => ({
  openUrl: vi.fn(),
}));

describe('Stream verification', () => {
  beforeEach(() => {
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      isReady: true,
      isLoading: false,
    });

    useSoundStore.setState({
      src: null,
      status: 'stopped',
      crossfadeMs: 0,
      preload: 'auto',
      crossOrigin: '',
    });

    resetInMemoryTauriStore();
    useStreamVerificationStore.setState({ verifications: {} });
    streamVerificationApi.clearCache();

    useSettingsStore.getState().setValue('playback.streamExpiryMs', 3600000);
    useSettingsStore.getState().setValue('playback.streamResolutionRetries', 1);
    useSettingsStore
      .getState()
      .setValue('core.playback.streamVerification', true);
    useSettingsStore
      .getState()
      .setValue('core.playback.streamVerificationService', true);
    useSettingsStore
      .getState()
      .setValue(
        'core.streamVerification.authorId',
        '2f1e4b9c-6b1d-4c0e-9a8e-1f2d3c4b5a69',
      );
    useStartupStore.setState({ isStartingUp: false });

    providersHost.clear();
    providersHost.register(
      new StreamingProviderBuilder()
        .withSearchForTrack(async () => CANDIDATES)
        .withGetStreamUrl(async (candidateId) => createMockStream(candidateId))
        .build(),
    );

    FetchMock.init();
  });

  describe('plays verified streams', () => {
    it("plays the top verified stream and moves it to the first place on the candidate list when it's not the first candidate", async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-b', score: 5 });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-b.mp3',
      );

      await QueueWrapper.candidatePopover.openFor('Karma Police');

      expect(QueueWrapper.candidatePopover.candidateTitles).toEqual([
        'Version B',
        'Version A',
        'Version C',
      ]);
      expect(QueueWrapper.candidatePopover.selectedCandidate).toBe('Version B');
    });

    it('plays the top verified stream even when the provider search did not return it', async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-verified', score: 5 });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-verified.mp3',
      );

      await QueueWrapper.candidatePopover.openFor('Karma Police');

      expect(QueueWrapper.candidatePopover.candidateTitles).toEqual([
        'Karma Police',
        'Version A',
        'Version B',
        'Version C',
      ]);
    });

    it('plays the first candidate when the track has no top stream', async () => {
      FetchMock.getError('/mappings/top', 404);
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-a.mp3',
      );
    });

    it('plays the first candidate without asking the stream verification service when verification is toggled off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerification', false);
      const fetchSpy = FetchMock.get('/mappings/top', {
        stream_id: 'yt-b',
        score: 5,
      });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-a.mp3',
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("doesn't send requests when online verification is off", async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerificationService', false);
      const fetchSpy = FetchMock.get('/mappings/top', {
        stream_id: 'yt-b',
        score: 10,
      });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-a.mp3',
      );
      expect(
        await QueueWrapper.streamVerification.status.find('Unverified'),
      ).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('local verifications', () => {
    it('plays the locally verified stream first', async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-b', score: 10 });
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-c.mp3',
      );
    });

    it('plays the locally verified stream without asking the stream verification service when online verification is off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerificationService', false);
      const fetchSpy = FetchMock.get('/mappings/top', {
        stream_id: 'yt-b',
        score: 10,
      });
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-c.mp3',
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('plays the locally verified stream without asking the stream verification service', async () => {
      const fetchSpy = FetchMock.get('/mappings/top', {
        stream_id: 'yt-b',
        score: 10,
      });
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('ignores local verifications when stream verification is off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerification', false);
      FetchMock.get('/mappings/top', { stream_id: 'yt-b', score: 10 });
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-a.mp3',
      );
    });

    it('keeps local verifications after a restart', async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-b', score: 10 });
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      useStreamVerificationStore.setState({ verifications: {}, loaded: false });
      await initializeStreamVerificationStore();
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.playingStreamUrl).toBe(
        'https://example.com/yt-c.mp3',
      );
    });
  });

  describe('shows status', () => {
    it('shows Unverified when the track has no top stream', async () => {
      FetchMock.getError('/mappings/top', 404);
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.status.find('Unverified'),
      ).toBeInTheDocument();
    });

    it('shows Unverified when the user switches to a candidate that is not the top stream', async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-a', score: 10 });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.candidatePopover.openFor('Karma Police');
      await QueueWrapper.candidatePopover.select('Version B');

      expect(
        await QueueWrapper.streamVerification.status.find('Unverified'),
      ).toBeInTheDocument();
    });

    it('shows Weakly verified when there are few votes', async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-a', score: 2 });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.status.find('Weakly verified'),
      ).toBeInTheDocument();
    });

    it('shows Verified when there are many votes', async () => {
      FetchMock.get('/mappings/top', { stream_id: 'yt-a', score: 10 });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.status.find('Verified'),
      ).toBeInTheDocument();
    });

    it('shows Verified by you if the user has verified it', async () => {
      FetchMock.get('/mappings/top', {
        stream_id: 'yt-a',
        score: 10,
        self_verified: true,
      });
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.status.find('Verified by you'),
      ).toBeInTheDocument();
    });

    it('shows Verified by you for a local verification when online verification is off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerificationService', false);
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.status.find('Verified by you'),
      ).toBeInTheDocument();
    });

    it('shows a loader while the status is loading', async () => {
      FetchMock.get('/mappings/top', {
        stream_id: 'yt-a',
        score: 10,
      }).mockImplementation(() => new Promise(() => {}));
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.loader.find(),
      ).toBeInTheDocument();
    });

    it('renders nothing when the preference is off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerification', false);
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      expect(QueueWrapper.streamVerification.query).not.toBeInTheDocument();
    });

    it("renders nothing when nothing's playing", async () => {
      await QueueWrapper.mount();

      expect(QueueWrapper.streamVerification.query).not.toBeInTheDocument();
    });
  });

  describe('verifying', () => {
    it('lets you verify the track', async () => {
      FetchMock.getError('/mappings/top', 404);
      FetchMock.get('/mappings', {});
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.streamVerification.verifyButton.click();

      expect(
        await QueueWrapper.streamVerification.status.find('Verified by you'),
      ).toBeInTheDocument();
      expect(
        await QueueWrapper.streamVerification.unverifyButton.find(),
      ).toBeInTheDocument();
    });

    it('lets you unverify the track', async () => {
      FetchMock.get('/mappings/top', {
        stream_id: 'yt-a',
        score: 10,
        self_verified: true,
      });
      FetchMock.get('/mappings', {});
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.streamVerification.unverifyButton.click();

      expect(
        await QueueWrapper.streamVerification.status.find('Unverified'),
      ).toBeInTheDocument();
      expect(
        await QueueWrapper.streamVerification.verifyButton.find(),
      ).toBeInTheDocument();
    });

    it('lets you verify the track when online verification is off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerificationService', false);
      const fetchSpy = FetchMock.get('/mappings', {});
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.streamVerification.verifyButton.click();

      expect(
        await QueueWrapper.streamVerification.status.find('Verified by you'),
      ).toBeInTheDocument();
      expect(
        await QueueWrapper.streamVerification.unverifyButton.find(),
      ).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('lets you unverify a local verification when online verification is off', async () => {
      useSettingsStore
        .getState()
        .setValue('core.playback.streamVerificationService', false);
      const fetchSpy = FetchMock.get('/mappings', {});
      await useStreamVerificationStore
        .getState()
        .saveVerification(TRACK_WITH_CANDIDATES.track, 'yt-c');
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.streamVerification.unverifyButton.click();

      expect(
        await QueueWrapper.streamVerification.status.find('Unverified'),
      ).toBeInTheDocument();
      expect(
        await QueueWrapper.streamVerification.verifyButton.find(),
      ).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('saves the verification locally when the stream verification service is unavailable', async () => {
      FetchMock.getError('/mappings/top', 404);
      FetchMock.getError('/mappings', 500);
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.streamVerification.verifyButton.click();

      expect(
        await QueueWrapper.toast.find(
          "Stream was verified locally, but Nuclear couldn't reach the verification service.",
        ),
      ).toBeInTheDocument();
      expect(
        await QueueWrapper.streamVerification.status.find('Verified by you'),
      ).toBeInTheDocument();
    });

    it('disables the button while the playing candidate has no resolved stream', async () => {
      FetchMock.getError('/mappings/top', 404);
      providersHost.clear();
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack(async () => CANDIDATES)
          .withGetStreamUrl(() => new Promise(() => {}))
          .build(),
      );
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      expect(
        await QueueWrapper.streamVerification.verifyButton.find(),
      ).toBeDisabled();
    });
  });

  describe('explaining', () => {
    it('explains how stream verification works', async () => {
      FetchMock.getError('/mappings/top', 404);
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await QueueWrapper.streamVerification.helpButton.click();

      expect(
        await QueueWrapper.streamVerification.explanation.find(),
      ).toHaveTextContent(
        'Nuclear may sometimes pick the wrong version of a song. You can correct this. Right-click the queue item to see the list of available streams, and pick the right one. When you hear the right one, press Verify to save your correction. Other users will get that version first too. Nuclear asks the verification service about every track you play. When you verify, it sends the artist, the title, the stream you picked, and a random ID as your user identifier.',
      );
    });

    it('opens the documentation from the explanation', async () => {
      FetchMock.getError('/mappings/top', 404);
      QueueWrapper.initQueue([TRACK_WITH_CANDIDATES]);
      await QueueWrapper.mount();

      await QueueWrapper.streamVerification.helpButton.click();
      await QueueWrapper.streamVerification.explanation.learnMore();

      expect(openUrl).toHaveBeenCalledWith(
        'https://docs.nuclearplayer.com/nuclear/core-concepts/stream-verification',
      );
    });
  });
});
