import { waitFor } from '@testing-library/react';

import type { QueueItem, StreamCandidate } from '@nuclearplayer/model';

import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import {
  createMockCandidate,
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import { createQueueItem } from '../test/fixtures/queue';
import { QueueWrapper } from './Queue.test-wrapper';
import { StreamResolutionWrapper } from './StreamResolution.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(9100),
}));

const itemWithCandidates = (
  title: string,
  candidates: StreamCandidate[],
): QueueItem => {
  const item = createQueueItem(title);
  return {
    ...item,
    track: { ...item.track, streamCandidates: candidates },
  };
};

const registerStreamingProvider = () => {
  providersHost.register(
    new StreamingProviderBuilder()
      .withGetStreamUrl(async (candidateId) => createMockStream(candidateId))
      .build(),
  );
};

describe('Queue candidate selection', () => {
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
    registerStreamingProvider();
  });

  describe('popover contents', () => {
    it('opens a popover with the track header and all candidates on right-click', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Karma Police', [
          createMockCandidate('yt-a', 'Karma Police (Official Video)'),
          createMockCandidate('yt-b', 'Karma Police (Remaster)'),
          createMockCandidate('yt-c', 'Karma Police (Live)'),
        ]),
      ]);
      await QueueWrapper.mount();

      await QueueWrapper.candidatePopover.openFor('Karma Police');

      expect(QueueWrapper.candidatePopover.header.title).toBe('Karma Police');
      expect(QueueWrapper.candidatePopover.header.artist).toBe('Test Artist');
      expect(QueueWrapper.candidatePopover.candidateTitles).toEqual([
        'Karma Police (Official Video)',
        'Karma Police (Remaster)',
        'Karma Police (Live)',
      ]);
    });

    it('shows the first non-failed candidate as selected', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Song One', [createMockCandidate('yt-a', 'A')]),
        itemWithCandidates('Song Two', [
          createMockCandidate('yt-bad', 'Broken Version', { failed: true }),
          createMockCandidate('yt-good', 'Working Version'),
        ]),
      ]);
      await QueueWrapper.mount();

      await QueueWrapper.candidatePopover.openFor('Song Two');

      expect(QueueWrapper.candidatePopover.selectedCandidate).toBe(
        'Working Version',
      );
    });

    it('shows an empty state for items without candidates', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Song One', [createMockCandidate('yt-a', 'A')]),
        createQueueItem('Song Two'),
      ]);
      await QueueWrapper.mount();

      await QueueWrapper.candidatePopover.openFor('Song Two');

      expect(QueueWrapper.candidatePopover.emptyState).toHaveTextContent(
        'No stream candidates',
      );
    });
  });

  describe('selecting a candidate', () => {
    it('moves the clicked candidate to the front of the list and marks it selected', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Song One', [createMockCandidate('yt-a', 'A')]),
        itemWithCandidates('Song Two', [
          createMockCandidate('yt-1', 'First Version'),
          createMockCandidate('yt-2', 'Second Version'),
          createMockCandidate('yt-3', 'Third Version'),
        ]),
      ]);
      await QueueWrapper.mount();

      await QueueWrapper.candidatePopover.openFor('Song Two');
      await QueueWrapper.candidatePopover.select('Third Version');

      expect(QueueWrapper.candidatePopover.candidateTitles).toEqual([
        'Third Version',
        'First Version',
        'Second Version',
      ]);
      expect(QueueWrapper.candidatePopover.selectedCandidate).toBe(
        'Third Version',
      );
    });

    it('restarts playback from the new source when switching on the current item', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Karma Police', [
          createMockCandidate('yt-a', 'Version A'),
          createMockCandidate('yt-b', 'Version B'),
        ]),
      ]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      expect(StreamResolutionWrapper.getSoundState().src).toEqual({
        url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC1hLm1wMw',
        protocol: 'https',
      });

      await QueueWrapper.candidatePopover.openFor('Karma Police');
      await QueueWrapper.candidatePopover.select('Version B');

      await waitFor(() => {
        expect(StreamResolutionWrapper.getSoundState().src).toEqual({
          url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC1iLm1wMw',
          protocol: 'https',
        });
      });
      expect(StreamResolutionWrapper.getSoundState().status).toBe('playing');
    });

    it('does not interrupt playback when switching on another item', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Karma Police', [
          createMockCandidate('yt-a', 'Version A'),
        ]),
        itemWithCandidates('No Surprises', [
          createMockCandidate('yt-1', 'First Version'),
          createMockCandidate('yt-2', 'Second Version'),
        ]),
      ]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.candidatePopover.openFor('No Surprises');
      await QueueWrapper.candidatePopover.select('Second Version');

      expect(QueueWrapper.candidatePopover.selectedCandidate).toBe(
        'Second Version',
      );
      expect(StreamResolutionWrapper.getSoundState().src).toEqual({
        url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC1hLm1wMw',
        protocol: 'https',
      });
    });

    it('retries a failed candidate when it is explicitly selected', async () => {
      QueueWrapper.seedQueue([
        itemWithCandidates('Karma Police', [
          createMockCandidate('yt-bad', 'Broken Version', { failed: true }),
          createMockCandidate('yt-a', 'Working Version'),
        ]),
      ]);
      await QueueWrapper.mount();
      await StreamResolutionWrapper.waitForPlayback();

      await QueueWrapper.candidatePopover.openFor('Karma Police');
      await QueueWrapper.candidatePopover.select('Broken Version');

      await waitFor(() => {
        expect(StreamResolutionWrapper.getSoundState().src).toEqual({
          url: 'http://127.0.0.1:9100/stream/aHR0cHM6Ly9leGFtcGxlLmNvbS95dC1iYWQubXAz',
          protocol: 'https',
        });
      });
      expect(QueueWrapper.candidatePopover.selectedCandidate).toBe(
        'Broken Version',
      );
    });
  });
});
