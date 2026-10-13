import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory } from '@tanstack/react-router';
import {
  act,
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Queue, Track } from '@nuclearplayer/model';
import type { AttributedLyrics } from '@nuclearplayer/plugin-sdk';
import { createSelectWrapper } from '@nuclearplayer/ui';

import {
  REMOTE_EMPTY_QUEUE,
  REMOTE_PLAYBACK,
  REMOTE_QUEUE,
  REMOTE_SETTINGS,
} from '../test/fixtures/remoteControl';
import { MockEventSource } from '../test/mocks/eventSource';
import { FetchMock } from '../test/mocks/fetch';
import RemoteApp from './RemoteApp';
import { createRemoteRouter } from './remoteRouter';
import type { PlaybackState, SettingsState } from './remoteStore';
import { useRemoteStore } from './remoteStore';
import { MAX_RETRIES } from './useEventSource';

const user = userEvent.setup();
export const RemoteControlWrapper = {
  reset() {
    MockEventSource.lastInstance = null;
    useRemoteStore.setState(useRemoteStore.getInitialState());
    vi.stubGlobal('EventSource', MockEventSource);
    vi.restoreAllMocks();
    vi.stubGlobal('EventSource', MockEventSource);
  },

  async mount({ path = '/' }: { path?: string } = {}): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: [path] });
    const result = render(
      <RemoteApp
        queryClientProp={new QueryClient()}
        routerProp={createRemoteRouter(history)}
      />,
    );
    await screen.findByTestId('jam-connecting');
    return result;
  },

  async simulateConnection(
    options: { emptyQueue?: boolean; lyrics?: AttributedLyrics[] } = {},
  ) {
    const queue = options.emptyQueue ? REMOTE_EMPTY_QUEUE : REMOTE_QUEUE;
    FetchMock.init();
    if (options.lyrics) {
      this.lyrics.mockCurrent(options.lyrics);
    }
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

    await waitFor(() => {
      expect(useRemoteStore.getState().synced).toBe(true);
    });
  },

  async mountConnected({
    path,
    ...connection
  }: {
    path?: string;
    emptyQueue?: boolean;
    lyrics?: AttributedLyrics[];
  } = {}) {
    await this.mount({ path });
    await this.simulateConnection(connection);
  },

  async openLyrics(lyrics: AttributedLyrics[]) {
    this.lyrics.mockCurrent(lyrics);
    await this.nowPlaying.lyricsButton.click();
    await screen.findByTestId('jam-lyrics-page');
  },

  simulateConnectionFailure() {
    for (let retry = 0; retry <= MAX_RETRIES; retry++) {
      act(() => {
        MockEventSource.lastInstance?.simulateError();
      });
    }
  },
  simulateConnectionDrop() {
    act(() => {
      MockEventSource.lastInstance?.simulateError();
    });
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
    lyricsButton: {
      get element() {
        return screen.getByTestId('jam-lyrics-button');
      },
      async click() {
        await user.click(this.element);
      },
    },
  },

  get queuePage() {
    return screen.getByTestId('jam-queue-page');
  },

  lyricsPage: {
    get element() {
      return screen.getByTestId('jam-lyrics-page');
    },
    get track() {
      const topBar = screen.getByTestId('jam-lyrics-top-bar');
      return {
        title: within(topBar).getByTestId('jam-lyrics-top-bar-title')
          .textContent,
        artist: within(topBar).getByTestId('jam-lyrics-top-bar-artist')
          .textContent,
      };
    },
    offset: {
      get value() {
        return screen.getByTestId('jam-lyrics-offset').textContent;
      },
      async earlier() {
        await user.click(
          within(screen.getByTestId('jam-lyrics-offset')).getByRole('button', {
            name: 'Show lyrics earlier',
          }),
        );
      },
      async later() {
        await user.click(
          within(screen.getByTestId('jam-lyrics-offset')).getByRole('button', {
            name: 'Show lyrics later',
          }),
        );
      },
    },
    sourcePicker: createSelectWrapper(() =>
      screen.getByTestId('jam-lyrics-source-picker'),
    ),
    backButton: {
      get element() {
        return screen.getByTestId('jam-lyrics-back-button');
      },
      async click() {
        await user.click(this.element);
      },
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
    async findHeader() {
      await screen.findByTestId('jam-queue-header');
      return this.header;
    },
    get header() {
      const header = screen.getByTestId('jam-queue-header');
      return {
        label: within(header).getByTestId('jam-queue-label').textContent,
        count: within(header).getByTestId('jam-queue-count').textContent,
      };
    },
    get items() {
      return screen.queryAllByTestId('jam-queue-item');
    },
    get emptyState() {
      return screen.queryByTestId('jam-queue-empty');
    },
    async removeTrack(title: string) {
      const item = screen
        .getAllByTestId('jam-queue-item')
        .find((element) => element.textContent?.includes(title))!;
      await user.click(
        within(item).getByTestId('jam-queue-item-remove-button'),
      );
    },
  },

  lyrics: {
    mockCurrent(lyrics: AttributedLyrics[]) {
      FetchMock.set('/api/lyrics/current', lyrics);
    },
    mockError() {
      FetchMock.setError('/api/lyrics/current', 500);
    },
    get requests() {
      return vi
        .mocked(global.fetch)
        .mock.calls.filter(([url]) => url === '/api/lyrics/current');
    },
    get lines() {
      return within(screen.getByTestId('jam-lyrics'))
        .getAllByTestId('lyrics-line')
        .map((line) => ({
          text: line.textContent,
          isActive: line.dataset.active === 'true',
        }));
    },
    async findLines() {
      await within(await screen.findByTestId('jam-lyrics')).findAllByTestId(
        'lyrics-line',
      );
      return this.lines;
    },
    emptyState: {
      async find() {
        return screen.findByTestId('jam-lyrics-empty');
      },
      get title() {
        return within(screen.getByTestId('jam-lyrics-empty')).getByRole(
          'heading',
        ).textContent;
      },
      get subtitle() {
        return within(screen.getByTestId('jam-lyrics-empty')).getByRole(
          'paragraph',
        ).textContent;
      },
    },
    async tapLine(text: string) {
      await user.click(
        within(screen.getByTestId('jam-lyrics')).getByText(text),
      );
    },
  },

  search: {
    mockResults(tracks: Track[]) {
      FetchMock.get('/api/search', { tracks });
    },
    mockError() {
      FetchMock.getError('/api/search', 500);
    },
    get drawer() {
      return screen.queryByTestId('jam-search-drawer');
    },
    get emptyState() {
      return screen.queryByTestId('jam-search-empty');
    },
    get errorState() {
      return screen.queryByTestId('jam-search-error');
    },
    get results() {
      return screen.queryAllByTestId('jam-search-result-track');
    },
    input: {
      get element() {
        return screen.getByTestId('jam-search-input');
      },
      async type(text: string) {
        await user.type(this.element, text);
      },
    },
    clearButton: {
      get element() {
        return screen.getByTestId('jam-search-clear');
      },
      async click() {
        await user.click(this.element);
      },
    },
    async addTrack(title: string) {
      await user.click(await screen.findByText(title));
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

  async advanceTime(ms: number) {
    await act(async () => {
      vi.advanceTimersByTime(ms);
    });
  },

  sendSettingsUpdate(settings: SettingsState) {
    act(() => {
      MockEventSource.lastInstance?.simulateEvent('settings', settings);
    });
  },
};
