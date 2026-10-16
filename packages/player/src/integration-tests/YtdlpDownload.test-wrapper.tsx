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
import { emit } from '../test/utils/eventMocks';

type DownloadKind = 'install' | 'update';

const user = userEvent.setup();

const emitDownload = (payload: Record<string, unknown>) =>
  act(async () => {
    emit('ytdlp:download', payload);
    await new Promise((resolve) => setTimeout(resolve));
  });

const toastElement = () => screen.getByTestId('ytdlp-download-toast');

const hasAttribute =
  (attribute: string) => (_content: string, element: Element | null) =>
    element !== null && element.hasAttribute(attribute);

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
    async progress(kind: DownloadKind, percent: number | null) {
      await emitDownload({ kind, status: 'progress', percent });
    },
    async finished(kind: DownloadKind) {
      await emitDownload({ kind, status: 'finished' });
    },
    async failed(kind: DownloadKind, error: string) {
      await emitDownload({ kind, status: 'failed', error });
    },
  },

  toast: {
    get title() {
      return within(toastElement()).getByText(hasAttribute('data-title'))
        .textContent;
    },
    get description() {
      return (
        within(toastElement()).queryByText(hasAttribute('data-description'))
          ?.textContent ?? null
      );
    },
    retryButton: {
      get element() {
        return within(toastElement()).queryByRole('button', { name: 'Retry' });
      },
      async click() {
        await user.click(
          within(toastElement()).getByRole('button', { name: 'Retry' }),
        );
      },
    },
  },
};
