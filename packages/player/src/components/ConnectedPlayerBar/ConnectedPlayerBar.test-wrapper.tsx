import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { QueueItem, Track } from '@nuclearplayer/model';

import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { ConnectedPlayerBar } from './ConnectedPlayerBar';

const user = userEvent.setup();

const defaultTrack: Track = {
  title: 'Test Track',
  artists: [
    {
      name: 'Test Artist',
      roles: [],
      source: { provider: 'test', id: 'a1' },
    },
  ],
  source: { provider: 'test', id: 't1' },
};

class QueueItemBuilder {
  private item: QueueItem;

  constructor() {
    this.item = {
      id: 'qi-1',
      track: { ...defaultTrack },
      status: 'success',
      addedAtIso: new Date().toISOString(),
    };
  }

  withId(id: string) {
    this.item.id = id;
    return this;
  }

  withTrack(track: Track) {
    this.item.track = track;
    return this;
  }

  withTitle(title: string) {
    this.item.track.title = title;
    return this;
  }

  withArtist(name: string) {
    this.item.track.artists = [
      { name, roles: [], source: { provider: 'test', id: 'a1' } },
    ];
    return this;
  }

  withArtwork(url: string) {
    this.item.track.artwork = {
      items: [{ url }],
    };
    return this;
  }

  withStatus(status: QueueItem['status']) {
    this.item.status = status;
    return this;
  }

  build(): QueueItem {
    return structuredClone(this.item);
  }
}

export const ConnectedPlayerBarWrapper = {
  QueueItemBuilder,

  async mount(): Promise<RenderResult> {
    const result = render(<ConnectedPlayerBar />);
    await act(() => Promise.resolve());
    return result;
  },

  seedQueueItem(item: QueueItem) {
    useQueueStore.setState({
      items: [item],
      currentIndex: 0,
    });
  },

  seedVolume(volume01: number) {
    useSettingsStore.setState({
      values: { 'core.playback.volume': volume01 },
    });
  },

  seedShuffle(enabled: boolean) {
    useQueueStore.setState({ shuffleEnabled: enabled });
  },

  seedRepeatMode(mode: 'off' | 'all' | 'one') {
    useQueueStore.setState({ repeatMode: mode });
  },

  nowPlaying: {
    title(text: string) {
      return screen.getByText(text);
    },
    artist(text: string) {
      return screen.queryByText(text);
    },
    get thumbnail() {
      return screen.queryByTestId('player-now-playing-thumbnail');
    },
    get placeholder() {
      return screen.queryByTestId('player-now-playing-placeholder');
    },
  },

  controls: {
    shuffleButton: {
      get element() {
        return screen.getByTestId('player-shuffle-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
    repeatButton: {
      get element() {
        return screen.getByTestId('player-repeat-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
  },

  volume: {
    get slider() {
      return screen.getByTestId('player-volume-slider');
    },
    get rangeInput() {
      return within(this.slider).getByRole('slider');
    },
    async changeValue(value: number) {
      fireEvent.change(this.rangeInput, { target: { value: String(value) } });
    },
  },
};
