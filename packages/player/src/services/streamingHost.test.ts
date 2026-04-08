import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { StreamCandidate, Track } from '@nuclearplayer/model';
import type { StreamingProvider } from '@nuclearplayer/plugin-sdk';

import { useSettingsStore } from '../stores/settingsStore';
import { providersHost } from './providersHost';
import { createStreamingHost } from './streamingHost';

describe('streamingHost', () => {
  let streamingHost: ReturnType<typeof createStreamingHost>;

  beforeEach(() => {
    streamingHost = createStreamingHost();
    useSettingsStore.getState().setValue('playback.streamExpiryMs', 3600000);
    useSettingsStore.getState().setValue('playback.streamResolutionRetries', 3);
    vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 0, 0));
  });

  afterEach(() => {
    providersHost.clear();
    vi.useRealTimers();
  });

  describe('resolveCandidatesForTrack', () => {
    it('returns error when no streaming provider available', async () => {
      const track: Track = {
        title: 'Test Track',
        artists: [{ name: 'Test Artist', roles: [] }],
        source: { provider: 'test', id: 'track-1' },
      };

      const result = await streamingHost.resolveCandidatesForTrack(track);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('No streaming provider available');
      }
    });

    it('searches for track and returns candidates', async () => {
      const mockCandidates = [
        {
          id: 'candidate-1',
          title: 'Test Track',
          source: { provider: 'youtube', id: 'vid1' },
          failed: false,
        },
        {
          id: 'candidate-2',
          title: 'Test Track (Live)',
          source: { provider: 'youtube', id: 'vid2' },
          failed: false,
        },
      ];

      const searchForTrack = vi.fn().mockResolvedValue(mockCandidates);

      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack,
        getStreamUrl: vi.fn(),
      };

      providersHost.register(provider);

      const track: Track = {
        title: 'Test Track',
        artists: [{ name: 'Test Artist', roles: [] }],
        album: {
          title: 'Test Album',
          source: { provider: 'test', id: 'alb1' },
        },
        source: { provider: 'test', id: 'track-1' },
      };

      const result = await streamingHost.resolveCandidatesForTrack(track);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.candidates).toEqual(mockCandidates);
      }
      expect(searchForTrack).toHaveBeenCalledWith(
        'Test Artist',
        'Test Track',
        'Test Album',
      );
    });

    it('prefers searchForTrackV2 over searchForTrack when available', async () => {
      const mockCandidates = [
        {
          id: 'candidate-1',
          title: 'Test Track',
          source: { provider: 'test', id: 'vid1' },
          failed: false,
        },
      ];

      const searchForTrack = vi.fn();
      const searchForTrackV2 = vi.fn().mockResolvedValue(mockCandidates);

      const provider: StreamingProvider = {
        id: 'test',
        kind: 'streaming',
        name: 'Test',
        searchForTrack,
        searchForTrackV2,
        getStreamUrl: vi.fn(),
      };

      providersHost.register(provider);

      const track: Track = {
        title: 'Test Track',
        artists: [{ name: 'Test Artist', roles: [] }],
        source: { provider: 'test', id: 'track-1' },
      };

      const result = await streamingHost.resolveCandidatesForTrack(track);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.candidates).toEqual(mockCandidates);
      }
      expect(searchForTrackV2).toHaveBeenCalledWith(track);
      expect(searchForTrack).not.toHaveBeenCalled();
    });

    it('falls back to searchForTrack when searchForTrackV2 is not defined', async () => {
      const mockCandidates = [
        {
          id: 'candidate-1',
          title: 'Test Track',
          source: { provider: 'test', id: 'vid1' },
          failed: false,
        },
      ];

      const searchForTrack = vi.fn().mockResolvedValue(mockCandidates);

      const provider: StreamingProvider = {
        id: 'test',
        kind: 'streaming',
        name: 'Test',
        searchForTrack,
        getStreamUrl: vi.fn(),
      };

      providersHost.register(provider);

      const track: Track = {
        title: 'Test Track',
        artists: [{ name: 'Test Artist', roles: [] }],
        album: {
          title: 'Test Album',
          source: { provider: 'test', id: 'alb1' },
        },
        source: { provider: 'test', id: 'track-1' },
      };

      const result = await streamingHost.resolveCandidatesForTrack(track);

      expect(result.success).toBe(true);
      expect(searchForTrack).toHaveBeenCalledWith(
        'Test Artist',
        'Test Track',
        'Test Album',
      );
    });

    it('handles search errors', async () => {
      const searchForTrack = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));

      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack,
        getStreamUrl: vi.fn(),
      };

      providersHost.register(provider);

      const track: Track = {
        title: 'Test Track',
        artists: [{ name: 'Test Artist', roles: [] }],
        source: { provider: 'test', id: 'track-1' },
      };

      const result = await streamingHost.resolveCandidatesForTrack(track);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          'Failed to resolve candidates: Network error',
        );
      }
    });
  });

  describe('resolveStreamForCandidate', () => {
    it('returns undefined when no streaming provider available', async () => {
      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'youtube', id: 'vid1' },
        failed: false,
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(result).toBeUndefined();
    });

    it('returns candidate unchanged when already marked as failed', async () => {
      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack: vi.fn(),
        getStreamUrl: vi.fn(),
      };

      providersHost.register(provider);

      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'youtube', id: 'vid1' },
        failed: true,
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(result).toBe(candidate);
      expect(provider.getStreamUrl).not.toHaveBeenCalled();
    });

    it('returns candidate unchanged when stream is already resolved and not expired', async () => {
      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack: vi.fn(),
        getStreamUrl: vi.fn(),
      };

      providersHost.register(provider);

      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'youtube', id: 'vid1' },
        failed: false,
        stream: {
          url: 'https://example.com/stream.mp3',
          protocol: 'https',
          source: { provider: 'youtube', id: 'vid1' },
        },
        lastResolvedAtIso: new Date().toISOString(),
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(result).toBe(candidate);
      expect(provider.getStreamUrl).not.toHaveBeenCalled();
    });

    it('resolves stream successfully', async () => {
      const mockStream = {
        url: 'https://example.com/stream.mp3',
        protocol: 'https' as const,
        source: { provider: 'youtube', id: 'vid1' },
      };

      const getStreamUrl = vi.fn().mockResolvedValue(mockStream);

      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack: vi.fn(),
        getStreamUrl,
      };

      providersHost.register(provider);

      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'youtube', id: 'vid1' },
        failed: false,
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(getStreamUrl).toHaveBeenCalledWith('candidate-1');
      expect(result).toEqual({
        ...candidate,
        stream: mockStream,
        lastResolvedAtIso: '2025-01-01T00:00:00.000Z',
        failed: false,
      });
    });

    it('prefers getStreamUrlV2 over getStreamUrl when available', async () => {
      const mockStream = {
        url: 'https://example.com/stream.mp3',
        protocol: 'https' as const,
        source: { provider: 'test', id: 'vid1' },
      };

      const getStreamUrl = vi.fn();
      const getStreamUrlV2 = vi.fn().mockResolvedValue(mockStream);

      const provider: StreamingProvider = {
        id: 'test',
        kind: 'streaming',
        name: 'Test',
        searchForTrack: vi.fn(),
        getStreamUrl,
        getStreamUrlV2,
      };

      providersHost.register(provider);

      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'test', id: 'vid1' },
        failed: false,
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(getStreamUrlV2).toHaveBeenCalledWith(candidate);
      expect(getStreamUrl).not.toHaveBeenCalled();
      expect(result!.stream).toEqual(mockStream);
    });

    it('retries on failure and returns failed candidate after max retries', async () => {
      const getStreamUrl = vi
        .fn()
        .mockRejectedValue(new Error('Stream unavailable'));

      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack: vi.fn(),
        getStreamUrl,
      };

      providersHost.register(provider);

      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'youtube', id: 'vid1' },
        failed: false,
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(getStreamUrl).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        ...candidate,
        failed: true,
        stream: undefined,
      });
    });

    it('re-resolves expired stream', async () => {
      const oldStream = {
        url: 'https://example.com/old-stream.mp3',
        protocol: 'https' as const,
        source: { provider: 'youtube', id: 'vid1' },
      };

      const newStream = {
        url: 'https://example.com/new-stream.mp3',
        protocol: 'https' as const,
        source: { provider: 'youtube', id: 'vid1' },
      };

      const getStreamUrl = vi.fn().mockResolvedValue(newStream);

      const provider: StreamingProvider = {
        id: 'youtube',
        kind: 'streaming',
        name: 'YouTube',
        searchForTrack: vi.fn(),
        getStreamUrl,
      };

      providersHost.register(provider);

      const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();

      const candidate: StreamCandidate = {
        id: 'candidate-1',
        title: 'Test Track',
        source: { provider: 'youtube', id: 'vid1' },
        failed: false,
        stream: oldStream,
        lastResolvedAtIso: twoHoursAgo,
      };

      const result = await streamingHost.resolveStreamForCandidate(candidate);

      expect(getStreamUrl).toHaveBeenCalledWith('candidate-1');
      expect(result!.stream).toEqual(newStream);
    });
  });
});
