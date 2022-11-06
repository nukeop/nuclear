import { ipcRenderer } from 'electron';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IpcEvents } from '@nuclear/core';

import { ListeningHistoryView } from '../../components/ListeningHistoryView';
import { queue as queueSelector } from '../../selectors/queue';

// Duplication of the types from the @nuclear/main package
// Importing them causes issues with the dev server
type ListeningHistoryEntry = {
  uuid: string;
  artist: string;
  title: string;
  createdAt: Date;
}

type ListeningHistoryRequest = {
  limit?: number;
  beforeCursor?: string | null;
  afterCursor?: string | null;
}

type ListeningHistoryResult = {
  data: ListeningHistoryEntry[];
  cursor: {
    beforeCursor: string | null;
    afterCursor: string | null;
  }
}

const clearHistory = () => ipcRenderer.send(IpcEvents.CLEAR_LISTENING_HISTORY);
const fetchHistory = (request: ListeningHistoryRequest) => ipcRenderer.invoke(IpcEvents.FETCH_LISTENING_HISTORY, request);

/**
 * The cursor is a base64 encoded string in the form of "createdAt:1667239617000". 
 * We need to extract the timestamp and subtract 1ms from it then encode it back.
 * This is needed so that the next page of results doesn't contain the last item of the current page
 */
const processAfterCursor = (afterCursor: string | null) => {
  if (afterCursor) {
    const [attr, timestamp] = atob(afterCursor).split(':');
    const newCursor = btoa(`${attr}:${parseInt(timestamp, 10) - 1}`);
    return newCursor;
  }
  return null;
};

export const ListeningHistoryContainer: React.FC = () => {
  const queue = useSelector(queueSelector);
  const [limit, setLimit] = useState(10);
  const [afterCursor, setAfterCursor] = useState(undefined);
  const [beforeCursor, setBeforeCursor] = useState(undefined);
  const [listeningHistory, setListeningHistory] = useState<ListeningHistoryResult>();
  const [lastSearchQuery, setLastSearchQuery] = useState<ListeningHistoryRequest | undefined>();

  const setFetchResult = useCallback((result: ListeningHistoryResult) => {
    setListeningHistory(result);
    setAfterCursor(processAfterCursor(result.cursor.afterCursor));
    setBeforeCursor(result.cursor.beforeCursor);
  }, []);

  useEffect(() => {
    const query = lastSearchQuery ?? {limit};
    fetchHistory(query).then(setFetchResult);
  }, [queue]);

  const refreshHistory = useCallback(() => {
    fetchHistory({limit}).then(data => {
      setFetchResult(data);
      setLastSearchQuery({limit});
    });
  }, [limit]);

  const nextPage = useCallback(() => {
    fetchHistory({limit, afterCursor}).then(data => {
      setFetchResult(data);
      setLastSearchQuery({limit, afterCursor});
    });
  }, [limit, afterCursor]);

  const previousPage = useCallback(() => {
    fetchHistory({limit, beforeCursor}).then(data => {
      setFetchResult(data);
      setLastSearchQuery({limit, beforeCursor});
    });
  }, [limit, beforeCursor]);

  return <ListeningHistoryView
    tracks={listeningHistory?.data ?? []}
    refreshHistory={refreshHistory}
    clearHistory={() => {
      clearHistory();
      setImmediate(() => refreshHistory());
    }}
    nextPage={nextPage}
    previousPage={previousPage}
    isNextPageAvailable={Boolean(afterCursor)}
    isPreviousPageAvailable={Boolean(beforeCursor)}
  />;
};
