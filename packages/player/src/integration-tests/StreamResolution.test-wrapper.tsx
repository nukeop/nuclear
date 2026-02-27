import {
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';

export const StreamResolutionWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await screen.findByTestId('app-layout');
    return component;
  },

  getSoundState() {
    return useSoundStore.getState();
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
