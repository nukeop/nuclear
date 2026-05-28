import { act, render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Queue } from '@nuclearplayer/model';

import {
  REMOTE_EMPTY_QUEUE,
  REMOTE_PLAYBACK,
  REMOTE_QUEUE,
  REMOTE_SETTINGS,
} from '../test/fixtures/remoteControl';
import { MockEventSource } from '../test/mocks/eventSource';
import { FetchMock } from '../test/mocks/fetch';
import RemoteControl from './RemoteControl';
import type { PlaybackState, SettingsState } from './remoteStore';
import { useRemoteStore } from './remoteStore';

const user = userEvent.setup();
const MAX_RETRIES = 3;

export const RemoteControlWrapper = {
  reset() {
    MockEventSource.lastInstance = null;
    useRemoteStore.setState(useRemoteStore.getInitialState());
    vi.stubGlobal('EventSource', MockEventSource);
    vi.restoreAllMocks();
    vi.stubGlobal('EventSource', MockEventSource);
  },

  async mount(): Promise<RenderResult> {
    const result = render(<RemoteControl />);
    await screen.findByTestId('jam-connecting');
    return result;
  },

  async simulateConnection(options: { emptyQueue?: boolean } = {}) {
    const queue = options.emptyQueue ? REMOTE_EMPTY_QUEUE : REMOTE_QUEUE;
    FetchMock.init();
    FetchMock.get('/api/queue', queue);
    FetchMock.get('/api/playback', REMOTE_PLAYBACK);
    FetchMock.get('/api/settings', REMOTE_SETTINGS);
    FetchMock.get('/api/playback/toggle', {});
    FetchMock.get('/api/playback/next', {});
    FetchMock.get('/api/playback/previous', {});
    FetchMock.get('/api/playback/seek', {});
    FetchMock.get('/api/playback/shuffle', {});
    FetchMock.get('/api/playback/repeat', {});

    await act(async () => {
      MockEventSource.lastInstance?.simulateOpen();
    });

    await screen.findByTestId('connection-status-badge');
  },

  simulateConnectionFailure() {
    for (let retry = 0; retry <= MAX_RETRIES; retry++) {
      act(() => {
        MockEventSource.lastInstance?.simulateError();
      });
    }
  },

  get connectingState() {
    return screen.queryByTestId('jam-connecting');
  },

  get errorState() {
    return screen.queryByTestId('jam-error');
  },

  header: {
    get badge() {
      return screen.getByTestId('connection-status-badge');
    },
    get statusText() {
      return screen.getByTestId('connection-status-badge').textContent?.trim();
    },
  },

  nowPlaying: {
    get title() {
      return screen.getByTestId('now-playing-title').textContent;
    },
    get artist() {
      return screen.getByTestId('now-playing-artist').textContent;
    },
  },

  controls: {
    playPauseButton: {
      get element() {
        return (screen.queryByTestId('jam-pause-button') ??
          screen.queryByTestId('jam-play-button'))!;
      },
      async click() {
        await user.click(this.element);
      },
    },
    nextButton: {
      get element() {
        return screen.getByTestId('jam-next-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
    previousButton: {
      get element() {
        return screen.getByTestId('jam-previous-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
    shuffleButton: {
      get element() {
        return screen.getByTestId('jam-shuffle-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
    repeatButton: {
      get element() {
        return screen.getByTestId('jam-repeat-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
  },

  queue: {
    get header() {
      return screen.queryByTestId('jam-queue-header');
    },
    get count() {
      return screen.queryByTestId('jam-queue-count')?.textContent;
    },
    get items() {
      return screen.queryAllByTestId('jam-queue-item');
    },
    get emptyState() {
      return screen.queryByTestId('jam-queue-empty');
    },
  },

  sendQueueUpdate(queue: Queue) {
    act(() => {
      MockEventSource.lastInstance?.simulateEvent('queue', queue);
    });
  },

  sendPlaybackUpdate(playback: PlaybackState) {
    act(() => {
      MockEventSource.lastInstance?.simulateEvent('playback', playback);
    });
  },

  sendSettingsUpdate(settings: SettingsState) {
    act(() => {
      MockEventSource.lastInstance?.simulateEvent('settings', settings);
    });
  },
};
