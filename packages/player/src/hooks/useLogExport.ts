import { getVersion } from '@tauri-apps/api/app';
import { appLogDir } from '@tauri-apps/api/path';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import type { LogEntryData } from '@nuclearplayer/ui';

import { Logger } from '../services/logger';

const formatLogForExport = (log: LogEntryData): string => {
  const timestamp = log.timestamp.toISOString();
  const level = log.level.toUpperCase().padEnd(5);
  const scope =
    log.source.type === 'plugin'
      ? `plugin:${log.source.scope}`
      : log.source.scope;
  const scopePart = scope ? ` [${scope}]` : '';
  const targetPart = log.target ? ` [${log.target}]` : '';
  return `[${timestamp}] [${level}]${targetPart}${scopePart} ${log.message}`;
};

export const generateExportContent = async (
  logs: LogEntryData[],
): Promise<string> => {
  const appVersion = await getVersion();

  const header = [
    '# Nuclear Music Player - Log Export',
    `# Version: ${appVersion}`,
    `# Platform: ${navigator.platform}`,
    `# Exported: ${new Date().toISOString()}`,
    `# Entries: ${logs.length}`,
    '#',
    '',
  ].join('\n');

  const logLines = logs.map(formatLogForExport).join('\n');
  return header + logLines;
};

export const useLogExport = (logs: LogEntryData[]) => {
  const { t } = useTranslation('logs');
  const logsRef = useRef(logs);
  logsRef.current = logs;

  const exportLogs = useCallback(async () => {
    const filePath = await save({
      defaultPath: `nuclear-logs-${new Date().toISOString().slice(0, 10)}.txt`,
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    if (!filePath) {
      return;
    }

    const content = await generateExportContent(logsRef.current);
    await writeTextFile(filePath, content);
    toast.success(t('exportSuccess'));
  }, [t]);

  const openLogFolder = useCallback(async () => {
    const logDir = await appLogDir();
    if (!logDir) {
      Logger.fs.error('appLogDir returned undefined');
      return;
    }
    await revealItemInDir(logDir);
  }, []);

  return { exportLogs, openLogFolder };
};
