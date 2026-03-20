import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

const user = userEvent.setup();

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
    const router = createRouter({ routeTree });
    const component = render(
      <App queryClientProp={queryClient} routerProp={router} />,
    );

    await this.search(query ?? 'test');

    return component;
  },

  async search(query: string) {
    const searchBox = await screen.findByTestId('search-box');
    await user.type(searchBox, query);
    await user.keyboard('{Enter}');
    await screen.findByTestId('search-view');
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
