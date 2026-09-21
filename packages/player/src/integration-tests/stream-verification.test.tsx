import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import {
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import { TRACK_WITH_CANDIDATES } from '../test/fixtures/streamVerification';
import { FetchMock } from '../test/mocks/fetch';
import { QueueWrapper } from './Queue.test-wrapper';
import { StreamResolutionWrapper } from './StreamResolution.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
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

    useSettingsStore.getState().setValue('playback.streamExpiryMs', 3600000);
    useSettingsStore.getState().setValue('playback.streamResolutionRetries', 1);
    useSettingsStore.getState().setValue('playback.streamVerification', true);
    useStartupStore.setState({ isStartingUp: false });

    providersHost.clear();
    providersHost.register(
      new StreamingProviderBuilder()
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
      ]);
      expect(QueueWrapper.candidatePopover.selectedCandidate).toBe('Version B');
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
        .setValue('playback.streamVerification', false);
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
  });

  describe('shows status', () => {
    it.todo('shows Unverified when the track has no top stream');
    it.todo(
      'shows Unverified when the top stream is not the playing candidate',
    );
    it.todo('shows Weakly verified when there are few votes');
    it.todo('shows Verified when there are many votes');
    it.todo('shows Verified by you if the user has verified it');
    it.todo('shows Checking while the status is loading');
    it.todo('renders nothing when the preference is off');
    it.todo("renders nothing when nothing's playing");
  });

  describe('verifying', () => {
    it.todo('lets the user verify the track');
    it.todo('lets the user unverify the track');
    it.todo('shows an error when verification fails');
    it.todo(
      'disables the button while the playing candidate has no resolved stream',
    );
  });
});
