import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { QueueItem } from '@nuclearplayer/model';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useQueueStore } from '../../stores/queueStore';
import { LyricsProviderBuilder } from '../../test/builders/LyricsProviderBuilder';

const user = userEvent.setup();

export const LyricsWrapper = {
  reset() {
    providersHost.clear();
    useQueueStore.setState({ items: [], currentIndex: 0 });
  },

  setCurrentQueueItem(item: QueueItem) {
    useQueueStore.setState({ items: [item], currentIndex: 0 });
  },

  registerProvider(builder: LyricsProviderBuilder) {
    providersHost.register(builder.build());
  },

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
    action: {
      async click() {
        await user.click(screen.getByTestId('lyrics-empty-state-action'));
      },
    },
  },

  get loadingState() {
    return screen.getByTestId('lyrics-loading');
  },
};
