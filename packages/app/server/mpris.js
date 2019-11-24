import { ipcMain } from 'electron';
import Player from 'mpris-service';

import { autobind, ipcListener, mprisListener } from './lib/decorators';
import { store } from './store';

import {
  onPlayPause,
  onNext,
  onPrevious,
  onPause,
  onPlay,
  onVolume,
  onStop,
  getPlayingStatus,
  onSettings,
  onSelectTrack,
  onActivatePlaylist
} from './ipc';

const statusMapper = {
  PLAYING: Player.PLAYBACK_STATUS_PLAYING,
  PAUSED: Player.PLAYBACK_STATUS_PAUSED
};

const loopStatusMapper = {
  true: Player.LOOP_STATUS_PLAYLIST,
  false: Player.LOOP_STATUS_NONE
};

class MprisPlayer extends Player {
  constructor(window, app) {
    super({
      name: 'Nuclear',
      identity: 'Nuclear audio player',
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

    const storedPlaylists = store.get('playlists');
    this.window = window;
    this.app = app;
    this.tracks = [];
    this.setPlaylists(storedPlaylists ? storedPlaylists.map(this._playlistMapper) : []);
  }

  @autobind
  _trackMapper(track, index = 0) {
    return {
      id: track.uuid,
      'mpris:trackid': this.objectPath(`track/${index}`),
      'mpris:artUrl': track.thumbnail,
      'mpris:length': track.streams && track.streams.length ? track.streams[0].duration * 1000 * 1000 : 0, // In microseconds
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
    onActivatePlaylist(this.playlists[this.getPlaylistIndex(playlistId)].Name);
  }

  @mprisListener('raise')
  _onRaise() {
    this.window.focus();
  }

  @mprisListener('quit')
  _onQuit() {
    this.app.quit();
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

  @mprisListener('goTo')
  _onSelectTrack(trackId) {
    onSelectTrack(this.getTrackIndex(trackId));
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

  @ipcListener('addTrack')
  _ipcAddTrack(evt, track) {
    this.tracks = [
      ...this.tracks,
      this._trackMapper(track, this.tracks.length)
    ];
  }

  @ipcListener('removeTrack')
  _ipcRemoveTrack(evt, { uuid }) {
    this.tracks = this.tracks.filter((track) => uuid !== track.id);
  }

  async listen() {
    const status = await getPlayingStatus();

    this.canControl = true;
    this.canEditTracks = true;
    this.playbackStatus = statusMapper[status.playbackStatus];
    this.volume = status.volume / 100;
    this.shuffle = status.shuffleQueue;
    this.loopStatus = loopStatusMapper[status.loopAfterQueueEnd];

    MprisPlayer.prototype.mprisEvents.forEach(({ event, handler }) => {
      this.on(event, this[handler]);
    });

    MprisPlayer.prototype.ipcEvents.forEach(({ event, handler }) => {
      ipcMain.on(event, this[handler]);
    });
  }

  setMetadata(track) {
    if (track.streams) {
      this.metadata = this._trackMapper(track);
    }
  }
}

export default MprisPlayer;
