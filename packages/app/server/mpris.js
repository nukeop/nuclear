import Player from 'mpris-service';
import { ipcMain } from 'electron';

const basicEvents = [
  // 'raise',
  'quit',
  'next',
  'previous',
  'pause',
  'playpause',
  'stop',
  'play',
  'seek',
  'volume'
  // 'position',
  // 'open',
];

const settingsEvent = [
  'loopStatus',
  'shuffle'
];

class MprisPlayer extends Player {
  constructor() {
    super({
      name: 'Nuclear',
      identity: 'Node.js media player',
      supportedUriSchemes: ['file'],
      supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
      supportedInterfaces: ['player']
    });
  }

  listen() {
    basicEvents.forEach((eventName) => {
      this.on(eventName, data => ipcMain.emit(eventName, data));
    });
  }
}

export default MprisPlayer;
