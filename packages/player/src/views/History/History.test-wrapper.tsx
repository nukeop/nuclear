import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import {
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import type { HistoryEntry } from '../../services/tauri/bindings';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useQueueStore } from '../../stores/queueStore';
import type { TauriCommandMocks } from '../../test/utils/commandMocks';
import { ok } from '../../test/utils/commandMocks';

const user = userEvent.setup();

const FAVORITED_LABEL = 'Remove from favorites';

export const createHistoryWrapper = (commandMocks: TauriCommandMocks) => ({
  init() {
    commandMocks.reset();
    useQueueStore.setState({ items: [], currentIndex: 0 });
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: true,
    });
  },

  mockHistoryEntries(...entries: HistoryEntry[]) {
    commandMocks.command('historyFetch').mockImplementation(async (page) =>
      ok({
        items: entries.slice(page.offset, page.offset + page.limit),
        total: entries.length,
      }),
    );
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/history'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('history-view');
    await waitFor(() => {
      expect(screen.queryByTestId('history-loading')).not.toBeInTheDocument();
    });
    return component;
  },

  get emptyState() {
    return screen.getByTestId('history-empty-state');
  },

  get rows() {
    return screen.getAllByTestId('history-row');
  },

  pagination: {
    get isVisible() {
      return screen.queryByTestId('history-pagination') !== null;
    },
    get element() {
      return screen.getByTestId('history-pagination');
    },
    get pages() {
      return within(this.element)
        .getAllByTestId('pagination-item')
        .map((item) => item.textContent);
    },
    get currentPage() {
      return within(this.element).getByRole('button', { current: 'page' })
        .textContent;
    },
    previous: {
      async click() {
        await user.click(screen.getByRole('button', { name: 'Previous page' }));
      },
    },
    next: {
      async click() {
        await user.click(screen.getByRole('button', { name: 'Next page' }));
      },
    },
  },

  pageSizeSelect: {
    get element() {
      return screen.getByTestId('history-page-size');
    },
    async select(size: string) {
      await user.click(within(this.element).getByRole('button'));
      await user.click(await screen.findByRole('option', { name: size }));
    },
  },

  queue: {
    get tracks() {
      return screen.getAllByTestId('queue-item').map((item) => ({
        title: within(item).getByTestId('queue-item-title').textContent,
        artist: within(item).getByTestId('queue-item-artist').textContent,
      }));
    },
    get currentTrackTitle() {
      const current = screen
        .getAllByTestId('queue-item')
        .find((item) => item.getAttribute('data-is-current') === 'true');
      return within(current!).getByTestId('queue-item-title').textContent;
    },
  },

  get dayGroups() {
    return screen.getAllByTestId('history-day-group').map((group) => ({
      marker: within(group).getByTestId('history-day-marker').textContent,
      rowTitles: within(group)
        .getAllByTestId('history-row-title')
        .map((title) => title.textContent),
    }));
  },

  row(index: number) {
    const element = () => screen.getAllByTestId('history-row')[index];
    return {
      get element() {
        return element();
      },
      get title() {
        return within(element()).getByTestId('history-row-title').textContent;
      },
      get artist() {
        return within(element()).getByTestId('history-row-artist').textContent;
      },
      get artwork() {
        return within(element()).getByRole('img');
      },
      get playedAt() {
        return within(element()).getByTestId('history-row-played-at')
          .textContent;
      },
      favoriteButton: {
        get element() {
          return within(element()).getByTestId('history-row-favorite');
        },
        get isFavorited() {
          return this.element.getAttribute('aria-label') === FAVORITED_LABEL;
        },
        async click() {
          await user.click(this.element);
        },
      },
      addToQueueButton: {
        async click() {
          await user.click(
            within(element()).getByTestId('history-row-add-to-queue'),
          );
        },
      },
      playButton: {
        async click() {
          await user.click(within(element()).getByTestId('history-row-title'));
        },
      },
    };
  },
});
