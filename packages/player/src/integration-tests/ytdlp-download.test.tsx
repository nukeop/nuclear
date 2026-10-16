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

    YtdlpDownloadWrapper.download.progress('install', 42);

    const toast = await YtdlpDownloadWrapper.toast.find();
    expect(toast.text('Downloading yt-dlp… 42%')).toBeInTheDocument();
  });

  it('shows update progress without a percent when the size is unknown', async () => {
    await YtdlpDownloadWrapper.mount();

    YtdlpDownloadWrapper.download.progress('update', null);

    const toast = await YtdlpDownloadWrapper.toast.find();
    expect(toast.text('Updating yt-dlp…')).toBeInTheDocument();
  });

  it('replaces the progress toast with the finished toast', async () => {
    await YtdlpDownloadWrapper.mount();
    YtdlpDownloadWrapper.download.progress('install', 99);

    YtdlpDownloadWrapper.download.finished('install');

    const toast = await YtdlpDownloadWrapper.toast.find();
    expect(toast.text('yt-dlp downloaded')).toBeInTheDocument();
    expect(toast.queryText('Downloading yt-dlp… 99%')).not.toBeInTheDocument();
  });

  it('shows the install error with a Retry button', async () => {
    await YtdlpDownloadWrapper.mount();

    YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    const toast = await YtdlpDownloadWrapper.toast.find();
    expect(toast.text("Couldn't download yt-dlp")).toBeInTheDocument();
    expect(toast.text('HTTP error: 503')).toBeInTheDocument();
    expect(toast.retryButton.element).toBeInTheDocument();
  });

  it('requests the install again when Retry is clicked', async () => {
    await YtdlpDownloadWrapper.mount();
    YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    const toast = await YtdlpDownloadWrapper.toast.find();
    await toast.retryButton.click();

    expect(YtdlpDownloadWrapper.installRequests).toBe(2);
  });

  it('shows the update error without a Retry button', async () => {
    await YtdlpDownloadWrapper.mount();

    YtdlpDownloadWrapper.download.failed('update', 'HTTP error: 503');

    const toast = await YtdlpDownloadWrapper.toast.find();
    expect(toast.text("Couldn't update yt-dlp")).toBeInTheDocument();
    expect(toast.text('HTTP error: 503')).toBeInTheDocument();
    expect(toast.retryButton.element).not.toBeInTheDocument();
  });

  it('drops the error and Retry button when a new download starts after a failure', async () => {
    await YtdlpDownloadWrapper.mount();
    YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    YtdlpDownloadWrapper.download.progress('install', 10);

    const toast = await YtdlpDownloadWrapper.toast.find();
    expect(toast.text('Downloading yt-dlp… 10%')).toBeInTheDocument();
    expect(toast.queryText('HTTP error: 503')).not.toBeInTheDocument();
    expect(toast.retryButton.element).not.toBeInTheDocument();
  });
});
