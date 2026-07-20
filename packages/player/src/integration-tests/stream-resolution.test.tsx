import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import { MetadataProviderBuilder } from '../test/builders/MetadataProviderBuilder';
import {
  createMockCandidate,
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import { AlbumWrapper } from '../views/Album/Album.test-wrapper';
import { StreamResolutionWrapper } from './StreamResolution.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

describe('Stream Resolution Integration', () => {
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
    useStartupStore.setState({ isStartingUp: false });

    providersHost.clear();
  });

  const setupMetadataProvider = () => {
    providersHost.register(
      MetadataProviderBuilder.albumDetailsProvider().build(),
    );
  };

  describe('when adding tracks to queue', () => {
    it('resolves stream and starts playback for the first track', async () => {
      setupMetadataProvider();

      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async (artist, title) => [
          createMockCandidate('yt-1', `${artist} - ${title}`),
        ])
        .withGetStreamUrl(async (candidateId) =>
          createMockStream(candidateId, { mimeType: 'audio/mpeg' }),
        )
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForPlayback();

      const src = StreamResolutionWrapper.getSoundState().src;
      expect(src).toEqual({
        url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC0xLm1wMw',
        protocol: 'https',
      });

      const currentItem = StreamResolutionWrapper.getCurrentQueueItem();
      expect(currentItem?.status).toBe('success');
      expect(currentItem?.track.streamCandidates).toHaveLength(1);
    });

    it('shows loading state while resolving stream', async () => {
      setupMetadataProvider();

      let resolveStream: (stream: ReturnType<typeof createMockStream>) => void;
      const streamPromise = new Promise<ReturnType<typeof createMockStream>>(
        (resolve) => {
          resolveStream = resolve;
        },
      );

      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async () => [createMockCandidate('yt-1', 'Track')])
        .withGetStreamUrl(async () => streamPromise)
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await waitFor(() => {
        const item = StreamResolutionWrapper.getCurrentQueueItem();
        expect(item?.status).toBe('loading');
      });

      resolveStream!(createMockStream('yt-1'));

      await waitFor(() => {
        expect(useSoundStore.getState().src).not.toBeNull();
      });

      StreamResolutionWrapper.simulateCanPlay();

      await waitFor(() => {
        const item = StreamResolutionWrapper.getCurrentQueueItem();
        expect(item?.status).toBe('success');
      });
    });
  });

  describe('when stream resolution fails', () => {
    it('shows error state when no streaming provider is available', async () => {
      setupMetadataProvider();

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForError();

      const currentItem = StreamResolutionWrapper.getCurrentQueueItem();
      expect(currentItem?.status).toBe('error');
      expect(currentItem?.error).toBe('streaming:errors.noProviderAvailable');
    });

    it('shows error state when the provider fails to find candidates', async () => {
      setupMetadataProvider();

      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async () => {
          throw new Error('Search failed');
        })
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForError();

      const currentItem = StreamResolutionWrapper.getCurrentQueueItem();
      expect(currentItem?.status).toBe('error');
      expect(currentItem?.error).toBe('streaming:errors.noCandidatesFound');
    });

    it('shows error state when no provider is available to resolve a cached candidate', async () => {
      setupMetadataProvider();

      useQueueStore.setState({
        items: [
          {
            id: 'restored-item-1',
            status: 'idle',
            addedAtIso: new Date().toISOString(),
            track: {
              title: 'Karma Police',
              artists: [{ name: 'Radiohead', roles: ['primary'] }],
              source: { provider: 'test', id: 'karma-police' },
              streamCandidates: [
                {
                  id: 'cached-yt-id',
                  title: 'Karma Police',
                  failed: false,
                  source: { provider: 'yt', id: 'cached-yt-id' },
                  stream: {
                    url: 'https://cached.example.com/karma.m4a?token=old',
                    protocol: 'https',
                    source: { provider: 'yt', id: 'cached-yt-id' },
                  },
                  lastResolvedAtIso: new Date().toISOString(),
                },
              ],
            },
          },
        ],
        currentIndex: 0,
        isReady: true,
        isLoading: false,
      });

      await AlbumWrapper.mountDirectly();

      await StreamResolutionWrapper.waitForError();

      const currentItem = StreamResolutionWrapper.getCurrentQueueItem();
      expect(currentItem?.status).toBe('error');
      expect(currentItem?.error).toBe('streaming:errors.noProviderAvailable');
    });

    it('shows error state when all candidates fail', async () => {
      setupMetadataProvider();

      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async () => [
          createMockCandidate('yt-1', 'Candidate 1'),
          createMockCandidate('yt-2', 'Candidate 2'),
        ])
        .withGetStreamUrl(async () => {
          throw new Error('Stream unavailable');
        })
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForError();

      const currentItem = StreamResolutionWrapper.getCurrentQueueItem();
      expect(
        currentItem?.track.streamCandidates?.every((c) => c.failed),
      ).toBeTruthy();
      expect(currentItem?.status).toBe('error');
      expect(currentItem?.error).toBe('streaming:errors.allCandidatesFailed');
    });

    it('falls back to next candidate when first one fails', async () => {
      setupMetadataProvider();

      let callCount = 0;
      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async () => [
          createMockCandidate('yt-bad', 'Bad Stream'),
          createMockCandidate('yt-good', 'Good Stream'),
        ])
        .withGetStreamUrl(async (candidateId) => {
          callCount++;
          if (candidateId === 'yt-bad') {
            throw new Error('Stream unavailable');
          }
          return createMockStream(candidateId);
        })
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.getSoundState().src).toEqual({
        url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC1nb29kLm1wMw',
        protocol: 'https',
      });

      const currentItem = StreamResolutionWrapper.getCurrentQueueItem();
      expect(currentItem?.status).toBe('success');
      expect(currentItem?.track.streamCandidates?.[0].failed).toBe(true);
      expect(currentItem?.track.streamCandidates?.[1].failed).toBe(false);

      expect(callCount).toEqual(2);
    });
  });

  describe('when stream is fMP4 (YouTube)', () => {
    it('produces MSE protocol with durationSeconds for m4a container', async () => {
      setupMetadataProvider();

      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async (artist, title) => [
          createMockCandidate('yt-1', `${artist} - ${title}`, {
            durationMs: 180000,
          }),
        ])
        .withGetStreamUrl(async (candidateId) =>
          createMockStream(candidateId, {
            container: 'm4a',
            mimeType: 'audio/mp4',
            durationMs: 180000,
            url: 'https://rr1---sn-abc.googlevideo.com/videoplayback?id=123',
          }),
        )
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForPlayback();

      const src = StreamResolutionWrapper.getSoundState().src;
      expect(src?.protocol).toBe('mse');
      expect(src?.durationSeconds).toBe(180);
      expect(src?.url).toContain('http://127.0.0.1:9100/stream/');
    });

    it('falls back to regular protocol when no duration is available', async () => {
      setupMetadataProvider();

      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async (artist, title) => [
          createMockCandidate('yt-1', `${artist} - ${title}`),
        ])
        .withGetStreamUrl(async (candidateId) =>
          createMockStream(candidateId, {
            container: 'm4a',
            mimeType: 'audio/mp4',
          }),
        )
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');

      await StreamResolutionWrapper.waitForPlayback();

      const src = StreamResolutionWrapper.getSoundState().src;
      expect(src?.protocol).toBe('https');
      expect(src?.durationSeconds).toBeUndefined();
    });
  });

  describe('when the queue contains tracks with cached candidates', () => {
    const setupQueueWithCachedCandidates = (lastResolvedAtIso: string) => {
      useQueueStore.setState({
        items: [
          {
            id: 'restored-item-1',
            status: 'idle',
            addedAtIso: new Date().toISOString(),
            track: {
              title: 'Karma Police',
              artists: [{ name: 'Radiohead', roles: ['primary'] }],
              source: { provider: 'test', id: 'karma-police' },
              streamCandidates: [
                {
                  id: 'cached-yt-id',
                  title: 'Karma Police',
                  failed: false,
                  source: { provider: 'yt', id: 'cached-yt-id' },
                  stream: {
                    url: 'https://cached.example.com/karma.m4a?token=old',
                    protocol: 'https',
                    source: { provider: 'yt', id: 'cached-yt-id' },
                  },
                  lastResolvedAtIso,
                },
              ],
            },
          },
        ],
        currentIndex: 0,
        isReady: true,
        isLoading: false,
      });
    };

    it('performs a fresh search when the most recent candidate is past the expiry window', async () => {
      setupMetadataProvider();

      const searchForTrack = vi.fn(async (artist: string, title: string) => [
        createMockCandidate(`fresh-${title}`, `${artist} - ${title}`),
      ]);
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack(searchForTrack)
          .withGetStreamUrl(async (candidateId) =>
            createMockStream(candidateId),
          )
          .build(),
      );

      const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
      setupQueueWithCachedCandidates(twoHoursAgo);

      await AlbumWrapper.mountDirectly();

      await waitFor(() => {
        expect(searchForTrack).toHaveBeenCalledWith(
          'Radiohead',
          'Karma Police',
          undefined,
        );
      });
    });

    it('reuses cached candidates when they are still within the expiry window', async () => {
      setupMetadataProvider();

      const searchForTrack = vi.fn(async (artist: string, title: string) => [
        createMockCandidate(`fresh-${title}`, `${artist} - ${title}`),
      ]);
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack(searchForTrack)
          .withGetStreamUrl(async (candidateId) =>
            createMockStream(candidateId),
          )
          .build(),
      );

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
      setupQueueWithCachedCandidates(fiveMinutesAgo);

      await AlbumWrapper.mountDirectly();

      await StreamResolutionWrapper.waitForPlayback();

      expect(searchForTrack).not.toHaveBeenCalled();
    });
  });

  describe('when navigating the queue', () => {
    it('resolves stream for each track when navigating', async () => {
      setupMetadataProvider();

      const resolvedTracks: string[] = [];
      const streamingProvider = new StreamingProviderBuilder()
        .withSearchForTrack(async (artist, title) => {
          resolvedTracks.push(title);
          return [createMockCandidate(`yt-${title}`, `${artist} - ${title}`)];
        })
        .withGetStreamUrl(async (candidateId) => createMockStream(candidateId))
        .build();

      providersHost.register(streamingProvider);

      await AlbumWrapper.mountDirectly();
      await AlbumWrapper.addTrackToQueueByTitle('Countdown');
      await AlbumWrapper.addTrackToQueueByTitle('Giant Steps');

      await StreamResolutionWrapper.waitForPlayback();
      expect(resolvedTracks).toContain('Countdown');

      await StreamResolutionWrapper.selectQueueItem('Giant Steps');

      await waitFor(() => {
        expect(resolvedTracks).toContain('Giant Steps');
      });

      expect(StreamResolutionWrapper.getSoundState().src).toEqual({
        url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC1HaWFudCBTdGVwcy5tcDM',
        protocol: 'https',
      });
    });
  });
});
