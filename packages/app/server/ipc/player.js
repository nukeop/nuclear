import { ipcListener } from '../helpers/decorators';

class IpcPlayer {
  constructor({ mpris, window }) {
    /** @type {import('../services/mpris').default} */
    this.mpris = mpris;
    /** @type {import('../services/window').default} */
    this.window = window;
  }

  @ipcListener('play')
  onPlay() {
    this.mpris.play();
  }

  @ipcListener('paused')
  onPause() {
    this.mpris.pause();
  }

  @ipcListener('volume')
  onVolume(evt, data) {
    this.mpris.volume = data / 100;
  }

  @ipcListener('loopStatus')
  onLoop(evt, data) {
    this.mpris.setLoopStatus(data);
  }

  @ipcListener('shuffle')
  onShuffle(evt, data) {
    this.mpris.shuffle = data;
  }

  @ipcListener('addTrack')
  onAddTrack(evt, track) {
    this.mpris.addTrack(track);
  }

  @ipcListener('removeTrack')
  onRemoveTrack(evt, { uuid }) {
    this.mpris.removeTrack(uuid);
  }

  @ipcListener('songChange')
  onSongChange(event, arg) {
    if (arg === null) {
      return;
    }

    this.window.setTitle(`${arg.artist} - ${arg.title} - Nuclear Music Player`);
    this.mpris.setMetadata(arg);
  }
}

export default IpcPlayer;
