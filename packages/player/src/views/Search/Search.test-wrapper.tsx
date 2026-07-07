import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { useRecentSearches } from '../../components/SearchBox/useRecentSearches';
import { routeTree } from '../../routeTree.gen';

const user = userEvent.setup();

type AppRouter = ReturnType<typeof createRouter<typeof routeTree>>;
let router: AppRouter;

export const SearchWrapper = {
  async mount(query?: string): Promise<RenderResult> {
    useRecentSearches.setState({ recentSearches: [] });
    // Fresh instances prevent flaky tests caused by stale state from previous
    // tests bleeding into subsequent ones (route subscriptions, query cache
    // observers). This causes tests to fail if running with coverage.
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    });
    const component = render(
      <App queryClientProp={queryClient} routerProp={router} />,
    );

    if (query !== undefined) {
      await this.search(query);
    } else {
      await screen.findByTestId('search-box');
    }

    return component;
  },

  async search(query: string) {
    const searchBox = await screen.findByTestId('search-box');
    await user.clear(searchBox);
    await user.type(searchBox, query);
    await user.keyboard('{Enter}');
    await screen.findByTestId('search-view');
  },

  searchBox: {
    get input(): HTMLInputElement {
      return screen.getByTestId('search-box') as HTMLInputElement;
    },

    async focus() {
      await user.click(this.input);
    },

    get popover() {
      return screen.queryByTestId('search-box-popover');
    },

    get recentSearches() {
      return screen
        .queryAllByTestId('search-box-recent-search')
        .map((item) => item.textContent);
    },

    get highlightedRecentSearch() {
      const highlighted = screen
        .queryAllByTestId('search-box-recent-search')
        .find((item) => item.dataset.highlighted === 'true');
      return highlighted?.textContent;
    },

    get highlightedRecentSearches() {
      return screen
        .queryAllByTestId('search-box-recent-search')
        .filter((item) => item.dataset.highlighted === 'true')
        .map((item) => item.textContent);
    },

    async hoverRecentSearch(text: string) {
      const item = screen
        .getAllByTestId('search-box-recent-search')
        .find((candidate) => candidate.textContent === text);
      await user.hover(item!);
    },

    async clickRecentSearch(text: string) {
      const item = screen
        .getAllByTestId('search-box-recent-search')
        .find((candidate) => candidate.textContent === text);
      await user.click(item!);
    },

    async highlightNext() {
      await user.keyboard('{ArrowDown}');
    },

    async highlightPrevious() {
      await user.keyboard('{ArrowUp}');
    },

    async selectHighlighted() {
      await user.keyboard('{Enter}');
    },

    clearHistoryButton: {
      get element() {
        return screen.queryByTestId('search-box-clear-history');
      },
      async click() {
        await user.click(screen.getByTestId('search-box-clear-history'));
      },
    },

    async type(text: string) {
      await user.type(this.input, text);
    },

    async replaceText(text: string) {
      await user.clear(this.input);
      await user.type(this.input, text);
    },

    async clear() {
      await user.keyboard('{Escape}');
    },

    clearButton: {
      get element() {
        return screen.queryByTestId('search-box-clear');
      },
      async click() {
        await user.click(screen.getByTestId('search-box-clear'));
      },
    },
  },

  async findSearchQuery(query: string) {
    return screen.findByText(`Query: "${query}"`);
  },

  async navigateToSearch(query: string) {
    await router.navigate({ to: '/search', search: { q: query } });
  },

  goBack() {
    router.history.back();
  },

  get emptyState() {
    return screen.queryByTestId('search-empty-state');
  },

  emptyStateAction: {
    get element() {
      return screen.queryByTestId('search-empty-state-action');
    },
    async click() {
      await user.click(screen.getByTestId('search-empty-state-action'));
    },
  },

  async settingsDialog() {
    return screen.findByRole('dialog');
  },

  async pluginsHeading() {
    return screen.findByRole('heading', { name: 'Plugins' });
  },
};
