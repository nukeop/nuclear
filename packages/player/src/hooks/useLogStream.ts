import { invoke } from '@tauri-apps/api/core';
import { attachLogger } from '@tauri-apps/plugin-log';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { RingBuffer } from '../utils/RingBuffer';

const FLUSH_INTERVAL_MS = 100;
const MAX_LOG_ENTRIES = 1000;
const LOG_FORMAT_REGEX = /^\[[^\]]+\]\[([^\]]+)\]\s*(.*)/s;
const SCOPE_PREFIX_REGEX = /^\[([^\]]+)\]\s*(.*)/s;

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

type LogEntry = {
  id: string;
  timestamp: Date;
  level: LogLevel;
  target: string;
  source: {
    type: 'core' | 'plugin';
    scope: string;
  };
  message: string;
};

type StartupLogEntry = {
  timestamp: string;
  level: string;
  message: string;
};

const LEVEL_MAP: Record<number, LogLevel> = {
  1: 'trace',
  2: 'debug',
  3: 'info',
  4: 'warn',
  5: 'error',
};

const createLogEntry = (
  message: string,
  level: LogLevel,
  timestamp: Date,
): LogEntry => {
  const formatMatch = message.match(LOG_FORMAT_REGEX);

  let target = '';
  let remainder = message;

  if (formatMatch) {
    target = formatMatch[1];
    remainder = formatMatch[2];
  }

  const scopeMatch = remainder.match(SCOPE_PREFIX_REGEX);
  const scopeRaw = scopeMatch?.[1] ?? '';
  const content = scopeMatch?.[2] ?? remainder;
  const isPlugin = scopeRaw.startsWith('plugin:');

  return {
    id: uuid(),
    timestamp,
    level,
    target,
    source: {
      type: isPlugin ? 'plugin' : 'core',
      scope: isPlugin ? scopeRaw.slice(7) : scopeRaw,
    },
    message: content,
  };
};

const logBuffer = new RingBuffer<LogEntry>(MAX_LOG_ENTRIES);
let logStreamInitialized = false;

export const initLogStream = () => {
  if (logStreamInitialized) {
    return;
  }
  logStreamInitialized = true;

  invoke<StartupLogEntry[]>('get_startup_logs')
    .then((startupLogs) => {
      const parsed = startupLogs.map((entry) =>
        createLogEntry(
          entry.message,
          entry.level.toLowerCase() as LogLevel,
          new Date(entry.timestamp),
        ),
      );
      logBuffer.prepend(parsed);
    })
    .catch(() => {});

  attachLogger((record: { level: number; message: string }) => {
    const entry = createLogEntry(
      record.message,
      LEVEL_MAP[record.level] ?? 'info',
      new Date(),
    );
    logBuffer.push(entry);
  }).catch(() => {});
};

export const resetLogStreamForTesting = () => {
  logBuffer.clear();
  logStreamInitialized = false;
};

export const useLogStream = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => logBuffer.toArray());
  const lastFlushedVersionRef = useRef(logBuffer.version);

  useEffect(() => {
    const flushInterval = setInterval(() => {
      if (lastFlushedVersionRef.current !== logBuffer.version) {
        lastFlushedVersionRef.current = logBuffer.version;
        setLogs(logBuffer.toArray());
      }
    }, FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(flushInterval);
    };
  }, []);

  const clearLogs = useCallback(() => {
    logBuffer.clear();
  }, []);

  const scopes = useMemo(
    () => [...new Set(logs.map((log) => log.source.scope).filter(Boolean))],
    [logs],
  );

  const targets = useMemo(
    () => [...new Set(logs.map((log) => log.target).filter(Boolean))],
    [logs],
  );

  return {
    logs,
    scopes,
    targets,
    clearLogs,
  };
};
