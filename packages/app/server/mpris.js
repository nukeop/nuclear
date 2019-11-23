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

const basicEvents = [
  // 'raise',
  // 'quit',
  // 'loopStatus',
  // 'shuffle',
  'next',
  'previous',
  'pause',
  'playpause',
  'stop',
  'play',
  'volume'
  // 'seek',
  // 'position',
  // 'open',
];

class MprisPlayer extends Player {
  position = 0;
  statusInterval;
  eventMapper = {
    next: onNext,
    previous: onPrevious,
    stop: this._onStop,
    pause: this._onPause,
    playpause: this._onPlayPause,
    play: this._onPlay,
    // seek: this._onSeek,
    volume: this._onVolume,
    loopStatus: this._onLoop,
    shuffle: this._onShuffle
  };

  constructor() {
    super({
      name: 'Nuclear',
      identity: 'Nuclear',
      supportedUriSchemes: ['file'],
      supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
      supportedInterfaces: ['player']
    });
  }

  _onShuffle() {
    onSettings({ shuffleQueue: !this.shuffle });
    this.shuffle = !this.shuffle;
  }

  _onLoop() {
    this.loopStatus = this.loopStatus === Player.LOOP_STATUS_TRACK
      ? Player.LOOP_STATUS_NONE
      : Player.LOOP_STATUS_TRACK;
    onSettings({ loopAfterQueueEnd: this.loopStatus === Player.LOOP_STATUS_TRACK });
  }

  _onPlay(evt) {
    this.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
    onPlay();
  }

  _onPause() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
    onPause();
  }

  _onStop() {
    this.playbackStatus = Player.PLAYBACK_STATUS_STOPED;
    onStop();
  }

  _onPlayPause() {
    this.playbackStatus = this.playbackStatus === Player.PLAYBACK_STATUS_PLAYING
      ? Player.PLAYBACK_STATUS_PAUSED
      : Player.PLAYBACK_STATUS_STOPED;
    onPlayPause();
  }

  _onVolume(data) {
    this.volume = data;
    onVolume(data * 100);
  }

  // _onSeek(data) {
  //   onSeek(data);
  // }

  listen() {
    this.on('shuffle', this._onShuffle);
    this.on('loopStatus', this._onLoop);
    basicEvents.forEach((eventName) => {
      this.on(eventName, data => {
        this.eventMapper[eventName](data);
      });
    });
  }

  getPosition() {
    return this.position;
  }

  subscribeForStatus() {
    this.statusInterval = setInterval(async () => {
      const status = await getPlayingStatus();

      this.playbackStatus = statusMapper[status.playbackStatus];
      this.volume = status.volume / 100;
      this.shuffle = status.shuffleQueue;
      this.loopStatus = loopStatusMapper[status.loopAfterQueueEnd];
      // this.canPlay = !status.playbackStreamLoading;
      // this.canPause = !status.playbackStreamLoading;
    }, 1000);
  }

  unsubscribeStatus() {
    clearInterval(this.statusInterval);
  }

  setMetadata(track) {
    if (track.uuid) {
      this.metadata = {
        'mpris:trackid': this.objectPath('track/0'),
        'mpris:length': track.streams && track.streams.length ? track.streams[0].duration * 1000 * 1000 : 0, // In microseconds
        'mpris:artUrl': track.thumbnail,
        'xesam:title': track.name,
        // 'xesam:album': '21',
        'xesam:artist': [track.artist]
      };
    }
  }
}

export default MprisPlayer;
