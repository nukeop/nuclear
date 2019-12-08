import { app } from 'electron';
import Player from 'mpris-service';
import _ from 'lodash';

import { autobind, mprisListener } from '../helpers/decorators';

const statusMapper = {
  PLAYING: Player.PLAYBACK_STATUS_PLAYING,
  PAUSED: Player.PLAYBACK_STATUS_PAUSED
};

const loopStatusMapper = {
  true: Player.LOOP_STATUS_PLAYLIST,
  false: Player.LOOP_STATUS_NONE
};

/**
 * @typedef {Object} NuclearStatus
 * @property {string} playbackStatus
 * @property {number} volume
 * @property {boolean} shuffleQueue
 * @property {boolean} loopAfterQueueEnd
 * 
 * @typedef {Object} NuclearMeta
 * @property {string} uuid
 * @property {string} thumbnail
 * @property {Array<{duration: number}>} streams
 * @property {string} name
 * @property {string} artist
 * 
 * @typedef {Object} MprisMeta
 * @property {string} mpris:trackid
 * @property {string} mpris:artUrl
 * @property {number} mrpis:length
 * @property {string} xesam:title
 * @property {string} xesam:artist
 * @property {number} xesam:album
 */

/**
 * Wrapper around mpris-service
 * Bridge between the app and any Mpris client
 * 
 * @see {@link https://specifications.freedesktop.org/mpris-spec/latest/}
 * @see {@link https://github.com/dbusjs/mpris-service}
 * @see {@link https://extensions.gnome.org/extension/1379/mpris-indicator-button/}
 * @see {@link https://github.com/altdesktop/playerctl}
 */
class MprisPlayer extends Player {
  constructor({ ipc, window, store, mprisLogger }) {
    super({
      name: 'Nuclear',
      identity: 'Nuclear Music Player',
      supportedUriSchemes: ['file', 'uri'],
      supportedMimeTypes: [
        'audio/mpeg',
        'audio/acc',
        'audio/x-flac',
        'audio/wav',
        'audio/ogg'
      ],
      supportedInterfaces: ['player', 'trackList', 'playlists']
    });

    /** @type {import('electron').IpcMain} */
    this.ipc = ipc;
    /** @type {import('./store').default} */
    this.store = store;
    /** @type {import('./window').default} */
    this.window = window;
    /** @type {import('./logger').Logger} */
    this.logger = mprisLogger;
    /** @type {any[]} */
    this.tracks = [];
    const storedPlaylists = this.store.get('playlists');
    this.setPlaylists(storedPlaylists ? storedPlaylists.map(this._playlistMapper) : []);
  }

  /**
   * @private
   * @param {Array<{duration: number}>} streams 
   * @returns {number}
   */
  _getDuration(streams) {
    return (_.get(streams, '[0].duration')* 1000 * 1000) || 0; // In microseconds
  }

  /**
   * @private
   * @returns {Promise<NuclearStatus>}
   */
  _getPlayingStatus() {
    return new Promise(resolve => {
      this.rendererWindow.send('playing-status');
      this.ipc.once('playing-status', (evt, data) => {
        resolve(data);
      });
    });
  }

  /**
   * @private
   * @param {NuclearMeta} track 
   * @param {number} index
   * @returns {MprisMeta} 
   */
  @autobind
  _trackMapper(track, index = 0) {
    return {
      id: track.uuid,
      'mpris:trackid': this.objectPath(`track/${index}`),
      'mpris:artUrl': track.thumbnail,
      'mpris:length': this._getDuration(track.streams),
      'xesam:title': track.name,
      'xesam:artist': [track.artist]
      // 'xesam:album': '21'
    };
  }

  @autobind
  _playlistMapper(playlist, index = 0) {
    return {
      Id: this.objectPath(`playlist/${index}`),
      Name: playlist.name,
      Icon: playlist.tracks[0].thumbnail
    };
  }

  @mprisListener('activatePlaylist')
  _onActivatePlaylist(playlistId) {
    this.setActivePlaylist(playlistId);
    this.rendererWindow.send('activate-playlist', this.playlists[this.getPlaylistIndex(playlistId)].Name);
  }

  @mprisListener('raise')
  _onRaise() {
    this.window.focus();
  }

  @mprisListener('quit')
  _onQuit() {
    app.quit();
  }

  @mprisListener('shuffle')
  _onShuffle() {
    this.shuffle = !this.shuffle;
    this.rendererWindow.send('settings', { shuffleQueue: this.shuffle });
  }

  @mprisListener('loopStatus')
  _onLoop() {
    this.loopStatus = this.loopStatus === Player.LOOP_STATUS_PLAYLIST
      ? Player.LOOP_STATUS_NONE
      : Player.LOOP_STATUS_PLAYLIST;
  
    this.rendererWindow.send('settings', { loopAfterQueueEnd: this.loopStatus === Player.LOOP_STATUS_PLAYLIST });
  }

  @mprisListener('play')
  _onPlay() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
    this.rendererWindow.send('play');
  }

  @mprisListener('pause')
  _onPause() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
    this.rendererWindow.send('pause');
  }

  @mprisListener('stop')
  _onStop() {
    this.playbackStatus = Player.PLAYBACK_STATUS_STOPED;
    this.rendererWindow.send('stop');
  }

  @mprisListener('playpause')
  _onPlayPause() {
    this.playbackStatus = this.playbackStatus === Player.PLAYBACK_STATUS_PLAYING
      ? Player.PLAYBACK_STATUS_PAUSED
      : Player.PLAYBACK_STATUS_STOPED;
    
    this.rendererWindow.send('playpause');
  }

  @mprisListener('volume')
  _onVolume(data) {
    this.volume = data;
    this.rendererWindow.send('volume', data * 100);
  }

  @mprisListener('next')
  _onNext() {
    this.rendererWindow.send('next');
  }

  @mprisListener('previous')
  _onPrevious() {
    this.rendererWindow.send('previous');
  }

  @mprisListener('goTo')
  _onSelectTrack(trackId) {
    this.rendererWindow.send('select-track', this.getTrackIndex(trackId));
  }

  async listen() {
    const status = await this._getPlayingStatus();

    this.canControl = true;
    this.canEditTracks = true;
    this.playbackStatus = statusMapper[status.playbackStatus];
    this.volume = status.volume / 100;
    this.shuffle = status.shuffleQueue;
    this.loopStatus = [status.loopAfterQueueEnd];

    MprisPlayer.prototype.mprisEvents.forEach(({ event, handler }) => {
      this.on(event, _.throttle((data) => {
        this.logger.log(`Incomming event ${event}`);

        const result = this[handler](data);

        if (result instanceof Promise) {
          result.catch((err) => {
            this.logger.error(`Error in event ${event} handler => ${err.message}`);
          });
        }
      }, 1000));
    });
  }

  setMetadata(track) {
    if (track.streams) {
      this.metadata = this._trackMapper(track);
    }
  }

  addTrack(track) {
    this.tracks = [
      ...this.tracks,
      this._trackMapper(track, this.tracks.length)
    ];
  }

  removeTrack(uuid) {
    this.tracks = this.tracks.filter((track) => uuid !== track.id);
  }

  play() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
  }

  pause() {
    this.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
  }

  setLoopStatus(data) {
    this.loopStatus = loopStatusMapper[data];
  }
}

export default MprisPlayer;
