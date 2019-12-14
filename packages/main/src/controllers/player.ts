import { NuclearMeta } from '@nuclear/common';
import { Event } from 'electron';
import { inject } from 'inversify';

import SystemApi from '../services/system-api';
import Window from '../services/window';
import { ipcEvent, ipcController } from '../utils/decorators';
import NuclearApi from '../utils/api';

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
  onVolume(evt: Event, data: number) {
    this.systemApi.setVolume && this.systemApi.setVolume(data);
  }

  @ipcEvent('loopStatus')
  onLoop(evt: Event, data: boolean) {
    this.systemApi.setLoopStatus && this.systemApi.setLoopStatus(data);
  }

  @ipcEvent('shuffle')
  onShuffle(evt: Event, data: boolean) {
    this.systemApi.shuffle = data;
  }

  @ipcEvent('addTrack')
  onAddTrack(evt: Event, track: NuclearMeta) {
    this.systemApi.addTrack && this.systemApi.addTrack(track);
  }

  @ipcEvent('removeTrack')
  onRemoveTrack(evt: Event, { uuid }: NuclearMeta) {
    this.systemApi.removeTrack && this.systemApi.removeTrack(uuid);
  }

  @ipcEvent('songChange')
  onSongChange(evt: Event, arg: NuclearMeta) {
    if (arg === null) {
      return;
    }

    this.window.setTitle(`${arg.artist} - ${arg.name} - Nuclear Music Player`);
    this.systemApi.setMetadata && this.systemApi.setMetadata(arg);
  }
}

export default IpcPlayer;
