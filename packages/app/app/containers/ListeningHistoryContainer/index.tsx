import { ipcRenderer } from 'electron';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IpcEvents } from '@nuclear/core';
import { ListeningHistoryEntry } from '@nuclear/main/src/services/listening-history/model/ListeningHistoryEntry';

import { ListeningHistoryView } from '../../components/ListeningHistoryView';
import { queue as queueSelector } from '../../selectors/queue';

type ListeningHistory = {
  data: ListeningHistoryEntry[];
  cursor: {
    beforeCursor: string | null;
    afterCursor: string | null;
  }
}

const clearHistory = () => ipcRenderer.send(IpcEvents.CLEAR_LISTENING_HISTORY);
const fetchHistory = (limit: number) => ipcRenderer.invoke(IpcEvents.FETCH_LISTENING_HISTORY, { limit });

export const ListeningHistoryContainer: React.FC = () => {
  const queue = useSelector(queueSelector);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [afterCursor, setAfterCursor] = useState(undefined);
  const [listeningHistory, setListeningHistory] = useState<ListeningHistory>();

  useEffect(() => {
    fetchHistory(entriesPerPage).then(data => {
      setListeningHistory(data);
      setAfterCursor(data.cursor.afterCursor);
    });
  }, [entriesPerPage, afterCursor, queue]);

  const refreshHistory = useCallback(() => {
    fetchHistory(entriesPerPage).then(data => {
      setListeningHistory(data);
    });
  }, [entriesPerPage, afterCursor]);

  return <ListeningHistoryView 
    tracks={listeningHistory?.data ?? []} 
    refreshHistory={refreshHistory}
    clearHistory={() => {
      clearHistory();
      setImmediate(() => refreshHistory());
    }}
  />;
};
