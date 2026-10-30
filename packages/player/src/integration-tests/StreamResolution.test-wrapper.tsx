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
import { setSetting } from '../stores/settingsStore';
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

class DeferredSearches {
  private readonly deferredByTitle = new Map<
    string,
    PromiseWithResolvers<void>
  >();
  private readonly requested: string[] = [];

  get requestedTitles(): readonly string[] {
    return this.requested;
  }

  async search(title: string) {
    this.requested.push(title);
    await this.deferredFor(title).promise;
    return [createMockCandidate(`${title} stream`, title)];
  }

  release(title: string) {
    this.deferredFor(title).resolve();
  }

  private deferredFor(title: string) {
    const deferred =
      this.deferredByTitle.get(title) ?? Promise.withResolvers<void>();
    this.deferredByTitle.set(title, deferred);
    return deferred;
  }
}

export const StreamResolutionWrapper = {
  streaming: {
    searches: new DeferredSearches(),

    async register() {
      await setSetting('core.playback.streamVerification', false);
      const searches = new DeferredSearches();
      this.searches = searches;
      providersHost.register(
        new StreamingProviderBuilder()
          .withSearchForTrack((_artist, title) => searches.search(title))
          .withGetStreamUrl(async (candidateId) =>
            createMockStream(candidateId),
          )
          .build(),
      );
    },

    async waitForSearch(title: string) {
      await waitFor(() => {
        expect(this.searches.requestedTitles).toContain(title);
      });
    },

    async releaseSearch(title: string) {
      await act(async () => {
        this.searches.release(title);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    },
  },

  async startQueuePlayback(titles: string[]) {
    QueueWrapper.initQueue(titles.map((title) => createQueueItem(title)));
    this.streaming.searches.release(titles[0]);
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
