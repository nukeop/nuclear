import { IpcEvents } from '@nuclear/core';
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';
import ListeningHistoryService from '../services/listening-history';
import { ipcController, ipcEvent } from '../utils/decorators';

@ipcController()
export default class ListeningHistoryController {
  constructor(
    @inject(ListeningHistoryService) private listeningHistory: ListeningHistoryService
  ) {}

  @ipcEvent(IpcEvents.POST_LISTENING_HISTORY_ENTRY)
  async postListeningHistoryEntry(event: IpcMessageEvent, entry: { artist: string, title: string }) {
    return this.listeningHistory.postListeningHistoryEntry(entry);
  }

  @ipcEvent(IpcEvents.GET_LISTENING_HISTORY)
  async getListeningHistory(event: IpcMessageEvent) {
    return this.listeningHistory.getListeningHistory();
  }
}
