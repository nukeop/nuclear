import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { invoke } from '@tauri-apps/api/core';
import {
  act,
  render,
  RenderResult,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { routeTree } from '../routeTree.gen';
import { tauriEventMocks } from '../test/utils/eventMocks';

type DownloadKind = 'install' | 'update';

const user = userEvent.setup();

const emitDownload = (payload: Record<string, unknown>) =>
  act(() => tauriEventMocks.emit('ytdlp:download', payload));

const createToastWrapper = (toast: HTMLElement) => ({
  text(content: string) {
    return within(toast).getByText(content);
  },
  queryText(content: string) {
    return within(toast).queryByText(content);
  },
  retryButton: {
    get element() {
      return within(toast).queryByRole('button', { name: 'Retry' });
    },
    async click() {
      await user.click(within(toast).getByRole('button', { name: 'Retry' }));
    },
  },
});

export const YtdlpDownloadWrapper = {
  async mount(): Promise<RenderResult> {
    vi.mocked(invoke).mockResolvedValue(true);
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const router = createRouter({ routeTree, history });
    const result = render(<App routerProp={router} />);
    await screen.findByTestId('sidebar-toggle-right');
    return result;
  },

  get installRequests() {
    return vi
      .mocked(invoke)
      .mock.calls.filter(([command]) => command === 'ytdlp_ensure_installed')
      .length;
  },

  download: {
    progress(kind: DownloadKind, percent: number | null) {
      emitDownload({ kind, status: 'progress', percent });
    },
    finished(kind: DownloadKind) {
      emitDownload({ kind, status: 'finished' });
    },
    failed(kind: DownloadKind, error: string) {
      emitDownload({ kind, status: 'failed', error });
    },
  },

  toast: {
    async find() {
      return createToastWrapper(
        await screen.findByTestId('ytdlp-download-toast'),
      );
    },
  },
};
