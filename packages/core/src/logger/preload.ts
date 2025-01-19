import { contextBridge, ipcRenderer } from 'electron';

const electronApi = {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  onReceive: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, callback);
  },
  getGlobal: (key: string) => {
    return (window as any).electronApi.getGlobal(key);
  }
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
