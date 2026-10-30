import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { i18n } from '@nuclearplayer/i18n';

import { Logger } from '../services/logger';
import { commands } from '../services/tauri/bindings';
import { unwrapResult } from '../services/tauri/results';
import { errorMessage } from '../utils/errorMessage';

export const YTDLP_DOWNLOAD_EVENT = 'ytdlp:download';

export type DownloadEvent = { kind: 'install' | 'update' } & (
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

const ensureYtdlpInstalled = async () => {
  try {
    unwrapResult(await commands.ytdlpEnsureInstalled());
  } catch (error) {
    Logger.streaming.error(`yt-dlp setup failed: ${errorMessage(error)}`);
  }
};

const progressMessage = (
  kind: DownloadEvent['kind'],
  percent: number | null,
) => {
  if (percent === null) {
    return i18n.t(`streaming:ytdlp.${kind}.progressUnknown`);
  }
  return i18n.t(`streaming:ytdlp.${kind}.progress`, { percent });
};

const retryAction = (kind: DownloadEvent['kind']) => {
  if (kind === 'update') {
    return undefined;
  }
  return {
    label: i18n.t('common:actions.retry'),
    onClick: () => void ensureYtdlpInstalled(),
  };
};

const showFailedToast = (kind: DownloadEvent['kind'], error: string) =>
  toast.error(i18n.t(`streaming:ytdlp.${kind}.failed`), {
    ...TOAST_OPTIONS,
    description: error,
    action: retryAction(kind),
  });

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
    const unlistening = listen<DownloadEvent>(YTDLP_DOWNLOAD_EVENT, (event) =>
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
