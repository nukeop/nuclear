import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { i18n } from '@nuclearplayer/i18n';

import { Logger } from '../services/logger';
import { commands } from '../services/tauri/bindings';

type DownloadEvent = { kind: 'install' | 'update' } & (
  | { status: 'progress'; percent: number | null }
  | { status: 'finished' }
  | { status: 'failed'; error: string }
);

const TOAST_OPTIONS = {
  id: 'ytdlp-download',
  testId: 'ytdlp-download-toast',
  description: undefined,
  action: undefined,
};

const logSetupFailure = (error: unknown) =>
  Logger.streaming.error(`yt-dlp setup failed: ${error}`);

const ensureYtdlpInstalled = async () => {
  try {
    const result = await commands.ytdlpEnsureInstalled();
    if (result.status === 'error') {
      logSetupFailure(result.error);
    }
  } catch (error) {
    logSetupFailure(error);
  }
};

const progressMessage = (
  kind: DownloadEvent['kind'],
  percent: number | null,
) => {
  if (percent === null) {
    return i18n.t(`streaming:ytdlp.${kind}.progress_unknown`);
  }
  return i18n.t(`streaming:ytdlp.${kind}.progress`, { percent });
};

const showFailedToast = (kind: DownloadEvent['kind'], error: string) => {
  const title = i18n.t(`streaming:ytdlp.${kind}.failed`);
  if (kind === 'update') {
    return toast.error(title, { ...TOAST_OPTIONS, description: error });
  }
  return toast.error(title, {
    ...TOAST_OPTIONS,
    description: error,
    action: {
      label: i18n.t('common:actions.retry'),
      onClick: () => void ensureYtdlpInstalled(),
    },
  });
};

const showDownloadToast = (event: DownloadEvent) => {
  switch (event.status) {
    case 'progress':
      return toast.loading(
        progressMessage(event.kind, event.percent),
        TOAST_OPTIONS,
      );
    case 'finished':
      return toast.success(
        i18n.t(`streaming:ytdlp.${event.kind}.finished`),
        TOAST_OPTIONS,
      );
    case 'failed':
      return showFailedToast(event.kind, event.error);
  }
};

export const useYtdlpDownload = () => {
  useEffect(() => {
    const cleanup = new AbortController();
    const unlistening = listen<DownloadEvent>('ytdlp:download', (event) =>
      showDownloadToast(event.payload),
    );

    void unlistening.then(() => {
      if (!cleanup.signal.aborted) {
        void ensureYtdlpInstalled();
      }
    });

    return () => {
      cleanup.abort();
      void unlistening.then((unlisten) => unlisten());
    };
  }, []);
};
