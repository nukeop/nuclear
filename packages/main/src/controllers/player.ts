import { NuclearMeta } from '@nuclear/common';
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import NuclearApi from '../interfaces/nuclear-api';
import SystemApi from '../services/system-api';
import Window from '../services/window';
import { ipcEvent, ipcController } from '../utils/decorators';

@ipcController()
class IpcPlayer {
  constructor(
    @inject(SystemApi) private systemApi: NuclearApi,
    @inject(Window) private window: Window
  ) {}

  @ipcEvent('play')
  onPlay() {
    this.systemApi.play();
  }

  @ipcEvent('paused')
  onPause() {
    this.systemApi.pause();
  }

  @ipcEvent('volume')
  onVolume(evt: IpcMessageEvent, data: number) {
    this.systemApi.setVolume && this.systemApi.setVolume(data);
  }

  @ipcEvent('loopStatus')
  onLoop(evt: IpcMessageEvent, data: boolean) {
    this.systemApi.setLoopStatus && this.systemApi.setLoopStatus(data);
  }

  @ipcEvent('shuffle')
  onShuffle(evt: IpcMessageEvent, data: boolean) {
    this.systemApi.shuffle = data;
  }

  @ipcEvent('addTrack')
  onAddTrack(evt: IpcMessageEvent, track: NuclearMeta) {
    this.systemApi.addTrack && this.systemApi.addTrack(track);
  }

  @ipcEvent('removeTrack')
  onRemoveTrack(evt: IpcMessageEvent, { uuid }: NuclearMeta) {
    this.systemApi.removeTrack && this.systemApi.removeTrack(uuid);
  }

  @ipcEvent('clear-tracklist')
  onClearTrackList() {
    this.systemApi.clearTrackList && this.systemApi.clearTrackList();
  }

  @ipcEvent('songChange')
  onSongChange(evt: IpcMessageEvent, arg: NuclearMeta) {
    if (arg === null) {
      return;
    }

    this.window.setTitle(`${arg.artist} - ${arg.name} - Nuclear Music Player`);
    this.systemApi.sendMetadata && this.systemApi.sendMetadata(arg);
  }
}

export default IpcPlayer;
