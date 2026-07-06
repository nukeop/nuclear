import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

const user = userEvent.setup();

type AppRouter = ReturnType<typeof createRouter<typeof routeTree>>;
let router: AppRouter;

export const SearchWrapper = {
  async mount(query?: string): Promise<RenderResult> {
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
    await user.type(searchBox, query);
    await user.keyboard('{Enter}');
    await screen.findByTestId('search-view');
  },

  searchBox: {
    get input(): HTMLInputElement {
      return screen.getByTestId('search-box') as HTMLInputElement;
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
