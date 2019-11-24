import { ipcMain } from 'electron';
import Player from 'mpris-service';

import {
  onPlayPause,
  onNext,
  onPrevious,
  onPause,
  onPlay,
  onVolume,
  onStop,
  getPlayingStatus,
  onSettings
} from './ipc';

const statusMapper = {
  PLAYING: Player.PLAYBACK_STATUS_PLAYING,
  PAUSED: Player.PLAYBACK_STATUS_PAUSED
};

const loopStatusMapper = {
  true: Player.LOOP_STATUS_TRACK,
  false: Player.LOOP_STATUS_NONE
};

function mprisListener(event) {
  return (target, handler) => {
    target.mprisEvents = target.mprisEvents || [];
    target.mprisEvents.push({ event, handler });
  };
}

function ipcListener(event) {
  return (target, handler) => {
    target.ipcEvents = target.ipcEvents || [];
    target.ipcEvents.push({ event, handler });
  };
}

class MprisPlayer extends Player {
  // position = 0;

  constructor() {
    super({
      name: 'Nuclear',
      identity: 'Nuclear',
      supportedUriSchemes: ['file'],
      supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
      supportedInterfaces: ['player']
    });
  }

  @mprisListener('shuffle')
  _onShuffle() {
    this.shuffle = !this.shuffle;
    onSettings({ shuffleQueue: this.shuffle });
  }

  @mprisListener('loopStatus')
  _onLoop() {
    this.loopStatus = this.loopStatus === Player.LOOP_STATUS_PLAYLIST
      ? Player.LOOP_STATUS_NONE
      : Player.LOOP_STATUS_PLAYLIST;
    onSettings({ loopAfterQueueEnd: this.loopStatus === Player.LOOP_STATUS_PLAYLIST });
  }

  @mprisListener('play')
  _onPlay() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
    onPlay();
  }

  @mprisListener('pause')
  _onPause() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
    onPause();
  }

  @mprisListener('stop')
  _onStop() {
    this.playbackStatus = Player.PLAYBACK_STATUS_STOPED;
    onStop();
  }

  @mprisListener('playpause')
  _onPlayPause() {
    this.playbackStatus = this.playbackStatus === Player.PLAYBACK_STATUS_PLAYING
      ? Player.PLAYBACK_STATUS_PAUSED
      : Player.PLAYBACK_STATUS_STOPED;
    onPlayPause();
  }

  @mprisListener('volume')
  _onVolume(data) {
    this.volume = data;
    onVolume(data * 100);
  }

  @mprisListener('next')
  _onNext() {
    onNext();
  }

  @mprisListener('previous')
  _onPrevious() {
    onPrevious();
  }

  @ipcListener('play')
  _ipcPlay() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
  }

  @ipcListener('paused')
  _ipcPause() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
  }

  @ipcListener('volume')
  _ipcVolume(evt, data) {
    this.volume = data / 100;
  }

  @ipcListener('loopStatus')
  _ipcLoop(evt, data) {
    this.loopStatus = loopStatusMapper[data];
  }

  @ipcListener('shuffle')
  _ipcShuffle(evt, data) {
    this.shuffle = data;
  }

  async listen() {
    const status = await getPlayingStatus();

    this.playbackStatus = statusMapper[status.playbackStatus];
    this.volume = status.volume / 100;
    this.shuffle = status.shuffleQueue;
    this.loopStatus = loopStatusMapper[status.loopAfterQueueEnd];

    MprisPlayer.prototype.mprisEvents.forEach(({ event, handler }) => {
      this.on(event, this[handler]);
    });

    MprisPlayer.prototype.ipcEvents.forEach(({ event, handler }) => {
      ipcMain.on(event, this[handler].bind(this));
    });
  }

  setMetadata(track) {
    if (track.streams) {
      // this.position++;
      this.metadata = {
        'mpris:trackid': this.objectPath('track/0'),
        'mpris:artUrl': track.thumbnail,
        'xesam:title': track.name,
        'xesam:artist': [track.artist]
        // 'xesam:album': '21',
        // 'mpris:length': track.streams && track.streams.length ? track.streams[0].duration *1000 * 1000 : 0, // In microseconds
      };
    }
  }

  // getPosition() {
  //   return this.position;
  // }
}

export default MprisPlayer;
