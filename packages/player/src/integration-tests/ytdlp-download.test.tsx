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

    expect(
      await YtdlpDownloadWrapper.toast.findText('Downloading yt-dlp… 42%'),
    ).toBeInTheDocument();
  });

  it('shows update progress without a percent when the size is unknown', async () => {
    await YtdlpDownloadWrapper.mount();

    YtdlpDownloadWrapper.download.progress('update', null);

    expect(
      await YtdlpDownloadWrapper.toast.findText('Updating yt-dlp…'),
    ).toBeInTheDocument();
  });

  it('replaces the progress toast with the finished toast', async () => {
    await YtdlpDownloadWrapper.mount();
    YtdlpDownloadWrapper.download.progress('install', 99);
    await YtdlpDownloadWrapper.toast.findText('Downloading yt-dlp… 99%');

    YtdlpDownloadWrapper.download.finished('install');

    expect(
      await YtdlpDownloadWrapper.toast.findText('yt-dlp downloaded'),
    ).toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.queryText('Downloading yt-dlp… 99%'),
    ).not.toBeInTheDocument();
  });

  it('shows the install error with a Retry button', async () => {
    await YtdlpDownloadWrapper.mount();

    YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');

    expect(
      await YtdlpDownloadWrapper.toast.findText("Couldn't download yt-dlp"),
    ).toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.findText('HTTP error: 503'),
    ).toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.retryButton.find(),
    ).toBeInTheDocument();
  });

  it('requests the install again when Retry is clicked', async () => {
    await YtdlpDownloadWrapper.mount();
    YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');
    await YtdlpDownloadWrapper.toast.findText('HTTP error: 503');

    await YtdlpDownloadWrapper.toast.retryButton.click();

    expect(YtdlpDownloadWrapper.installRequests).toBe(2);
  });

  it('shows the update error without a Retry button', async () => {
    await YtdlpDownloadWrapper.mount();

    YtdlpDownloadWrapper.download.failed('update', 'HTTP error: 503');

    expect(
      await YtdlpDownloadWrapper.toast.findText("Couldn't update yt-dlp"),
    ).toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.findText('HTTP error: 503'),
    ).toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.retryButton.query(),
    ).not.toBeInTheDocument();
  });

  it('drops the error and Retry button when a new download starts after a failure', async () => {
    await YtdlpDownloadWrapper.mount();
    YtdlpDownloadWrapper.download.failed('install', 'HTTP error: 503');
    await YtdlpDownloadWrapper.toast.findText('HTTP error: 503');

    YtdlpDownloadWrapper.download.progress('install', 10);

    expect(
      await YtdlpDownloadWrapper.toast.findText('Downloading yt-dlp… 10%'),
    ).toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.queryText('HTTP error: 503'),
    ).not.toBeInTheDocument();
    expect(
      await YtdlpDownloadWrapper.toast.retryButton.query(),
    ).not.toBeInTheDocument();
  });
});
