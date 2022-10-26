import { IpcEvents } from '@nuclear/core';
import { ListeningHistoryEntry } from '@nuclear/main/src/services/listening-history/model/ListeningHistoryEntry';
import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { ListeningHistoryView } from '../../components/ListeningHistoryView';

type ListeningHistory = {
  data: ListeningHistoryEntry[];
  cursor: {
    beforeCursor: string | null;
    afterCursor: string | null;
  }
}

export const ListeningHistoryContainer: React.FC = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [afterCursor, setAfterCursor] = useState(undefined);
  const [listeningHistory, setListeningHistory] = useState<ListeningHistory>();

  useEffect(() => {
    ipcRenderer.invoke(IpcEvents.FETCH_LISTENING_HISTORY, { limit: entriesPerPage }).then(setListeningHistory);
  }, [entriesPerPage, afterCursor]);

  return <ListeningHistoryView tracks={listeningHistory?.data ?? []} />;
};
