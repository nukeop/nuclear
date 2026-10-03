import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

export const LyricsWrapper = {
  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/lyrics'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('lyrics-view');
    return component;
  },

  emptyState: {
    get title() {
      return within(screen.getByTestId('lyrics-empty-state')).getByRole(
        'heading',
      ).textContent;
    },
  },
};
