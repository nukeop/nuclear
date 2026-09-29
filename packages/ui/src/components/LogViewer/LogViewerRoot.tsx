import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { cn } from '../../utils';
import type { LogEntryData } from '../LogEntry';
import {
  defaultLabels,
  LogViewerContext,
  LogViewerLabels,
  parseSearch,
} from './context';

export type LogViewerRootProps = PropsWithChildren<{
  logs: LogEntryData[];
  scopes: string[];
  labels?: Partial<LogViewerLabels>;
  className?: string;
}>;

export const LogViewerRoot: FC<LogViewerRootProps> = ({
  children,
  logs,
  scopes,
  labels: labelOverrides,
  className,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const labels = useMemo(
    () => ({ ...defaultLabels, ...labelOverrides }),
    [labelOverrides],
  );

  useEffect(() => {
    setSelectedScopes((prev) => prev.filter((s) => scopes.includes(s)));
  }, [scopes]);

  const searchResult = useMemo(() => parseSearch(search), [search]);

  const filteredLogs = useMemo(() => {
    const { regex, isValid } = searchResult;
    if (!isValid) {
      return [];
    }

    return logs.filter((log) => {
      if (selectedLevels.length > 0 && !selectedLevels.includes(log.level)) {
        return false;
      }
      if (
        selectedScopes.length > 0 &&
        !selectedScopes.includes(log.source.scope)
      ) {
        return false;
      }
      if (regex && !regex.test(log.message)) {
        return false;
      }
      return true;
    });
  }, [logs, searchResult, selectedLevels, selectedScopes]);

  const contextValue = useMemo(
    () => ({
      logs,
      filteredLogs,
      scopes,
      search,
      setSearch,
      searchResult,
      selectedLevels,
      setSelectedLevels,
      selectedScopes,
      setSelectedScopes,
      labels,
    }),
    [
      logs,
      filteredLogs,
      scopes,
      search,
      searchResult,
      selectedLevels,
      selectedScopes,
      labels,
    ],
  );

  return (
    <LogViewerContext.Provider value={contextValue}>
      <div className={cn('flex h-full flex-col gap-4 pb-6', className)}>
        {children}
      </div>
    </LogViewerContext.Provider>
  );
};
