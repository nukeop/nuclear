import * as tauriLog from '@tauri-apps/plugin-log';

const MAX_LOG_LENGTH = 4000;
const PREVIEW_MAX_ENTRIES = 3;
const PREVIEW_MAX_VALUE_LENGTH = 20;

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

type LogMethod = (message: string) => Promise<void>;

export type ScopedLogger = {
  [K in LogLevel]: LogMethod;
};

export const LOG_SCOPES = [
  'app',
  'dashboard',
  'mcp',
  'playback',
  'streaming',
  'plugins',
  'http',
  'fs',
  'settings',
  'themes',
  'updates',
  'queue',
  'metadata',
  'playlists',
] as const;

export type LogScope = (typeof LOG_SCOPES)[number];

const createScopedLogger = (scope: string): ScopedLogger => {
  const logWithScope = (level: LogLevel, message: string): Promise<void> => {
    const formattedMessage = `[${scope}] ${message}`;
    return tauriLog[level](formattedMessage);
  };

  return {
    trace: (message: string) => logWithScope('trace', message),
    debug: (message: string) => logWithScope('debug', message),
    info: (message: string) => logWithScope('info', message),
    warn: (message: string) => logWithScope('warn', message),
    error: (message: string) => logWithScope('error', message),
  };
};

type LoggerType = {
  [K in LogScope]: ScopedLogger;
};

export const Logger = LOG_SCOPES.reduce(
  (acc, scope) => {
    acc[scope] = createScopedLogger(scope);
    return acc;
  },
  {} as Record<LogScope, ScopedLogger>,
) as LoggerType;

const sanitizePluginId = (pluginId: string): string => {
  if (!pluginId || typeof pluginId !== 'string') {
    return 'unknown';
  }
  return pluginId.replace(/[[\]\n\r]/g, '_');
};

export const createPluginLogger = (pluginId: string): ScopedLogger => {
  const sanitized = sanitizePluginId(pluginId);
  return createScopedLogger(`plugin:${sanitized}`);
};

const truncateIfNeeded = (text: string): string => {
  if (text.length > MAX_LOG_LENGTH) {
    return `${text.slice(0, MAX_LOG_LENGTH)}... [truncated]`;
  }
  return text;
};

export const formatLogValue = (value: unknown): string => {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'string') {
    return truncateIfNeeded(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'function') {
    const name = value.name || 'anonymous';
    return `[Function: ${name}]`;
  }

  if (value instanceof Error) {
    const parts = [
      `${value.name}: ${value.message}`,
      value.stack ? value.stack.split('\n').slice(1).join('\n') : '',
    ].filter(Boolean);
    return truncateIfNeeded(parts.join('\n'));
  }

  try {
    const json = JSON.stringify(value);
    return truncateIfNeeded(json);
  } catch {
    const preview = getObjectPreview(value as object);
    return `[Unserializable object: ${preview}]`;
  }
};

const getObjectPreview = (obj: object): string => {
  try {
    const entries = Object.entries(obj)
      .slice(0, PREVIEW_MAX_ENTRIES)
      .map(([key, val]) => {
        if (val === obj) {
          return `${key}: [circular]`;
        }
        const valStr =
          typeof val === 'string'
            ? val.slice(0, PREVIEW_MAX_VALUE_LENGTH)
            : typeof val === 'object'
              ? '[object]'
              : String(val);
        return `${key}: ${valStr}`;
      });
    return entries.join(', ');
  } catch {
    return '[unable to preview]';
  }
};
