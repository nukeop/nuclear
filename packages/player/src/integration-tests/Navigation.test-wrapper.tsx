import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';

import App from '../App';
import { routeTree } from '../routeTree.gen';

export const NavigationWrapper = {
  async mount(initialPath: string): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: [initialPath] });
    const router = createRouter({ routeTree, history });
    const result = render(
      <App routerProp={router} queryClientProp={new QueryClient()} />,
    );
    await screen.findByTestId('sidebar-toggle-right');
    return result;
  },
};
