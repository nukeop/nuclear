/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge, ipcRenderer } = require('electron');

const electronApi = {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  onReceive: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  getGlobal: (key) => {
    return window.electronApi.getGlobal(key);
  }
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
