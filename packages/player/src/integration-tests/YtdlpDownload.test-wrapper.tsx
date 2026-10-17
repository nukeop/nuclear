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
import { toast } from 'sonner';

import App from '../App';
import { DownloadEvent, YTDLP_DOWNLOAD_EVENT } from '../hooks/useYtdlpDownload';
import { routeTree } from '../routeTree.gen';
import { emit } from '../test/utils/eventMocks';

type DownloadKind = DownloadEvent['kind'];

const user = userEvent.setup();

const emitDownload = (payload: DownloadEvent) =>
  act(() => {
    void emit(YTDLP_DOWNLOAD_EVENT, payload);
  });

const toastElement = () => screen.findByTestId('ytdlp-download-toast');

export const YtdlpDownloadWrapper = {
  async mount(): Promise<RenderResult> {
    toast.dismiss();
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
    async findText(text: string) {
      return within(await toastElement()).findByText(text);
    },
    async queryText(text: string) {
      return within(await toastElement()).queryByText(text);
    },
    retryButton: {
      async find() {
        return within(await toastElement()).findByRole('button', {
          name: 'Retry',
        });
      },
      async query() {
        return within(await toastElement()).queryByRole('button', {
          name: 'Retry',
        });
      },
      async click() {
        await user.click(await this.find());
      },
    },
  },
};
