import type { FC } from 'react';

import { LogViewer, type LogEntryData, type LogLevel } from '@nuclearplayer/ui';

const log = (
  time: string,
  level: LogLevel,
  scope: string,
  message: string,
): LogEntryData => ({
  id: time,
  timestamp: new Date(`2026-09-28T${time}`),
  level,
  target: `nuclear::${scope}`,
  source: { type: 'core', scope },
  message,
});

const LOGS = [
  log(
    '21:14:02.118',
    'info',
    'plugins',
    'Plugin geiger@2.1.0 loaded successfully',
  ),
  log('21:14:02.341', 'info', 'mpd', 'MPD server started on 127.0.0.1:6600'),
  log(
    '21:14:02.507',
    'info',
    'mcp',
    'MCP server started on http://127.0.0.1:8800/mcp',
  ),
  log('21:14:03.912', 'info', 'discord', 'Discord Rich Presence connected'),
  log('21:15:10.044', 'info', 'playback', 'Queue restored with 24 tracks'),
  log(
    '21:15:11.630',
    'warn',
    'streaming',
    'Stream candidate timed out, trying the next one',
  ),
  log(
    '21:15:13.205',
    'info',
    'streaming',
    'Resolved stream for Neon Cascade - Phosphor Gate',
  ),
  log(
    '21:15:13.488',
    'info',
    'playback',
    'Now playing: Neon Cascade - Phosphor Gate',
  ),
  log('21:15:14.019', 'error', 'plugins', 'Failed to fetch artwork: 404'),
  log(
    '21:15:14.702',
    'info',
    'discord',
    'Presence updated: Neon Cascade - Phosphor Gate',
  ),
];

export const LogViewerWidget: FC = () => (
  <LogViewer.Root
    logs={LOGS}
    scopes={[]}
    className="surface-background border-border shadow-shadow h-80 w-full min-w-0 gap-3 rounded-md border-(length:--border-width) p-4"
  >
    <div className="flex">
      <LogViewer.SearchInput />
    </div>
    <LogViewer.LevelFilter />
    <LogViewer.VirtualizedList />
  </LogViewer.Root>
);
