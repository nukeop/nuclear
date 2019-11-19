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
  PLAYING: 'Playing',
  PAUSED: 'Paused'
};

const basicEvents = [
  // 'raise',
  // 'quit',
  'next',
  'previous',
  'pause',
  'playpause',
  'stop',
  'play',
  'volume',
  'loopStatus',
  'shuffle'
  // 'seek',
  // 'position',
  // 'open',
];

class MprisPlayer extends Player {
  position = 0;
  statusInterval;

  constructor() {
    super({
      name: 'Nuclear',
      identity: 'Nuclear',
      supportedUriSchemes: ['file'],
      supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
      supportedInterfaces: ['player']
    });
  }

  _onShuffle(shuffleQueue) {
    this.shuffle = shuffleQueue;
    onSettings({ shuffleQueue  });
  }

  _onLoop(loopAfterQueueEnd) {
    this.loopStatus = loopAfterQueueEnd;
    onSettings({ loopAfterQueueEnd });
  }

  _onPlay() {
    this.playbackStatus = 'Playing';
    onPlay();
  }

  _onPause() {
    this.playbackStatus = 'Paused';
    onPause();
  }

  _onPlayPause() {
    this.playbackStatus = this.playbackStatus === 'Playing' ? 'Paused' : 'Playing';
    onPlayPause();
  }

  _onVolume(data) {
    onVolume(data * 100);
  }

  // _onSeek(data) {
  //   onSeek(data);
  // }

  listen() {
    const eventMapper = {
      next: onNext,
      previous: onPrevious,
      stop: onStop,
      pause: this._onPause,
      playpause: this._onPlayPause,
      play: this._onPlay,
      // seek: this._onSeek,
      volume: this._onVolume,
      loopStatus: this._onLoop,
      shuffle: this._onShuffle
    };

    basicEvents.forEach((eventName) => {
      this.on(eventName, data => {
        eventMapper[eventName](data);
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
      this.loopStatus = status.loopAfterQueueEnd;
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
        'xesam:album': '21',
        'xesam:artist': [track.artist]
      };
    }
  }
}

export default MprisPlayer;
