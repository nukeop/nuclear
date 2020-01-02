/* eslint-disable @typescript-eslint/no-explicit-any */
import { NuclearStatus, NuclearMeta, NuclearPlaylist, PlaybackStatus } from '@nuclear/common';
import autobind from 'autobind-decorator';
import { app, IpcMain, Event } from 'electron';
import { inject } from 'inversify';
import _ from 'lodash';
import MprisService, { MprisPlaylist, MprisMeta, PlaybackStatus as MprisStatus, LoopStatus } from 'mpris-service';

import NuclearApi from '../../interfaces/nuclear-api';
import { systemMediaController, systemMediaEvent, SYSTEM_MEDIA_EVENT_KEY } from '../../utils/decorators';
import { ControllerMeta } from '../../utils/types';
import Config from '../config';
import Ipc from '../ipc';
import Logger, { systemApiLogger } from '../logger';
import Store from '../store';
import Window from '../window';

const statusMapper: Record<string, MprisStatus> = {
  [PlaybackStatus.PLAYING]: MprisService.PLAYBACK_STATUS_PLAYING,
  [PlaybackStatus.PAUSED]: MprisService.PLAYBACK_STATUS_PAUSED
};

const loopStatusMapper: Record<string, LoopStatus> = {
  true: MprisService.LOOP_STATUS_PLAYLIST,
  false: MprisService.LOOP_STATUS_NONE
};

/**
 * Wrapper around mpris-service
 * Bridge between the app and any Mpris client
 * 
 * @see {@link https://specifications.freedesktop.org/mpris-spec/latest/}
 * @see {@link https://github.com/dbusjs/mpris-service}
 * @see {@link https://extensions.gnome.org/extension/1379/mpris-indicator-button/}
 * @see {@link https://github.com/altdesktop/playerctl}
 */

@systemMediaController() 
class LinuxMediaService extends MprisService implements NuclearApi {
  tracks: MprisMeta[];

  constructor(
    @inject(Config) config: Config,
    @inject(Ipc) private ipc: IpcMain,
    @inject(systemApiLogger) private logger: Logger,
    @inject(Store) private store: Store,
    @inject(Window) private window: Window
  ) {
    super({
      name: config.title.replace(/ /g, '_'),
      identity: config.title,
      supportedMimeTypes: config.supportedFormats.map(format => `audio/${format}`),
      supportedUriSchemes: ['file', 'uri'],
      supportedInterfaces: ['player', 'trackList', 'playlists']
    });

    this.tracks = [];
    const storedPlaylists = this.store.get('playlists');
    this.setPlaylists(storedPlaylists ? storedPlaylists.map(this.playlistMapper) : []);
  }

  private getPlayingStatus(): Promise<NuclearStatus> {
    return new Promise(resolve => {
      this.window.send('playing-status');
      this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
        resolve(data);
      });
    });
  }

  @autobind
  private trackMapper(track: NuclearMeta, index = 0): MprisMeta {
    return {
      id: track.uuid,
      'mpris:trackid': this.objectPath(`track/${index}`),
      'mpris:artUrl': track.thumbnail,
      'xesam:title': track.name,
      'xesam:artist': [track.artist]
      // 'mpris:length': this.getDuration(track.streams),
      // 'xesam:album': '21'
    };
  }

  @autobind
  private playlistMapper(playlist: NuclearPlaylist, index = 0): MprisPlaylist {
    return {
      Id: this.objectPath(`playlist/${index}`),
      Name: playlist.name,
      Icon: playlist.tracks[0].thumbnail
    };
  }

  @systemMediaEvent('activatePlaylist')
  onActivatePlaylist(playlistId: string) {
    this.setActivePlaylist(playlistId);
    this.window.send('activate-playlist', this.playlists[this.getPlaylistIndex(playlistId)].Name);
  }

  @systemMediaEvent('raise')
  onRaise() {
    this.window.focus();
  }

  @systemMediaEvent('quit')
  onQuit() {
    app.quit();
  }

  @systemMediaEvent('shuffle')
  onShuffle() {
    this.shuffle = !this.shuffle;
    this.window.send('settings', { shuffleQueue: this.shuffle });
  }

  @systemMediaEvent('loopStatus')
  onLoop() {
    this.loopStatus = this.loopStatus === MprisService.LOOP_STATUS_PLAYLIST
      ? MprisService.LOOP_STATUS_NONE
      : MprisService.LOOP_STATUS_PLAYLIST;
  
    this.window.send('settings', { loopAfterQueueEnd: this.loopStatus === MprisService.LOOP_STATUS_PLAYLIST });
  }

  @systemMediaEvent('play')
  onPlay() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PLAYING;
    this.window.send('play');
  }

  @systemMediaEvent('pause')
  onPause() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PAUSED;
    this.window.send('pause');
  }

  @systemMediaEvent('stop')
  onStop() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_STOPED;
    this.window.send('stop');
  }

  @systemMediaEvent('playpause')
  onPlayPause() {
    this.playbackStatus = this.playbackStatus === MprisService.PLAYBACK_STATUS_PLAYING
      ? MprisService.PLAYBACK_STATUS_PAUSED
      : MprisService.PLAYBACK_STATUS_STOPED;
    
    this.window.send('playpause');
  }

  @systemMediaEvent('volume')
  onVolume(data: number) {
    this.volume = data;
    this.window.send('volume', data * 100);
  }

  @systemMediaEvent('next')
  onNext() {
    this.window.send('next');
  }

  @systemMediaEvent('previous')
  onPrevious() {
    this.window.send('previous');
  }

  @systemMediaEvent('goTo')
  onSelectTrack(trackId: string) {
    this.window.send('select-track', this.getTrackIndex(trackId));
  }

  sendMetadata(track: NuclearMeta) {
    this.metadata = this.trackMapper(track);
  }

  addTrack(track: NuclearMeta) {
    this.tracks = [
      ...this.tracks,
      this.trackMapper(track, this.tracks.length)
    ];
  }

  removeTrack(uuid: string) {
    this.tracks = this.tracks.filter((track) => uuid !== track.id);
  }

  clearTrackList() {
    this.tracks = [];
    this.sendMetadata({
      artist: 'Nuclear',
      name: '',
      uuid: '0',
      thumbnail: '',
      streams: []
    })
  }

  play() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PLAYING;
  }

  setVolume(volume: number) {
    this.volume = volume / 100;
  }

  pause() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PAUSED;
  }

  setLoopStatus(data: boolean) {
    this.loopStatus = loopStatusMapper[data.toString()];
  }

  async listen() {
    const status = await this.getPlayingStatus();

    this.canControl = true;
    this.canEditTracks = true;
    this.playbackStatus = statusMapper[status.playbackStatus];
    this.volume = status.volume / 100;
    this.shuffle = status.shuffleQueue;
    this.loopStatus =loopStatusMapper[status.loopAfterQueueEnd.toString()];

    const meta: ControllerMeta[] = Reflect.getMetadata(SYSTEM_MEDIA_EVENT_KEY, LinuxMediaService.prototype);

    meta.forEach(({ eventName, name }) => {

      this.on(eventName, (event: Event, data: any) => {
        this.logger.log(`incoming event => ${eventName}`);

        const result = (this as any)[name](event, data);

        if (result instanceof Promise) {
          result.catch((err: Error) => {
            this.logger.error(`error in event ${eventName} => ${err.message}`);
          });
        }
      });
    });
  }
}

export default LinuxMediaService;
