import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toaster } from '@nuclearplayer/ui';

import { ok } from '../test/utils/commandMocks';
import { initYtdlpDownloadToast } from './ytdlpDownloadToast';

const commandMocks = await vi.hoisted(async () => {
  const { TauriCommandMocks } = await import('../test/utils/commandMocks');
  return new TauriCommandMocks();
});

vi.mock('./tauri/bindings', () => commandMocks.moduleFactory());

const eventHandlers = vi.hoisted(
  () => new Map<string, (event: { payload: unknown }) => void>(),
);

vi.mock('@tauri-apps/api/event', () => ({
  listen: async (
    name: string,
    handler: (event: { payload: unknown }) => void,
  ) => {
    eventHandlers.set(name, handler);
    return () => eventHandlers.delete(name);
  },
}));

const emitDownloadEvent = (payload: Record<string, unknown>) =>
  act(() => eventHandlers.get('ytdlp:download')!({ payload }));

describe('yt-dlp download toast', () => {
  beforeEach(async () => {
    commandMocks.reset();
    render(<Toaster />);
    await initYtdlpDownloadToast();
  });

  it('shows install progress with percent', async () => {
    emitDownloadEvent({ kind: 'install', status: 'progress', percent: 42 });

    expect(
      await screen.findByText('Downloading yt-dlp… 42%'),
    ).toBeInTheDocument();
  });

  it('shows update progress without percent when the size is unknown', async () => {
    emitDownloadEvent({ kind: 'update', status: 'progress', percent: null });

    expect(await screen.findByText('Updating yt-dlp…')).toBeInTheDocument();
  });

  it('replaces the progress toast when the download finishes', async () => {
    emitDownloadEvent({ kind: 'install', status: 'progress', percent: 99 });
    await screen.findByText('Downloading yt-dlp… 99%');

    emitDownloadEvent({ kind: 'install', status: 'finished' });

    expect(await screen.findByText('yt-dlp downloaded')).toBeInTheDocument();
    expect(
      screen.queryByText('Downloading yt-dlp… 99%'),
    ).not.toBeInTheDocument();
  });

  it('shows the error and reinstalls when Retry is clicked', async () => {
    commandMocks.command('ytdlpEnsureInstalled').mockResolvedValue(ok(false));
    emitDownloadEvent({
      kind: 'install',
      status: 'failed',
      error: 'HTTP error: 503',
    });

    expect(
      await screen.findByText("Couldn't download yt-dlp"),
    ).toBeInTheDocument();
    expect(screen.getByText('HTTP error: 503')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(commandMocks.command('ytdlpEnsureInstalled')).toHaveBeenCalled();
  });

  it('shows a failed update without Retry because the old binary still works', async () => {
    emitDownloadEvent({
      kind: 'update',
      status: 'failed',
      error: 'HTTP error: 503',
    });

    expect(
      await screen.findByText("Couldn't update yt-dlp"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Retry' }),
    ).not.toBeInTheDocument();
  });
});
