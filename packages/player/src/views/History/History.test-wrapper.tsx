import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import type { HistoryEntry } from '../../services/tauri/bindings';
import type { TauriCommandMocks } from '../../test/utils/commandMocks';
import { ok } from '../../test/utils/commandMocks';

export const createHistoryWrapper = (commandMocks: TauriCommandMocks) => ({
  init() {
    commandMocks.reset();
  },

  mockHistoryEntries(...entries: HistoryEntry[]) {
    commandMocks.command('historyGetRecent').mockResolvedValue(ok(entries));
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/history'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('history-view');
    return component;
  },

  get emptyState() {
    return screen.getByTestId('empty-state');
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
    };
  },
});
