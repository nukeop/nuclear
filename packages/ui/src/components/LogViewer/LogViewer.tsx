import { FC } from 'react';

import type { LogEntryData } from '../LogEntry';
import { LogViewerLabels } from './context';
import { LogEntryCount } from './LogEntryCount';
import { LogLevelFilter } from './LogLevelFilter';
import { LogScopeFilter } from './LogScopeFilter';
import { LogSearchInput } from './LogSearchInput';
import { LogToolbar } from './LogToolbar';
import { LogViewerRoot } from './LogViewerRoot';
import { LogViewerVirtualizedList } from './LogViewerVirtualizedList';

export type LogViewerProps = {
  logs: LogEntryData[];
  scopes: string[];
  onClear: () => void;
  onExport: () => void | Promise<void>;
  onOpenLogFolder: () => void;
  labels?: Partial<LogViewerLabels>;
  className?: string;
};

type LogViewerComponent = FC<LogViewerProps> & {
  Root: typeof LogViewerRoot;
  SearchInput: typeof LogSearchInput;
  LevelFilter: typeof LogLevelFilter;
  ScopeFilter: typeof LogScopeFilter;
  Toolbar: typeof LogToolbar;
  EntryCount: typeof LogEntryCount;
  VirtualizedList: typeof LogViewerVirtualizedList;
};

const LogViewerImpl: FC<LogViewerProps> = ({
  logs,
  scopes,
  onClear,
  onExport,
  onOpenLogFolder,
  labels,
  className,
}) => (
  <LogViewerRoot
    logs={logs}
    scopes={scopes}
    labels={labels}
    className={className}
  >
    <div className="flex flex-wrap items-center gap-4">
      <LogSearchInput />
      <LogToolbar
        onClear={onClear}
        onExport={onExport}
        onOpenLogFolder={onOpenLogFolder}
      />
    </div>

    <div className="flex flex-wrap items-center gap-4">
      <LogLevelFilter />
      <LogScopeFilter />
      <LogEntryCount />
    </div>

    <LogViewerVirtualizedList />
  </LogViewerRoot>
);

export const LogViewer = LogViewerImpl as LogViewerComponent;
LogViewer.Root = LogViewerRoot;
LogViewer.SearchInput = LogSearchInput;
LogViewer.LevelFilter = LogLevelFilter;
LogViewer.ScopeFilter = LogScopeFilter;
LogViewer.Toolbar = LogToolbar;
LogViewer.EntryCount = LogEntryCount;
LogViewer.VirtualizedList = LogViewerVirtualizedList;
