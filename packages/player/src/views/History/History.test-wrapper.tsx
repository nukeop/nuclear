import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';

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
});
