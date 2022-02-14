import { NuclearMeta, IpcEvents } from '@nuclear/core';
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import NuclearApi from '../interfaces/nuclear-api';
import SystemApi from '../services/system-api';
import Window from '../services/window';
import { ipcEvent, ipcController } from '../utils/decorators';
import Discord from '../services/discord';
import TrayMenu from '../services/trayMenu';
import Logger, { $mainLogger } from '../services/logger';

@ipcController()
class IpcPlayer {
  constructor(
    @inject(Discord) private discord: Discord,
    @inject(TrayMenu) private trayMenu: TrayMenu,
    @inject(SystemApi) private systemApi: NuclearApi,
    @inject(Window) private window: Window,
    @inject($mainLogger) private logger: Logger
  ) {}

  @ipcEvent(IpcEvents.PLAY)
  onPlay() {
    this.systemApi.play();
    this.trayMenu.update({isPlaying: true});
    return this.discord.play();
  }

  @ipcEvent(IpcEvents.PAUSE)
  onPause() {
    this.systemApi.pause();
    this.trayMenu.update({isPlaying: false});
    return this.discord.pause();
  }

  @ipcEvent(IpcEvents.VOLUME)
  onVolume(evt: IpcMessageEvent, data: number) {
    this.systemApi.setVolume && this.systemApi.setVolume(data);
  }

  @ipcEvent(IpcEvents.LOOP)
  onLoop(evt: IpcMessageEvent, data: boolean) {
    this.systemApi.setLoopStatus && this.systemApi.setLoopStatus(data);
  }

  @ipcEvent(IpcEvents.SHUFFLE)
  onShuffle(evt: IpcMessageEvent, data: boolean) {
    this.systemApi.shuffle = data;
  }

  @ipcEvent(IpcEvents.TRACK_ADD)
  onAddTrack(evt: IpcMessageEvent, track: NuclearMeta) {
    this.systemApi.addTrack && this.systemApi.addTrack(track);
  }

  @ipcEvent(IpcEvents.TRACK_REMOVE)
  onRemoveTrack(evt: IpcMessageEvent, { uuid }: NuclearMeta) {
    this.systemApi.removeTrack && this.systemApi.removeTrack(uuid);
  }

  @ipcEvent(IpcEvents.QUEUE_CLEAR)
  async onClearTrackList() {
    try {
      this.systemApi.clearTrackList && this.systemApi.clearTrackList();
      await this.discord.clear();
      this.trayMenu.update({isPlaying: false, track: null});
    } catch (e) {
      this.logger.error('Main process failed to react to IPC clear queue event');
    }
  }

  @ipcEvent(IpcEvents.SONG_CHANGE)
  onSongChange(evt: IpcMessageEvent, arg: NuclearMeta) {
    if (arg === null) {
      return;
    }

    this.window.setTitle(`${arg.artist} - ${arg.name} - Nuclear Music Player`);
    this.systemApi.sendMetadata && this.systemApi.sendMetadata(arg);
    this.discord.trackChange(arg);
    this.trayMenu.update({track: arg});
  }
}

export default IpcPlayer;
