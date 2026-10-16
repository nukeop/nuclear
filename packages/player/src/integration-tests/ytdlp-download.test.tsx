import { YtdlpDownloadWrapper } from './YtdlpDownload.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('yt-dlp download', () => {
  it('requests the yt-dlp install when the app starts', async () => {
    await YtdlpDownloadWrapper.mount();

    expect(YtdlpDownloadWrapper.installRequests).toBe(1);
  });

  it('shows install progress with the percent downloaded', async () => {
    await YtdlpDownloadWrapper.mount();

    await YtdlpDownloadWrapper.download.progress('install', 42);

    expect(YtdlpDownloadWrapper.toast.title).toBe('Downloading yt-dlp… 42%');
  });

  it('shows update progress without a percent when the size is unknown', async () => {
    await YtdlpDownloadWrapper.mount();

    await YtdlpDownloadWrapper.download.progress('update', null);

    expect(YtdlpDownloadWrapper.toast.title).toBe('Updating yt-dlp…');
  });

  it('replaces the progress toast with the finished toast', async () => {
    await YtdlpDownloadWrapper.mount();
    await YtdlpDownloadWrapper.download.progress('install', 99);

    await YtdlpDownloadWrapper.download.finished('install');

    expect(YtdlpDownloadWrapper.toast.title).toBe('yt-dlp downloaded');
  });

  it('shows the install error with a Retry button', async () => {
    await YtdlpDownloadWrapper.mount();

    await YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    expect(YtdlpDownloadWrapper.toast.title).toBe("Couldn't download yt-dlp");
    expect(YtdlpDownloadWrapper.toast.description).toBe('HTTP error: 503');
    expect(YtdlpDownloadWrapper.toast.retryButton.element).toBeInTheDocument();
  });

  it('requests the install again when Retry is clicked', async () => {
    await YtdlpDownloadWrapper.mount();
    await YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    await YtdlpDownloadWrapper.toast.retryButton.click();

    expect(YtdlpDownloadWrapper.installRequests).toBe(2);
  });

  it('shows the update error without a Retry button', async () => {
    await YtdlpDownloadWrapper.mount();

    await YtdlpDownloadWrapper.download.failed('update', 'HTTP error: 503');

    expect(YtdlpDownloadWrapper.toast.title).toBe("Couldn't update yt-dlp");
    expect(YtdlpDownloadWrapper.toast.description).toBe('HTTP error: 503');
    expect(
      YtdlpDownloadWrapper.toast.retryButton.element,
    ).not.toBeInTheDocument();
  });

  it('drops the error and Retry button when a new download starts after a failure', async () => {
    await YtdlpDownloadWrapper.mount();
    await YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    await YtdlpDownloadWrapper.download.progress('install', 10);

    expect(YtdlpDownloadWrapper.toast.title).toBe('Downloading yt-dlp… 10%');
    expect(YtdlpDownloadWrapper.toast.description).toBeNull();
    expect(
      YtdlpDownloadWrapper.toast.retryButton.element,
    ).not.toBeInTheDocument();
  });
});
