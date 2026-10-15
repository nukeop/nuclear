import {
  act,
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import {
  createMockCandidate,
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import { createQueueItem } from '../test/fixtures/queue';
import { PlayerBarWrapper } from './PlayerBar.test-wrapper';
import { QueueWrapper } from './Queue.test-wrapper';
import { SoundWrapper } from './Sound.test-wrapper';

const searchGates = new Map<string, PromiseWithResolvers<void>>();
const searchedTitles: string[] = [];

const searchGateFor = (title: string) => {
  const gate = searchGates.get(title) ?? Promise.withResolvers<void>();
  searchGates.set(title, gate);
  return gate;
};

const gatedSearch = async (title: string) => {
  searchedTitles.push(title);
  await searchGateFor(title).promise;
  return [createMockCandidate(`${title} stream`, title)];
};

export const StreamResolutionWrapper = {
  streaming: {
    register() {
      searchGates.clear();
      searchedTitles.length = 0;
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack((_artist, title) => gatedSearch(title))
          .withGetStreamUrl(async (candidateId) =>
            createMockStream(candidateId),
          )
          .build(),
      );
    },

    async waitForPendingSearch(title: string) {
      await waitFor(() => {
        expect(searchedTitles).toContain(title);
      });
    },

    async releaseSearch(title: string) {
      await act(async () => {
        searchGateFor(title).resolve();
      });
    },
  },

  async startQueuePlayback(titles: string[]) {
    QueueWrapper.initQueue(titles.map((title) => createQueueItem(title)));
    searchGateFor(titles[0]).resolve();
    useStartupStore.setState({ isStartingUp: false });
    await QueueWrapper.mount();
    await waitFor(() => {
      expect(useSoundStore.getState().src).not.toBeNull();
    });

    await PlayerBarWrapper.playButton.click();
    SoundWrapper.fireCanPlay();
  },

  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await screen.findByTestId('app-layout');
    return component;
  },

  getSoundState() {
    return useSoundStore.getState();
  },

  get playingStreamUrl() {
    const proxiedUrl = useSoundStore.getState().src!.url;
    const encoded = proxiedUrl.slice(proxiedUrl.lastIndexOf('/') + 1);
    return atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  },

  getCurrentQueueItem() {
    return useQueueStore.getState().getCurrentItem();
  },

  getQueueItems() {
    return useQueueStore.getState().items;
  },

  async waitForStreamResolution() {
    await waitFor(() => {
      const item = this.getCurrentQueueItem();
      expect(item?.status).not.toBe('loading');
    });
  },

  async waitForPlayback() {
    await waitFor(() => {
      expect(useSoundStore.getState().src).not.toBeNull();
    });

    const audio = document.querySelector('audio');
    if (audio) {
      audio.dispatchEvent(new Event('canplay'));
    }

    await waitFor(() => {
      const item = useQueueStore.getState().getCurrentItem();
      expect(item?.status).toBe('success');
    });
  },

  simulateCanPlay() {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.dispatchEvent(new Event('canplay'));
    }
  },

  async waitForSuccess() {
    this.simulateCanPlay();
    await waitFor(() => {
      const item = useQueueStore.getState().getCurrentItem();
      expect(item?.status).toBe('success');
    });
  },

  async waitForError() {
    await waitFor(() => {
      const item = this.getCurrentQueueItem();
      expect(item?.status).toBe('error');
    });
  },

  getQueueItemStatuses() {
    return useQueueStore.getState().items.map((item) => ({
      title: item.track.title,
      status: item.status,
      error: item.error,
      hasCandidates: (item.track.streamCandidates?.length ?? 0) > 0,
    }));
  },

  async selectQueueItem(title: string) {
    const queuePanel = await screen.findByTestId('queue-panel');
    const items = await within(queuePanel).findAllByTestId('queue-item');
    const item = items.find((el) => el.textContent?.includes(title));
    if (!item) {
      throw new Error(`Queue item with title "${title}" not found`);
    }
    await userEvent.dblClick(item);
  },
};
