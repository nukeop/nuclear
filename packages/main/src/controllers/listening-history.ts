import { IpcEvents } from '@nuclear/core';
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';
import ListeningHistoryService from '../services/listening-history';
import { ipcController, ipcEvent, ipcInvokeHandler } from '../utils/decorators';

export type ListeningHistoryFilters = {
  artist?: string;
  title?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export type ListeningHistoryPaginationSettings = {
  limit?: number;
  order?: 'ASC' | 'DESC';
  beforeCursor?: string | null;
  afterCursor?: string | null;
}

export type ListeningHistoryRequest = ListeningHistoryFilters & ListeningHistoryPaginationSettings;

@ipcController()
export default class ListeningHistoryController {
  constructor(
    @inject(ListeningHistoryService) private listeningHistory: ListeningHistoryService
  ) {}

  @ipcEvent(IpcEvents.POST_LISTENING_HISTORY_ENTRY)
  async postListeningHistoryEntry(event: IpcMessageEvent, entry: { artist: string, title: string }) {
    return this.listeningHistory.postListeningHistoryEntry(entry);
  }

  @ipcInvokeHandler(IpcEvents.FETCH_LISTENING_HISTORY)
  async getListeningHistory(event: IpcMessageEvent, request: ListeningHistoryRequest) {
    return this.listeningHistory.getListeningHistory(request);
  }

  @ipcEvent(IpcEvents.CLEAR_LISTENING_HISTORY)
  async clearListeningHistory(event: IpcMessageEvent) {
    return this.listeningHistory.clearListeningHistory();
  }
}
