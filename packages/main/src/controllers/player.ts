import { NuclearMeta, IpcEvents } from '@nuclear/core';
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import NuclearApi from '../interfaces/nuclear-api';
import SystemApi from '../services/system-api';
import Window from '../services/window';
import { ipcEvent, ipcController } from '../utils/decorators';
import Discord from '../services/discord';

@ipcController()
class IpcPlayer {
  constructor(
    @inject(Discord) private discord: Discord,
    @inject(SystemApi) private systemApi: NuclearApi,
    @inject(Window) private window: Window
  ) {}

  @ipcEvent(IpcEvents.PLAY)
  onPlay() {
    this.systemApi.play();
    return this.discord.play();
  }

  @ipcEvent(IpcEvents.PAUSE)
  onPause() {
    this.systemApi.pause();
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
  onClearTrackList() {
    this.systemApi.clearTrackList && this.systemApi.clearTrackList();
    this.discord.clear();
  }

  @ipcEvent(IpcEvents.SONG_CHANGE)
  onSongChange(evt: IpcMessageEvent, arg: NuclearMeta) {
    if (arg === null) {
      return;
    }

    this.window.setTitle(`${arg.artist} - ${arg.name} - Nuclear Music Player`);
    this.systemApi.sendMetadata && this.systemApi.sendMetadata(arg);
    this.discord.trackChange(arg);
  }
}

export default IpcPlayer;
